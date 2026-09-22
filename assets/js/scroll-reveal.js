// Shifts each section's content up into place, piece by piece, whenever it
// scrolls into view, and reverses it (shifts back down, fades out) when it
// scrolls back out of view. The intro is skipped since it's already on
// screen at load.
(function () {
  var sections = document.querySelectorAll("main > section:not(#intro)");
  if (!sections.length) return;

  // Respect the visitor's OS-level "reduce motion" setting, and fall back
  // gracefully if this browser has no IntersectionObserver: in both cases
  // leave everything visible and skip the animation entirely. window.reveal
  // stays undefined, which other scripts (like projects.js) check for too.
  var prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  if (prefersReducedMotion || !("IntersectionObserver" in window)) return;

  var STAGGER_STEP_MS = 90; // delay added between each piece in a section
  var MAX_STAGGER_ITEMS = 5; // cap so a long section doesn't take too long

  // Picks the elements inside a section that should animate as separate,
  // staggered pieces: cards if there are any, otherwise grid columns,
  // otherwise the direct paragraphs/lists/iframe in its container. Falls
  // back to the whole section if none of those apply.
  function getRevealItems(section) {
    var cards = section.querySelectorAll(".card");
    if (cards.length >= 1) return Array.prototype.slice.call(cards);

    var cols = section.querySelectorAll(".row > .col");
    if (cols.length > 1) return Array.prototype.slice.call(cols);

    var container = section.querySelector(":scope > .container");
    if (container) {
      var pieces = Array.prototype.filter.call(container.children, function (el) {
        if (el.tagName === "IFRAME") return true;
        // A <p> containing a <ul> gets auto-closed by the browser around the
        // list, which can leave empty paragraphs behind; skip those.
        if (el.tagName === "P" || el.tagName === "UL") {
          return el.textContent.trim().length > 0;
        }
        return false;
      });
      if (pieces.length) return pieces;
    }

    return [section];
  }

  // Marks an element as a reveal piece and gives it its place in the
  // stagger order. Shared by the initial page setup and by revealNow().
  function prepare(item, index) {
    item.classList.add("reveal-item");
    item.style.transitionDelay = Math.min(index, MAX_STAGGER_ITEMS) * STAGGER_STEP_MS + "ms";
  }

  sections.forEach(function (section) {
    var items = getRevealItems(section);
    items.forEach(prepare);
    // Remembered so content added to this section later (e.g. more project
    // cards from "Load More") can still be tied to its entrance, if needed.
    section._revealItems = items;
  });

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        var items = entry.target._revealItems || [entry.target];
        items.forEach(function (item) {
          // Toggle both ways, so scrolling back up reverses the entrance
          // instead of leaving everything revealed for good.
          item.classList.toggle("is-visible", entry.isIntersecting);
        });
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -80px 0px" }
  );

  sections.forEach(function (section) {
    observer.observe(section);
  });

  // For elements added to the page after the fact (like the extra project
  // cards "Load More" inserts). The section is already on screen when that
  // happens, so this animates immediately rather than waiting to scroll.
  window.revealNow = function (items) {
    Array.prototype.forEach.call(items, function (item, index) {
      prepare(item, index);
      // Force layout so the browser registers the starting position before
      // "is-visible" is added, otherwise the transition gets skipped.
      void item.offsetWidth;
      item.classList.add("is-visible");

      // Add it to its section's tracked pieces, so if the section later
      // scrolls out of view and back, this item fades out and back in too.
      var section = item.closest("section");
      if (section && section._revealItems && section._revealItems.indexOf(item) === -1) {
        section._revealItems.push(item);
      }
    });
  };
})();
