// SKV138 TEST push subscriptions. Requires a separate Neon migration and SKV138_PUSH_OWNER_USER_ID.
// No notification delivery or scheduled execution is enabled by this endpoint.
import { createRemoteJWKSet, jwtVerify } from 'jose';
import pg from 'pg';
import webpush from 'web-push';
let pool;
let jwks;
const reply=(statusCode,body)=>({statusCode,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'},body:JSON.stringify(body)});
function config(){
  for(const key of ['DATABASE_URL','NEON_AUTH_JWKS_URL','NEON_AUTH_ISSUER','SKV138_APP_ORIGIN','SKV138_PUSH_OWNER_USER_ID'])if(!process.env[key])throw new Error('Missing push configuration');
  const issuer=new URL(process.env.NEON_AUTH_ISSUER),keys=new URL(process.env.NEON_AUTH_JWKS_URL);
  if(issuer.protocol!=='https:'||keys.protocol!=='https:')throw new Error('Invalid auth URL');
  if(!jwks)jwks=createRemoteJWKSet(keys);
  if(!pool)pool=new pg.Pool({connectionString:process.env.DATABASE_URL,max:2});
}
async function userId(event){
  const token=/^Bearer (\S+)$/i.exec(event.headers.authorization||event.headers.Authorization||'')?.[1];
  if(!token)return null;
  const opts={issuer:process.env.NEON_AUTH_ISSUER,algorithms:['EdDSA']};
  if(process.env.NEON_AUTH_AUDIENCE)opts.audience=process.env.NEON_AUTH_AUDIENCE;
  const {payload}=await jwtVerify(token,jwks,opts);
  return typeof payload.sub==='string'?payload.sub:null;
}
function validSubscription(s){
  if(!s||typeof s!=='object'||typeof s.endpoint!=='string'||s.endpoint.length>2048)return false;
  let url;try{url=new URL(s.endpoint)}catch{return false}
  if(url.protocol!=='https:'||url.username||url.password||url.hash)return false;
  return s.keys&&typeof s.keys.p256dh==='string'&&s.keys.p256dh.length>=40&&s.keys.p256dh.length<=256&&
    typeof s.keys.auth==='string'&&s.keys.auth.length>=12&&s.keys.auth.length<=128;
}
export async function handler(event){
  if(!['GET','POST','DELETE'].includes(event.httpMethod))return reply(405,{error:'Method not allowed'});
  try{config()}catch{return reply(503,{error:'Push not configured'})}
  if(event.httpMethod!=='GET'&&(event.headers.origin||event.headers.Origin)!==process.env.SKV138_APP_ORIGIN)return reply(403,{error:'Origin denied'});
  let id;try{id=await userId(event)}catch{return reply(401,{error:'Invalid authentication'})}
  if(!id)return reply(401,{error:'Authentication required'});
  if(id!==process.env.SKV138_PUSH_OWNER_USER_ID)return reply(403,{error:'Not push owner'});
  const client=await pool.connect().catch(()=>null);
  if(!client)return reply(503,{error:'Database unavailable'});
  try{
    const access=await client.query('SELECT 1 FROM public.skv138_access WHERE user_id=$1',[id]);
    if(access.rowCount!==1)return reply(403,{error:'Access denied'});
    if(event.httpMethod==='GET'){
      const result=await client.query('SELECT COUNT(*)::int AS count FROM public.skv138_push_subscriptions WHERE user_id=$1',[id]);
      return reply(200,{count:result.rows[0].count,publicKey:process.env.SKV138_VAPID_PUBLIC_KEY||null});
    }
    if(Buffer.byteLength(event.body||'','utf8')>8192)return reply(413,{error:'Payload too large'});
    let data;try{data=JSON.parse(event.body||'')}catch{return reply(400,{error:'Invalid JSON'})}
    if(event.httpMethod==='POST' && data.action==='test'){
      if(!process.env.SKV138_VAPID_PUBLIC_KEY||!process.env.SKV138_VAPID_PRIVATE_KEY||!process.env.SKV138_VAPID_SUBJECT)return reply(503,{error:'VAPID not configured'});
      const found=await client.query('SELECT endpoint,p256dh,auth_key FROM public.skv138_push_subscriptions WHERE user_id=$1 ORDER BY updated_at DESC LIMIT 1',[id]);
      if(!found.rowCount)return reply(409,{error:'No push subscription'});
      const sub=found.rows[0];
      webpush.setVapidDetails(process.env.SKV138_VAPID_SUBJECT,process.env.SKV138_VAPID_PUBLIC_KEY,process.env.SKV138_VAPID_PRIVATE_KEY);
      try{
        await webpush.sendNotification({endpoint:sub.endpoint,keys:{p256dh:sub.p256dh,auth:sub.auth_key}},JSON.stringify({kind:'skv138-task',taskId:'test',title:'SKV138 – testvarsel',body:'Pushvarsler fungerer på denne enheten.'}),{TTL:300});
        return reply(200,{ok:true});
      }catch(error){
        console.error('SKV138 test push failed',error?.statusCode||'unknown');
        if([404,410].includes(error?.statusCode))await client.query('DELETE FROM public.skv138_push_subscriptions WHERE endpoint=$1',[sub.endpoint]);
        return reply(502,{error:'Push delivery failed'});
      }
    }
    if(event.httpMethod==='POST'){
      if(!validSubscription(data.subscription))return reply(400,{error:'Invalid subscription'});
      const s=data.subscription;
      await client.query(`INSERT INTO public.skv138_push_subscriptions(user_id,endpoint,p256dh,auth_key,updated_at)
        VALUES($1,$2,$3,$4,now()) ON CONFLICT(endpoint) DO UPDATE SET
        user_id=EXCLUDED.user_id,p256dh=EXCLUDED.p256dh,auth_key=EXCLUDED.auth_key,updated_at=now()`,[id,s.endpoint,s.keys.p256dh,s.keys.auth]);
      return reply(200,{ok:true});
    }
    if(typeof data.endpoint!=='string'||data.endpoint.length>2048)return reply(400,{error:'Invalid endpoint'});
    await client.query('DELETE FROM public.skv138_push_subscriptions WHERE user_id=$1 AND endpoint=$2',[id,data.endpoint]);
    return reply(200,{ok:true});
  }catch(error){console.error('SKV138 push subscription error',error);return reply(500,{error:'Push storage error'})}
  finally{client.release()}
}
