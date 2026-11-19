# Landing Pages | ÚNICA

Exemplos de landing pages prontos para servir de base em projetos reais. Cada pasta é um projeto independente, com código, imagens e documentação próprios: para usar com um cliente, é só trocar marca, textos, fotos e contatos.

| Pasta | Exemplo | Status |
| --- | --- | --- |
| [cafeteria/](cafeteria/) | Máquinas de café — catálogo com orçamento pelo WhatsApp (React) | Pronto para usar como base |
| [hospedagemcabana/](hospedagemcabana/) | Cabanas — hospedagem | Pronto para usar como base |
| [dentista/](dentista/) | Odontologia — consultório com agendamento pelo WhatsApp | Pronto para usar como base |
| [psicologa/](psicologa/) | Psicologia — consultório | Pronto para usar como base |
| [scooter-eletrica/](scooter-eletrica/) | Scooters elétricas — loja | Pronto para usar como base |

## Como usar um exemplo em um projeto real
1. Copie a pasta do exemplo mais próximo do nicho do cliente para uma nova pasta (`nutricionista/`, `advocacia/`, `barbearia/` etc.).
2. Troque marca, textos, fotos, WhatsApp, endereço e preços. O README de cada pasta lista o que é provisório.
3. Atualize as tags de compartilhamento (`og:title`, `og:description`, `og:image`) para o domínio do cliente.
4. Publique na Vercel apontando o **Root Directory** para a pasta do projeto, para que o `vercel.json` dela seja aplicado.

## Padrão dos exemplos
- **Celular primeiro:** testados a partir de 320 px de largura, com atenção a celulares lentos e conexões fracas.
- **Sem dependências:** HTML, CSS e JavaScript puros; abre direto no navegador. As exceções são `cafeteria/` e `dentista/`, feitos em React + Vite: precisam de `npm install` e `npm run build` (a Vercel faz isso sozinha). No `cafeteria/`, todo o conteúdo fica em um único arquivo de configuração.
- **Segurança e privacidade** (`hospedagemcabana/`, `scooter-eletrica/`, `dentista/` e `cafeteria/`): política de segurança de conteúdo, fontes hospedadas no próprio site, links externos protegidos e cabeçalhos de segurança no `vercel.json`. Use o mesmo padrão em novos projetos.

## Antes de publicar para um cliente
Use apenas fotos, marcas, depoimentos e credenciais que o cliente autorizou, e confirme preços, condições e dados de contato com ele.
