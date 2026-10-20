/**
 * Every visible string on the site, in English and Brazilian Portuguese.
 * Proper nouns, company names, package names and the recorded terminal
 * session stay as they are in both languages.
 */

export type Lang = 'en' | 'pt';

export const LANGS: readonly Lang[] = ['en', 'pt'];

/** BCP 47 tag written to `<html lang>`. */
export const HTML_LANG: Record<Lang, string> = { en: 'en', pt: 'pt-BR' };

export interface ProjectCopy {
  tag: string;
  descriptor: string;
  summary?: string;
  highlights?: string[];
  imageAlt: string;
}

export interface ExperienceCopy {
  engagement: string;
  period: string;
  points: string[];
}

const en = {
  meta: {
    title: 'Gabriel Andrade — Senior Full Stack Engineer',
    description:
      'Senior Full Stack Engineer | AI agents in production | React, TypeScript, Next.js, Python',
  },
  skipLink: 'Skip to main content',
  nav: {
    label: 'Primary',
    work: 'Work',
    harness: 'Harness',
    projects: 'Projects',
    experience: 'Experience',
    contact: 'Contact',
    cue: 'Work ↓',
  },
  language: {
    group: 'Language',
    en: 'English',
    pt: 'Português',
  },
  hero: {
    headline: [
      'Senior Full Stack Engineer',
      'AI agents in production',
      'React, TypeScript, Next.js, Python',
    ],
  },
  work: {
    label: 'Work',
    highlights: 'Highlights',
    projects: {
      'interactive-ai': {
        tag: 'Current',
        descriptor: 'Agent platform: React/Next.js and Python',
        highlights: [
          'Agent observability',
          'AI workflows',
          'In-product copilot',
        ],
        imageAlt: 'InteractiveAI platform, public site',
      },
      'smart-date-input': {
        tag: 'Open source',
        descriptor: 'Date and time input with natural-language parsing',
        summary: 'React and TypeScript component with keyboard navigation.',
        imageAlt:
          'smart-date-input parsing “next friday at 2pm” to Oct 16 at 14:00',
      },
      'mms-design-your-own': {
        tag: 'via Valtech',
        descriptor:
          'Frontend for the product configurator used to personalize M&M’s in 12 countries.',
        imageAlt: 'M&M’s Design Your Own color step',
      },
    } as Record<string, ProjectCopy>,
  },
  harness: {
    label: 'Agent harness',
    status: 'Still in progress',
    lede: 'A factory-style harness for coding agents. An orchestration system routes work between a lead agent and worker agents, and hidden evals grade what they ship.',
    note: 'Private repository while the project is still in progress.',
    facts: [
      'Orchestration: a lead agent assigns tasks to workers, each in its own process on a SQLite (WAL) message bus',
      'Hidden evals per task: a naive solution must fail and a correct one must pass',
      'Workspace tools stay inside the workdir; commands go through an argv allowlist, not a shell',
      'JSON trace per run; TypeScript on Bun with an Ink chat TUI',
    ],
    caption:
      'Recorded offline run without a model key; peers reply locally. Temp paths shortened.',
  },
  terminal: {
    replay: 'Replay',
    transcript: (title: string) => `${title} transcript`,
  },
  craft: {
    label: 'Open source',
    lede: 'React/TypeScript date and time input with natural-language parsing and keyboard navigation, published as an npm component.',
    keyboard: 'Keyboard',
    keysHint: 'Move through suggestions and select',
    caption: 'Running the published npm package.',
  },
  liveDemo: {
    live: 'Live component',
    fromNpm: 'From npm',
    placeholder: 'e.g. next friday 3pm',
    valueLabel: 'Value from onChange',
    inputLabel: 'Try smart-date-input',
    calendar: 'Open calendar',
    locale: 'en-US',
  },
  fourier: {
    label: 'Side project',
    title: 'Fourier series drawing',
    lede: 'An outline drawn with a Fourier series. Each axis is a chain of rotating circles, and the shape gets more accurate as terms are added.',
    stages: 'circles per axis',
    caption: 'Canvas 2D. 1,000 samples, up to 100 terms per axis.',
    canvasLabel:
      'A capybara outline traced by two chains of rotating circles, one per axis.',
    unit: 'circles per axis',
    replay: 'Replay',
  },
  experience: {
    label: 'Experience',
    items: {
      InteractiveAI: {
        engagement: 'Contract',
        period: 'Mar 2026 – Present',
        points: [
          'React/Next.js app and Python FastAPI services',
          'Agent observability, AI workflows, in-product copilot',
          'Security hardening of auth and secrets handling',
        ],
      },
      'Red Ventures': {
        engagement: 'Contract',
        period: 'May 2024 – Mar 2026',
        points: [
          'Millions of users/month',
          'Strata plan comparison tool',
          'Introduced trunk-based development for a 12-person team',
        ],
      },
      Valtech: {
        engagement: 'Contract',
        period: 'Sep 2021 – May 2024',
        points: [
          'Good Eggs: 7,000+ products, web (React/Next.js) and mobile (React Native)',
          "M&M's Design Your Own configurator in 12 countries",
          'Catalyst/LEAP design system cut site rollout times 40%',
        ],
      },
      Pacto: {
        engagement: 'Contract',
        period: 'Jul 2019 – Sep 2021',
        points: [
          '1,000+ daily users',
          'USD 1M+/day in payments',
          'Component library that cut dev time 35%',
        ],
      },
    } as Record<string, ExperienceCopy>,
  },
  about: {
    label: 'About',
    text: "Senior full stack engineer with seven years of experience in consumer platforms, e-commerce and financial services. I've led modernization projects, improved performance on high-traffic systems and mentored developers.",
  },
  contact: {
    label: 'Contact',
    lede: 'Email is the best way to reach me.',
  },
  footer: {
    label: 'Footer',
    email: 'Email',
  },
};

