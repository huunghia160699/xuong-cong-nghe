import {isLiveMode} from "@/lib/supabase/config";
import {createSupabaseServerClient} from "@/lib/supabase/server";
export const ADMIN_COUNT_TABLES=[
 ["Hồ sơ","profiles"],["Khóa học","courses"],["Chương","chapters"],["Bài học","lessons"],
 ["Lượt làm quiz","quiz_attempts"],["Quiz","quizzes"],["Đăng ký khóa học","enrollments"],
 ["Bài đã hoàn thành","lesson_progress"],["Câu hỏi","questions"]
] as const;
export type AdminStats={values:Record<string,number|null>;error:boolean;live:boolean};
export async function loadAdminStats():Promise<AdminStats>{
 if(!isLiveMode())return {values:{},error:false,live:false};
 const supabase=await createSupabaseServerClient();
 const results=await Promise.all(ADMIN_COUNT_TABLES.map(async ([label,table])=>{
  const {count,error}=await supabase.from(table).select("id",{head:true,count:"exact"});
  return {label,count:error?null:count,failed:Boolean(error)};
 }));
 return {values:Object.fromEntries(results.map(r=>[r.label,r.count])),
  error:results.some(r=>r.failed),live:true};
}
