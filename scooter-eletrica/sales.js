/* Assistente de conversas: funciona sem enviar dados a servidores e sem inventar contato.
   A âncora é interpretada por contact.js, que abre a prévia da demonstração
   ou WhatsApp real quando WHATSAPP_DA_LOJA estiver configurado. */
(() => {
  'use strict';
  const box = document.getElementById('salesAssistant');
  if (!box) return;
  const model = box.querySelector('#salesModel');
  const preview = box.querySelector('#salesMessagePreview');
  const link = box.querySelector('#salesSend');

  function update() {
    const selected = model?.value || '';
    const interest = box.querySelector('input[name="salesInterest"]:checked')?.value || 'preço e opções de pagamento';
    const about = selected
      ? 'Quero saber mais sobre ' + (selected === 'Triciclo' ? 'o Triciclo elétrico' : 'o modelo ' + selected)
      : 'Gostaria de uma indicação do modelo ideal para a minha rotina';
    const message = 'Olá! Vim pelo site. ' + about + ' e gostaria de informações sobre ' + interest + '.';
    preview.textContent = message;
    link.dataset.demoUrl = 'https://wa.me/5500900000000?text=' + encodeURIComponent(message);
    link.setAttribute('aria-label', 'Continuar no WhatsApp: ' + (selected || 'ajuda para escolher'));
    link.href = '#contato-demo';
  }

  box.addEventListener('change', update);
  update();
})();
