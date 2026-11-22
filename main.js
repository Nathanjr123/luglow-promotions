(() => {
'use strict';
const $ = s => document.querySelector(s);
const WA = '27846972497', MAIL = 'lupromotions9@gmail.com';
const still = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Services ---------- */
const GROUPS = [
  ['Influencer, digital and social', 'Reach people where they scroll.', [
    ['Influencer marketing & management', 'We help brands leverage influencer partnerships to increase visibility, build credibility and connect with relevant audiences.',
      ['Influencer sourcing and identification','Influencer relationship management','Influencer campaign coordination','Brand collaborations and partnerships','Campaign briefing and deliverable coordination','Influencer marketing strategy','Campaign performance monitoring']],
    ['Digital marketing', 'We develop digital marketing initiatives that help businesses strengthen their online presence, reach potential customers and communicate effectively with their target markets.',
      ['Digital campaign coordination','Online brand awareness campaigns','Digital promotional strategies','Audience engagement initiatives','Online marketing communications','Digital brand positioning']],
    ['Social media management', 'We help businesses establish and maintain a consistent, engaging social media presence.',
      ['Social media account management','Content planning and scheduling','Social media campaign coordination','Brand communication','Community and audience engagement','Social media growth initiatives']]]],
  ['Activations and promotions', 'Put the product in people’s hands.', [
    ['Brand activations', 'We create interactive brand experiences that bring products and services directly to consumers, increasing visibility, encouraging participation and creating memorable interactions.',
      ['In-store activations','Outdoor activations','Product launches','Consumer engagement campaigns','Promotional games and competitions','Retail and nightlife activations']],
    ['Experiential marketing', 'We create engaging marketing experiences that allow consumers to interact with brands in meaningful and memorable ways. Through creative concepts and immersive campaigns, we help brands establish stronger emotional connections with their audiences.', []],
    ['Product sampling & in-store promotions', 'We help brands introduce products to consumers through interactive demonstrations, product sampling and retail promotional campaigns.', []],
    ['Flyer distribution & promotional campaigns', 'We coordinate targeted promotional campaigns designed to increase awareness and reach consumers in high-traffic locations.', []]]],
  ['People, events and partnerships', 'The team that represents you on the day.', [
    ['Promotional staffing & brand ambassadors', 'We provide professional and energetic promotional personnel to represent brands at events, activations and marketing campaigns.',
      ['Brand ambassadors','Promotional representatives','Event hosts and hostesses','Bottle service hostesses','Promotional teams','Campaign staffing coordination']],
    ['Event marketing & management', 'We support the planning, coordination and promotional execution of marketing events and brand experiences.',
      ['Corporate event promotions','Product launches','Brand events','Event staffing','Promotional coordination','Entertainment and nightlife marketing']],
    ['Brand partnerships & collaborations', 'We facilitate strategic brand collaborations and promotional partnerships that create opportunities for businesses to expand their reach and connect with new audiences.', []]]]
];
const el = (tag, props = {}, ...kids) => { const n = Object.assign(document.createElement(tag), props); n.append(...kids); return n; };
const select = $('#f-service');
for (const [title, sub, items] of GROUPS) {
  const list = el('div', { className: 'items' });
  items.forEach(([name, text, points], i) => {
    const link = el('a', { href: '#contact', textContent: 'Enquire about this service' });
    link.addEventListener('click', () => { select.value = name; });
    const body = el('div', { className: 'sbody' }, el('p', { textContent: text }));
    if (points.length) body.append(el('ul', {}, ...points.map(p => el('li', { textContent: p }))));
    body.append(link);
    list.append(el('details', { open: i === 0 }, el('summary', { textContent: name }), body));
    select.append(el('option', { textContent: name }));
  });
  $('#serviceList').append(el('div', { className: 'group' }, el('div', {}, el('h3', { textContent: title }), el('p', { textContent: sub })), list));
}

/* ---------- Menu ---------- */
const nav = $('#nav'), burger = $('.burger');
const menu = open => { nav.classList.toggle('open', open); burger.setAttribute('aria-expanded', open); burger.textContent = open ? 'Close' : 'Menu'; };
burger.addEventListener('click', () => menu(!nav.classList.contains('open')));
nav.addEventListener('click', e => { if (e.target.closest('a')) menu(false); });
addEventListener('keydown', e => { if (e.key === 'Escape') menu(false); });

/* ---------- Map ---------- */
const NS = 'http://www.w3.org/2000/svg', frag = document.createDocumentFragment();
window.SA_DOTS.forEach(([x, y], i) => {
  const c = document.createElementNS(NS, 'circle');
  c.setAttribute('cx', x); c.setAttribute('cy', y); c.setAttribute('r', 5);
  const h = (i * 7919) % 101;
  if (h < 22) { c.setAttribute('class', 'lit'); c.style.animationDelay = -(h * .23).toFixed(2) + 's'; }
  frag.append(c);
});
$('#map').append(frag);

/* ---------- Enquiry ---------- */
$('#enquiry').addEventListener('submit', e => {
  e.preventDefault();
  const d = new FormData(e.target), v = k => String(d.get(k) || '').trim();
  const lines = ['Hi Luglow Promotions, I would like to enquire about a campaign.', '', 'Name: ' + v('name')];
  if (v('brand')) lines.push('Brand: ' + v('brand'));
  lines.push('Service: ' + v('service'));
  if (v('where')) lines.push('City and date: ' + v('where'));
  lines.push('', v('msg'));
  const text = lines.join('\n');
  if (e.submitter && e.submitter.value === 'mail') {
    location.href = `mailto:${MAIL}?subject=${encodeURIComponent('Campaign enquiry: ' + (v('brand') || v('name')))}&body=${encodeURIComponent(text)}`;
    $('#formNote').textContent = 'Opening your email app. Press send there to reach us. If nothing opens, email ' + MAIL + '.';
  } else {
    window.open(`https://wa.me/${WA}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
    $('#formNote').textContent = 'Opening WhatsApp. Press send there to reach us. If nothing opens, message 084 697 2497.';
  }
});

/* ---------- Hero: the bottle-service sparkler ---------- */
const cv = $('#spark'), ctx = cv.getContext('2d'), stage = $('.stage'), input = $('#brandInput');
const bottle = document.createElement('canvas');
let W = 0, H = 0, dpr = 1, B = null, sparks = [], t = 0, boost = 0, visible = true, running = false;
const D = '"Anybody","Arial Black",sans-serif';

function path(c, w, h) { // long-neck bottle, origin top-centre
  const n = w * .19, b = w / 2, s = h * .3, e = h * .5;
  c.beginPath(); c.moveTo(-n, 0); c.lineTo(-n, s);
  c.bezierCurveTo(-n, s + h * .1, -b, s + h * .1, -b, e);
  c.lineTo(-b, h - 14); c.quadraticCurveTo(-b, h, -b + 16, h); c.lineTo(b - 16, h); c.quadraticCurveTo(b, h, b, h - 14);
  c.lineTo(b, e); c.bezierCurveTo(b, s + h * .1, n, s + h * .1, n, s); c.lineTo(n, 0); c.closePath();
}
function wrapName(c, name, maxW, maxH) {
  const words = name.split(/\s+/);
  let best = null;
  for (let n = 1; n <= Math.min(3, words.length); n++) { // break into n lines, keeping the widest line as short as possible
    const tryCuts = (start, left) => left === 1 ? [[words.slice(start).join(' ')]] :
      Array.from({ length: words.length - start - left + 1 }, (_, k) => start + k + 1).flatMap(i => tryCuts(i, left - 1).map(r => [words.slice(start, i).join(' '), ...r]));
    for (const lines of tryCuts(0, n)) {
      c.font = `800 100px ${D}`;
      const wide = Math.max(...lines.map(l => c.measureText(l).width));
      const size = Math.min(maxW / wide * 100, maxH / (n * .98));
      if (!best || size > best.size) best = { lines, size };
    }
  }
  return best;
}
function paintBottle() {
  const { w, h } = B, pad = 4;
  bottle.width = (w + pad * 2) * dpr; bottle.height = (h + pad) * dpr;
  const c = bottle.getContext('2d'); c.setTransform(dpr, 0, 0, dpr, (w / 2 + pad) * dpr, 0);
  c.save(); path(c, w, h); c.clip();
  let g = c.createLinearGradient(-w / 2, 0, w / 2, 0);
  g.addColorStop(0, '#2f8a68'); g.addColorStop(.07, '#0d4434'); g.addColorStop(.36, '#15694f'); g.addColorStop(.62, '#0b3a2d'); g.addColorStop(.93, '#0a3428'); g.addColorStop(1, '#2b8062');
  c.fillStyle = g; c.fillRect(-w, 0, w * 2, h);
  g = c.createLinearGradient(0, 0, 0, h * .6); g.addColorStop(0, 'rgba(255,190,80,.85)'); g.addColorStop(.35, 'rgba(255,160,46,.32)'); g.addColorStop(1, 'rgba(255,160,46,0)');
  c.fillStyle = g; c.fillRect(-w, 0, w * 2, h);
  g = c.createLinearGradient(-w * .19, 0, w * .19, 0); g.addColorStop(0, '#a8600c'); g.addColorStop(.35, '#ffd27a'); g.addColorStop(.6, '#e8931c'); g.addColorStop(1, '#8a4a06');
  c.fillStyle = g; c.fillRect(-w / 2, 0, w, h * .13);
  c.fillStyle = 'rgba(60,28,0,.4)'; c.fillRect(-w / 2, h * .035, w, 2); c.fillRect(-w / 2, h * .126, w, 2);
  c.fillStyle = 'rgba(255,255,255,.2)'; c.fillRect(-w * .13, h * .15, w * .035, h * .17);
  // label
  const ly = h * .535, lh = h * .33;
  c.fillStyle = '#f6f8ee'; c.fillRect(-w / 2, ly, w, lh);
  c.fillStyle = '#ffb02e'; c.fillRect(-w / 2, ly, w, 7); c.fillRect(-w / 2, ly + lh - 7, w, 7);
  const name = (input.value.trim() || 'Your brand').toUpperCase();
  const fit = wrapName(c, name, w * .8, lh * .56);
  c.font = `800 ${fit.size}px ${D}`; c.fillStyle = '#0a211a'; c.textAlign = 'center'; c.textBaseline = 'middle';
  fit.lines.forEach((l, i) => c.fillText(l, 0, ly + lh * .44 + (i - (fit.lines.length - 1) / 2) * fit.size * .98));
  c.font = `600 ${Math.max(10, w * .085)}px "Instrument Sans",sans-serif`; c.fillStyle = '#3f5a4e';
  c.fillText('brought to life', 0, ly + lh * .86);
  g = c.createLinearGradient(-w / 2, 0, w / 2, 0); g.addColorStop(0, 'rgba(4,26,20,.55)'); g.addColorStop(.2, 'rgba(4,26,20,0)'); g.addColorStop(.34, 'rgba(255,255,255,.16)'); g.addColorStop(.5, 'rgba(4,26,20,0)'); g.addColorStop(.75, 'rgba(4,26,20,.05)'); g.addColorStop(1, 'rgba(4,26,20,.6)');
  c.fillStyle = g; c.fillRect(-w / 2, ly, w, lh);
  c.restore();
}
function size() {
  const r = cv.getBoundingClientRect(), s = stage.getBoundingClientRect();
  dpr = Math.min(2, devicePixelRatio || 1); W = r.width; H = r.height;
  cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
  const formTop = $('.try').getBoundingClientRect().top - r.top;
  const top = s.top - r.top + Math.min(190, s.height * .27), h = formTop - 20 - top;
  B = { h, w: Math.min(h * .4, s.width * .6), x: s.left - r.left + s.width / 2, y: top };
  B.sy = B.y - Math.max(34, h * .1);
  paintBottle(); draw();
}
function emit(n) {
  for (let i = 0; i < n; i++) {
    const a = -Math.PI / 2 + (Math.random() - .5) * 2.5, v = 90 + Math.pow(Math.random(), 1.6) * 430;
    sparks.push({ x: B.x, y: B.sy, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: .45 + Math.random() * 1.05, age: 0, s: .6 + Math.random() * 1.3 });
  }
}
function step(dt) {
  t += dt; boost = Math.max(0, boost - dt * 1.6);
  emit(Math.round((190 + boost * 700) * dt + Math.random()));
  for (const p of sparks) { p.age += dt; p.vy += 430 * dt; const k = Math.exp(-1.5 * dt); p.vx *= k; p.vy *= k; p.x += p.vx * dt; p.y += p.vy * dt; }
  sparks = sparks.filter(p => p.age < p.life);
}
function draw() {
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H);
  const fl = 1 + Math.sin(t * 23) * .04 + Math.sin(t * 37) * .03 + boost * .25, R = Math.max(420, B.h * 1.3) * fl;
  let g = ctx.createRadialGradient(B.x, B.sy, 0, B.x, B.sy, R);
  g.addColorStop(0, 'rgba(255,186,70,.6)'); g.addColorStop(.14, 'rgba(240,150,40,.32)'); g.addColorStop(.45, 'rgba(30,110,80,.38)'); g.addColorStop(1, 'rgba(7,38,30,0)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  g = ctx.createRadialGradient(0, 0, 0, 0, 0, B.w * 1.25); g.addColorStop(0, 'rgba(2,14,11,.85)'); g.addColorStop(1, 'rgba(2,14,11,0)');
  ctx.save(); ctx.translate(B.x, B.y + B.h); ctx.scale(1, .12); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, B.w * 1.25, 0, 7); ctx.fill(); ctx.restore();
  ctx.drawImage(bottle, B.x - B.w / 2 - 4, B.y, B.w + 8, B.h + 4);
  ctx.strokeStyle = '#d7c9a4'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(B.x, B.y + 2); ctx.lineTo(B.x, B.sy); ctx.stroke();
  ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
  for (const p of sparks) {
    const q = 1 - p.age / p.life;
    ctx.strokeStyle = `hsla(${24 + q * 24},100%,${48 + q * 34}%,${Math.min(1, q * 1.5)})`; ctx.lineWidth = p.s * (.5 + q);
    ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x - p.vx * .028, p.y - p.vy * .028); ctx.stroke();
  }
  g = ctx.createRadialGradient(B.x, B.sy, 0, B.x, B.sy, 46 * fl);
  g.addColorStop(0, 'rgba(255,255,240,1)'); g.addColorStop(.25, 'rgba(255,225,150,.8)'); g.addColorStop(1, 'rgba(255,160,46,0)');
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(B.x, B.sy, 46 * fl, 0, 7); ctx.fill();
  ctx.globalCompositeOperation = 'source-over';
}
let last = 0;
function loop(now) {
  if (!visible) { running = false; return; }
  step(Math.max(0, Math.min(.033, (now - last) / 1000))); last = now; draw(); requestAnimationFrame(loop);
}
const start = () => { if (!running && !still) { running = true; last = performance.now(); requestAnimationFrame(loop); } };
size();
for (let i = 0; i < 70; i++) step(1 / 60); // the first frame is already lit
draw();
input.addEventListener('input', () => {
  boost = 1; paintBottle(); draw();
  $('#f-brand').value = input.value.trim();
});
addEventListener('resize', size);
new ResizeObserver(size).observe(stage);
new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) start(); }).observe(cv);
if (document.fonts) document.fonts.load(`800 40px ${D}`).then(size, () => {});
})();