export type Messages = typeof en;

const pt: Messages = {
  meta: {
    title: 'Gabriel Andrade — Engenheiro Full Stack Sênior',
    description:
      'Engenheiro Full Stack Sênior | Agentes de IA em produção | React, TypeScript, Next.js, Python',
  },
  skipLink: 'Pular para o conteúdo principal',
  nav: {
    label: 'Principal',
    work: 'Trabalhos',
    harness: 'Harness',
    projects: 'Projetos',
    experience: 'Experiência',
    contact: 'Contato',
    cue: 'Trabalhos ↓',
  },
  language: {
    group: 'Idioma',
    en: 'English',
    pt: 'Português',
  },
  hero: {
    headline: [
      'Engenheiro Full Stack Sênior',
      'Agentes de IA em produção',
      'React, TypeScript, Next.js, Python',
    ],
  },
  work: {
    label: 'Trabalhos',
    highlights: 'Destaques',
    projects: {
      'interactive-ai': {
        tag: 'Atual',
        descriptor: 'Plataforma de agentes: React/Next.js e Python',
        highlights: [
          'Observabilidade de agentes',
          'Fluxos de IA',
          'Copiloto no produto',
        ],
        imageAlt: 'Plataforma InteractiveAI, site público',
      },
      'smart-date-input': {
        tag: 'Open source',
        descriptor: 'Campo de data e hora que entende linguagem natural',
        summary: 'Componente React e TypeScript com navegação por teclado.',
        imageAlt:
          'smart-date-input convertendo “next friday at 2pm” em Oct 16 at 14:00',
      },
      'mms-design-your-own': {
        tag: 'via Valtech',
        descriptor:
          'Frontend do configurador usado para personalizar M&M’s em 12 países.',
        imageAlt: 'Etapa de escolha de cores do M&M’s Design Your Own',
      },
    },
  },
  harness: {
    label: 'Harness de agentes',
    status: 'Em andamento',
    lede: 'Um harness no estilo fábrica para agentes de código. Um sistema de orquestração distribui o trabalho entre um agente líder e agentes workers, e evals ocultos avaliam o que eles entregam.',
    note: 'Repositório privado enquanto o projeto está em andamento.',
    facts: [
      'Orquestração: o agente líder atribui tarefas aos workers, cada um em seu próprio processo, sobre um barramento de mensagens em SQLite (WAL)',
      'Evals ocultos por tarefa: uma solução ingênua precisa falhar e a correta precisa passar',
      'As ferramentas do workspace ficam restritas ao diretório de trabalho; os comandos passam por uma allowlist de argv, sem shell',
      'Trace em JSON a cada execução; TypeScript com Bun e uma TUI de chat em Ink',
    ],
    caption:
      'Execução gravada offline, sem chave de modelo; os peers respondem localmente. Caminhos temporários encurtados.',
  },
  terminal: {
    replay: 'Repetir',
    transcript: (title: string) => `Transcrição: ${title}`,
  },
  craft: {
    label: 'Open source',
    lede: 'Campo de data e hora em React/TypeScript que entende linguagem natural e tem navegação por teclado, publicado como componente no npm.',
    keyboard: 'Teclado',
    keysHint: 'Navegue pelas sugestões e selecione',
    caption: 'Rodando o pacote publicado no npm.',
  },
  liveDemo: {
    live: 'Componente ao vivo',
    fromNpm: 'Direto do npm',
    placeholder: 'ex.: next friday 3pm',
    valueLabel: 'Valor do onChange',
    inputLabel: 'Teste o smart-date-input',
    calendar: 'Abrir calendário',
    locale: 'pt-BR',
  },
  fourier: {
    label: 'Projeto pessoal',
    title: 'Desenho com série de Fourier',
    lede: 'Um contorno desenhado com uma série de Fourier. Cada eixo é uma cadeia de círculos girando, e a forma fica mais precisa a cada termo adicionado.',
    stages: 'círculos por eixo',
    caption: 'Canvas 2D. 1.000 amostras, até 100 termos por eixo.',
    canvasLabel:
      'O contorno de uma capivara traçado por duas cadeias de círculos girando, uma por eixo.',
    unit: 'círculos por eixo',
    replay: 'Repetir',
  },
  experience: {
    label: 'Experiência',
    items: {
      InteractiveAI: {
        engagement: 'Contrato',
        period: 'Mar 2026 – Atual',
        points: [
          'App em React/Next.js e serviços em Python com FastAPI',
          'Observabilidade de agentes, fluxos de IA, copiloto no produto',
          'Reforço de segurança na autenticação e no tratamento de segredos',
        ],
      },
      'Red Ventures': {
        engagement: 'Contrato',
        period: 'Mai 2024 – Mar 2026',
        points: [
          'Milhões de usuários por mês',
          'Ferramenta de comparação de planos Strata',
          'Introduzi o trunk-based development em uma equipe de 12 pessoas',
        ],
      },
      Valtech: {
        engagement: 'Contrato',
        period: 'Set 2021 – Mai 2024',
        points: [
          'Good Eggs: mais de 7.000 produtos, web (React/Next.js) e mobile (React Native)',
          "Configurador M&M's Design Your Own em 12 países",
          'Design system Catalyst/LEAP reduziu em 40% o tempo de lançamento de sites',
        ],
      },
      Pacto: {
        engagement: 'Contrato',
        period: 'Jul 2019 – Set 2021',
        points: [
          'Mais de 1.000 usuários por dia',
          'Mais de US$ 1 milhão por dia em pagamentos',
          'Biblioteca de componentes que reduziu o tempo de desenvolvimento em 35%',
        ],
      },
    },
  },
  about: {
    label: 'Sobre',
    text: 'Engenheiro full stack sênior com sete anos de experiência em plataformas de consumo, e-commerce e serviços financeiros. Liderei projetos de modernização, melhorei a performance de sistemas de alto tráfego e fiz mentoria de outros desenvolvedores.',
  },
  contact: {
    label: 'Contato',
    lede: 'O melhor jeito de falar comigo é por e-mail.',
  },
  footer: {
    label: 'Rodapé',
    email: 'E-mail',
  },
};

export const MESSAGES: Record<Lang, Messages> = { en, pt };
