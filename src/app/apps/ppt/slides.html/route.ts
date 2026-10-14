import { NextResponse } from "next/server";
export function GET(request: Request) {
  const old=new URL(request.url);
  const lesson=old.searchParams.get("lesson");
  const path=lesson==="layout-gallery" ? "/cong-cu/trinh-chieu/layout-gallery" : "/cong-cu/trinh-chieu/quan-ly-tep-va-thu-muc";
  const to=new URL(path,old.origin);
  if(lesson!=="layout-gallery" && old.searchParams.get("class")==="hl-26-27")
    to.searchParams.set("class","hl-26-27");
  return NextResponse.redirect(to,308);
}
