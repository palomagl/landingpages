// Rio Vale — lightweight scroll interactions. Zero external JS dependencies.
const motionReduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const bar = document.querySelector('.progress');
const heroImage = document.querySelector('.hero-photo img');
const mobileCta = document.querySelector('#mobileCta');
const bookingSection = document.querySelector('#reserva');
const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();

if ('IntersectionObserver' in window && !motionReduced) {
  document.body.classList.add('motion');
  const observer = new IntersectionObserver(entries => {
    for (const item of entries) {
      if (item.isIntersecting) {
        item.target.classList.add('shown');
        observer.unobserve(item.target);
      }
    }
  }, { threshold: .08, rootMargin: '0px 0px -18px 0px' });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

let ticking = false;
function syncScroll() {
  const offset = window.scrollY;
  const total = document.documentElement.scrollHeight - window.innerHeight;
  if (bar) bar.style.transform = 'scaleX(' + (total > 0 ? Math.max(0, Math.min(offset/total, 1)) : 0) + ')';
  if (heroImage && !motionReduced && offset < innerHeight * 1.12) {
    heroImage.style.transform = 'translate3d(0,' + Math.min(offset * .12, 128) + 'px,0) scale(1.06)';
  }
  if (mobileCta) {
    const bookingReached = bookingSection && bookingSection.getBoundingClientRect().top < innerHeight * .68;
    mobileCta.classList.toggle('visible', offset > Math.min(innerHeight * .66, 540) && !bookingReached);
  }
  ticking = false;
}
addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(syncScroll); } }, {passive:true});
addEventListener('resize', () => requestAnimationFrame(syncScroll), {passive:true});
syncScroll();
