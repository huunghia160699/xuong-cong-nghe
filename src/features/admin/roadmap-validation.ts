import {
 ROADMAP_PHASES,ROADMAP_PRIORITY,ROADMAP_STATUS,
 type RoadmapEpic
} from "./roadmap-data";

/** Validate imports and API payloads with exactly the same rules. No untrusted object may skip this step. */
export const ROADMAP_MAX_BYTES=500_000;
export const ROADMAP_MAX_ITEMS=200;
const text=(value:unknown,max:number,min=0):value is string=>
 typeof value==="string"&&value.length>=min&&value.length<=max;
const isRecord=(value:unknown):value is Record<string,unknown>=>
 typeof value==="object"&&value!==null&&!Array.isArray(value);
const date=(value:unknown):value is string=>
 typeof value==="string"&&/^\d{4}-\d{2}-\d{2}$/.test(value)&&!Number.isNaN(Date.parse(value));
const idsUnique=(records:Record<string,unknown>[])=>{
 const ids=records.map(item=>item.id);
 return new Set(ids).size===ids.length;
};
export function validateRoadmap(value:unknown):value is RoadmapEpic[]{
 if(!Array.isArray(value)||value.length>ROADMAP_MAX_ITEMS)return false;
 const list:Record<string,unknown>[]=[];
 for(const raw of value){
  if(!isRecord(raw))return false;
  const item=raw;
  if(!text(item.id,120,1)||!text(item.title,200,3)||!text(item.summary,1000)
    ||!text(item.area,80,1)||!ROADMAP_PHASES.includes(item.phase as typeof ROADMAP_PHASES[number])
    ||!Object.hasOwn(ROADMAP_STATUS,String(item.status))
    ||!Object.hasOwn(ROADMAP_PRIORITY,String(item.priority))
    ||typeof item.order!=="number"||!Number.isFinite(item.order)
    ||(item.owner!==undefined&&!text(item.owner,100))
    ||(item.targetDate!==undefined&&item.targetDate!==""&&!date(item.targetDate))
    ||(item.updatedAt!==undefined&&!text(item.updatedAt,50))
    ||!Array.isArray(item.checklist)||item.checklist.length>300
    ||!Array.isArray(item.entries)||item.entries.length>500)return false;

  const tasks:Record<string,unknown>[]=[];
  for(const task of item.checklist){
   if(!isRecord(task)||!text(task.id,120,1)||!text(task.text,500,1)
      ||typeof task.done!=="boolean")return false;
   tasks.push(task);
  }
  if(!idsUnique(tasks))return false;
  const notes:Record<string,unknown>[]=[];
  for(const entry of item.entries){
   if(!isRecord(entry)||!text(entry.id,120,1)||!text(entry.text,1500,1)
      ||!["note","added","fixed"].includes(String(entry.kind))||!date(entry.date))return false;
   notes.push(entry);
  }
  if(!idsUnique(notes))return false;
  list.push(item);
 }
 return idsUnique(list);
}
export function roadmapBytes(value:unknown):number{
 return new TextEncoder().encode(JSON.stringify(value)).length;
}
