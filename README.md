# saurabhdarji7.github.io

Personal portfolio — [saurabhdarji7.github.io](https://saurabhdarji7.github.io/)

## Stack

Hand-written HTML, [Bulma](https://bulma.io/) for layout primitives, Font Awesome
and Devicon for iconography, [Typed.js](https://mattboldt.com/demos/typed-js/) for
the typing effect, [AOS](https://michalsnik.github.io/aos/) for fading sections in
on scroll, and [GLightbox](https://biati-digital.github.io/glightbox/) for the
photo viewer. **No build step and no package manager** — the repository root is
the deployed site.

```
index.html               the page
assets/css/base.css       design tokens, resets, element defaults
assets/css/layout.css     backdrop, side navigation, section shell
assets/css/components.css entries, cards, icons, footer
assets/css/sections.css   scroll-reveal and reduced-motion
assets/js/scripts.js      no libraries
assets/img/               images, pre-optimised
assets/img/experience/    photos grouped by role, with thumbs/
assets/img/education/     convocation photos
```

Bulma, Font Awesome and Devicon are loaded from jsDelivr with
[Subresource Integrity](https://developer.mozilla.org/docs/Web/Security/Subresource_Integrity)
hashes and pinned versions, so a compromised or altered CDN file is rejected by
the browser rather than executed.

## Running it

It is static files — open `index.html`, or serve the directory:

```sh
python3 -m http.server 8080
```

## Deploying

Pushing to `main` publishes via GitHub Pages
([`.github/workflows/static.yml`](.github/workflows/static.yml)). There is
nothing to build.

## Stack decisions

A one-page resume is static content that changes a few times a year. It is read
once, quickly, often on a phone, and it has to still work when I come back to it
in two years. Those constraints drove every choice here.

**No build step.** The previous version compiled Pug → HTML and SCSS → CSS through
ten hand-rolled Node scripts to produce a single static page. That is machinery
with no output to justify it: the page is edited by hand either way, and a
toolchain that sits untouched for a year is a toolchain that no longer installs.
Editing `index.html` directly removes the entire failure mode.

**Bulma over Bootstrap.** Bulma is CSS-only. Bootstrap's components here required
its JavaScript bundle for the navbar, scrollspy and popovers; the same behaviour
is a short `IntersectionObserver` in `scripts.js`. Isotope went too — the masonry
layout it provided is a few lines of CSS Grid.

**Libraries where they earn their place.** Typed.js, AOS and GLightbox are
loaded from a CDN with pinned versions and SRI hashes. Each replaces code that
is fiddly to get right — a typing state machine, a scroll observer, and a modal
gallery with keyboard and touch handling. GLightbox alone removed about 90 lines
of markup, CSS and JavaScript; a handful of CSS rules pull its default styling
towards the rest of the site.

**Plain browser APIs for everything else.** The menu, the active nav link and
the footer year stay hand-written, because the smallest library covering them
would be larger than the code it replaced — Alpine.js is 19 KB to save fourteen
lines. The thumbnails are ordinary links to the full-size photo, so they still
work if the viewer fails to load.

**Font Awesome via the CSS build, not the JS build.** The old site loaded
`all.js` (~400 KB, render-blocking, rewrites the DOM at runtime). The CSS build
does the same job through ordinary font loading.

**Pinned CDN versions with SRI.** Vendor CSS is versioned in the URL and hash-checked,
which keeps the repository free of vendored copies without accepting whatever the
CDN happens to serve later.

**Fonts.** Google Fonts was loading *Saira Extra Condensed* and *Muli* while the
stylesheet asked for *Titillium Web* and *Roboto Condensed* — the downloaded fonts
were never applied to anything. Removing them changed nothing visually and removed
two render-blocking requests; the page now uses the system font stack.

**Images.** They were 77% of the page: 4.0 MB of assets, including a 488 KB
portrait rendered at 160 px. Resized to their display dimensions and re-encoded to
396 KB total — a 90% reduction and the single largest win available.

**Photo galleries.** Each role carries a strip of thumbnails that open in a
lightbox. Only the thumbnails (~560 KB across the whole page) are fetched, lazily;
the full-size image is requested when a photo is opened and released again on
close. The lightbox is a native `<dialog>` — the browser handles the backdrop,
focus trapping and Escape — with arrow-key paging scoped to the gallery that was
opened. Thumbnails are `<button>`s so they are reachable by keyboard.

**Accessibility and robustness.** Scroll-reveal is gated behind a `.js` class, so
the page renders fully when JavaScript fails rather than staying invisible.
Animation is disabled under `prefers-reduced-motion`. Icons are `aria-hidden` with
labels on their links, and there is a skip link.

## Result

| | Before | After |
|---|---|---|
| Image payload | 4.0 MB | 396 KB |
| Third-party hosts | 6 | 1 (jsDelivr, all SRI-pinned) |
| JS libraries | 5 | 3 |
| Build scripts | 10 | 0 |

## Licence

[MIT](LICENSE)
