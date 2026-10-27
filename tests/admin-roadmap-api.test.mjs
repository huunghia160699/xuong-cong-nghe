import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {runInNewContext} from "node:vm";
import ts from "typescript";
import * as data from "../src/features/admin/roadmap-data.ts";

const simpleRead=path=>readFileSync(path,"utf8");
const load=(file,requirements)=>{
 const source=simpleRead(file);
 const js=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
 const module={exports:{}};
 runInNewContext(js,{
  module,exports:module.exports,require:(name)=>{
   if(name==="./roadmap-data")return data;
   if(Object.hasOwn(requirements,name))return requirements[name];
   throw Error("Unsupported module "+name);
  },Date,Set,Number,Object,JSON,String,Array,TextEncoder,Request,Response
 },{timeout:3000});
 return module.exports;
};
const validate=load("src/features/admin/roadmap-validation.ts",{});
const base=JSON.parse(JSON.stringify(data.ROADMAP_INITIAL));
function harness({live=true,user=true,role="admin",record=null}={}){
 let stored=record,reads=0,writes=0;
 const db={
  auth:{getUser:async()=>({data:{user:user?{id:"teacher-1"}:null},error:null})},
  from(table){
   const filter={};let mode="read",value=null;
   const q={
    select(){return q;},
    eq(name,v){filter[name]=v;return q;},
    insert(item){mode="insert";value=item;return q;},
    update(item){mode="update";value=item;return q;},
    order(){return q;},
    limit(){return Promise.resolve({data:[],error:null});},
    async single(){return result();},
    async maybeSingle(){return result();}
   };
   function result(){
    if(table==="profiles")return {data:{role},error:null};
    if(table==="admin_roadmap_events")return {data:[],error:null};
    if(table!=="admin_roadmap")throw Error("Unknown table: "+table);
    reads++;
    if(mode==="read")return {data:stored,error:null};
    if(mode==="insert"){
     if(stored)return {data:null,error:{code:"23505"}};
     writes++;stored={...value};return {data:stored,error:null};
    }
    if(mode==="update"){
     if(!stored||filter.version!==stored.version)return {data:null,error:null};
     writes++;stored={...stored,...value};return {data:stored,error:null};
    }
    throw Error("Unexpected mode");
   }
   return q;
  }
 };
 const NextResponse={json:(content,options={})=>new Response(JSON.stringify(content),{
  status:options.status??200,headers:{"Content-Type":"application/json",...(options.headers??{})}
 })};
 const api=load("src/app/api/admin/roadmap/route.ts",{
  "next/server":{NextResponse},
  "@/lib/supabase/server":{createSupabaseServerClient:async()=>db},
  "@/lib/supabase/config":{isLiveMode:()=>live},
  "@/features/admin/roadmap-validation":validate
 });
 const put=(items,version,headers={})=>api.PUT(new Request("http://localhost/api/admin/roadmap",{
  method:"PUT",headers:{"Content-Type":"application/json",...headers},
  body:JSON.stringify({items,version})
 }));
 return {api,put,stats:()=>({reads,writes,stored})};
}

test("Demo blocks API, unauthenticated and ordinary users are rejected",async()=>{
 const demo=harness({live:false});
 assert.equal((await demo.api.GET()).status,403);
 assert.equal((await demo.put(base,0)).status,403);
 const anonymous=harness({user:false});
 assert.equal((await anonymous.api.GET()).status,401);
 assert.equal((await anonymous.put(base,0)).status,401);
 const student=harness({role:"student"});
 assert.equal((await student.api.GET()).status,403);
 assert.equal((await student.put(base,0)).status,403);
 assert.equal(student.stats().writes,0);
});
test("Admin can create, read, update; stale revisions return 409",async()=>{
 const api=harness();
 let result=await api.api.GET();assert.equal(result.status,200);
 assert.equal((await result.json()).version,0);
 result=await api.put(base,0);assert.equal(result.status,200);
 assert.equal((await result.json()).version,1);
 result=await api.api.GET();assert.equal((await result.json()).items.length,20);
 assert.equal((await api.put(base,0)).status,409);
 const next=JSON.parse(JSON.stringify(base));next[0].summary="Server updated";
 result=await api.put(next,1);assert.equal(result.status,200);
 assert.equal((await result.json()).version,2);
 assert.equal((await api.put(base,1)).status,409);
 assert.equal(api.stats().stored.items[0].summary,"Server updated");
 assert.equal(api.stats().writes,2);
});
test("Malformed body and oversized declared payload are rejected before DB write",async()=>{
 const api=harness();
 const wrong=JSON.parse(JSON.stringify(base));wrong[1].id=wrong[0].id;
 assert.equal((await api.put(wrong,0)).status,400);
 assert.equal((await api.put(base,-1)).status,400);
 assert.equal((await api.put(base,0,{"content-length":"500001"})).status,413);
 assert.equal(api.stats().writes,0);
});
