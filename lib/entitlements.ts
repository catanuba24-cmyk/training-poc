import { cookies } from "next/headers";

export type AccessType = "free" | "paid" | "org";

export function getUserEntitlements() {
  const c = cookies();
  const isPaid = c.get("pro")?.value === "1";    // ?pro=1 sets a cookie
  const inOrg  = c.get("org")?.value === "acme"; // ?org=acme sets a cookie
  return { isPaid, inOrg };
}

export function canViewCourse(accessType: AccessType, opts: { isPaid: boolean, inOrg: boolean }) {
  if (accessType === "free") return true;
  if (accessType === "paid") return opts.isPaid;
  if (accessType === "org")  return opts.inOrg;
  return false;
}
