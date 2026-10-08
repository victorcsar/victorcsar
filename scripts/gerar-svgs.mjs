// Gera os painéis SVG do README em versão clara e escura.
// Uso: node scripts/gerar-svgs.mjs
//
// O conteúdo (textos, sistemas e stack) fica todo aqui. Depois de mudar algo,
// rode o script de novo e commite os arquivos de assets/.

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

const sistemas = [
  ['app-cliente', '~3.000 usuários/dia'],
  ['assinatura-contratos', 'centenas de contratos/mês'],
  ['plataforma-rh', '~100 colaboradores'],
  ['servidores', '15 aplicações migradas'],
];

const stack = [
  'TypeScript', 'NestJS', 'Express', 'Prisma', 'Python', 'React', 'Next.js', 'Tailwind CSS',
  'PostgreSQL', 'Redis', 'MongoDB', 'BullMQ', 'Linux', 'Docker', 'Nginx', 'PM2', "Let's Encrypt", 'AWS',
];

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

const svg = ({ h, label, c, animacoes, defs = '', corpo }) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${h}" width="${W}" height="${h}" role="img" aria-label="${esc(label)}">
  <title>${esc(label)}</title>
  ${estilo(c, animacoes)}
  ${defs ? `<defs>${defs}</defs>` : ''}
  <rect x=".5" y=".5" width="${W - 1}" height="${h - 1}" rx="6" fill="${c.bg}" stroke="${c.rule}"/>
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

// A barra enche a cada 2 s, como o `watch`, e as linhas piscam juntas na atualização.
// Os pontos de status pulsam um depois do outro. Tudo em ciclo, para quem rolar até aqui ainda ver.
const animPs = `
    .refresh { transform-box: fill-box; transform-origin: left; animation: refresh 2s linear infinite; }
    @keyframes refresh { from { transform: scaleX(0); } to { transform: scaleX(1); } }
    .pulse { transform-box: fill-box; transform-origin: center; animation: pulse 2s ease-in-out var(--d) infinite; }
    @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: .35; transform: scale(.7); } }
    .rows { animation: rows 2s steps(1) infinite; }
    @keyframes rows { 0% { opacity: .55; } 6% { opacity: 1; } }
    @media (prefers-reduced-motion: reduce) { .refresh, .pulse, .rows { animation: none; } }`;

const dockerPs = (c) => svg({
  h: 112 + sistemas.length * 42,
  c,
  label: 'watch docker ps. ' + sistemas.map(([n, e]) => `${n}: no ar, ${e}.`).join(' '),
  animacoes: animPs,
  corpo: `${prompt(42, 'watch docker ps')}
  ${txt(692, 42, 'muted', 14, 'a cada 2,0s', ' text-anchor="end"')}
  <rect x="28" y="58" width="664" height="2" class="rule"/>
  <rect x="28" y="58" width="664" height="2" class="prompt refresh"/>

  ${txt(28, 96, 'muted', 13, 'SISTEMA', ' letter-spacing="1.5"')}
  ${txt(300, 96, 'muted', 13, 'STATUS', ' letter-spacing="1.5"')}
  ${txt(400, 96, 'muted', 13, 'ESCALA', ' letter-spacing="1.5"')}

  <g class="rows">
${sistemas.map(([nome, escala], i) => {
  const y = 140 + i * 42;
  return `    ${txt(28, y, 'fg b', 18, esc(nome))}
    <circle cx="306" cy="${y - 6}" r="5" class="ok pulse" style="--d: ${i * 0.25}s"/>
    ${txt(320, y, 'ok', 17, 'up')}
    ${txt(400, y, 'accent', 17, esc(escala))}`;
}).join('\n')}
  </g>`,
});

// ---------------------------------------------------------------- stack correndo

const animStack = (loop) => `
    .ticker { animation: ticker ${(loop / 45).toFixed(1)}s linear infinite; }
    @keyframes ticker { to { transform: translateX(-${loop}px); } }
    @media (prefers-reduced-motion: reduce) { .ticker { animation: none; } }`;

const stackSvg = (c) => {
  // Posições fixas por item: o laço fecha certinho mesmo se a fonte do visitante for outra.
  let x = 0;
  let itens = '';
  for (const s of stack) {
    itens += txt(x, 0, 'fg', 17, esc(s));
    x += s.length * 10.4 + 18;
    itens += txt(x, 0, 'muted', 17, '·');
    x += 28;
  }
  const loop = Math.round(x);
  const esq = 112;
  const dir = 704;

  return svg({
    h: 76,
    c,
    label: 'Stack: ' + stack.join(', ') + '.',
    animacoes: animStack(loop),
    defs: `<clipPath id="faixa"><rect x="${esq}" y="1" width="${dir - esq}" height="74"/></clipPath>
    <linearGradient id="some-esq"><stop offset="0" stop-color="${c.bg}"/><stop offset="1" stop-color="${c.bg}" stop-opacity="0"/></linearGradient>
    <linearGradient id="some-dir"><stop offset="0" stop-color="${c.bg}" stop-opacity="0"/><stop offset="1" stop-color="${c.bg}"/></linearGradient>`,
    corpo: `<g clip-path="url(#faixa)">
    <g class="ticker">
      <g transform="translate(${esq + 8} 46)">
        ${itens}
        <g transform="translate(${loop} 0)">${itens}</g>
      </g>
    </g>
  </g>
  <rect x="${esq}" y="1" width="28" height="74" fill="url(#some-esq)"/>
  <rect x="${dir - 48}" y="1" width="48" height="74" fill="url(#some-dir)"/>
  ${txt(28, 46, 'prompt', 17, 'stack')}
  ${txt(84, 46, 'muted', 17, '›')}`,
  });
};

// ---------------------------------------------------------------- saída

const paineis = { header, 'docker-ps': dockerPs, stack: stackSvg };

mkdirSync(ASSETS, { recursive: true });
for (const [nome, gerar] of Object.entries(paineis)) {
  for (const [tema, cores] of Object.entries(temas)) {
    const arquivo = join(ASSETS, `${nome}-${tema}.svg`);
    writeFileSync(arquivo, gerar(cores));
    console.log(`assets/${nome}-${tema}.svg`);
  }
}
