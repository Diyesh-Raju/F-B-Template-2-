/** Compare current pathname to an internal `href` (same page, ignoring hash/query). */
export function isSamePath(pathname: string, href: string): boolean {
  if (!href.startsWith("/")) return false;
  const pathOnly = href.split("#")[0]?.split("?")[0] ?? href;
  const normalized =
    pathOnly === "/" ? "/" : pathOnly.replace(/\/$/, "") || "/";
  const current = pathname === "/" ? "/" : pathname.replace(/\/$/, "") || "/";
  return current === normalized;
}
