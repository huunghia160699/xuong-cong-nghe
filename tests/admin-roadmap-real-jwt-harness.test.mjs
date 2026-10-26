import test from "node:test";
import assert from "node:assert/strict";
import {readRlsConfig,runRlsCheck,PRODUCTION_PROJECT_REF} from "../scripts/verify-roadmap-rls.mjs";

function env(){
 return {
  RLS_SUPABASE_URL:"https://"+PRODUCTION_PROJECT_REF+".supabase.co",
  RLS_SUPABASE_PUBLISHABLE_KEY:"sb_publishable_test_public",
  RLS_ADMIN_EMAIL:"a@example.test",
  RLS_ADMIN_PASSWORD:"test-only-not-a-real-password",
  RLS_STUDENT_EMAIL:"b@example.test",
  RLS_STUDENT_PASSWORD:"test-only-not-a-real-password"
 };
}

function fakeClients({leakStudent=false,guestAllowed=false,studentRole="student"}={}){
 const allocations=[];
 const factory=()=>{
  const role=["admin","student","guest"][allocations.length];
  allocations.push(role);
  const user={id:role+"-uuid",email_confirmed_at:"2026-10-27T00:00:00Z"};
  return {
   auth:{
    async signInWithPassword(){return {data:{session:{access_token:"mock-"+role}},error:null};},
    async getUser(){return {data:{user},error:null};}
   },
   from(table){
    if(table==="profiles")return {
     select(){return {eq(){return {async single(){return {data:{role:role==="student"?studentRole:role},error:null};}};}};}
    };
    if(table==="admin_roadmap")return {
     async select(){
      if(role==="guest")return guestAllowed?{data:[],error:null}:{data:null,error:{code:"42501"}};
      if(role==="student")return {data:leakStudent?[{id:"global-master-roadmap"}]:[],error:null};
      return {data:[],error:null};
     }
    };
    throw Error("Unexpected mock table "+table);
   }
  };
 };
 return factory;
}
test("requires two separate credential sets and enforces HTTPS",()=>{
 const e=env();
 assert.equal(readRlsConfig(e).adminEmail,"a@example.test");
 assert.throws(()=>readRlsConfig({...e,RLS_STUDENT_PASSWORD:""}),/RLS_STUDENT_PASSWORD/);
 assert.throws(()=>readRlsConfig({...e,RLS_STUDENT_EMAIL:e.RLS_ADMIN_EMAIL}),/khác nhau/);
 assert.throws(()=>readRlsConfig({...e,RLS_SUPABASE_URL:"http://example.test"}),/HTTPS/);
});
test("rejects secret and service_role keys regardless of JWT presence",()=>{
 const e=env();
 assert.throws(()=>readRlsConfig({...e,RLS_SUPABASE_PUBLISHABLE_KEY:"sb_secret_unsafe"}),/secret/);
 const jwt=(role)=>"e30."+Buffer.from(JSON.stringify({role})).toString("base64url")+".sig";
 assert.throws(()=>readRlsConfig({...e,RLS_SUPABASE_PUBLISHABLE_KEY:jwt("service_role")}),/service_role/);
 assert.ok(readRlsConfig({...e,RLS_SUPABASE_PUBLISHABLE_KEY:jwt("anon")}));
});
test("write tests cannot run against production or without two explicit safety gates",()=>{
 const e=env();
 assert.throws(()=>readRlsConfig({...e,RLS_TEST_ISOLATED:"YES",RLS_WRITE_ACK:"I_UNDERSTAND"},true),/production/);
 const isolated={...e,RLS_SUPABASE_URL:"https://separatetesting.supabase.co"};
 assert.throws(()=>readRlsConfig(isolated,true),/RLS_TEST_ISOLATED/);
 assert.ok(readRlsConfig({...isolated,RLS_TEST_ISOLATED:"YES",RLS_WRITE_ACK:"I_UNDERSTAND"},true));
});
test("real-session orchestration requires admin/student roles and guest denied",async()=>{
 const lines=[];
 const result=await runRlsCheck({env:env(),buildClient:fakeClients(),logger:s=>lines.push(s)});
 assert.deepEqual(result,{mode:"read-only",adminRows:0,adminRole:"admin",studentRole:"student"});
 assert.ok(lines.some(s=>s.includes("READ-ONLY PASS")));
});
test("fails closed if unauthenticated or student can read roadmap",async()=>{
 await assert.rejects(runRlsCheck({env:env(),buildClient:fakeClients({guestAllowed:true}),logger:()=>{}}),/anon đọc/);
 await assert.rejects(runRlsCheck({env:env(),buildClient:fakeClients({leakStudent:true}),logger:()=>{}}),/Student đọc/);
 await assert.rejects(runRlsCheck({env:env(),buildClient:fakeClients({studentRole:"admin"}),logger:()=>{}}),/không khớp/);
});
