// Gated debug logger for production diagnosis.
//
// OFF by default, so real visitors never see console spam. To turn it on
// against the deployed site WITHOUT a rebuild, do either of these in the
// browser console (or address bar) and reload:
//
//     localStorage.setItem('debug', '1')      // persists across reloads
//     // — or append to the URL —
//     ?debug=1                                 // also persists (writes the flag)
//
// Then watch the console: you'll see Lenis init, scrub trigger creation /
// re-measure, video load + play() success/failure, and IntersectionObserver
// callbacks — exactly the events that differ between a warm dev machine and a
// cold first-time public visit. Disable with localStorage.removeItem('debug').

function computeEnabled(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const qs = new URLSearchParams(window.location.search);
    if (qs.get("debug") === "1") {
      window.localStorage.setItem("debug", "1");
      return true;
    }
    return window.localStorage.getItem("debug") === "1";
  } catch {
    return false;
  }
}

export const DEBUG = computeEnabled();

export function dlog(scope: string, ...args: unknown[]) {
  if (!DEBUG) return;
  console.log(
    `%c[${scope}]%c ${new Date().toISOString().slice(11, 23)}`,
    "color:#ffb347;font-weight:bold",
    "color:#888",
    ...args
  );
}
