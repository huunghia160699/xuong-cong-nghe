import { NextResponse } from "next/server";
export function GET(request: Request) {
  return NextResponse.redirect(new URL("/cong-cu/trinh-chieu",request.url),308);
}
