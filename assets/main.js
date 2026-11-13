(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const body = document.body;
  const header = $('.header');

  /* Logo fallback if remote image fails */
  $$('.logo img').forEach(img => {
    const fail = () => img.closest('.logo').classList.add('no-img');
    if (img.complete && !img.naturalWidth) fail();
    img.addEventListener('error', fail);
  });

  /* Header: solid on scroll */
  const onScroll = () => {
    const y = window.scrollY;
    if (header && !header.classList.contains('header--solid')) header.classList.toggle('is-solid', y > 40);
    $('.to-top')?.classList.toggle('is-visible', y > 700);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Mobile nav */
  const burger = $('.burger');
  burger?.addEventListener('click', () => {
    const open = body.classList.toggle('nav-open');
    burger.setAttribute('aria-expanded', open);
  });
  $$('.nav a').forEach(a => a.addEventListener('click', () => {
    body.classList.remove('nav-open');
    burger?.setAttribute('aria-expanded', 'false');
  }));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      body.classList.remove('nav-open');
      $$('.lang.is-open').forEach(l => l.classList.remove('is-open'));
    }
  });

  /* Language dropdown */
  $$('.lang').forEach(lang => {
    const btn = $('.lang__btn', lang);
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const open = lang.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', open);
    });
  });
  document.addEventListener('click', () => $$('.lang.is-open').forEach(l => {
    l.classList.remove('is-open');
    $('.lang__btn', l).setAttribute('aria-expanded', 'false');
  }));

  /* To top */
  $('.to-top')?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* Companies */
  const IMG = 'https://metroholding.ge/files/shares/servicesimages/';
  const KA = document.documentElement.lang === 'ka';
  const T = KA
    ? { all: 'ყველა', soon: 'მალე', logo: 'ლოგო' }
    : { all: 'All', soon: 'Coming soon', logo: 'logo' };
  const SECTORS = KA ? {
    tourism: 'ტურიზმი და სასტუმროები',
    transport: 'ტრანსპორტი',
    building: 'მშენებლობა',
    realtor: 'უძრავი ქონება',
    management: 'მართვა',
    insurance: 'დაზღვევა',
    clinic: 'ჯანდაცვა',
    architecture: 'ინჟინერია',
    trading: 'ვაჭრობა',
  } : {
    tourism: 'Tourism & Hotels',
    transport: 'Transportation',
    building: 'Construction',
    realtor: 'Real Estate',
    management: 'Management',
    insurance: 'Insurance',
    clinic: 'Healthcare',
    architecture: 'Engineering',
    trading: 'Trading',
  };
  const COMPANIES = [
    ['Hotel Euphoria', 'tourism', 'services-001826euphoria.png', 'https://euphoriahotel.ge/'],
    ['Hotel Intourist Palace', 'tourism', 'services-001810intourist-palace.png', 'https://www.intouristpalace.com/'],
    ['Legend Hotel Batumi', 'tourism', 'services-001817legend.png', 'https://metrocity.ge/'],
    ['Sky Tower Hotel', 'tourism', 'services-005817sky-tower.png', 'http://www.metroskytower.com/'],
    ['Legend Business Hotel', 'tourism', 'services-001802business-hotel.png', 'http://legendbusinesshotelbatumi.ge/'],
    ['Hotel Jasmine', 'tourism', 'services-164912jasmine.jpg', null],
    ['Metro Goderdzi Resorts', 'tourism', 'services-165141ramada-1.jpg', null],
    ['City Travel', 'tourism', 'services-001220city-travel.png', 'https://citytravel.ge/'],
    ['Adjara Tour', 'tourism', 'services-001208adjara-tour.png', 'http://adjaratour.com/'],
    ['Metro Georgia', 'transport', 'services-000554metro-georgia.png', 'https://metrogeorgia.ge/'],
    ['City Car', 'transport', 'services-002238batumi-car.png', 'http://batumicar.ge/'],
    ['Metro Petrol', 'transport', 'services-003706metro-petrol.png', 'http://metropetrol.ge/'],
    ['Metro 360', 'building', 'services-002411metro360.png', 'http://metro360.ge/'],
    ['Metro Construction', 'building', 'services-145257metro-constructions.jpg', 'http://metro360.ge/'],
    ['Legend Apartments', 'realtor', 'services-010824legend-apartments.png', 'https://metrocity.ge/'],
    ['Metro City Apartments', 'realtor', 'services-002454logo-(1).png', 'https://metrocity.ge/'],
    ['Gonio In', 'realtor', 'services-122504WhatsApp_Image_2022-05-25_at_1.16.39_PM-removebg-preview.png', 'https://asyasoftware.viewin360.co/share/collection/7vPn1?logo=0&info=0&fs=1&vr=1&sd=1&initload=0&thumbs=1'],
    ['Metro Atlas Georgia', 'management', 'services-002827metro-atlas.png', 'http://metroatlas.ge/'],
    [KA ? 'მწვანე დაზღვევა საქართველო' : 'Green Insurance Georgia', 'insurance', 'services-002008greenig.png', 'http://greenig.ge/'],
    ['Stork IVF', 'clinic', 'services-002321logo.png', 'https://storkivf.ge/en/'],
    ['Metro MEP', 'architecture', 'services-105725metro-mep-logo.jfif', 'http://metromep.ge/'],
    ['Supplying Everything', 'trading', 'services-183524logo-(2).png', 'http://supplying.ge'],
  ];

  const grid = $('#companies-grid');
  const filters = $('#company-filters');
  if (grid && filters) {
    const ext = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg>';
    grid.innerHTML = COMPANIES.map(([name, cat, img, url]) => {
      const tag = url ? 'a' : 'div';
      const attrs = url ? ` href="${url}" target="_blank" rel="noopener"` : '';
      const initials = name.split(' ').map(w => w[0]).slice(0, 2).join('');
      return `<${tag} class="company" data-cat="${cat}"${attrs}>
        <div class="company__logo"><img src="${IMG + encodeURI(img)}" alt="${name} ${T.logo}" loading="lazy" onerror="this.outerHTML='<span class=&quot;ph&quot;>${initials}</span>'"></div>
        <div class="company__body">
          <span class="company__tag">${SECTORS[cat]}</span>
          <span class="company__name">${name}</span>
          <span class="company__link">${url ? new URL(url).hostname.replace('www.', '') + ext : T.soon}</span>
        </div>
      </${tag}>`;
    }).join('');

    const counts = COMPANIES.reduce((m, c) => (m[c[1]] = (m[c[1]] || 0) + 1, m), {});
    const order = Object.keys(SECTORS).filter(k => counts[k]);
    filters.innerHTML =
      `<button class="chip is-active" data-filter="*" aria-pressed="true">${T.all} <small>${COMPANIES.length}</small></button>` +
      order.map(k => `<button class="chip" data-filter="${k}" aria-pressed="false">${SECTORS[k]} <small>${counts[k]}</small></button>`).join('');

    const apply = f => {
      $$('.chip', filters).forEach(c => {
        const on = c.dataset.filter === f;
        c.classList.toggle('is-active', on);
        c.setAttribute('aria-pressed', on);
      });
      $$('.company', grid).forEach(el => { el.hidden = !(f === '*' || el.dataset.cat === f); });
    };
    filters.addEventListener('click', e => {
      const b = e.target.closest('.chip');
      if (b) apply(b.dataset.filter);
    });
    // Sector cards jump to filtered list
    $$('[data-goto-filter]').forEach(a => a.addEventListener('click', () => apply(a.dataset.gotoFilter)));
  }

  /* Count-up stats */
  const countUp = el => {
    const target = +el.dataset.count;
    const suffix = el.dataset.suffix || '';
    const dur = 1400;
    const t0 = performance.now();
    const fmt = n => n.toLocaleString('en-US').replace(/,/g, ' ');
    const tick = t => {
      const p = Math.min(1, (t - t0) / dur);
      el.textContent = fmt(Math.round(target * (1 - Math.pow(1 - p, 3)))) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  /* Reveal on scroll */
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if ('IntersectionObserver' in window && !reduce) {
    const io = new IntersectionObserver(entries => entries.forEach(en => {
      if (!en.isIntersecting) return;
      en.target.classList.add('is-in');
      if (en.target.dataset.count) countUp(en.target);
      io.unobserve(en.target);
    }), { threshold: .15 });
    $$('.reveal, [data-count]').forEach(el => io.observe(el));
  } else {
    $$('.reveal').forEach(el => el.classList.add('is-in'));
  }

  /* Year */
  $$('[data-year]').forEach(el => (el.textContent = new Date().getFullYear()));
})();
