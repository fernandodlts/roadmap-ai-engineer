import type { Phase } from '../types/roadmap';

export const PHASES: Phase[] = [
  {
    id: 0,
    code: 'Fase 0',
    title: 'Fundamentos de Software & Revisão Ativa',
    weeksLabel: 'Semanas 1 a 3',
    hours: 36,
    isMilestoneTarget: false,
    objective:
      'Adaptada para quem já conhece um pouco de Python e SQL mas precisa retomar consistência diária, dominar Git/GitHub, terminal (incluindo Claude Code), Pandas e Web Scraping.',
  },
  {
    id: 1,
    code: 'Fase 1',
    title: 'Como a IA Generativa Funciona por Dentro',
    weeksLabel: 'Semana 4',
    hours: 12,
    isMilestoneTarget: false,
    objective:
      'Entender a mecânica real por trás dos modelos fundacionais: tipos de modelos, tokens, janela de contexto, embeddings, matemática da temperatura (Softmax/Euler) e causas de alucinação.',
  },
  {
    id: 2,
    code: 'Fase 2',
    title: 'APIs, Prompts e Projeto 1',
    weeksLabel: 'Semanas 5 a 7',
    hours: 36,
    isMilestoneTarget: false,
    objective:
      'Dominar chamadas de API (SDKs e LangChain), introdução ao LangGraph, Structured Outputs com Pydantic, padrão ReAct/Tool Calling, técnicas avançadas de prompt e construir o Projeto Prático 1.',
  },
  {
    id: 3,
    code: 'Fase 3',
    title: 'RAG (Retrieval-Augmented Generation) e Projeto 2',
    weeksLabel: 'Semanas 8 a 10',
    hours: 36,
    isMilestoneTarget: false,
    objective:
      'Construir pipelines completos de RAG em bancos vetoriais com chunking, embeddings, busca híbrida (vetorial + BM25), reranking (RRF e ColBERT), Agentic RAG e entregar o Projeto Prático 2.',
  },
  {
    id: 4,
    code: 'Fase 4',
    title: 'Agentes I: Arquitetura, Estado, Memória e Observabilidade',
    weeksLabel: 'Semanas 11 e 12',
    hours: 24,
    isMilestoneTarget: false,
    objective:
      'Aprofundar no loop agêntico (harness), grafos de estados, threads e checkpointers no LangGraph, observabilidade/tracing (Langfuse, LangSmith ou Opik) e memórias de curto/longo prazo.',
  },
  {
    id: 5,
    code: 'Fase 5',
    title: 'Agentes II: Protocolos, Multiagentes, Segurança e Projeto 3',
    weeksLabel: 'Semanas 13 a 15',
    hours: 36,
    isMilestoneTarget: true,
    objective:
      '🎯 MARCO PARA APLICAR ÀS VAGAS! Dominar MCP (Anthropic), A2A (Google), sistemas multiagênticos no LangGraph, Guardrails, Human-in-the-Loop (HITL), noções de FastAPI e lançar o Projeto Prático 3.',
  },
  {
    id: 6,
    code: 'Fase 6',
    title: 'Avaliação de Sistemas de IA (Evaluation) e Projeto 4',
    weeksLabel: 'Semanas 16 e 17',
    hours: 24,
    isMilestoneTarget: false,
    objective:
      'Estude enquanto aplica às vagas: métricas tradicionais vs LLM-as-a-Judge, Red Teaming, Golden Datasets vivos, framework Ragas, testes de regressão em CI e Benchmark do Agente (Projeto 4).',
  },
  {
    id: 7,
    code: 'Fase 7',
    title: 'Deploy, Produção e LLMOps e Projeto 5',
    weeksLabel: 'Semanas 18 e 19',
    hours: 24,
    isMilestoneTarget: false,
    objective:
      'Coloque seu agente em produção real: FastAPI completo, Docker essencial, CI/CD, Cloud (Azure/AWS/GCP), Rate Limit, Autenticação, Logs e comparativo estratégico Python vs No-Code (n8n).',
  },
];
