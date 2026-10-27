import {createHash} from "node:crypto";
import {validateRoadmap,roadmapBytes,ROADMAP_MAX_BYTES} from "./roadmap-validation";
import type {RoadmapEpic} from "./roadmap-data";

export type RoadmapBackupEvent={
 id:number;version:number;occurred_at:string;actor_id:string|null;changes:unknown
};
export type RoadmapBackup={
 kind:"xcn-roadmap-supabase-backup";format:1;exportedAt:string;
 documentId:"global-master-roadmap";roadmapVersion:number;
 items:RoadmapEpic[];events:RoadmapBackupEvent[];sha256:string
};
export const checksum=(items:RoadmapEpic[],version:number)=>
 createHash("sha256").update(JSON.stringify({items,version}),"utf8").digest("hex");
export function makeRoadmapBackup(items:unknown,version:unknown,events:unknown):RoadmapBackup{
 if(!validateRoadmap(items)||roadmapBytes(items)>ROADMAP_MAX_BYTES||
  typeof version!=="number"||!Number.isSafeInteger(version)||version<1)
   throw Error("Invalid roadmap document");
 if(!Array.isArray(events)||events.length>2000||events.some(x=>
  !x||!Number.isSafeInteger(x.id)||!Number.isSafeInteger(x.version)||
  typeof x.occurred_at!=="string"||!Array.isArray(x.changes)))
   throw Error("Invalid event history");
 return {kind:"xcn-roadmap-supabase-backup",format:1,
  exportedAt:new Date().toISOString(),documentId:"global-master-roadmap",
  roadmapVersion:version,items,events,sha256:checksum(items,version)};
}
export function verifyRoadmapBackup(value:unknown):boolean{
 if(!value||typeof value!=="object")return false;
 const x=value as Partial<RoadmapBackup>;
 return x.kind==="xcn-roadmap-supabase-backup"&&x.format===1&&
  x.documentId==="global-master-roadmap"&&
  typeof x.roadmapVersion==="number"&&Number.isSafeInteger(x.roadmapVersion)&&
  x.roadmapVersion>=1&&validateRoadmap(x.items)&&
  roadmapBytes(x.items)<=ROADMAP_MAX_BYTES&&typeof x.sha256==="string"&&
  x.sha256===checksum(x.items,x.roadmapVersion);
}
