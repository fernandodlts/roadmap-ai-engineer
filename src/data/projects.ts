import type { Project, ProjectStep } from '../types/roadmap';

export const PROJECTS: Project[] = [
  {
    id: 'proj-1',
    number: 1,
    phaseId: 2,
    week: 7,
    requiredForJobs: true,
    title: 'Extrator Inteligente de Contratos',
    subtitle: 'APIs, Structured Outputs (JSON tipado / Pydantic) e Engenharia de Prompt',
    description:
      'Aplicação que recebe o PDF de um contrato e retorna em um painel visual um JSON fortemente tipado contendo partes envolvidas, datas, valores, obrigações e análise de riscos. Use IA para criar uma variação original (ex.: extrator de editais, notas fiscais ou apólices) usando apenas conceitos até a Fase 2.',
  },
  {
    id: 'proj-2',
    number: 2,
    phaseId: 3,
    week: 10,
    requiredForJobs: true,
    title: 'Assistente de Documentação com RAG',
    subtitle: 'Banco Vetorial, Busca Híbrida (BM25 + Vetorial), Reranking e Metadados',
    description:
      'Sistema RAG que indexa uma coleção de documentos técnicos ou corporativos de teste (que você pode gerar com o Claude) e responde perguntas complexas citando exatamente o documento e a seção de origem através de metadados.',
  },
  {
    id: 'proj-3',
    number: 3,
    phaseId: 5,
    week: 15,
    requiredForJobs: true,
    title: 'Agente de Atendimento e Resolução de Problemas (HITL)',
    subtitle: 'LangGraph, RAG + Tools, Guardrails, MCP/Multiagentes e Aprovação Humana',
    description:
      'Agente completo (ex.: suporte de TI / Service Desk) que consulta a base de conhecimento RAG, aciona ferramentas externas, bloqueia desvios com Guardrails e exige aprovação humana (Human-in-the-Loop) antes de ações sensíveis como restauração de fábrica ou exclusão de dados.',
  },
  {
    id: 'proj-4',
    number: 4,
    phaseId: 6,
    week: 17,
    requiredForJobs: false,
    title: 'Benchmark Completo do Agente Anterior',
    subtitle: 'Golden Dataset, Framework Ragas, LLM-as-a-Judge, Red Teaming e CI',
    description:
      'Suite de avaliação rigorosa aplicada sobre o Projeto 3: construa um Golden Dataset de casos reais/fictícios, calcule métricas de fidelidade e relevância no Ragas, configure LLM-as-a-Judge, execute ataques adversariais (Red Teaming) e rode testes de regressão automatizados.',
  },
  {
    id: 'proj-5',
    number: 5,
    phaseId: 7,
    week: 19,
    requiredForJobs: false,
    title: 'Agente de IA em Produção (Cloud + Docker + CI/CD)',
    subtitle: 'FastAPI, Containerização Docker, Autenticação, Rate Limit, Logs e Nuvem',
    description:
      'Transforme o seu agente em um serviço web de nível corporativo: API REST estruturada em FastAPI, empacotada em container Docker, publicada em nuvem (Azure, AWS ou GCP) com autenticação, rate limit, logs estruturados e deploy contínuo (CI/CD).',
  },
];

export const PROJECT_STEPS: ProjectStep[] = [
  { key: 'code', label: '1. Código funcionando e testado localmente' },
  {
    key: 'variation',
    label: '2. Variação original do tema para se diferenciar de projetos genéricos',
  },
  {
    key: 'github',
    label: '3. Repositório no GitHub com README claro, arquitetura e prints',
  },
  {
    key: 'linkedin',
    label: '4. Post técnico publicado no LinkedIn explicando a solução',
  },
];
