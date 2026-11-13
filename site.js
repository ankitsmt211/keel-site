// Fills the store buttons. Set STORE_URL once the Chrome Web Store listing is live; until then the
// page says "Coming soon". Phones and non-Chromium browsers can't install extensions, so they get
// one plain line and a "Copy link" button instead of a store button.
const STORE_URL = '';

function canInstall() {
  const ua = navigator.userAgent;
  const mobile = navigator.userAgentData ? navigator.userAgentData.mobile : /Android|iPhone|iPad|iPod|Mobile/i.test(ua);
  const chromium = navigator.userAgentData
    ? navigator.userAgentData.brands.some((b) => /Chrom/i.test(b.brand))
    : /Chrome\//.test(ua) && !/OPR\//.test(ua);
  return !mobile && chromium;
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
  if (!STORE_URL) {
    if (hero) hero.append(el('p', { class: 'soon' }, 'Coming soon to the Chrome Web Store'));
    return;
  }
  if (canInstall()) {
    if (hero) hero.append(el('a', { class: 'btn btn-primary', href: STORE_URL, rel: 'noopener' }, 'Add to Chrome'));
    if (header) header.append(el('a', { class: 'btn btn-primary btn-sm', href: STORE_URL, rel: 'noopener' }, 'Add to Chrome'));
    return;
  }
  if (!hero) return;
  hero.append(el('p', { class: 'phone-note' }, 'Keel works in Chrome on a computer.'));
  const button = el('button', { class: 'btn btn-secondary', type: 'button' }, 'Copy link');
  const status = el('p', { class: 'copied', 'aria-live': 'polite' });
  button.addEventListener('click', async () => {
    const link = location.origin + location.pathname;
    try {
      await navigator.clipboard.writeText(link);
      status.textContent = 'Link copied. Open it in Chrome on your computer.';
    } catch {
      status.textContent = link; // clipboard blocked: show it to select by hand
    }
  });
  hero.append(button, status);
}

document.addEventListener('DOMContentLoaded', fill);
