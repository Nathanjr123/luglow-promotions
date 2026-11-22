(() => {
'use strict';
const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const WA = '27846972497', MAIL = 'lupromotions9@gmail.com';
const still = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Header, menu, services dropdown */
const top = $('.top'), burger = $('.burger'), drop = $('.has-drop'), dropBtn = $('.dropbtn');
const onScroll = () => { top.classList.toggle('solid', scrollY > 24); document.body.classList.toggle('past', scrollY > 420); };
addEventListener('scroll', onScroll, { passive: true }); onScroll();
const menu = open => { top.classList.toggle('menu', open); burger.setAttribute('aria-expanded', open); burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu'); document.body.style.overflow = open ? 'hidden' : ''; };
const setDrop = open => { drop.classList.toggle('open', open); dropBtn.setAttribute('aria-expanded', open); };
burger.addEventListener('click', () => menu(!top.classList.contains('menu')));
dropBtn.addEventListener('click', () => setDrop(!drop.classList.contains('open')));
document.addEventListener('click', e => { if (!e.target.closest('.has-drop')) setDrop(false); if (e.target.closest('#nav a')) { menu(false); setDrop(false); } });
addEventListener('keydown', e => { if (e.key === 'Escape') { menu(false); setDrop(false); } });
matchMedia('(min-width:941px)').addEventListener('change', () => menu(false));
const links = new Map($$('#nav > a:not(.m-only)').map(a => [a.hash.slice(1), a]));
const spy = new IntersectionObserver(es => es.forEach(e => {
  if (e.target.id === 'contact') document.body.classList.toggle('at-contact', e.isIntersecting);
  const a = links.get(e.target.id); if (!a) return;
  if (e.isIntersecting) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
}), { rootMargin: '-45% 0px -50%' });
$$('section[id]').forEach(s => spy.observe(s));

/* Hero slideshow */
const slides = $$('.slide'), dots = $$('.dots [data-i]'), pause = $('.pause');
let at = 0, timer = 0;
const show = i => {
  at = (i + slides.length) % slides.length;
  slides.forEach((s, k) => { s.classList.toggle('on', k === at); s.setAttribute('aria-hidden', k !== at); });
  dots.forEach((d, k) => { if (k === at) d.setAttribute('aria-current', 'true'); else d.removeAttribute('aria-current'); });
};
const play = on => {
  clearInterval(timer); timer = on ? setInterval(() => { if (!document.hidden) show(at + 1); }, 5500) : 0;
  pause.classList.toggle('off', !on); pause.setAttribute('aria-label', on ? 'Pause slideshow' : 'Play slideshow');
};
pause.addEventListener('click', () => play(!timer));
dots.forEach(d => d.addEventListener('click', () => { show(+d.dataset.i); play(false); }));
play(!still);

/* Service filter and details */
const filters = $$('.filters button');
filters.forEach(b => b.addEventListener('click', () => {
  filters.forEach(x => x.setAttribute('aria-pressed', x === b));
  $$('#bento [data-g]').forEach(c => { c.hidden = b.dataset.f !== 'all' && c.dataset.g !== b.dataset.f; });
}));
$$('[data-dialog]').forEach(b => b.addEventListener('click', e => {
  e.preventDefault(); menu(false); setDrop(false); document.getElementById(b.dataset.dialog).showModal();
}));
$$('dialog').forEach(d => d.addEventListener('click', e => {
  if (e.target.closest('[data-close]')) return d.close();
  if (e.target !== d) return;
  const r = d.getBoundingClientRect();
  if (d.id === 'lightbox' || e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) d.close();
}));
$$('[data-service]').forEach(a => a.addEventListener('click', () => {
  $('#f-service').value = a.dataset.service; const d = a.closest('dialog'); if (d) d.close();
}));

/* Photo viewer */
const shots = $$('[data-shot]'), box = $('#lightbox'), big = box.querySelector('img'), cap = box.querySelector('p');
let cur = 0;
const view = i => {
  cur = (i + shots.length) % shots.length;
  const thumb = shots[cur].querySelector('img'), set = shots[cur].querySelector('source').srcset.split(',').pop().trim().split(' ')[0];
  big.onerror = () => { big.onerror = null; big.src = thumb.getAttribute('src'); };
  big.src = set; big.alt = thumb.alt; cap.textContent = shots[cur].nextElementSibling.textContent;
};
shots.forEach((b, i) => b.addEventListener('click', () => { view(i); box.showModal(); }));
box.querySelectorAll('[data-step]').forEach(b => b.addEventListener('click', () => view(cur + +b.dataset.step)));
box.addEventListener('keydown', e => { if (e.key === 'ArrowLeft') view(cur - 1); if (e.key === 'ArrowRight') view(cur + 1); });

/* Map */
const NS = 'http://www.w3.org/2000/svg', frag = document.createDocumentFragment();
window.SA_DOTS.forEach(([x, y], i) => {
  const c = document.createElementNS(NS, 'circle');
  c.setAttribute('cx', x); c.setAttribute('cy', y); c.setAttribute('r', 5);
  const h = (i * 7919) % 101;
  if (h < 22) { c.setAttribute('class', 'lit'); c.style.animationDelay = -(h * .23).toFixed(2) + 's'; }
  frag.append(c);
});
$('#map').append(frag);

/* Once the page is ready, fetch the remaining photos so they are there before the visitor scrolls. */
addEventListener('load', () => {
  document.body.classList.add('ready'); // slides 2 and 3 only start loading now
  if (navigator.connection && navigator.connection.saveData) return;
  (window.requestIdleCallback || (f => setTimeout(f, 300)))(() => $$('img[loading=lazy]').forEach(i => { i.loading = 'eager'; }));
});

/* Enquiry */
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
})();
