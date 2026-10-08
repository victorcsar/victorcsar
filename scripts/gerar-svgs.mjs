// Gera os painéis SVG do README em versão clara e escura.
// Uso: node scripts/gerar-svgs.mjs
//
// O conteúdo (textos, sistemas, stack, projetos e contatos) fica todo aqui. Depois de mudar
// algo, rode o script de novo e commite os arquivos de assets/. Se mudar um texto, confira
// também o texto alternativo (alt) da imagem no README.md.

import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ASSETS = join(dirname(fileURLToPath(import.meta.url)), '..', 'assets');

// ---------------------------------------------------------------- conteúdo

const perfil = {
  nome: 'Víctor César',
  cargo: 'Desenvolvedor Full Stack / DevOps · Santo Estêvão, Bahia',
  site: 'victorcesar.com.br',
  desde: 'jan/2023',
  aplicacoes: '15',
  usuarios: '3.000',
};

const sistemas = {
  comentario: '# provedora de internet, da arquitetura ao deploy',
  lista: [
    ['app-cliente', '~3.000 usuários/dia'],
    ['assinatura-contratos', 'centenas de contratos/mês'],
    ['plataforma-rh', '~100 colaboradores'],
    ['servidores', '15 aplicações migradas'],
  ],
};

const stack = [
  ['frontend', ['React', 'Next.js', 'Tailwind CSS']],
  ['backend', ['TypeScript', 'NestJS', 'Express', 'Prisma', 'Python']],
  ['dados', ['PostgreSQL', 'Redis', 'MongoDB', 'BullMQ']],
  ['infra', ['Linux', 'Docker', 'Nginx', 'PM2', "Let's Encrypt"]],
  ['cloud', ['AWS Certified Cloud Practitioner']],
];

// O nome do arquivo de cada projeto é projeto-<nome>-<tema>.svg
const projetos = [
  ['oficinaFlow', 'Gestão de oficina mecânica: orçamentos, O.S. e estoque'],
  ['cv-web', 'Meu currículo online, no ar em victorcesar.com.br'],
  ['curriculo', 'O mesmo currículo, em LaTeX'],
];

// O nome do arquivo de cada contato é contato-<id>-<tema>.svg; o id também escolhe o ícone.
// O endereço completo do LinkedIn não cabe num terço da largura, por isso só o caminho do perfil.
const contatos = [
  ['site', 'victorcesar.com.br'],
  ['linkedin', 'in/victorcesarbastos'],
  ['email', 'victorcesagx@gmail.com'],
];

// Tempo de um ciclo do `watch docker ps`, em segundos
const CICLO_PS = 5;
// Quanto tempo a seleção fica em cada camada da stack, em segundos
const PASSO_STACK = 2.5;

// ---------------------------------------------------------------- temas

const temas = {
  dark: {
    bg: '#020617', rule: '#1e293b', fg: '#e2e8f0', muted: '#94a3b8',
    prompt: '#38bdf8', accent: '#60a5fa', ok: '#4ade80', logo: '#ffffff',
  },
  light: {
    bg: '#f8fafc', rule: '#e2e8f0', fg: '#0f172a', muted: '#64748b',
    prompt: '#0284c7', accent: '#2563eb', ok: '#16a34a', logo: '#0f172a',
  },
};

// ---------------------------------------------------------------- base

const W = 720;

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');

const txt = (x, y, cls, size, content, extra = '') =>
  `<text x="${x}" y="${y}" font-size="${size}" class="${cls}"${extra}>${content}</text>`;

const prompt = (y, cmd) => txt(28, y, 'prompt', 17, '~ $') + txt(70, y, 'fg', 17, esc(cmd));

// Cores por classe e animações. O SVG entra no README como <img>, então não roda script,
// mas CSS com @keyframes funciona. Quem pede menos movimento vê tudo parado no estado final.
const estilo = (c, animacoes) => `<style>
    text { font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace; }
    .bg { fill: ${c.bg}; }
    .rule { fill: ${c.rule}; }
    .fg { fill: ${c.fg}; }
    .muted { fill: ${c.muted}; }
    .prompt { fill: ${c.prompt}; }
    .accent { fill: ${c.accent}; }
    .ok { fill: ${c.ok}; }
    .logo { fill: ${c.logo}; }
    .b { font-weight: 600; }
${animacoes}
  </style>`;

const svg = ({ w = W, h, label, c, animacoes = '', defs = '', corpo }) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${esc(label)}">
  <title>${esc(label)}</title>
  ${estilo(c, animacoes)}
  ${defs ? `<defs>${defs}</defs>` : ''}
  <rect x=".5" y=".5" width="${w - 1}" height="${h - 1}" rx="6" fill="${c.bg}" stroke="${c.rule}"/>
  ${corpo}
