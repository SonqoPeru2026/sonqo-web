// Slider por scroll-snap paginado: avanza de a una "página" (lo que quepa en el
// viewport del track: 1 card en mobile, 3 en desktop, según el ancho de los items).
// Compartido por el carrusel de reels (/gallery) y los embeds del home.
export interface SnapSliderSelectors {
  track: string;
  prev: string;
  next: string;
  counter?: string;
  counterTotal?: string;
}

export function initSnapSlider(root: HTMLElement, sel: SnapSliderSelectors): void {
  if (root.dataset.sliderReady) return;
  root.dataset.sliderReady = "1";

  const track = root.querySelector<HTMLElement>(sel.track);
  const prev = root.querySelector<HTMLButtonElement>(sel.prev);
  const next = root.querySelector<HTMLButtonElement>(sel.next);
  const counter = sel.counter ? root.querySelector<HTMLElement>(sel.counter) : null;
  const counterTotal = sel.counterTotal
    ? root.querySelector<HTMLElement>(sel.counterTotal)
    : null;
  if (!track || !prev || !next) return;

  // clientWidth es 0 si el track arranca oculto (display:none): evita NaN.
  const width = () => track.clientWidth || 1;
  const pages = () => Math.max(1, Math.ceil(track.scrollWidth / width()));
  const current = () => Math.round(track.scrollLeft / width());
  const goTo = (i: number) => {
    const target = Math.max(0, Math.min(pages() - 1, i));
    track.scrollTo({ left: target * width(), behavior: "smooth" });
  };
  const sync = () => {
    const i = current();
    if (counter) counter.textContent = String(i + 1);
    if (counterTotal) counterTotal.textContent = String(pages());
    prev.disabled = i <= 0;
    next.disabled = i >= pages() - 1;
  };

  prev.addEventListener("click", () => goTo(current() - 1));
  next.addEventListener("click", () => goTo(current() + 1));
  track.addEventListener("scroll", sync, { passive: true });
  window.addEventListener("resize", sync, { passive: true });
  sync();
}
