(() => {
  const qs = (selector, root = document) => root.querySelector(selector);
  const qsa = (selector, root = document) => [...root.querySelectorAll(selector)];

  const FOCUSABLE =
    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

  const lockScroll = (locked) => {
    document.documentElement.classList.toggle("overflow-hidden", locked);
  };

  const setInert = (element, inert) => {
    if (inert) {
      element.setAttribute("inert", "");
    } else {
      element.removeAttribute("inert");
    }
  };

  const getFocusable = (root) =>
    qsa(FOCUSABLE, root).filter(
      (el) => !el.hasAttribute("disabled") && el.getAttribute("aria-hidden") !== "true",
    );

  const bindDrawer = ({
    openBtn,
    closeBtn,
    drawer,
    overlay,
    closedClass,
    openClass,
    desktopMq,
    desktopAsSidebar = false,
  }) => {
    if (!openBtn || !drawer || !overlay) {
      return;
    }

    const media = desktopMq ? window.matchMedia(desktopMq) : null;
    let isOpen = false;
    let lastFocused = null;

    const isDesktop = () => Boolean(media?.matches);

    const applyClosedVisual = () => {
      drawer.classList.add(closedClass);
      drawer.classList.remove(openClass);
    };

    const applyOpenVisual = () => {
      drawer.classList.remove(closedClass);
      drawer.classList.add(openClass);
    };

    const applyAccessibility = (open) => {
      if (isDesktop() && desktopAsSidebar) {
        setInert(drawer, false);
        drawer.setAttribute("aria-hidden", "false");
        overlay.classList.add("hidden");
        openBtn.setAttribute("aria-expanded", "false");
        lockScroll(false);
        return;
      }

      if (isDesktop() && !desktopAsSidebar) {
        setInert(drawer, true);
        drawer.setAttribute("aria-hidden", "true");
        overlay.classList.add("hidden");
        openBtn.setAttribute("aria-expanded", "false");
        lockScroll(false);
        return;
      }

      setInert(drawer, !open);
      drawer.setAttribute("aria-hidden", open ? "false" : "true");
      overlay.classList.toggle("hidden", !open);
      openBtn.setAttribute("aria-expanded", open ? "true" : "false");
      lockScroll(open);
    };

    const setOpen = (open) => {
      if (isDesktop()) {
        isOpen = false;
        if (desktopAsSidebar) {
          applyOpenVisual();
        } else {
          applyClosedVisual();
        }
        applyAccessibility(false);
        return;
      }

      isOpen = open;
      if (open) {
        applyOpenVisual();
      } else {
        applyClosedVisual();
      }
      applyAccessibility(open);

      if (open) {
        lastFocused = document.activeElement;
        const focusables = getFocusable(drawer);
        (focusables[0] || closeBtn || openBtn)?.focus?.();
      } else if (lastFocused && typeof lastFocused.focus === "function") {
        lastFocused.focus();
        lastFocused = null;
      } else {
        openBtn.focus();
      }
    };

    const onKeydown = (event) => {
      if (isDesktop() || !isOpen) {
        return;
      }

      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const focusables = getFocusable(drawer);
      if (focusables.length === 0) {
        event.preventDefault();
        return;
      }

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    openBtn.addEventListener("click", () => setOpen(true));
    closeBtn?.addEventListener("click", () => setOpen(false));
    overlay.addEventListener("click", () => setOpen(false));
    document.addEventListener("keydown", onKeydown);

    const syncViewport = () => {
      if (isDesktop()) {
        isOpen = false;
        if (desktopAsSidebar) {
          applyOpenVisual();
        } else {
          applyClosedVisual();
        }
        applyAccessibility(false);
        return;
      }

      if (isOpen) {
        applyOpenVisual();
      } else {
        applyClosedVisual();
      }
      applyAccessibility(isOpen);
    };

    syncViewport();
    media?.addEventListener("change", syncViewport);
  };

  const publicMenu = qs("[data-public-menu]");
  bindDrawer({
    openBtn: qs("[data-public-menu-open]"),
    closeBtn: qs("[data-public-menu-close]"),
    drawer: publicMenu,
    overlay: qs("[data-public-menu-overlay]"),
    closedClass: "translate-x-full",
    openClass: "translate-x-0",
    desktopMq: publicMenu?.dataset.drawerDesktopMq || "(min-width: 768px)",
    desktopAsSidebar: false,
  });

  const panelMenu = qs("[data-panel-menu]");
  bindDrawer({
    openBtn: qs("[data-panel-menu-open]"),
    closeBtn: qs("[data-panel-menu-close]"),
    drawer: panelMenu,
    overlay: qs("[data-panel-menu-overlay]"),
    closedClass: "-translate-x-full",
    openClass: "translate-x-0",
    desktopMq: panelMenu?.dataset.drawerDesktopMq || "(min-width: 1024px)",
    desktopAsSidebar: true,
  });

  const searchToggle = qs("[data-search-open]");
  const searchBar = qs("[data-search-bar]");
  const searchClose = qs("[data-search-close]");
  if (searchToggle && searchBar) {
    const setSearch = (open) => {
      searchBar.classList.toggle("hidden", !open);
      searchToggle.setAttribute("aria-expanded", open ? "true" : "false");
      if (open) {
        qs("input", searchBar)?.focus();
      }
    };
    searchToggle.addEventListener("click", () => setSearch(true));
    searchClose?.addEventListener("click", () => setSearch(false));
  }
})();