</svg>
`;

// ---------------------------------------------------------------- cabeçalho

// Cada comando é revelado por uma tarja da cor do fundo que anda para a direita,
// uma letra por passo, levando o cursor na frente. Depois a saída aparece. Roda uma vez.
const animHeader = `
    .show { animation: show .35s ease-out var(--d) backwards; }
    .type { opacity: 0; animation: type calc(var(--n) * 70ms) steps(var(--n)) var(--d) backwards; }
    .blink { animation: blink 1.1s step-end infinite, show 0s linear var(--d) backwards; }
    @keyframes show { from { opacity: 0; } }
    @keyframes type { from { opacity: 1; transform: translateX(0); } to { opacity: 1; transform: translateX(var(--w)); } }
    @keyframes blink { 50% { opacity: 0; } }
    @media (prefers-reduced-motion: reduce) { .show, .type, .blink { animation: none; } }`;

const digitar = (y, cmd, d) => `<g class="type" style="--n: ${cmd.length}; --w: ${Math.round(cmd.length * 10.6)}px; --d: ${d}s">
    <rect x="69" y="${y - 20}" width="${cmd.length * 12}" height="26" class="bg"/>
    <rect x="69" y="${y - 17}" width="10" height="21" class="prompt"/>
  </g>`;

const header = (c) => svg({
  h: 330,
  c,
  label: `${perfil.nome}, ${perfil.cargo}. Em produção desde ${perfil.desde}, ${perfil.aplicacoes} aplicações, ${perfil.usuarios} usuários por dia.`,
  animacoes: animHeader,
  corpo: `<g transform="translate(28 22) scale(.625)">
    <polygon points="6,14 18,14 27,38 27,50 21,50" class="logo"/>
    <polygon points="27,38 36,14 48,14 33,50 27,50" fill="#3b82f6"/>
    <rect x="44" y="42" width="14" height="8" rx="2" fill="#38bdf8"/>
  </g>
  ${txt(692, 50, 'muted', 14, esc(perfil.site), ' text-anchor="end"')}

  ${prompt(112, 'whoami')}
  ${digitar(112, 'whoami', 0.5)}
  ${txt(28, 156, 'fg b show', 32, esc(perfil.nome), ' style="--d: 1.05s"')}
  ${txt(28, 186, 'muted show', 16, esc(perfil.cargo), ' style="--d: 1.15s"')}

  <g class="show" style="--d: 1.6s">
  ${prompt(236, 'uptime')}
  ${digitar(236, 'uptime', 1.65)}
  </g>
  ${txt(28, 266, 'fg show', 16, `em produção desde ${perfil.desde} · <tspan class="accent">${perfil.aplicacoes}</tspan> aplicações · <tspan class="accent">${perfil.usuarios}</tspan> usuários/dia`, ' style="--d: 2.2s"')}

  ${txt(28, 306, 'prompt show', 17, '~ $', ' style="--d: 2.6s"')}
  <rect x="69" y="289" width="10" height="21" class="prompt blink" style="--d: 2.6s"/>`,
});

// ---------------------------------------------------------------- watch docker ps

// A barra enche a cada ciclo, como o `watch`, e as linhas piscam juntas na atualização.
// Os pontos de status pulsam um depois do outro. Tudo em ciclo, para quem rolar até aqui ainda ver.
const animPs = `
    .refresh { transform-box: fill-box; transform-origin: left; animation: refresh ${CICLO_PS}s linear infinite; }
    @keyframes refresh { from { transform: scaleX(0); } to { transform: scaleX(1); } }
    .pulse { transform-box: fill-box; transform-origin: center; animation: pulse ${CICLO_PS / 2}s ease-in-out var(--d) infinite; }
    @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: .35; transform: scale(.7); } }
    .rows { animation: rows ${CICLO_PS}s steps(1) infinite; }
    @keyframes rows { 0% { opacity: .55; } 4% { opacity: 1; } }
    @media (prefers-reduced-motion: reduce) { .refresh, .pulse, .rows { animation: none; } }`;

const dockerPs = (c) => svg({
  h: 140 + sistemas.lista.length * 42,
  c,
  label: `watch docker ps. Sistemas de uma provedora de internet, da arquitetura ao deploy. ` +
    sistemas.lista.map(([n, e]) => `${n}: no ar, ${e}.`).join(' '),
  animacoes: animPs,
  corpo: `${prompt(42, 'watch docker ps')}
  ${txt(692, 42, 'muted', 14, `a cada ${CICLO_PS.toFixed(1).replace('.', ',')}s`, ' text-anchor="end"')}
  ${txt(28, 70, 'muted', 15, esc(sistemas.comentario))}
  <rect x="28" y="86" width="664" height="2" class="rule"/>
  <rect x="28" y="86" width="664" height="2" class="prompt refresh"/>

  ${txt(28, 124, 'muted', 13, 'SISTEMA', ' letter-spacing="1.5"')}
  ${txt(300, 124, 'muted', 13, 'STATUS', ' letter-spacing="1.5"')}
  ${txt(400, 124, 'muted', 13, 'ESCALA', ' letter-spacing="1.5"')}

  <g class="rows">
