import {type RoadmapEpic} from "./roadmap-data";
import {validateRoadmap,roadmapBytes,ROADMAP_MAX_BYTES} from "./roadmap-validation";

export const ROADMAP_STORAGE_KEY="xcn-admin-roadmap-v3";
export const ROADMAP_LEGACY_STORAGE_KEY="xcn-admin-roadmap-v2";
export type RoadmapDraft={
 format:3;items:RoadmapEpic[];baseVersion:number;pending:boolean;savedAt:string
};
export const buildDraft=(items:RoadmapEpic[],baseVersion:number,pending:boolean):RoadmapDraft=>({
 format:3,items,baseVersion,pending,savedAt:new Date().toISOString()
});
/** Strict parse: a stale/corrupt draft cannot poison state or silently overwrite server work. */
export function decodeDraft(value:unknown):RoadmapDraft|null{
 // Migrate the old browser-only v2 array without discarding it.
 if(Array.isArray(value)){
  return validateRoadmap(value)&&roadmapBytes(value)<=ROADMAP_MAX_BYTES?
   {format:3,items:value,baseVersion:0,pending:true,savedAt:""}:null;
 }
 if(!value||typeof value!=="object")return null;
 const raw=value as Partial<RoadmapDraft>;
 if(raw.format!==3||!validateRoadmap(raw.items)||roadmapBytes(raw.items)>ROADMAP_MAX_BYTES
  ||!Number.isInteger(raw.baseVersion)||Number(raw.baseVersion)<0
  ||typeof raw.pending!=="boolean"
  ||typeof raw.savedAt!=="string"||raw.savedAt.length>50)return null;
 return raw as RoadmapDraft;
}
export function shouldOfferRecovery(draft:RoadmapDraft|null,serverItems:RoadmapEpic[],serverVersion:number){
 if(!draft)return false;
 if(!validateRoadmap(serverItems))return true;
 // Even Demo-era drafts (pending=false) may contain edits not yet imported into Supabase.
 // Always ask before discarding a divergent local copy; never silently overwrite either side.
 return JSON.stringify(draft.items)!==JSON.stringify(serverItems)||
  (draft.pending&&draft.baseVersion!==serverVersion);
}
