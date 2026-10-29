(() => {
  const root = document.documentElement;
  const body = document.body;
  const header = document.querySelector("[data-header]");
  const themeToggle = document.querySelector("[data-theme-toggle]");
  const menuToggle = document.querySelector("[data-menu-toggle]");
  const menu = document.querySelector("[data-menu]");
  const storageKey = "sn-refrigeracao-theme";

  body.classList.add("js-ready");

  const systemTheme = () =>
    window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";

  const applyTheme = (theme) => {
    root.setAttribute("data-theme", theme);
    if (themeToggle) {
      const next = theme === "dark" ? "claro" : "escuro";
      themeToggle.setAttribute("aria-label", `Ativar tema ${next}`);
    }
  };

  applyTheme(localStorage.getItem(storageKey) || systemTheme());

  themeToggle?.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    localStorage.setItem(storageKey, next);
    applyTheme(next);
  });

  const setMenu = (open) => {
    if (!menu || !menuToggle) return;
    menu.hidden = !open;
    menuToggle.classList.toggle("is-open", open);
    menuToggle.setAttribute("aria-expanded", String(open));
    const label = menuToggle.querySelector(".sr-only");
    if (label) label.textContent = open ? "Fechar menu" : "Abrir menu";
  };

  menuToggle?.addEventListener("click", () => setMenu(menu.hidden));
  menu?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenu(false));
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth >= 960) setMenu(false);
  });

  const onScroll = () => {
    header?.classList.toggle("is-scrolled", window.scrollY > 8);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const revealAllIn = (rootEl) => {
    (rootEl || document).querySelectorAll(".reveal").forEach((el) => el.classList.add("is-in"));
  };

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduceMotion && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: "80px 0px 12% 0px" }
    );

    document.querySelectorAll(".reveal").forEach((el, index) => {
      el.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
      observer.observe(el);
    });

    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener("click", () => {
        const target = document.querySelector(link.getAttribute("href"));
        if (target) revealAllIn(target);
      });
    });
  } else {
    revealAllIn(document);
  }

  document.querySelectorAll(".faq-item").forEach((item) => {
    item.addEventListener("toggle", () => {
      if (!item.open) return;
      document.querySelectorAll(".faq-item").forEach((other) => {
        if (other !== item) other.open = false;
      });
    });
  });
})();
