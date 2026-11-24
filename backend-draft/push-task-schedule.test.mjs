import test from 'node:test';
import assert from 'node:assert/strict';
import { pendingPushTasks } from './push-task-schedule.mjs';

const state=(extra={})=>({
  bookings:[{id:'booking-1',platform:'Airbnb',start:'2026-11-23',checkin:'15:00',end:'2026-11-25',checkout:'11:00',checks:{before:[],after:[]}}],
  privateStays:[],completed:{},templates:{before:[],after:[]},
  taskRules:[{id:'heat',title:'Skru på varme',active:true,platform:'Alle plattformer',anchor:'checkin',offset:-24,type:'manual',pushEnabled:true,pushLeadHours:1}],
  ...extra
});
const osloTime=(iso)=>Date.parse(iso);
test('heating: sends one hour before task due in Oslo winter time',()=>{
  const at=osloTime('2026-11-22T13:00:00Z'); // 14:00 Oslo, 24h before 15:00 check-in minus 1h
  assert.equal(pendingPushTasks(state(),at).length,1);
  assert.equal(pendingPushTasks(state(),at-16*60000).length,0);
});
test('disabled and completed rules do not notify',()=>{
  assert.equal(pendingPushTasks(state({completed:{'booking-1-heat':true}}),osloTime('2026-11-22T13:00:00Z')).length,0);
  assert.equal(pendingPushTasks(state({taskRules:[{...state().taskRules[0],pushEnabled:false}]}),osloTime('2026-11-22T13:00:00Z')).length,0);
});
test('cancelled and historical bookings do not notify',()=>{
  for(const flag of ['cancelled','historical']){
    const booking={...state().bookings[0],[flag]:true};
    assert.equal(pendingPushTasks(state({bookings:[booking]}),osloTime('2026-11-22T13:00:00Z')).length,0);
  }
});
test('private stay only follows private task rules',()=>{
  const privateStay={id:'private-1',start:'2026-11-23',checkin:'15:00',end:'2026-11-25',checkout:'11:00'};
  const rules=[{...state().taskRules[0],id:'privateheat',platform:'Privat booking'}];
  const result=pendingPushTasks(state({bookings:[],privateStays:[privateStay],taskRules:rules}),osloTime('2026-11-22T13:00:00Z'));
  assert.deepEqual(result.map(x=>x.taskId),['private-1-privateheat']);
});
test('spring DST local 15:00 is CEST',()=>{
  const s=state({bookings:[{...state().bookings[0],start:'2027-04-02'}]});
  assert.equal(pendingPushTasks(s,osloTime('2027-04-01T12:00:00Z')).length,1);
});
