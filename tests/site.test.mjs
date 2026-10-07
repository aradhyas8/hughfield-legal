import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const source = readFileSync(new URL('../site.js', import.meta.url), 'utf8');

function run(hostname, globalPrivacyControl = false) {
  const sent = [];
  const links = ['appStore', 'googlePlay'].map((link) => ({
    dataset: { link, placement: 'hero' },
    href: '',
    addEventListener(_event, handler) { this.click = handler; }
  }));
  const legalLinks = ['privacy', 'terms', 'support'].map((link) => ({
    dataset: { link },
    href: `https://legal.hushfield.xyz/${link}/`
  }));
  const allLinks = [...links, ...legalLinks];
  const audio = { addEventListener(_event, handler) { this.play = handler; } };
  const document = {
    referrer: 'https://search.example/results?q=private',
    querySelectorAll(selector) { return selector === '[data-link]' ? allLinks : selector === '[data-placement]' ? links : []; },
    querySelector(selector) { return selector === '.sound-preview audio' ? audio : null; },
    getElementById() { return null; }
  };
  vm.runInNewContext(source, {
    document, location: { hostname }, navigator: { globalPrivacyControl },
    crypto: { randomUUID: () => 'visit-id' }, URL, innerWidth: 390, window: {},
    fetch(_url, options) { sent.push(JSON.parse(options.body)); return Promise.resolve(); }
  });
  return { sent, links, legalLinks, audio };
}

const live = run('hushfield.xyz');
assert.equal(live.sent[0].event, 'landing_view');
assert.equal(live.sent[0].properties.referrer_domain, 'search.example');
assert.equal(live.sent[0].properties.$process_person_profile, false);
assert.equal(live.links[0].href, 'https://apps.apple.com/app/id6802781534');
assert.equal(live.links[1].href, 'https://play.google.com/store/apps/details?id=com.inethan18.hushfield');
assert.deepEqual(live.legalLinks.map(link => link.href), ['/privacy/', '/terms/', '/support/']);
live.links[1].click();
assert.equal(live.sent[1].event, 'store_click');
assert.equal(live.sent[1].properties.store, 'google_play');
assert.equal(live.sent[1].properties.placement, 'hero');
live.audio.play();
assert.equal(live.sent[2].event, 'audio_preview_play');
assert.equal(run('localhost').sent.length, 0);
assert.equal(run('hushfield.xyz', true).sent.length, 0);

const observers = [];
const classes = new Set();
const bar = {
  hidden: true,
  classList: {
    add(name) { classes.add(name); },
    remove(name) { classes.delete(name); },
    contains(name) { return classes.has(name); }
  },
  addEventListener(_event, handler) { this.transitionEnd = handler; }
};
const tour = {};
const close = {};
class FakeIntersectionObserver {
  constructor(callback) { this.callback = callback; observers.push(this); }
  observe(target) { this.target = target; }
  emit(isIntersecting, top) {
    this.callback([{ isIntersecting, boundingClientRect: { top } }]);
  }
}
const stickyDocument = {
  querySelectorAll() { return []; },
  querySelector() { return null; },
  getElementById(id) { return { ctaSticky: bar, tour, close }[id] ?? null; }
};
vm.runInNewContext(source, {
  document: stickyDocument, location: { hostname: 'localhost' }, navigator: {},
  window: { IntersectionObserver: FakeIntersectionObserver },
  IntersectionObserver: FakeIntersectionObserver,
  requestAnimationFrame(callback) { callback(); }
});
const tourObserver = observers.find(observer => observer.target === tour);
const closeObserver = observers.find(observer => observer.target === close);
tourObserver.emit(true, 200);
assert.equal(bar.hidden, true, 'sticky CTA stays hidden during the tour');
tourObserver.emit(false, -100);
assert.equal(classes.has('is-shown'), true, 'sticky CTA appears after the tour');
closeObserver.emit(true, 200);
assert.equal(classes.has('is-shown'), false, 'sticky CTA hides at the close section');
closeObserver.emit(false, -100);
assert.equal(classes.has('is-shown'), false, 'sticky CTA stays hidden after the close section');
bar.transitionEnd({ propertyName: 'transform' });
assert.equal(bar.hidden, true);
console.log('site checks passed');
