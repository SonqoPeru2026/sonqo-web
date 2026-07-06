type InstagramWindow = Window & {
  instgrm?: { Embeds: { process: () => void } };
};

const SCRIPT_ID = "ig-embed-js";
const SCRIPT_SRC = "https://www.instagram.com/embed.js";

export function loadInstagramEmbeds(): void {
  const w = window as InstagramWindow;
  if (w.instgrm) {
    w.instgrm.Embeds.process();
    return;
  }
  if (document.getElementById(SCRIPT_ID)) return;
  const s = document.createElement("script");
  s.id = SCRIPT_ID;
  s.async = true;
  s.src = SCRIPT_SRC;
  document.body.appendChild(s);
}

export function reprocessInstagramEmbeds(): void {
  (window as InstagramWindow).instgrm?.Embeds.process();
}
