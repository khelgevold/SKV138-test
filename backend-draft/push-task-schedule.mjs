// Pure task-due evaluator for a future scheduled push sender.
// Booking times are cabin-local (Europe/Oslo), not server-local.
function localMillis(day,time,offsetHours){
  if(!/^\d{4}-\d{2}-\d{2}$/.test(day||'')||!/^\d{2}:\d{2}$/.test(time||''))return null;
  // Convert Oslo wall-clock into UTC, including daylight-saving changes.
  const [y,m,d]=day.split('-').map(Number),[hh,mm]=time.split(':').map(Number);
  if(m<1||m>12||d<1||d>31||hh>23||mm>59)return null;
  const wall=Date.UTC(y,m-1,d,hh,mm);
  const formatter=new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Oslo',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'});
  let utc=wall;
  for(let i=0;i<3;i++){
    const parts=Object.fromEntries(formatter.formatToParts(new Date(utc)).filter(p=>p.type!=='literal').map(p=>[p.type,Number(p.value)]));
    const observed=Date.UTC(parts.year,parts.month-1,parts.day,parts.hour,parts.minute);
    utc+=wall-observed;
  }
  const parts=Object.fromEntries(formatter.formatToParts(new Date(utc)).filter(p=>p.type!=='literal').map(p=>[p.type,Number(p.value)]));
  if(Date.UTC(parts.year,parts.month-1,parts.day,parts.hour,parts.minute)!==wall)return null; // nonexistent DST time
  return utc+offsetHours*3600000;
}
function complete(state,booking,rule,taskId){
  if(booking.kind==='private'||rule.type!=='check')return !!state.completed?.[taskId];
  const key=rule.id==='before'?'before':rule.id==='after'?'after':null;
  if(!key)return !!state.completed?.[taskId];
  const templates=state.templates?.[key]||[];
  const relevant=templates.filter(t=>t.condition==='always'||booking[t.condition]);
  return relevant.length>0&&relevant.every(t=>booking.checks?.[key]?.includes(t.id));
}
export function pendingPushTasks(state,now=Date.now(),windowMinutes=15){
  if(!state||!Array.isArray(state.taskRules))return [];
  const result=[];
  const stays=[...(state.bookings||[]).filter(b=>!b.cancelled&&!b.historical).map(b=>({...b,kind:'rental'})),...(state.privateStays||[]).map(b=>({...b,kind:'private'}))];
  for(const stay of stays){
    for(const rule of state.taskRules){
      if(!rule.active||rule.pushEnabled!==true)continue;
      if(rule.platform!=='Alle inkl. privat'&&(stay.kind==='private'?rule.platform!=='Privat booking':!(rule.platform==='Alle plattformer'||rule.platform===stay.platform)))continue;
      const id=String(stay.id)+'-'+rule.id;
      if(complete(state,stay,rule,id))continue;
      if(rule.condition&&rule.condition!=='always'&&!stay[rule.condition])continue;
      const base=rule.anchor==='checkout'?[stay.end,stay.checkout]:[stay.start,stay.checkin];
      const due=localMillis(base[0],base[1]||'12:00',Number(rule.offset)||0);
      const lead=Number(rule.pushLeadHours);
      if(due===null||!Number.isFinite(lead)||lead<0||lead>168)continue;
      const notifyAt=due-lead*3600000;
      if(notifyAt>now||notifyAt<now-windowMinutes*60000)continue;
      result.push({taskId:id,title:rule.title,notifyAt,bookingId:stay.id});
    }
  }
  return result;
}
