/**
 * Siya Labs: progressive enhancement. The site is fully usable without this.
 * - reveal-on-scroll for below-the-fold content
 * - graphics animate only while visible
 * - services index: active row ↔ preview panel
 * - header "scrolled" state, <dialog> mobile menu, hero pointer parallax
 */
const root = document.documentElement;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasIO = 'IntersectionObserver' in window;

function initReveal() {
  document.querySelectorAll<HTMLElement>('[data-reveal-stagger]').forEach((group) => {
    group.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el, i) => {
      el.style.setProperty('--reveal-delay', `${Math.min(i, 8) * 90}ms`);
    });
  });

  const els = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
  const vh = window.innerHeight;
  const pending: HTMLElement[] = [];
  // Anything already on screen is shown immediately (no flash).
  for (const el of els) {
    const r = el.getBoundingClientRect();
    if (r.top < vh * 0.94 && r.bottom > 0) el.classList.add('is-visible');
    else pending.push(el);
  }
  root.classList.add('js');
  if (!hasIO || reduceMotion) {
    pending.forEach((el) => el.classList.add('is-visible'));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
  );
  pending.forEach((el) => io.observe(el));
}

function initGraphics() {
  const graphics = Array.from(document.querySelectorAll<SVGElement>('.gfx[data-animate]')).filter(
    (g) => !g.closest('[data-services-index]'),
  );
  if (!graphics.length) return;
  if (!hasIO) {
    graphics.forEach((g) => g.classList.add('is-playing'));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) entry.target.classList.toggle('is-playing', entry.isIntersecting);
    },
    { threshold: 0.25 },
  );
  graphics.forEach((g) => io.observe(g));

  const hero = document.querySelector('[data-hero-mark]');
  if (hero) {
    new IntersectionObserver(([entry]) => {
      hero.toggleAttribute('data-offscreen', !entry.isIntersecting);
    }).observe(hero);
  }
}

function initServicesIndex() {
  const index = document.querySelector<HTMLElement>('[data-services-index]');
  if (!index) return;
  const rows = Array.from(index.querySelectorAll<HTMLElement>('[data-service-row]'));
  const slides = Array.from(index.querySelectorAll<HTMLElement>('[data-service-slide]'));
  const panel = index.querySelector<HTMLElement>('[data-services-panel]');
  let active = 0;
  let panelVisible = false;
  let hovering = false;

  const render = () => {
    rows.forEach((row, i) => row.toggleAttribute('data-active', i === active));
    slides.forEach((slide, i) => {
      const on = i === active;
      slide.toggleAttribute('data-active', on);
      slide.querySelector('.gfx')?.classList.toggle('is-playing', on && panelVisible);
    });
  };
  const setActive = (i: number) => {
    if (i !== active) {
      active = i;
      render();
    }
  };

  rows.forEach((row, i) => {
    row.addEventListener('pointerenter', () => {
      hovering = true;
      setActive(i);
    });
    row.addEventListener('focusin', () => setActive(i));
  });
  index.addEventListener('pointerleave', () => (hovering = false));

  if (hasIO) {
    if (panel) {
      new IntersectionObserver(
        ([entry]) => {
          panelVisible = entry.isIntersecting;
          render();
        },
        { threshold: 0.2 },
      ).observe(panel);
    }
    // While scrolling (not hovering), follow the row crossing the viewport centre.
    const rowIO = new IntersectionObserver(
      (entries) => {
        if (hovering) return;
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(rows.indexOf(entry.target as HTMLElement));
        }
      },
      { rootMargin: '-48% 0px -48% 0px' },
    );
    rows.forEach((row) => rowIO.observe(row));
  }
  render();
}

function initHeader() {
  const header = document.querySelector<HTMLElement>('[data-header]');
  if (!header) return;
  let ticking = false;
  const update = () => {
    header.toggleAttribute('data-scrolled', window.scrollY > 8);
    ticking = false;
  };
  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    },
    { passive: true },
  );
  update();
}

function initMenu() {
  const dialog = document.querySelector<HTMLDialogElement>('[data-mobile-nav]');
  const openBtn = document.querySelector<HTMLButtonElement>('[data-menu-open]');
  if (!dialog || !openBtn || typeof dialog.showModal !== 'function') return;
  const closeBtn = dialog.querySelector<HTMLButtonElement>('[data-menu-close]');

  openBtn.addEventListener('click', () => {
    dialog.showModal();
    openBtn.setAttribute('aria-expanded', 'true');
  });
  closeBtn?.addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => openBtn.setAttribute('aria-expanded', 'false'));
  dialog.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => dialog.close()));
  window.matchMedia('(min-width: 48rem)').addEventListener('change', (e) => {
    if (e.matches && dialog.open) dialog.close();
  });
}

function initParallax() {
  const area = document.querySelector<HTMLElement>('[data-parallax]');
  if (!area || reduceMotion || !window.matchMedia('(pointer: fine)').matches) return;
  let frame = 0;
  area.addEventListener('pointermove', (e) => {
    const r = area.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width - 0.5) * 2;
    const y = ((e.clientY - r.top) / r.height - 0.5) * 2;
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      area.style.setProperty('--mx', x.toFixed(3));
      area.style.setProperty('--my', y.toFixed(3));
    });
  });
  area.addEventListener('pointerleave', () => {
    area.style.setProperty('--mx', '0');
    area.style.setProperty('--my', '0');
  });
}

initReveal();
initGraphics();
initServicesIndex();
initHeader();
initMenu();
initParallax();
