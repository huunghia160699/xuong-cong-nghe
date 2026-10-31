import {redirect} from "next/navigation";
import {createSupabaseServerClient} from "@/lib/supabase/server";
import {isLiveMode} from "@/lib/supabase/config";

/** Second server-side barrier: a missing middleware rule must not expose tools.
 * Mock Demo mode is only for offline development and does not enforce real Auth. */
export async function requireToolAccess(nextPath:string){
 if(!isLiveMode())return;
 const supabase=await createSupabaseServerClient();
 const {data:{user},error}=await supabase.auth.getUser();
 if(error||!user)redirect("/dang-nhap?next="+encodeURIComponent(nextPath));
 const {data:profile,error:profileError}=await supabase.from("profiles")
   .select("role").eq("id",user.id).single();
 if(profileError||!["admin","student","teacher"].includes(profile?.role??""))
   redirect("/khong-co-quyen");
}
