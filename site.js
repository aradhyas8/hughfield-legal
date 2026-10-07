const HUSHFIELD_LINKS = Object.freeze({
  appStore: "https://apps.apple.com/app/id6802781534",
  googlePlay: "https://play.google.com/store/apps/details?id=com.inethan18.hushfield",
  privacy: "https://legal.hushfield.xyz/privacy/",
  terms: "https://legal.hushfield.xyz/terms/",
  support: "https://legal.hushfield.xyz/support/"
});

document.querySelectorAll("[data-link]").forEach(a => {
  a.href = HUSHFIELD_LINKS[a.dataset.link] || a.href;
});

(() => {
  if (location.hostname !== "hushfield.xyz" || navigator.globalPrivacyControl) return;

  const token = "phc_zjAcBxMtUNPk8SLdoGirHAGGgAwExi3vPhyxw6qiBhfs";
  const distinctId = crypto.randomUUID();
  let referrerDomain = "direct";
  try {
    if (document.referrer) referrerDomain = new URL(document.referrer).hostname;
  } catch { /* Ignore a malformed browser referrer. */ }

  const capture = (event, details = {}) => {
    const payload = {
      token,
      event,
      properties: {
        distinct_id: distinctId,
        $process_person_profile: false,
        referrer_domain: referrerDomain,
        viewport: innerWidth < 600 ? "phone" : innerWidth < 960 ? "tablet" : "desktop",
        ...details
      }
    };
    fetch("https://us.i.posthog.com/i/v0/e/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
      referrerPolicy: "origin"
    }).catch(() => {});
  };

  capture("landing_view");
  document.querySelectorAll("[data-placement]").forEach(a => {
    a.addEventListener("click", () => capture("store_click", {
      store: a.dataset.link === "appStore" ? "app_store" : "google_play",
      placement: a.dataset.placement
    }));
  });
  document.querySelector(".sound-preview audio")?.addEventListener("play", () => capture("audio_preview_play"), { once: true });
})();

/* Sticky bottom bar appears after the tour and hides at the close.
   IntersectionObserver only; no scroll listeners. */
(() => {
  const bar = document.getElementById("ctaSticky");
  const tour = document.getElementById("tour");
  const close = document.getElementById("close");
  if (!bar || !tour || !close || !("IntersectionObserver" in window)) return;

  const state = { past: false, inTour: false, atClose: false };

  const apply = () => {
    const show = state.past && !state.inTour && !state.atClose;
    if (show) {
      bar.hidden = false;
      requestAnimationFrame(() => bar.classList.add("is-shown"));
    } else {
      bar.classList.remove("is-shown");
    }
  };

  bar.addEventListener("transitionend", e => {
    if (e.propertyName === "transform" && !bar.classList.contains("is-shown")) bar.hidden = true;
  });

  new IntersectionObserver(([e]) => {
    state.inTour = e.isIntersecting;
    state.past = e.boundingClientRect.top < 0;
    apply();
  }).observe(tour);

  new IntersectionObserver(([e]) => {
    state.atClose = e.isIntersecting || e.boundingClientRect.top < 0;
    apply();
  }, { rootMargin: "0px 0px -20% 0px" }).observe(close);
})();
