/* LusterLux v3: hero playback, nav, the line. Every Add goes to a real Shopify cart permalink. */
document.documentElement.classList.add('js');
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const STORE = 'https://lusterluxauto.com';

  /* catalog: titles, prices, variant ids and coverage from their live products.json */
  const P = [
    { k: 'luxfoam', g: 'wash', a: 'Lux', b: 'Foam', fn: 'Foam soap', price: 19.99, v: 59846347259985, c: '#8a6cff', sp: '8–16 washes per bottle. Foam cannon or bucket.' },
    { k: 'luxpro', g: 'wash paint', a: 'Lux', b: 'Pro', fn: 'Waterless wash & protectant', price: 19.99, v: 59846340902993, c: '#ec4fc6', sp: '15–30 vehicles per bottle. Safe on PPF, wraps & ceramic.' },
    { k: 'luxquick', g: 'paint', a: 'Lux', b: 'Quick', fn: 'Detail spray', price: 17.99, v: 59846342246481, c: '#2fd39a', sp: '15–25 vehicles per bottle. Dust, prints & fresh water spots.' },
    { k: 'ceramicx', g: 'paint', a: 'Ceramic', b: 'X', fn: 'Ceramic detail spray', price: 27.99, v: 59846341853265, c: '#35b9e6', sp: '10–20 vehicles per bottle. Up to 8 months of protection.' },
    { k: 'wheelassassin', g: 'wheel', a: 'Wheel', b: 'Assassin', fn: 'Wheel cleaner', price: 17.99, v: 59846363152465, c: '#d9f21c', sp: '12–20 vehicles per bottle. Brake dust, grease & road film.' },
    { k: 'tirevenom', g: 'wheel', a: 'Tire', b: 'Venom', fn: 'Tire dressing', price: 22.99, v: 59846342475857, c: '#e9ecef', sp: '30–50 tires per bottle. Up to 3 months, no sling.' },
    { k: 'interiorx', g: 'int', a: 'Interior', b: 'X', fn: 'Interior cleaner', price: 19.99, v: 59846363545681, c: '#e9e59a', sp: '15–25 vehicles per bottle. No slick residue.' },
    { k: 'restorx', g: 'int', a: 'Restor', b: 'X', fn: 'RVP plastic dressing', price: 22.99, v: 59846342377553, c: '#f1e4dc', sp: '20–40 vehicles per bottle. Up to 8 months.' },
    { k: 'birdielux', g: 'golf', a: 'Birdie', b: 'Lux', fn: 'Golf cart washless cleaner', price: 19.99, v: 59846406373457, c: '#8a8cff', sp: 'Washless clean for the body, seats and roof.' },
    { k: 'xfresh', g: 'golf', a: 'X', b: 'Fresh', fn: 'Golf cart interior cleaner', price: 19.99, v: 59846406013009, c: '#e9e59a', sp: 'Seats, dash and floor, without the slick finish.' },
  ];

  const grid = $('#grid');
  grid.innerHTML = P.map((p, i) => `
    <article class="card" data-g="${p.g}" style="--c:${p.c}">
      <p class="no">${String(i + 1).padStart(2, '0')}</p>
      <figure><img src="assets/img/bottles/${p.k}.webp" alt="${p.a}${p.b} ${p.fn}" loading="lazy" decoding="async" /></figure>
      <h3 class="nm">${p.a.toUpperCase()}<em>${p.b.toUpperCase()}</em></h3>
      <p class="fn">${p.fn}</p>
      <p class="sp">${p.sp}</p>
      <div class="buy"><span class="pr">$${p.price.toFixed(2)}</span>
        <a class="btn solid add" href="${STORE}/cart/${p.v}:1">Add to cart</a></div>
    </article>`).join('');

  const tabs = $('#tabs');
  tabs.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    for (const t of tabs.children) t.setAttribute('aria-selected', t === b);
    const f = b.dataset.f;
    for (const c of grid.children) c.hidden = f !== 'all' && !c.dataset.g.split(' ').includes(f);
  });

  /* nav: pins after the hero starts to scroll away */
  const nav = $('#nav');
  const onScroll = () => nav.classList.toggle('fixed', scrollY > 120);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* hero wall: their own clips and photos, in three columns drifting under the neon.
     Product tags come from the captions on their own posts. */
  const T = {
    foam:    { v: 'foam',  tag: 'LuxFoam',       sub: 'Foam wash' },
    chase:   { v: 'chase', tag: 'LuxPro',        sub: 'Co-founder Chase' },
    shop:    { v: 'shop',  tag: 'LuxPro',        sub: 'In the shop' },
    wheel:   { v: 'wheel', tag: 'WheelAssassin', sub: 'Wheel cleaner' },
    tire:    { v: 'tire',  tag: 'WheelAssassin', sub: 'Foamed & scrubbed' },
    meet:    { v: 'meet',  tag: 'Pop-up meet',   sub: 'Arizona', wide: 1 },
    lambo:   { p: 'p-lambo',    tag: 'LuxPro',    sub: 'Pro surface protectant' },
    inter:   { p: 'p-interior', tag: 'InteriorX', sub: 'Interior cleaner' },
    tirep:   { p: 'p-tire',     tag: 'TireVenom', sub: 'Tire dressing' },
  };
  const COLS = [['foam', 'lambo', 'meet'], ['chase', 'wheel', 'tirep'], ['shop', 'tire', 'inter']];
  const tile = k => {
    const t = T[k];
    const media = t.v
      ? `<video muted loop playsinline preload="metadata" poster="assets/wall/${t.v}.jpg" data-src="assets/wall/${t.v}.mp4"></video>`
      : `<img src="assets/wall/${t.p}.webp" alt="" loading="lazy" decoding="async" />`;
    return `<figure class="tile${t.wide ? ' wide' : ''}${t.p ? ' photo' : ''}">${media}<figcaption><b>${t.tag}</b>${t.sub}</figcaption></figure>`;
  };
  const wall = $('#wall');
  if (wall) {
    // each column holds its tiles twice so the drift loops seamlessly
    if (matchMedia('(max-width:900px)').matches) {
      // phones: one strip with every tile, twice, sliding sideways
      const all = ['chase', 'foam', 'lambo', 'wheel', 'meet', 'shop', 'tirep', 'tire', 'inter'];
      wall.innerHTML = `<div class="strip">${all.map(tile).join('')}${all.map(tile).join('')}</div>`;
    } else {
      wall.innerHTML = COLS.map((c, i) => `<div class="col c${i}"><div class="track">${c.map(tile).join('')}${c.map(tile).join('')}</div></div>`).join('');
    }
    const vids = [...wall.querySelectorAll('video')];
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const load = () => vids.forEach(v => { if (!v.src) v.src = v.dataset.src; });
    const run = on => vids.forEach(v => on && !reduce ? v.play().catch(() => {}) : v.pause());
    // start after the neon strikes; pause everything when the hero is off screen
    setTimeout(() => { load(); run(true); }, 600);
    new IntersectionObserver(es => es.forEach(e => run(e.isIntersecting)), { threshold: .05 }).observe(wall);
  }
})();
