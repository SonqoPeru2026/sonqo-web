declare global {
  interface Window {
    turnstile?: {
      render: (container: string | HTMLElement, params: Record<string, unknown>) => string;
      remove: (widgetId?: string) => void;
      reset: (widgetId?: string) => void;
    };
    __onTurnstileLoad?: () => void;
  }
}

const READY_EVENT = "turnstile:ready";

// El script de Turnstile llama a esto por nombre (?onload=) cuando termina de cargar.
window.__onTurnstileLoad = () => document.dispatchEvent(new CustomEvent(READY_EVENT));

// Renderiza a mano cada .cf-turnstile pendiente de la page actual. Se llama en cada
// astro:page-load porque el script (cargado una sola vez en Layout.astro con
// render=explicit) no vuelve a auto-escanear el DOM tras una navegación SPA.
// Lee los data-* del contenedor como si fuera auto-render implícito: data-sitekey,
// data-action, data-callback, data-expired-callback, data-error-callback (el valor
// de estos tres últimos es el NOMBRE de una función global en window).
export function renderPendingTurnstileWidgets(): void {
  const run = () => {
    document.querySelectorAll<HTMLElement>(".cf-turnstile:not([data-rendered])").forEach((el) => {
      const sitekey = el.dataset.sitekey;
      if (!sitekey || !window.turnstile) return;

      const params: Record<string, unknown> = { sitekey };
      if (el.dataset.action) params.action = el.dataset.action;
      for (const [attr, param] of [
        ["callback", "callback"],
        ["expiredCallback", "expired-callback"],
        ["errorCallback", "error-callback"],
      ] as const) {
        const fnName = el.dataset[attr];
        if (fnName) {
          params[param] = (...args: unknown[]) => {
            const fn = (window as unknown as Record<string, ((...a: unknown[]) => void) | undefined>)[fnName];
            fn?.(...args);
          };
        }
      }

      window.turnstile.render(el, params);
      el.dataset.rendered = "true";
    });
  };

  if (window.turnstile) run();
  else document.addEventListener(READY_EVENT, run, { once: true });
}
