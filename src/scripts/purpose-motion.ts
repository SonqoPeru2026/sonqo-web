// Coreografia de la seccion Purpose ("¿Qué hacemos?") con GSAP.
// - Texto: eyebrow + titulo con mascara por linea (mismo lenguaje que el hero),
//   parrafos escalonados, "−20 °C" subrayado, chips en cascada.
// - Card: reveal con clip-path + latido del corazon, parallax vertical, tilt 3D con brillo.
// - Carrusel de fotos: bucle infinito que avanza solo, acelera (o retrocede) con la
//   velocidad del scroll, se arrastra con inercia, frena al pasar el mouse, se inclina
//   con la velocidad y cada foto se desplaza dentro de su marco (efecto ventana).
// Todo vive en un gsap.matchMedia: reduced-motion = sin animaciones (contenido visible
// tal cual) y se revierte limpio al navegar con View Transitions (astro:before-swap).
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

// Curva firma del sitio (≈ cubic-bezier(0.16, 1, 0.3, 1) del hero).
const EASE = "expo.out";

let mm: gsap.MatchMedia | null = null;

export function destroyPurposeMotion(): void {
  mm?.revert();
  mm = null;
}

export function initPurposeMotion(): void {
  const root = document.querySelector<HTMLElement>("[data-purpose]");
  if (!root) return;
  destroyPurposeMotion();
  mm = gsap.matchMedia();

  mm.add(
    {
      motion: "(prefers-reduced-motion: no-preference)",
      finePointer: "(pointer: fine)",
    },
    (ctx) => {
      const { motion, finePointer } = ctx.conditions as Record<string, boolean>;
      if (!motion) return;

      const q = <T extends Element = HTMLElement>(sel: string) =>
        gsap.utils.toArray<T>(root.querySelectorAll(sel));
      const one = <T extends Element = HTMLElement>(sel: string) => root.querySelector<T>(sel);

      const cleanups: (() => void)[] = [];

      animateText(q, one);
      animateCard(one, q, finePointer, cleanups);
      animateStrip(root, q, one, finePointer, cleanups);

      return () => cleanups.forEach((fn) => fn());
    },
  );
}

type Query = <T extends Element = HTMLElement>(sel: string) => T[];
type One = <T extends Element = HTMLElement>(sel: string) => T | null;

function animateText(q: Query, one: One): void {
  const text = one("[data-purpose-text]");
  const title = one("[data-purpose-title]");
  if (!text || !title) return;

  const intro = gsap.timeline({
    defaults: { ease: EASE },
    scrollTrigger: { trigger: text, start: "top 78%", once: true },
  });
  intro
    .from("[data-purpose-eyebrow-line]", { scaleX: 0, duration: 0.7 })
    .from("[data-purpose-eyebrow]", { y: 12, opacity: 0, duration: 0.7 }, "<0.1");

  // Mascara por linea: cada linea sube desde abajo. autoSplit re-parte al cambiar el
  // ancho (y al cargar la fuente) y onSplit recrea la animacion sobre las lineas nuevas.
  SplitText.create(title, {
    type: "lines",
    mask: "lines",
    autoSplit: true,
    onSplit: (self) =>
      gsap.from(self.lines, {
        yPercent: 110,
        duration: 1.1,
        stagger: 0.09,
        ease: EASE,
        scrollTrigger: { trigger: title, start: "top 82%", once: true },
      }),
  });

  gsap.from(q("[data-purpose-para]"), {
    y: 24,
    opacity: 0,
    duration: 0.9,
    stagger: 0.12,
    ease: EASE,
    scrollTrigger: { trigger: title, start: "top 75%", once: true },
  });

  // El dato del frio se subraya cuando el parrafo ya esta en su lugar.
  const coldLine = one("[data-purpose-cold-line]");
  if (coldLine) {
    gsap.from(coldLine, {
      scaleX: 0,
      duration: 0.9,
      delay: 0.7,
      ease: "power3.inOut",
      scrollTrigger: { trigger: coldLine, start: "top 85%", once: true },
    });
  }

  gsap.from(q("[data-purpose-chip]"), {
    y: 14,
    scale: 0.96,
    opacity: 0,
    duration: 0.6,
    stagger: 0.06,
    ease: "power3.out",
    scrollTrigger: { trigger: q("[data-purpose-chip]")[0], start: "top 90%", once: true },
  });
}

