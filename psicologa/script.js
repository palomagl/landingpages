'use strict';
(() => {
  const c = window.SITE_CONFIG || {};
  document.querySelectorAll('[data-name]').forEach(el => { el.textContent = c.nomeCompleto || 'Nome da profissional'; });
  document.querySelectorAll('[data-title]').forEach(el => { el.textContent = c.tituloProfissional || 'Psicologia'; });
  document.querySelectorAll('[data-modality]').forEach(el => { el.textContent = c.modalidades?.[Number(el.dataset.modality)] || el.textContent; });
  const info = [c.crp && `CRP ${c.crp}`, c.cidade, c.endereco, c.abordagem].filter(Boolean);
  if (info.length) { const el = document.querySelector('.professional-data'); el.textContent = info.join(' · '); el.hidden = false; }
  if (c.fotografia && /^(assets\/|\.\/assets\/)/.test(c.fotografia)) {
    const image = document.querySelector('.hero-art img');
    image.removeAttribute('srcset'); image.src = c.fotografia;
    image.alt = `Retrato autorizado de ${c.nomeCompleto}`;
    document.querySelector('.hero-art figcaption').textContent = c.nomeCompleto;
    document.querySelector('.art-label').hidden = true;
  }
  document.title = `${c.nomeCompleto || 'Psicologia'} · Espaço para a sua própria voz${c.demonstracao !== false ? ' | Demo ÚNICA' : ''}`;
  const dialog = document.querySelector('dialog');
  const number = String(c.contatoWhatsapp || '').trim();
  const active = c.demonstracao === false && /^\d{10,15}$/.test(number);
  document.querySelectorAll('[data-contact]').forEach(link => {
    if (active) { link.href = `https://wa.me/${number}?text=${encodeURIComponent(c.mensagemWhatsapp || 'Olá! Gostaria de conhecer o atendimento.')}`; link.target = '_blank'; link.rel = 'noopener noreferrer'; }
    else { link.setAttribute('aria-haspopup', 'dialog'); link.addEventListener('click', event => { event.preventDefault(); dialog.showModal(); }); }
  });
  if (active) document.querySelector('.contact-note').textContent = 'Converse pelo WhatsApp para conhecer o atendimento.';
  document.querySelectorAll('.dialog-close, .dialog-done').forEach(button => button.addEventListener('click', () => dialog.close()));
  dialog.addEventListener('click', event => { if (event.target === dialog) { const r = dialog.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close(); } });
  if ('IntersectionObserver' in window) {
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.documentElement.classList.add('motion');
      const reveal = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); reveal.unobserve(entry.target); } }), { threshold: .08 });
      document.querySelectorAll('.reveal').forEach(el => reveal.observe(el));
    }
    const sticky = document.querySelector('.mobile-contact');
    const observed = new Map();
    const visibility = new IntersectionObserver(entries => { entries.forEach(e => observed.set(e.target, e.isIntersecting)); sticky.classList.toggle('is-hidden', [...observed.values()].some(Boolean)); });
    visibility.observe(document.querySelector('.hero-bottom .button')); visibility.observe(document.querySelector('.contact'));
  }
})();
