import type {MetadataRoute} from "next";

export default function robots():MetadataRoute.Robots{
 const base=process.env.NEXT_PUBLIC_APP_URL??"http://localhost:3000";
 return {
  rules:[{userAgent:"*",allow:"/",disallow:["/admin/","/student/","/api/","/auth/","/dang-nhap","/dang-ky","/quen-mat-khau","/doi-mat-khau"]}],
  sitemap:new URL("/sitemap.xml",base).toString()
 };
}