function animateCard(one: One, q: Query, finePointer: boolean, cleanups: (() => void)[]): void {
  const float = one("[data-purpose-card-float]");
  const card = one("[data-purpose-card]");
  if (!float || !card) return;

  // Reveal: el recorte se abre desde el centro mientras la card sube.
  const reveal = gsap.timeline({
    defaults: { ease: EASE },
    scrollTrigger: { trigger: card, start: "top 82%", once: true },
  });
  reveal
    .fromTo(
      card,
      { clipPath: "inset(10% 6% 10% 6% round 24px)", y: 48, opacity: 0 },
      { clipPath: "inset(0% 0% 0% 0% round 24px)", y: 0, opacity: 1, duration: 1.2, clearProps: "clipPath" },
    )
    .from(q("[data-purpose-card-item]"), { y: 16, opacity: 0, duration: 0.8, stagger: 0.08 }, "<0.3")
    // Latido unico: anticipacion corta -> golpe -> asentarse (sin rebote infinito).
    .to("[data-purpose-heart]", {
      keyframes: { scale: [1, 1.2, 0.95, 1.08, 1] },
      duration: 0.9,
      ease: "power2.out",
    }, "<0.35");

  // Parallax: la card flota mas lento que el texto (scrub con inercia).
  gsap.fromTo(
    float,
    { y: 70 },
    {
      y: -70,
      ease: "none",
      scrollTrigger: { trigger: float, start: "top bottom", end: "bottom top", scrub: 0.8 },
    },
  );

  if (!finePointer) return;

  // Tilt 3D + brillo que sigue al cursor. quickTo = un tween reutilizado (sin crear
  // tweens por cada pointermove).
  gsap.set(card, { transformPerspective: 900 });
  const rotX = gsap.quickTo(card, "rotationX", { duration: 0.6, ease: "power3.out" });
  const rotY = gsap.quickTo(card, "rotationY", { duration: 0.6, ease: "power3.out" });
  const MAX_TILT = 6;

  const onMove = (e: PointerEvent) => {
    const r = card.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    rotY((px - 0.5) * MAX_TILT * 2);
    rotX((0.5 - py) * MAX_TILT * 2);
    card.style.setProperty("--gx", `${(px * 100).toFixed(1)}%`);
    card.style.setProperty("--gy", `${(py * 100).toFixed(1)}%`);
  };
  const onLeave = () => {
    rotX(0);
    rotY(0);
  };
  card.addEventListener("pointermove", onMove);
  card.addEventListener("pointerleave", onLeave);
  cleanups.push(() => {
    card.removeEventListener("pointermove", onMove);
    card.removeEventListener("pointerleave", onLeave);
  });
}

