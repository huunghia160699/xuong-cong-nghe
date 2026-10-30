import {Brand} from "@/components/brand";
import {PublicNavigation} from "@/components/public-navigation";
import {createSupabaseServerClient} from "@/lib/supabase/server";
import {isLiveMode} from "@/lib/supabase/config";

/** Public pages are discoverable by guests; account actions are role-aware. */
export async function PublicHeader(){
 let accountHref="/dang-nhap",accountLabel="Đăng nhập";
 if(!isLiveMode()){
  accountHref="/student";accountLabel="Học thử";
 }else{
  try{
   const supabase=await createSupabaseServerClient();
   const {data:{user}}=await supabase.auth.getUser();
   if(user){
    const {data:profile}=await supabase.from("profiles").select("role").eq("id",user.id).maybeSingle();
    if(profile?.role==="admin"||profile?.role==="student"||profile?.role==="teacher"){
     accountHref=profile.role==="admin"?"/admin":"/student";
     accountLabel="Không gian của tôi";
    }
   }
  }catch{
   // Public navigation remains accessible if session lookup temporarily fails.
  }
 }
 return <header className="xcn-public-header sticky top-0 z-40" role="banner">
  <div className="xcn-container xcn-header-inner xcn-public-header-inner">
   <Brand />
   <PublicNavigation accountHref={accountHref} accountLabel={accountLabel}/>
  </div>
 </header>;
}
