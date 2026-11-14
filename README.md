# keel-site

The marketing site and privacy policy for the Keel Chrome extension. Static files, no build step:
host on Cloudflare Pages with the build command empty and the output directory `/`.

- `index.html`, `styles.css`, `site.js`: the homepage. `STORE_URL` in `site.js` is the Chrome
  Web Store listing; the store buttons come from it.
- `privacy/index.html`: copied from the extension repo (`store/privacy.html`) by
  `node scripts/sync-site.mjs`. Edit it there, not here.
- `assets/`: screenshots of the real extension with its sample data, light and dark.
- `_headers`: Cloudflare security and cache headers. File names aren't hashed, so bump the `?v=`
  on `styles.css` and `site.js` when they change.
