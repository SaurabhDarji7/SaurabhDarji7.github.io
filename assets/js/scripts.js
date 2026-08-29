/* Saurabh Darji — portfolio.

   Two animations come from small libraries loaded in index.html: Typed.js for
   the typing effect and AOS for fading sections in on scroll. Everything else
   is plain browser APIs.

   Each feature sits in its own setup function, so a missing element or a
   library that fails to load can only switch off its own feature.

   Everything lives inside one function call so nothing leaks into the page's
   global scope. (A plain script rather than a module, because modules are
   blocked when the page is opened straight from disk with file://.) */

(function () {
  "use strict";

  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* --------------------------------------------- menu on small screens --- */

  function setupMenu() {
    const button = document.querySelector(".menu-button");
    const menu = document.getElementById("sidebar-menu-list");
    if (!button || !menu) return;

    button.addEventListener("click", () => {
      const isOpen = menu.classList.toggle("is-open");
      button.setAttribute("aria-expanded", isOpen);
    });

    // Tapping a link jumps to that section, so close the menu behind it.
    menu.addEventListener("click", (event) => {
      if (!event.target.closest(".nav-link")) return;
      menu.classList.remove("is-open");
      button.setAttribute("aria-expanded", "false");
    });
  }

  /* ------------------------------------------ highlight the current section */

  function setupNavHighlight() {
    const links = document.querySelectorAll(".sidebar-menu .nav-link");
    if (!links.length) return;

    // An IntersectionObserver reports which elements are on screen. The catch
    // is that it only reports what *changed* since last time, not everything
    // currently visible — so we keep our own list of what is on screen now.
    const onScreen = new Set();

    const watcher = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) onScreen.add(entry.target);
        else onScreen.delete(entry.target);
      }

      // Two sections can be visible at once, so highlight the higher one.
      const sections = [...onScreen].sort((a, b) => a.offsetTop - b.offsetTop);
      const current = sections[0];
      if (!current) return;

      links.forEach((link) => {
        link.classList.toggle("is-active", link.hash === "#" + current.id);
      });
    }, { rootMargin: "0px 0px -40% 0px" });   // count a section once it reaches the upper screen

    links.forEach((link) => {
      const section = document.querySelector(link.hash);
      if (section) watcher.observe(section);
    });
  }

  /* --------------------------------------------- fade in when scrolled --- */

  function setupFadeIn() {
    // AOS reads the data-aos attributes in the HTML and fades those elements
    // in as they scroll into view.
    if (!window.AOS) {
      // The library did not load. Strip the attributes so its stylesheet
      // stops hiding the content, and show the page unanimated.
      document.querySelectorAll("[data-aos]").forEach((el) => el.removeAttribute("data-aos"));
      return;
    }

    AOS.init({
      duration: 600,          // milliseconds, matching the old hand-written fade
      easing: "ease-out",
      once: true,             // fade in the first time only, not on every pass
      offset: 80,             // start when the element is 80px from the bottom
      disable: () => reduceMotion
    });
  }

  /* ------------------------------------------------------ typing effect --- */

  function setupTyping() {
    const line = document.querySelector(".typing-text");
    if (!line) return;

    const words = line.dataset.words.split(",").map((w) => w.trim()).filter(Boolean);
    if (!words.length) return;

    // No animation for reduced-motion users, and none if the library is
    // missing — either way, show the first phrase as plain text.
    if (reduceMotion || !window.Typed) {
      line.textContent = words[0];
      return;
    }

    new Typed(line, {
      strings: words,
      typeSpeed: 100,
      backSpeed: 50,
      backDelay: 2000,        // pause on a finished phrase before deleting it
      loop: true,
      showCursor: false       // the blinking bar is drawn in CSS instead
    });
  }

  /* -------------------------------------------------------- photo viewer -- */

  function setupPhotoViewer() {
    // The thumbnails are ordinary links to the full-size photo, grouped by a
    // data-gallery name so each set pages through its own pictures. Without
    // the library they still work — the link just opens the image.
    if (!window.GLightbox) return;

    GLightbox({
      selector: ".glightbox",
      loop: true,             // paging past the last photo returns to the first
      touchNavigation: true,  // swipe on a phone
      descPosition: "bottom"
    });
  }

  /* -------------------------------------------------------------- footer -- */

  function setupYear() {
    const year = document.getElementById("year");
    if (year) year.textContent = new Date().getFullYear();
  }

  setupMenu();
  setupNavHighlight();
  setupFadeIn();
  setupTyping();
  setupPhotoViewer();
  setupYear();
})();
