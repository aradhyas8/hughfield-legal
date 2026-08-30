const HUSHFIELD_LINKS = Object.freeze({
  appStore: "https://example.com/hushfield-app-store",
  googlePlay: "https://example.com/hushfield-google-play",
  privacy: "https://legal.hushfield.xyz/privacy/",
  terms: "https://legal.hushfield.xyz/terms/",
  support: "https://legal.hushfield.xyz/support/"
});

document.querySelectorAll("[data-link]").forEach(a => {
  a.href = HUSHFIELD_LINKS[a.dataset.link] || a.href;
});

/* C4 · sticky bottom bar — in once the tour is underway, out again at the close.
   IntersectionObserver only; no scroll listeners. */
(() => {
  const bar = document.getElementById("ctaSticky");
  const tour = document.getElementById("tour");
  const close = document.getElementById("close");
  if (!bar || !tour || !close || !("IntersectionObserver" in window)) return;

  const state = { past: false, atClose: false };

  const apply = () => {
    const show = state.past && !state.atClose;
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
    state.past = e.boundingClientRect.top < 0 || e.isIntersecting;
    apply();
  }, { rootMargin: "-40% 0px 0px 0px" }).observe(tour);

  new IntersectionObserver(([e]) => {
    state.atClose = e.isIntersecting;
    apply();
  }, { rootMargin: "0px 0px -20% 0px" }).observe(close);
})();
