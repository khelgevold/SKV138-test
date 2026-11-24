import pg from 'pg';
import {timingSafeEqual} from 'node:crypto';
const response=(statusCode,body,type='text/plain')=>({statusCode,body,headers:{'Content-Type':type+'; charset=utf-8','Cache-Control':'no-store'}});
function authorized(token){const secret=process.env.SKV138_ICAL_TOKEN;if(!secret||secret.length<32||typeof token!=='string')return false;const a=Buffer.from(token),b=Buffer.from(secret);return a.length===b.length&&timingSafeEqual(a,b);}
function utc(day,time){if(!/^\d{4}-\d{2}-\d{2}$/.test(day)||!/^\d{2}:\d{2}$/.test(time))return null;const wall=Date.parse(day+'T'+time+':00Z');if(!Number.isFinite(wall))return null;let t=wall;const f=new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Oslo',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'});for(let i=0;i<3;i++){const p=Object.fromEntries(f.formatToParts(new Date(t)).map(x=>[x.type,Number(x.value)]));t+=wall-Date.UTC(p.year,p.month-1,p.day,p.hour,p.minute);}return new Date(t).toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');}
export async function handler(event){
 if(event.httpMethod!=='GET')return response(405,'Method not allowed');
 if(!authorized(event.queryStringParameters?.token))return response(404,'Not found');
 const pool=new pg.Pool({connectionString:process.env.DATABASE_URL,max:1});
 try{const r=await pool.query("SELECT payload,updated_at FROM public.skv138_data WHERE id='shared'");const state=r.rows[0]?.payload||{};const stamp=new Date(r.rows[0]?.updated_at||Date.now()).toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');
 const lines=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//SKV138//Homey//NO','CALSCALE:GREGORIAN'];
 const names={'Airbnb':'Airbnb','Booking.com':'Booking.com','Finn.no':'FINN','Direkte':'Direkte'};
 for(const [kind,stays] of [['rental',state.bookings||[]],['private',state.privateStays||[]]])for(const b of stays){if(b.cancelled)continue;const start=utc(b.start,b.checkin),end=utc(b.end,b.checkout);if(!start||!end||end<=start)continue;const title=kind==='private'?'Privat':names[b.platform]?'Utleie – '+names[b.platform]:null;if(!title)continue;const uid=Buffer.from(String(b.id)).toString('base64url');lines.push('BEGIN:VEVENT','UID:'+kind+'-'+uid+'@skv138','DTSTAMP:'+stamp,'DTSTART:'+start,'DTEND:'+end,'SUMMARY:'+title,'END:VEVENT');}
 lines.push('END:VCALENDAR');return response(200,lines.join('\r\n')+'\r\n','text/calendar');
 }catch{return response(503,'Calendar unavailable');}finally{await pool.end();}
}
