<picture>
  <source media="(prefers-color-scheme: dark)" srcset="assets/header-dark.svg">
  <img alt="Víctor César, Desenvolvedor Full Stack / DevOps" src="assets/header-light.svg" width="100%">
</picture>

Projeto, desenvolvo e mantenho, da arquitetura ao deploy, os sistemas que uma provedora de internet usa todos os dias: o aplicativo dos clientes, pagamentos, assinatura de contratos, RH e os servidores onde tudo isso roda.

### Em produção na PowerTelecom

- **Aplicativo do cliente**: API do app Android e iOS, com cerca de 3.000 usuários ativos por dia, faturas, pagamento por cartão e notificações push.
- **Assinatura de contratos**: selfie com reconhecimento facial, assinatura na tela e PDF integrado ao ERP. Centenas de contratos por mês, sem papel.
- **Plataforma de RH**: multiempresa, usada por cerca de 100 colaboradores, com contracheques em lote e ponto eletrônico.
- **Servidores**: migração de 15 aplicações em produção, tudo em Docker atrás do Nginx, com alertas no Discord e no Telegram.

> Esses sistemas são da empresa e ficam em repositórios privados.

### Stack

```yaml
# o que roda em produção hoje
backend:  [TypeScript, NestJS, Express, Prisma, Python]
frontend: [React, Next.js, Tailwind CSS]
dados:    [PostgreSQL, Redis, MongoDB, BullMQ]
infra:    [Linux, Docker, Nginx, PM2, Let's Encrypt]
cloud:    AWS Certified Cloud Practitioner
```

### Projetos abertos

- [oficinaFlow](https://github.com/victorcsar/oficinaFlow): gestão de oficina mecânica com orçamentos, ordens de serviço e estoque. Express, Prisma e React.
- [cv-web](https://github.com/victorcsar/cv-web): o código do meu currículo online.
- [curriculo](https://github.com/victorcsar/curriculo): o mesmo currículo em LaTeX.

### Contato

[victorcesar.com.br](https://www.victorcesar.com.br) · [LinkedIn](https://br.linkedin.com/in/victorcesarbastos) · [victorcesagx@gmail.com](mailto:victorcesagx@gmail.com)
