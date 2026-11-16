/* Rio Vale — mobile-first experience. No dependencies or layout-heavy scroll libraries. */
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const progress = document.querySelector('.reading-bar');
const heroMedia = document.querySelector('.opening-media');
const floating = document.querySelector('#floatingBooking');
const book = document.querySelector('#reservar');
const year = document.querySelector('#year');
if (year) year.textContent = String(new Date().getFullYear());

// Motion is enhancement-only: content remains visible when JS or observers fail.
if (!reduced && 'IntersectionObserver' in window) {
  const items = [...document.querySelectorAll('.reveal')];
  const obs = new IntersectionObserver(entries => entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
  }), {threshold:.08, rootMargin:'0px 0px -12px 0px'});
  document.body.classList.add('motion');
  items.forEach(el => obs.observe(el));
  // Independent image reveals, including the swipeable gallery cards.
  const photoTargets = [...document.querySelectorAll('.feature-image, .experience-illustration, .gallery-card')];
  const photoObserver = new IntersectionObserver(entries => {
    for (const entry of entries) if (entry.isIntersecting) {
      entry.target.classList.add('photo-shown');
      photoObserver.unobserve(entry.target);
    }
  }, {threshold: .12, rootMargin:'0px 55px -18px 55px'});
  photoTargets.forEach(el => {el.classList.add('photo-enter');photoObserver.observe(el)});
}

// Smooth but lightweight progress and photo depth, throttled to animation frames.
let queued = false;
function onScrollFrame() {
  const y = Math.max(0,scrollY);
  const max = document.documentElement.scrollHeight-innerHeight;
  if (progress) progress.style.transform = 'scaleX('+(max>0?Math.min(y/max,1):0)+')';
  if (heroMedia && !reduced && y < innerHeight * 1.2) {
    // Leave the animated image transform untouched; move its container only.
    heroMedia.style.setProperty('--hero-shift', Math.min(y * .11, 100) + 'px');
  }
  if (floating) {
    const bookingInView = book && book.getBoundingClientRect().top < innerHeight*.75;
    floating.classList.toggle('is-visible',y>Math.min(innerHeight*.6,480)&&!bookingInView);
  }
  queued = false;
}
function scheduleScroll(){if(!queued){queued=true;requestAnimationFrame(onScrollFrame)}}
addEventListener('scroll',scheduleScroll,{passive:true});
addEventListener('resize',scheduleScroll,{passive:true});
onScrollFrame();

// Touch-friendly horizontal photo gallery with functional arrow controls and index.
const track = document.querySelector('.gallery-track');
const cards = track ? [...track.querySelectorAll('.gallery-card')] : [];
const counter = document.querySelector('#galleryCurrent');
function activeIndex(){
  if(!track || !cards.length) return 0;
  let nearest=0,distance=Infinity;
  cards.forEach((c,i)=>{const diff=Math.abs(c.offsetLeft-track.offsetLeft-track.scrollLeft);if(diff<distance){distance=diff;nearest=i}});
  return nearest;
}
function updateCounter(){if(counter)counter.textContent=String(activeIndex()+1).padStart(2,'0')}
document.querySelectorAll('[data-slide]').forEach(btn=>btn.addEventListener('click',()=>{
  if(!track||!cards.length)return;
  const direction=Number(btn.dataset.slide)||0;
  const next=Math.max(0,Math.min(cards.length-1,activeIndex()+direction));
  const left=cards[next].offsetLeft-track.offsetLeft;
  track.scrollTo({left,behavior:reduced?'instant':'smooth'});
  if(counter)counter.textContent=String(next+1).padStart(2,'0');
}));
if(track){track.addEventListener('scroll',()=>requestAnimationFrame(updateCounter),{passive:true});updateCounter()}

// Browser-hosted photos may be blocked by CDN hotlink rules.
// Show a calm, useful fallback rather than a broken image icon or unrelated photo.
document.querySelectorAll('img[data-photo]').forEach(img=>{
  function failed(){
    const parent=img.parentElement;
    if(!parent||parent.classList.contains('image-unavailable'))return;
    parent.classList.add('image-unavailable');
    const a=document.createElement('a');
    a.className='photo-fallback';
    a.href='https://www.airbnb.com.br/rooms/1525661029363941402';
    a.target='_blank'; a.rel='noopener noreferrer';
    a.textContent='Ver fotografia original no Airbnb ↗';
    parent.append(a);
  }
  img.addEventListener('error',failed,{once:true});
  if(img.complete && !img.naturalWidth)failed();
});
