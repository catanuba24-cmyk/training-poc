import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const url = new URL(req.url);
  const res = NextResponse.next();

  // PoC role toggles via query string
  if (url.searchParams.has("pro")) {
    res.cookies.set("pro", url.searchParams.get("pro") === "1" ? "1" : "0", { path: "/" });
  }
  if (url.searchParams.has("org")) {
    const v = url.searchParams.get("org") || "";
    res.cookies.set("org", v, { path: "/" });
  }
  return res;
}
