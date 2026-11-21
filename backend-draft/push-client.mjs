// SKV138 TEST: opt-in push subscription. Never subscribes automatically.
import { SKV138_TEST_AUTH_URL } from './neon-test-config.mjs';
const endpoint='/.netlify/functions/skv138-push-subscription';
async function tokenFor(authClient){
  try{const result=await authClient.token();if(!result?.error&&result?.data?.token)return result.data.token}catch{}
  const response=await fetch(SKV138_TEST_AUTH_URL.replace(/\/$/,'')+'/token',{credentials:'include'});
  if(!response.ok)throw new Error('Kunne ikke hente innlogging');
  const data=await response.json();if(!data.token)throw new Error('Mangler innlogging');return data.token;
}
async function api(authClient,method='GET',data){
  const token=await tokenFor(authClient);
  const response=await fetch(endpoint,{method,headers:{Authorization:'Bearer '+token,...(data?{'Content-Type':'application/json'}:{})},...(data?{body:JSON.stringify(data)}:{})});
  if(response.status===403)return {notOwner:true};
  if(!response.ok)throw new Error('Push-tjenesten svarte '+response.status);
  return response.json();
}
function keyBytes(key){const base64=key.replace(/-/g,'+').replace(/_/g,'/');const binary=atob(base64.padEnd(Math.ceil(base64.length/4)*4,'='));return Uint8Array.from(binary,c=>c.charCodeAt(0))}
export async function initializePushSettings({authClient,container}){
  if(!container||!authClient)return;
  if(!('serviceWorker' in navigator)||!('PushManager' in window)||!('Notification' in window))return;
  let config;try{config=await api(authClient)}catch{return}
  if(config.notOwner)return;
  container.hidden=false;
  const status=container.querySelector('[data-push-status]');
  const button=container.querySelector('[data-push-enable]');
  if(!config.publicKey){status.textContent='Push er ikke konfigurert i TEST ennå.';button.disabled=true;return}
  const registration=await navigator.serviceWorker.getRegistration('/');
  const existing=registration?await registration.pushManager.getSubscription():null;
  if(existing){status.textContent='Denne enheten har et pushabonnement.';button.textContent='Oppdater pushabonnement'}
  else status.textContent='Aktiver pushvarsler på denne enheten.';
  button.addEventListener('click',async()=>{
    button.disabled=true;
    try{
      if(!window.matchMedia('(display-mode: standalone)').matches&&/iPhone|iPad|iPod/.test(navigator.userAgent))throw new Error('Legg SKV138 til på Hjem-skjermen først.');
      if(Notification.permission==='denied')throw new Error('Tillat varsler i iPhone-innstillinger først.');
      const permission=await Notification.requestPermission();
      if(permission!=='granted')throw new Error('Varslingstillatelse ble ikke gitt.');
      const worker=await navigator.serviceWorker.register('/push-sw.js',{scope:'/'});
      const subscription=await worker.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:keyBytes(config.publicKey)});
      await api(authClient,'POST',{subscription:subscription.toJSON()});
      status.textContent='Pushabonnement registrert for denne enheten.';
      button.textContent='Oppdater pushabonnement';
    }catch(error){status.textContent=error.message||'Kunne ikke aktivere push.'}
    finally{button.disabled=false}
  });
}