${sistemas.lista.map(([nome, escala], i) => {
  const y = 168 + i * 42;
  return `    ${txt(28, y, 'fg b', 18, esc(nome))}
    <circle cx="306" cy="${y - 6}" r="5" class="ok pulse" style="--d: ${(i * 0.4).toFixed(1)}s"/>
    ${txt(320, y, 'ok', 17, 'up')}
    ${txt(400, y, 'accent', 17, esc(escala))}`;
}).join('\n')}
  </g>`,
});

// ---------------------------------------------------------------- cat stack.yml

// Tudo fica parado e legível. Só uma seleção desce pelas camadas, uma por vez,
// como num menu de terminal.
const LINHA = 40;
const animStack = `
    .sel { animation: sel ${PASSO_STACK * stack.length}s steps(${stack.length}) infinite; }
    @keyframes sel { to { transform: translateY(${LINHA * stack.length}px); } }
    @media (prefers-reduced-motion: reduce) { .sel { animation: none; } }`;

const stackSvg = (c) => {
  const topo = 92;
  // Colunas pela largura da maior palavra de cada uma (fonte de 16 px ≈ 9,6 px por letra)
  const colunas = [140, 256, 346, 436, 522];
  return svg({
    h: topo + stack.length * LINHA,
    c,
    label: 'Stack. ' + stack.map(([k, v]) => `${k}: ${v.join(', ')}.`).join(' '),
    animacoes: animStack,
    corpo: `${prompt(42, 'cat stack.yml')}
  <g class="sel">
    <rect x="14" y="${topo - 26}" width="${W - 28}" height="34" rx="4" fill="${c.accent}" fill-opacity=".12"/>
    ${txt(20, topo - 3, 'prompt', 17, '›')}
  </g>
${stack.map(([camada, itens], i) => {
  const y = topo + i * LINHA - 3;
  return `  ${txt(40, y, 'accent', 16, esc(camada) + ':')}\n` +
    itens.map((item, j) => `  ${txt(colunas[j], y, 'fg', 16, esc(item))}`).join('\n');
}).join('\n')}`,
  });
};

// ---------------------------------------------------------------- projetos (uma imagem por link)

const projeto = ([nome, desc]) => (c) => svg({
  h: 84,
  c,
  label: `${nome}: ${desc}.`,
  corpo: `${txt(28, 36, 'muted', 16, `~/projetos/<tspan class="accent b" font-size="19">${esc(nome)}</tspan>`)}
  ${txt(692, 36, 'muted', 15, 'abrir ↗', ' text-anchor="end"')}
  ${txt(28, 64, 'fg', 16, esc(desc))}`,
});

// ---------------------------------------------------------------- contatos (três botões lado a lado)

// Ícones de 18 px centrados em (27, 30), no traço da cor do prompt.
const icones = {
  site: (c) => `<g fill="none" stroke="${c.prompt}" stroke-width="1.6">
    <circle cx="27" cy="30" r="8.5"/>
    <ellipse cx="27" cy="30" rx="3.8" ry="8.5"/>
    <path d="M18.5 30h17"/>
  </g>`,
  linkedin: (c) => `<rect x="18" y="21" width="18" height="18" rx="3" fill="${c.prompt}"/>
  <text x="27" y="34.5" font-size="12" font-weight="700" fill="${c.bg}" text-anchor="middle" style="font-family: Arial, Helvetica, sans-serif">in</text>`,
  email: (c) => `<g fill="none" stroke="${c.prompt}" stroke-width="1.6" stroke-linejoin="round">
    <rect x="18.5" y="23.5" width="17" height="13" rx="2"/>
    <path d="M19.5 25l7.5 6 7.5-6"/>
  </g>`,
};

const LARG_CONTATO = 272;

const contato = ([id, valor]) => (c) => svg({
  w: LARG_CONTATO,
  h: 60,
  c,
  label: valor,
  corpo: `${icones[id](c)}
  ${txt(46, 35, 'accent', 14, esc(valor))}
  ${txt(LARG_CONTATO - 16, 35, 'muted', 14, '↗', ' text-anchor="end"')}`,
});

// ---------------------------------------------------------------- saída

const paineis = {
  header,
  'docker-ps': dockerPs,
  stack: stackSvg,
  ...Object.fromEntries(projetos.map((p) => [`projeto-${p[0]}`, projeto(p)])),
  ...Object.fromEntries(contatos.map((p) => [`contato-${p[0]}`, contato(p)])),
};

mkdirSync(ASSETS, { recursive: true });
for (const [nome, gerar] of Object.entries(paineis)) {
  for (const [tema, cores] of Object.entries(temas)) {
    writeFileSync(join(ASSETS, `${nome}-${tema}.svg`), gerar(cores));
    console.log(`assets/${nome}-${tema}.svg`);
  }
}
