import type {RoadmapEpic,RoadmapChecklistItem,RoadmapEntry} from "./roadmap-data";

/** Comparison is read-only: deployment checklists are not evidence that a test passed. */
export type RoadmapComparison={
  sourceCount:number;targetCount:number;
  missingEpics:string[];extraEpics:string[];
  missingTasks:{epicId:string;text:string}[];
  extraTasks:{epicId:string;text:string}[];
  mismatchedTasks:{epicId:string;text:string;sourceDone:boolean;targetDone:boolean}[];
  textConflicts:{epicId:string;taskId:string}[];
  missingEntries:{epicId:string;text:string}[];
  extraEntries:{epicId:string;text:string}[];
};
const diffEntries=(source:RoadmapEntry[],target:RoadmapEntry[])=>
 source.filter(entry=>!target.some(current=>current.id===entry.id));
export function compareRoadmaps(source:RoadmapEpic[],target:RoadmapEpic[]):RoadmapComparison{
 const sourceMap=new Map(source.map(epic=>[epic.id,epic]));
 const targetMap=new Map(target.map(epic=>[epic.id,epic]));
 const result:RoadmapComparison={
  sourceCount:source.length,targetCount:target.length,missingEpics:[],extraEpics:[],
  missingTasks:[],extraTasks:[],mismatchedTasks:[],textConflicts:[],missingEntries:[],extraEntries:[]
 };
 for(const src of source){
  const dest=targetMap.get(src.id);
  if(!dest){result.missingEpics.push(src.title);continue;}
  const targetTasks=new Map(dest.checklist.map(t=>[t.id,t]));
  const sourceTasks=new Map(src.checklist.map(t=>[t.id,t]));
  for(const task of src.checklist){
   const counterpart=targetTasks.get(task.id);
   if(!counterpart){result.missingTasks.push({epicId:src.id,text:task.text});continue;}
   if(counterpart.done!==task.done)result.mismatchedTasks.push({
    epicId:src.id,text:task.text,sourceDone:task.done,targetDone:counterpart.done
   });
   if(counterpart.text!==task.text)result.textConflicts.push({epicId:src.id,taskId:task.id});
  }
  for(const task of dest.checklist){
   if(!sourceTasks.has(task.id))result.extraTasks.push({epicId:src.id,text:task.text});
  }
  for(const note of diffEntries(src.entries,dest.entries))
   result.missingEntries.push({epicId:src.id,text:note.text});
  for(const note of diffEntries(dest.entries,src.entries))
   result.extraEntries.push({epicId:src.id,text:note.text});
 }
 for(const dest of target)if(!sourceMap.has(dest.id))result.extraEpics.push(dest.title);
 return result;
}
export function compareTotals(report:RoadmapComparison){
 return {
  missing:report.missingEpics.length+report.missingTasks.length+report.missingEntries.length,
  differences:report.mismatchedTasks.length+report.textConflicts.length,
  extra:report.extraEpics.length+report.extraTasks.length+report.extraEntries.length
 };
}
/**
 * ONLY ADD missing IDs from source; preserve target edits, done flags, task text,
 * owner, order, status and logs. Never mark an existing checkbox completed.
 * Caller must checkpoint and obtain explicit confirmation before saving.
 */
export function mergeMissingRoadmap(target:RoadmapEpic[],source:RoadmapEpic[]):RoadmapEpic[]{
 const sourceMap=new Map(source.map(item=>[item.id,item]));
 const targetIds=new Set(target.map(item=>item.id));
 const combined=target.map(current=>{
  const src=sourceMap.get(current.id);
  if(!src)return structuredClone(current);
  const taskIds=new Set(current.checklist.map(task=>task.id));
  const entryIds=new Set(current.entries.map(entry=>entry.id));
  const addTasks:RoadmapChecklistItem[]=src.checklist
   .filter(task=>!taskIds.has(task.id)).map(task=>structuredClone(task));
  const addEntries:RoadmapEntry[]=src.entries
   .filter(entry=>!entryIds.has(entry.id)).map(entry=>structuredClone(entry));
  // Prevent newly imported work from showing a completed epic with unchecked tasks.
  const status=current.status==="done"&&addTasks.some(task=>!task.done)?"building":current.status;
  return {...structuredClone(current),status,
   checklist:[...current.checklist,...addTasks],
   entries:[...current.entries,...addEntries]};
 });
 for(const src of source){
  if(targetIds.has(src.id))continue;
  combined.push({...structuredClone(src),order:combined.length});
 }
 return combined;
}
