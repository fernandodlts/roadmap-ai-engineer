import type {
  CareerTip,
  PracticePlatform,
  RoutineDay,
  StudySchedule,
  TimerPreset,
  WeekdayIndex,
} from '../types/roadmap';

export const DEFAULT_STUDY_SCHEDULE: StudySchedule = {
  mode: 'fixed',
  hoursPerDay: 2,
  studyDays: [1, 2, 3, 4, 5, 6], // Segunda a Sábado
};

export interface WeekdayMeta {
  index: WeekdayIndex;
  id: RoutineDay['id'];
  short: string;
  name: string;
}

/** Ordem amigável da semana brasileira (Segunda a Domingo) */
export const WEEKDAYS_META: WeekdayMeta[] = [
  { index: 1, id: 'seg', short: 'Seg', name: 'Segunda-feira' },
  { index: 2, id: 'ter', short: 'Ter', name: 'Terça-feira' },
  { index: 3, id: 'qua', short: 'Qua', name: 'Quarta-feira' },
  { index: 4, id: 'qui', short: 'Qui', name: 'Quinta-feira' },
  { index: 5, id: 'sex', short: 'Sex', name: 'Sexta-feira' },
  { index: 6, id: 'sab', short: 'Sáb', name: 'Sábado' },
  { index: 0, id: 'dom', short: 'Dom', name: 'Domingo' },
];

export const ROUTINE_DAYS: RoutineDay[] = [
  {
    id: 'seg',
    weekday: 1,
    short: 'Seg',
    name: 'Segunda-feira',
    focus: 'Revisão Ativa + Teoria + Prática em Código',
  },
  {
    id: 'ter',
    weekday: 2,
    short: 'Ter',
    name: 'Terça-feira',
    focus: 'Revisão Ativa + Teoria + Prática em Código',
  },
  {
    id: 'qua',
    weekday: 3,
    short: 'Qua',
    name: 'Quarta-feira',
    focus: 'Revisão Ativa + Teoria + Prática em Código',
  },
  {
    id: 'qui',
    weekday: 4,
    short: 'Qui',
    name: 'Quinta-feira',
    focus: 'Revisão Ativa + Teoria + Prática em Código',
  },
  {
    id: 'sex',
    weekday: 5,
    short: 'Sex',
    name: 'Sexta-feira',
    focus: 'Projeto de Portfólio (GitHub)',
  },
  {
    id: 'sab',
    weekday: 6,
    short: 'Sáb',
    name: 'Sábado',
    focus: 'Revisão de Código + Post Técnico LinkedIn',
  },
  {
    id: 'dom',
    weekday: 0,
    short: 'Dom',
    name: 'Domingo',
    focus: 'Sessão Extra / Revisão Leve ou Leitura Técnica',
  },
];

export const TIMER_PRESETS: TimerPreset[] = [
  {
    id: 'review',
    label: '15 min — Revisão Ativa (Python/SQL)',
    shortLabel: '15m Revisão',
    minutes: 15,
    desc: 'Reescreva funções, listas, dicts ou queries SQL sem consulta antes de começar.',
  },
  {
    id: 'theory',
    label: '30 min — Teoria Focada',
    shortLabel: '30m Teoria',
    minutes: 30,
    desc: 'Assista ao vídeo/aula ou leia a documentação oficial fazendo anotações.',
  },
  {
    id: 'practice',
    label: '75 min — Mão na Massa (Código)',
    shortLabel: '75m Código',
    minutes: 75,
    desc: 'Implemente no VS Code/Terminal e valide com exemplos reais.',
  },
  {
    id: 'pomodoro',
    label: '25 min — Pomodoro',
    shortLabel: '25m Pomodoro',
    minutes: 25,
    desc: 'Bloco rápido de foco absoluto com 5 minutos de pausa ao final.',
  },
];

export const PRACTICE_PLATFORMS: PracticePlatform[] = [
  {
    id: 'leetcode-py',
    name: 'LeetCode Python',
    badge: 'Python',
    description: 'Centenas de problemas de lógica e estruturas de dados em Python.',
    url: 'https://leetcode.com/problemset/',
  },
  {
    id: 'sqlbolt',
    name: 'SQLBolt',
    badge: 'SQL',
    description: 'Lições interativas de SQL direto no navegador.',
    url: 'https://sqlbolt.com/',
  },
  {
    id: 'leetcode-sql',
    name: 'LeetCode SQL 50',
    badge: 'SQL',
    description: '50 problemas reais de entrevistas técnicas.',
    url: 'https://leetcode.com/studyplan/top-sql-50/',
  },
  {
    id: 'stratascratch',
    name: 'StrataScratch',
    badge: 'Python & SQL',
    description: 'Desafios reais de entrevistas em Dados & IA.',
    url: 'https://www.stratascratch.com/',
  },
];

export const CAREER_TIPS: CareerTip[] = [
  {
    id: 'tip-1',
    title: '1. LinkedIn sem se rotular iniciante',
    accent: 'cyan',
    body: 'Todo sábado, publique prints dos seus projetos e explique conceitos técnicos (tokenização, BM25, MCP, LangGraph). Evite escrever "estou começando do zero" — mostre postura de quem constrói soluções reais.',
  },
  {
    id: 'tip-2',
    title: '2. Networking Direcionado',
    accent: 'indigo',
    body: 'Conecte-se semanalmente com Tech Recruiters, Tech Leads e AI Engineers no LinkedIn. Quando publicar seus 3 projetos no GitHub, seu perfil já estará no radar de quem contrata.',
  },
  {
    id: 'tip-3',
    title: '3. Aplique na Fase 5 (Sem Medo)',
    accent: 'emerald',
    body: 'Não espere dominar 100% do roadmap para começar a se candidatar. Ao concluir até a Fase 5 + Projetos 1, 2 e 3, comece a aplicar imediatamente enquanto estuda Avaliação (Fase 6) e Deploy (Fase 7).',
  },
  {
    id: 'tip-4',
    title: '4. Python/LangGraph vs No-Code (n8n)',
    accent: 'amber',
    body: 'Ferramentas no-code como n8n são ótimas para empreender e vender automações próprias, mas vagas corporativas em AI Engineering exigem código em ',
    highlight: 'Python, RAG, LangGraph, MCP e FastAPI.',
  },
];
