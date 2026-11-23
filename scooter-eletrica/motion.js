/* Motion progressivo: efeitos discretos, sem dependências e sem bloquear conteúdo. */
(() => {
  'use strict';
  if (!('IntersectionObserver' in window)) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return;

  const selectors = [
    '.catalog .cat-head', '.catalog-jump', '.catalog .card',
    '.city-story-photo', '.city-story-copy h2', '.city-story-copy > p', '.story-link',
    '.choose .section-kicker', '.choose .h2', '.choose .sub', '.choose .use',
    '.feature-gallery', '.feature-copy', '.sales-assist-copy', '.sales-assist-form',
    '.faq-grid > div', '.final-grid > *'
  ];
  const elements = document.querySelectorAll(selectors.join(','));
  if (!elements.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(({target,isIntersecting}) => {
      if (!isIntersecting) return;
      target.classList.add('is-visible');
      observer.unobserve(target);
    });
  }, {threshold:0.09,rootMargin:'0px 0px -12px 0px'});

  elements.forEach(el => el.classList.add('motion-reveal'));
  document.documentElement.classList.add('motion-ready');
  elements.forEach(el => observer.observe(el));
})();
