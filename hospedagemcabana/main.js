/* Rio Vale — interactions, light enough for mobile.
   Replace with the URL of the exact Airbnb listing when provided. */
const AIRBNB_URL = "https://www.airbnb.com.br/rooms/1525661029363941402";
const IS_DIRECT_LISTING = /airbnb\.[^/]+\/rooms\//.test(AIRBNB_URL);
document.querySelectorAll('[data-booking]').forEach(a => {
  a.href = AIRBNB_URL;
  if (!IS_DIRECT_LISTING) {
    const label = a.getAttribute('aria-label') || 'Abrir Airbnb';
    a.setAttribute('aria-label', label + ' — busca de hospedagens na região, anúncio específico não confirmado');
    a.title = 'Busca de hospedagens na região. O anúncio exato ainda não foi identificado.';
  }
});
document.getElementById('year').textContent = new Date().getFullYear();
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const bar = document.querySelector('.topline');
const heroImg = document.querySelector('.hero-image img');
const mobile = document.getElementById('mobileBooking');
if ('IntersectionObserver' in window && !reduceMotion) {
  document.body.classList.add('motion');
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); revealObserver.unobserve(e.target); }
    });
  }, {threshold: 0.09, rootMargin: '0px 0px -20px 0px'});
  document.querySelectorAll('.revealed').forEach(el => revealObserver.observe(el));
}
let ticking = false;
function updateScroll() {
  const y = window.scrollY;
  const total = document.documentElement.scrollHeight - innerHeight;
  if (bar) bar.style.transform = 'scaleX(' + (total > 0 ? Math.min(1, y / total) : 0) + ')';
  if (mobile) mobile.classList.toggle('show', y > Math.min(innerHeight * .7, 620) && y < total - 120);
  if (!reduceMotion && heroImg && y < innerHeight * 1.1) heroImg.style.transform = 'translate3d(0,' + Math.min(y * .15, 140) + 'px,0) scale(1.09)';
  ticking = false;
}
addEventListener('scroll', () => {
  if (!ticking) { ticking = true; requestAnimationFrame(updateScroll); }
}, {passive: true});
addEventListener('resize', () => requestAnimationFrame(updateScroll), {passive: true});
updateScroll();
