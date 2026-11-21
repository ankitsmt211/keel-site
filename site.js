// Fills the store buttons from stores.js, which the keel repo generates from its list of stores.
// The visitor's own browser picks the store (Edge and other Chromium browsers install from the
// Chrome Web Store); a store whose listing doesn't exist yet says "Coming soon". Phones and other
// browsers can't install Keel, so they get one plain line naming the browsers it works in and a
// "Copy link" button instead.
const STORES = Array.isArray(window.KEEL_STORES) ? window.KEEL_STORES : [];
const LIVE = STORES.filter((s) => s.url);

function visitorStore() {
  const ua = navigator.userAgent;
  const mobile = navigator.userAgentData ? navigator.userAgentData.mobile : /Android|iPhone|iPad|iPod|Mobile/i.test(ua);
  if (mobile) return null;
  const chromium = navigator.userAgentData
    ? navigator.userAgentData.brands.some((b) => /Chrom/i.test(b.brand))
    : /Chrome\//.test(ua) && !/OPR\//.test(ua);
  const id = chromium ? 'chrome' : /Firefox\//.test(ua) ? 'firefox' : null;
  return STORES.find((s) => s.id === id) || null;
}

// "Chrome", "Chrome and Firefox".
function browserList(stores) {
  const names = stores.map((s) => s.label);
  return names.length < 2 ? names.join('') : `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`;
}

function el(tag, attrs, text) {
  const node = document.createElement(tag);
  Object.entries(attrs || {}).forEach(([k, v]) => node.setAttribute(k, v));
  if (text) node.textContent = text;
  return node;
}

function fill() {
  const hero = document.querySelector('[data-store-slot="hero"]');
  const header = document.querySelector('[data-store-slot="header"]');
  const store = visitorStore();
  if (store && store.url) {
    const label = `Add to ${store.label}`;
    if (hero) hero.append(el('a', { class: 'btn btn-primary', href: store.url, rel: 'noopener' }, label));
    if (header) header.append(el('a', { class: 'btn btn-primary btn-sm', href: store.url, rel: 'noopener' }, label));
    return;
  }
  if (!hero) return;
  if (store) {
    // Built for this browser, but its store hasn't listed Keel yet.
    hero.append(el('p', { class: 'soon' }, `Coming soon to ${store.store}`));
    return;
  }
  if (!LIVE.length) {
    hero.append(el('p', { class: 'soon' }, 'Coming soon'));
    return;
  }
  const browsers = browserList(LIVE);
  hero.append(el('p', { class: 'phone-note' }, `Keel works in ${browsers} on a computer.`));
  const button = el('button', { class: 'btn btn-secondary', type: 'button' }, 'Copy link');
  const status = el('p', { class: 'copied', 'aria-live': 'polite' });
  button.addEventListener('click', async () => {
    const link = location.origin + location.pathname;
    try {
      await navigator.clipboard.writeText(link);
      status.textContent = `Link copied. Open it in ${browsers} on your computer.`;
    } catch {
      status.textContent = link; // clipboard blocked: show it to select by hand
    }
  });
  hero.append(button, status);
}

document.addEventListener('DOMContentLoaded', fill);
