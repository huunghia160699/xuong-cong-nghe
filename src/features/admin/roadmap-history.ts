import type {RoadmapEpic} from "./roadmap-data";
import {roadmapBytes,validateRoadmap,ROADMAP_MAX_BYTES} from "./roadmap-validation";

export const ROADMAP_HISTORY_KEY="xcn-admin-roadmap-history-v1";
export const ROADMAP_HISTORY_LIMIT=6;
/** Leave space in browser storage for the active draft and unrelated app data. */
export const ROADMAP_HISTORY_MAX_BYTES=1_600_000;

export type RoadmapSnapshot={
 id:string;
 createdAt:string;
 label:string;
 baseVersion:number;
 items:RoadmapEpic[];
};
export type RoadmapSnapshotInput=Omit<RoadmapSnapshot,"id"|"createdAt">;

function validSnapshot(value:unknown):value is RoadmapSnapshot{
 if(!value||typeof value!=="object"||Array.isArray(value))return false;
 const x=value as Partial<RoadmapSnapshot>;
 return typeof x.id==="string"&&x.id.length>0&&x.id.length<=100
  &&typeof x.createdAt==="string"&&!Number.isNaN(Date.parse(x.createdAt))
  &&x.createdAt.length<=50&&typeof x.label==="string"&&x.label.length>0&&x.label.length<=100
  &&typeof x.baseVersion==="number"&&Number.isInteger(x.baseVersion)&&x.baseVersion>=0
  &&validateRoadmap(x.items)&&roadmapBytes(x.items)<=ROADMAP_MAX_BYTES;
}

/** A corrupt browser backup is never trusted as a restore source. */
export function parseRoadmapHistory(raw:unknown):RoadmapSnapshot[]{
 if(!Array.isArray(raw)||raw.length>ROADMAP_HISTORY_LIMIT)return [];
 if(!raw.every(validSnapshot))return [];
 const ids=raw.map(x=>x.id);
 if(new Set(ids).size!==ids.length)return [];
 if(roadmapBytes(raw)>ROADMAP_HISTORY_MAX_BYTES)return [];
 return raw;
}

/** Immutable bounded history; oldest snapshots are evicted to avoid exhausting localStorage. */
export function addRoadmapSnapshot(
 history:RoadmapSnapshot[],data:RoadmapSnapshotInput,
 id:string,createdAt:string
):RoadmapSnapshot[]{
 if(!validateRoadmap(data.items)||roadmapBytes(data.items)>ROADMAP_MAX_BYTES)
  throw new Error("Dữ liệu roadmap không hợp lệ để sao lưu.");
 if(!data.label.trim()||data.label.length>100||
  !Number.isInteger(data.baseVersion)||data.baseVersion<0)
  throw new Error("Thông tin bản sao lưu không hợp lệ.");
 if(!id||id.length>100||!createdAt||Number.isNaN(Date.parse(createdAt)))
  throw new Error("Định danh hoặc ngày sao lưu không hợp lệ.");
 const items=structuredClone(data.items);
 const prior=parseRoadmapHistory(history);
 if(prior[0]&&JSON.stringify(prior[0].items)===JSON.stringify(items))return prior;
 const snapshot:RoadmapSnapshot={id,createdAt,label:data.label.trim(),baseVersion:data.baseVersion,items};
 const next=[snapshot,...prior.filter(x=>x.id!==id)].slice(0,ROADMAP_HISTORY_LIMIT);
 while(next.length&&roadmapBytes(next)>ROADMAP_HISTORY_MAX_BYTES)next.pop();
 if(!next.length)throw new Error("Bản sao lưu vượt giới hạn lưu trữ trình duyệt.");
 return next;
}

export function removeRoadmapSnapshot(history:RoadmapSnapshot[],id:string):RoadmapSnapshot[]{
 return parseRoadmapHistory(history).filter(snapshot=>snapshot.id!==id);
}
