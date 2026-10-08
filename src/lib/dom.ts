/** In-page scroll that does not rewrite the HashRouter location. */
export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reducedMotion ? "instant" : "smooth", block: "start" });
  el.focus({ preventScroll: true });
}