function animateStrip(
  root: HTMLElement,
  q: Query,
  one: One,
  finePointer: boolean,
  cleanups: (() => void)[],
): void {
  const strip = one("[data-purpose-strip]");
  const track = one("[data-purpose-track]");
  if (!strip || !track) return;

  // Activa el modo animado: muestra los clones y desactiva el swipe nativo.
  strip.dataset.motion = "on";
  if (finePointer) strip.dataset.fine = "on";

  const photos = q("[data-purpose-photo]");
  const imgs = photos.map((p) => p.querySelector<HTMLElement>("[data-purpose-photo-img]"));
  const half = photos.length / 2;

  const CRUISE = 42; // px/s hacia la derecha, velocidad de crucero
  const HOVER_SLOW = 0.2; // con el mouse encima avanza al 20%
  const clampBoost = gsap.utils.clamp(-900, 900);
  const clampFling = gsap.utils.clamp(-2600, 2600);
  const clampSkew = gsap.utils.clamp(-4, 4);
  const clampUnit = gsap.utils.clamp(-1, 1);

  // Ancho de un set de fotos = distancia entre la 1ra foto y su clon (los margenes son
  // simetricos, asi el bucle cae exacto, sin salto).
  let loopWidth = 1;
  let offsets: number[] = [];
  let widths: number[] = [];
  const measure = () => {
    loopWidth = Math.max(1, photos[half].offsetLeft - photos[0].offsetLeft);
    offsets = photos.map((p) => p.offsetLeft);
    widths = photos.map((p) => p.offsetWidth);
  };
  measure();

  let x = -loopWidth / 2;
  let speedFactor = 1;
  let speedTarget = 1;
  let boost = 0; // empuje del scroll (px/s), se disipa
  let fling = 0; // inercia del arrastre (px/s), se disipa
  let skew = 0;
  let dragging = false;
  let dragVel = 0;
  let lastX = 0;
  let lastT = 0;

  const setX = gsap.quickSetter(track, "x", "px");
  const setSkew = gsap.quickSetter(track, "skewX", "deg");
  const setImgX = imgs.map((img) => (img ? gsap.quickSetter(img, "xPercent") : null));
  let wrapX = gsap.utils.wrap(-loopWidth, 0);

  const tick = (_time: number, deltaMs: number) => {
    const dt = Math.min(deltaMs, 64) / 1000;
    speedFactor += (speedTarget - speedFactor) * (1 - Math.exp(-dt * 5));
    boost *= Math.exp(-dt * 2.8);
    fling *= Math.exp(-dt * 2.2);

    const velocity = dragging ? dragVel : CRUISE * speedFactor + boost + fling;
    if (!dragging) x += velocity * dt;
    x = wrapX(x);
    setX(x);

    // Inclinacion: solo el exceso sobre la velocidad de crucero (en reposo = 0°).
    const skewTarget = clampSkew((velocity - CRUISE * speedFactor) / 320);
    skew += (skewTarget - skew) * (1 - Math.exp(-dt * 8));
    setSkew(skew);

    // Efecto ventana: la imagen se corre dentro del marco segun su lugar en pantalla.
    const vw = window.innerWidth;
    for (let i = 0; i < photos.length; i++) {
      const cx = offsets[i] + widths[i] / 2 + x;
      if (cx < -widths[i] || cx > vw + widths[i]) continue;
      setImgX[i]?.(clampUnit((cx / vw - 0.5) * 2) * -5);
    }
  };

  // El ticker solo corre mientras la tira esta en pantalla.
  let running = false;
  const start = () => {
    if (running) return;
    running = true;
    gsap.ticker.add(tick);
  };
  const stop = () => {
    running = false;
    gsap.ticker.remove(tick);
  };

  ScrollTrigger.create({
    trigger: strip,
    start: "top bottom",
    end: "bottom top",
    onToggle: (self) => (self.isActive ? start() : stop()),
  });

  // Scroll -> empuje: bajar acelera hacia la derecha, subir la hace retroceder.
  ScrollTrigger.create({
    trigger: root,
    start: "top bottom",
    end: "bottom top",
    onUpdate: (self) => {
      const target = clampBoost(self.getVelocity() * 0.45);
      if (Math.abs(target) > Math.abs(boost)) boost = target;
    },
  });

  // Entrada: las fotos suben en cascada la primera vez.
  gsap.from(photos, {
    y: 60,
    opacity: 0,
    duration: 1,
    stagger: { amount: 0.5 },
    ease: EASE,
    scrollTrigger: { trigger: strip, start: "top 90%", once: true },
  });

  // Arrastre con inercia (mouse y touch; el gesto vertical sigue siendo scroll).
  const onDown = (e: PointerEvent) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    dragging = true;
    dragVel = 0;
    fling = 0;
    boost = 0;
    lastX = e.clientX;
    lastT = performance.now();
    strip.dataset.dragging = "on";
    strip.setPointerCapture(e.pointerId);
  };
  const onMove = (e: PointerEvent) => {
    if (!dragging) return;
    const now = performance.now();
    const dx = e.clientX - lastX;
    const instant = (dx / Math.max(now - lastT, 1)) * 1000;
    dragVel = dragVel * 0.25 + instant * 0.75;
    x += dx;
    lastX = e.clientX;
    lastT = now;
  };
  const onUp = () => {
    if (!dragging) return;
    dragging = false;
    delete strip.dataset.dragging;
    // Si el dedo se detuvo antes de soltar, no hay lanzamiento.
    const v = performance.now() - lastT > 90 ? 0 : dragVel;
    fling = clampFling(v) - CRUISE * speedFactor;
  };
  const onEnter = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    speedTarget = HOVER_SLOW;
  };
  const onLeave = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    speedTarget = 1;
  };

  const onResize = () => {
    measure();
    wrapX = gsap.utils.wrap(-loopWidth, 0);
  };

  strip.addEventListener("pointerdown", onDown);
  strip.addEventListener("pointermove", onMove);
  strip.addEventListener("pointerup", onUp);
  strip.addEventListener("pointercancel", onUp);
  strip.addEventListener("pointerenter", onEnter);
  strip.addEventListener("pointerleave", onLeave);
  window.addEventListener("resize", onResize);

  cleanups.push(() => {
    stop();
    strip.removeEventListener("pointerdown", onDown);
    strip.removeEventListener("pointermove", onMove);
    strip.removeEventListener("pointerup", onUp);
    strip.removeEventListener("pointercancel", onUp);
    strip.removeEventListener("pointerenter", onEnter);
    strip.removeEventListener("pointerleave", onLeave);
    window.removeEventListener("resize", onResize);
    gsap.set(track, { clearProps: "transform" });
    gsap.set(imgs.filter(Boolean), { clearProps: "transform" });
    delete strip.dataset.motion;
    delete strip.dataset.fine;
    delete strip.dataset.dragging;
  });
}
