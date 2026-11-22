// Netlify scheduled function (TEST): one delivery attempt per task, owner only.
// Requires push-migration.sql, VAPID keys and SKV138_PUSH_OWNER_USER_ID.
import pg from 'pg';
import webpush from 'web-push';
import { pendingPushTasks } from '../push-task-schedule.mjs';

export const config = { schedule: '*/15 * * * *' };

export default async function handler() {
  const required=['DATABASE_URL','SKV138_PUSH_OWNER_USER_ID','SKV138_VAPID_PUBLIC_KEY','SKV138_VAPID_PRIVATE_KEY','SKV138_VAPID_SUBJECT'];
  if(required.some(key=>!process.env[key])){console.error('SKV138 push sender not configured');return}
  webpush.setVapidDetails(process.env.SKV138_VAPID_SUBJECT,process.env.SKV138_VAPID_PUBLIC_KEY,process.env.SKV138_VAPID_PRIVATE_KEY);
  const pool=new pg.Pool({connectionString:process.env.DATABASE_URL,max:1});
  const client=await pool.connect();
  try{
    const access=await client.query('SELECT 1 FROM public.skv138_access WHERE user_id=$1',[process.env.SKV138_PUSH_OWNER_USER_ID]);
    if(!access.rowCount)return;
    const data=await client.query("SELECT payload FROM public.skv138_data WHERE id='shared'");
    if(!data.rowCount)return;
    const subscriptions=await client.query('SELECT endpoint,p256dh,auth_key FROM public.skv138_push_subscriptions WHERE user_id=$1 ORDER BY updated_at DESC LIMIT 1',[process.env.SKV138_PUSH_OWNER_USER_ID]);
    if(!subscriptions.rowCount)return;
    const sub=subscriptions.rows[0];
    const now=Date.now();
    for(const task of pendingPushTasks(data.rows[0].payload,now,15)){
      // Claim before delivery: at most one send attempt per task, including concurrent invocations.
      const claimed=await client.query('INSERT INTO public.skv138_push_sent(task_id) VALUES($1) ON CONFLICT DO NOTHING RETURNING task_id',[task.taskId]);
      if(!claimed.rowCount)continue;
      const payload=JSON.stringify({kind:'skv138-task',taskId:task.taskId,title:'SKV138: '+task.title,body:'Du har en oppgave som nærmer seg.'});
      try{
        await webpush.sendNotification({endpoint:sub.endpoint,keys:{p256dh:sub.p256dh,auth:sub.auth_key}},payload,{TTL:3600});
      }catch(error){
        console.error('SKV138 push delivery failed',error?.statusCode||'unknown');
        if(error?.statusCode===404||error?.statusCode===410)await client.query('DELETE FROM public.skv138_push_subscriptions WHERE endpoint=$1',[sub.endpoint]);
      }
    }
  }finally{client.release();await pool.end()}
}
