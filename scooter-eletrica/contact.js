/* Prévia de atendimento: troca contatos fictícios por uma experiência de demonstração.
   Ao personalizar a loja, configure o número real abaixo (somente dígitos, DDI + DDD).
   Exemplo de formato: 55 + DDD + número. Nunca use números de exemplo em produção. */
(() => {
  'use strict';
  const WHATSAPP_DA_LOJA = '';
  const telefone = WHATSAPP_DA_LOJA.replace(/\D/g, '');
  const telefoneValido = /^55\d{10,11}$/.test(telefone);
  const modal = document.getElementById('contato-demo');
  const mensagem = document.getElementById('demo-message');
  const copy = document.getElementById('demo-copy');
  const close = () => { if (modal?.open) modal.close(); };
  document.getElementById('demo-close')?.addEventListener('click', close);
  document.getElementById('demo-dismiss')?.addEventListener('click', close);
  modal?.addEventListener('click', e => { if (e.target === modal) close(); });
  let ultimoTexto = '';
  document.addEventListener('click', event => {
    const link = event.target.closest?.('a[data-demo-url], a[href^="https://wa.me/5500900000000"]');
    if (!link) return;
    const origem = link.dataset.demoUrl || link.getAttribute('href');
    let texto = 'Olá! Vim pelo site e quero saber mais sobre os elétricos.';
    try { texto = new URL(origem).searchParams.get('text') || texto; } catch (_) { /* fallback de prévia */ }
    if (telefoneValido) {
      link.href = 'https://wa.me/' + telefone + '?text=' + encodeURIComponent(texto);
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      return;
    }
    event.preventDefault();
    ultimoTexto = texto;
    if (mensagem) mensagem.textContent = texto;
    if (copy) copy.textContent = 'Copiar mensagem';
    if (modal?.showModal) modal.showModal();
  }, true);
  copy?.addEventListener('click', async () => {
    if (!ultimoTexto) return;
    try {
      await navigator.clipboard.writeText(ultimoTexto);
      copy.textContent = 'Mensagem copiada';
    } catch (_) {
      copy.textContent = 'Selecione e copie o texto acima';
    }
  });
})();
