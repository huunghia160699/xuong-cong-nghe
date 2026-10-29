import type {RoadmapEpic} from "./roadmap-data";
import {validateRoadmap} from "./roadmap-validation";

/**
 * PostgreSQL jsonb and browser objects may order object keys differently.
 * Compare structured content without ignoring array order or field values.
 */
function canonical(value:unknown):unknown{
 if(Array.isArray(value))return value.map(canonical);
 if(value!==null&&typeof value==="object"){
  return Object.fromEntries(Object.entries(value).filter(([,v])=>v!==undefined)
   .sort(([a],[b])=>a<b?-1:a>b?1:0).map(([key,v])=>[key,canonical(v)]));
 }
 return value;
}
export function sameRoadmapContent(left:unknown,right:unknown):boolean{
 if(!validateRoadmap(left)||!validateRoadmap(right))return false;
 return JSON.stringify(canonical(left))===JSON.stringify(canonical(right));
}

/** A successful PUT is not considered fully synced until GET reads it back. */
export function isVerifiedRoadmapReadback(payload:unknown,version:number,sent:RoadmapEpic[]):boolean{
 if(!payload||typeof payload!=="object"||Array.isArray(payload))return false;
 const body=payload as {version?:unknown;items?:unknown};
 return Number.isInteger(version)&&version>0&&body.version===version&&
  sameRoadmapContent(body.items,sent);
}
