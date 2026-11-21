import type { RoadmapWeek } from '../types/roadmap';

export const WEEKS: RoadmapWeek[] = [
  // FASE 0 (36h)
  {
    week: 1,
    phaseId: 0,
    title: 'Python na Prática & Terminal (Anti-Esquecimento)',
    tasks: [
      {
        id: 'w1-t1',
        hours: 6,
        tag: 'Python',
        text: 'Revisão prática de Python (funções, listas, dicts, POO básica, ambientes virtuais venv, requisições HTTP)',
      },
      {
        id: 'w1-t2',
        hours: 4,
        tag: 'Terminal',
        text: 'Navegação no terminal (diretórios, permissões, variáveis de ambiente e uso do Claude Code no terminal)',
      },
      {
        id: 'w1-t3',
        hours: 2,
        tag: 'Prática',
        text: 'Mini-desafio prático sem copiar código (script CLI em Python)',
      },
    ],
  },
  {
    week: 2,
    phaseId: 0,
    title: 'Git, GitHub e SQL Essencial',
    tasks: [
      {
        id: 'w2-t1',
        hours: 6,
        tag: 'Git/GitHub',
        text: 'Git e GitHub na prática (init, branch, commit, merge, Pull Requests e README profissional)',
      },
      {
        id: 'w2-t2',
        hours: 6,
        tag: 'SQL',
        text: 'Revisão de SQL essencial (SELECT, WHERE, JOIN, UPDATE, DELETE e leitura crítica de queries)',
      },
    ],
  },
  {
    week: 3,
    phaseId: 0,
    title: 'Pandas, Web Scraping e Primeiro Post Técnico',
    tasks: [
      {
        id: 'w3-t1',
        hours: 6,
        tag: 'Dados',
        text: 'Manipulação de dados com Pandas (DataFrames, limpeza e leitura de CSV/JSON)',
      },
      {
        id: 'w3-t2',
        hours: 4,
        tag: 'Scraping',
        text: 'Web Scraping prático com BeautifulSoup e Playwright/Selenium (1 dia intensivo)',
      },
      {
        id: 'w3-t3',
        hours: 2,
        tag: 'LinkedIn',
        text: 'Revisão geral + primeiro post técnico no LinkedIn',
      },
    ],
  },

  // FASE 1 (12h)
  {
    week: 4,
    phaseId: 1,
    title: 'Por Dentro dos LLMs: Tokens, Embeddings e Temperatura',
    tasks: [
      { id: 'w4-t1', hours: 3, tag: 'Modelos', text: 'Diferenças entre LLM, SLM, LRM e VLM' },
      { id: 'w4-t2', hours: 3, tag: 'Tokens', text: 'Tokens, tokenização e janela de contexto' },
      { id: 'w4-t3', hours: 3, tag: 'Vetores', text: 'Embeddings (representação vetorial semântica)' },
      {
        id: 'w4-t4',
        hours: 3,
        tag: 'Fundamentos',
        text: 'Parâmetro de Temperatura (função Softmax e número de Euler) e por que ocorrem alucinações',
      },
    ],
  },

  // FASE 2 (36h)
  {
    week: 5,
    phaseId: 2,
    title: 'SDKs de LLMs, LangChain e Início no LangGraph',
    tasks: [
      {
        id: 'w5-t1',
        hours: 4,
        tag: 'APIs',
        text: 'Chamadas de API via SDKs (OpenAI, Anthropic, Vercel SDK)',
      },
      {
        id: 'w5-t2',
        hours: 4,
        tag: 'LangChain',
        text: 'Padronização com langchain-openai / langchain-anthropic (.invoke)',
      },
      {
        id: 'w5-t3',
        hours: 4,
        tag: 'LangGraph',
        text: 'Introdução ao LangGraph (conceitos iniciais de nós e arestas)',
      },
    ],
  },
  {
    week: 6,
    phaseId: 2,
    title: 'Structured Outputs, ReAct, Tool Calling e Prompting',
    tasks: [
      {
        id: 'w6-t1',
        hours: 4,
        tag: 'Pydantic',
        text: 'Structured Outputs (JSON tipado / Pydantic)',
      },
      {
        id: 'w6-t2',
        hours: 4,
        tag: 'Tools',
        text: 'Padrão ReAct e Tool Calling (como o LLM solicita ferramentas)',
      },
      {
        id: 'w6-t3',
        hours: 4,
        tag: 'Prompts',
        text: 'Técnicas de Prompt (Zero-shot, Few-shot, Chain of Thought, Tree of Thoughts, Chain of Verification)',
      },
    ],
  },
  {
    week: 7,
    phaseId: 2,
    title: 'Projeto Prático 1 — Extrator Inteligente de Contratos',
    isProjectWeek: true,
    tasks: [
      {
        id: 'w7-t1',
        hours: 8,
        tag: 'Projeto 1',
        text: 'Projeto Prático 1 — Extrator Inteligente de Contratos (enviar PDF e retornar JSON estruturado com partes, datas, valores, obrigações e riscos)',
      },
      {
        id: 'w7-t2',
        hours: 4,
        tag: 'Portfólio',
        text: 'Criar variação original do tema com ajuda de IA + documentação no GitHub e post com prints no LinkedIn',
      },
    ],
  },

  // FASE 3 (36h)
  {
    week: 8,
    phaseId: 3,
    title: 'Arquitetura RAG, Chunking e Banco Vetorial',
    tasks: [
      { id: 'w8-t1', hours: 4, tag: 'RAG', text: 'Arquitetura RAG e bancos de dados vetoriais' },
      {
        id: 'w8-t2',
        hours: 4,
        tag: 'Indexação',
        text: 'Pipeline de indexação, estratégias de chunking e geração de embeddings',
      },
      {
        id: 'w8-t3',
        hours: 4,
        tag: 'Recuperação',
        text: 'Recuperação por similaridade de cosseno e montagem do prompt de geração',
      },
    ],
  },
  {
    week: 9,
    phaseId: 3,
    title: 'Busca Híbrida (BM25), Reranking e Agentic RAG',
    tasks: [
      {
        id: 'w9-t1',
        hours: 4,
        tag: 'BM25',
        text: 'Busca híbrida (vetorial + palavras-chave com BM25)',
      },
      {
        id: 'w9-t2',
        hours: 4,
        tag: 'Reranking',
        text: 'Reranking (algoritmo RRF) e Late Interaction (ColBERT)',
      },
      {
        id: 'w9-t3',
        hours: 4,
        tag: 'Agentic RAG',
        text: 'Agentic RAG (reformulações de busca autônomas; nota: deixar GraphRAG/Neo4j para depois)',
      },
    ],
  },
  {
    week: 10,
    phaseId: 3,
    title: 'Projeto Prático 2 — Assistente de Documentação com RAG',
    isProjectWeek: true,
    tasks: [
      {
        id: 'w10-t1',
        hours: 8,
        tag: 'Projeto 2',
        text: 'Projeto Prático 2 — Assistente de Documentação com RAG (indexar docs de teste e responder citando fontes via metadados)',
      },
      {
        id: 'w10-t2',
        hours: 4,
        tag: 'Portfólio',
        text: 'Publicação no GitHub com README claro e post técnico no LinkedIn',
      },
    ],
  },

  // FASE 4 (24h)
  {
    week: 11,
    phaseId: 4,
    title: 'Loop Agêntico, Grafos de Estado e Checkpointers',
    tasks: [
      { id: 'w11-t1', hours: 4, tag: 'Agentes', text: 'Loop agêntico (harness) em profundidade' },
      { id: 'w11-t2', hours: 4, tag: 'LangGraph', text: 'Grafos de estados no LangGraph' },
      {
        id: 'w11-t3',
        hours: 4,
        tag: 'Persistência',
        text: 'Threads e Checkpointers (persistência de conversas e estado)',
      },
    ],
  },
  {
    week: 12,
    phaseId: 4,
    title: 'Observabilidade (Tracing) e Gestão de Memória',
    tasks: [
      {
        id: 'w12-t1',
        hours: 6,
        tag: 'Tracing',
        text: 'Observabilidade e Tracing com Langfuse, LangSmith ou Opik',
      },
      {
        id: 'w12-t2',
        hours: 6,
        tag: 'Memória',
        text: 'Gestão de Memória em agentes: curto e longo prazo (semântica, episódica e procedural)',
      },
    ],
  },

  // FASE 5 (36h) — MARCO PARA VAGAS
  {
    week: 13,
    phaseId: 5,
    title: 'Protocolos MCP, A2A e Sistemas Multiagênticos',
    tasks: [
      { id: 'w13-t1', hours: 4, tag: 'MCP', text: 'Protocolo MCP (Model Context Protocol da Anthropic)' },
      { id: 'w13-t2', hours: 4, tag: 'A2A', text: 'Protocolo A2A (Agent-to-Agent do Google)' },
      {
        id: 'w13-t3',
        hours: 4,
        tag: 'Multiagentes',
        text: 'Sistemas Multiagênticos no LangGraph (cada nó como agente especializado)',
      },
    ],
  },
  {
    week: 14,
    phaseId: 5,
    title: 'Guardrails, Human-in-the-Loop (HITL) e Base de FastAPI',
    tasks: [
      {
        id: 'w14-t1',
        hours: 5,
        tag: 'Segurança',
        text: 'Guardrails determinísticos (regex) e não determinísticos (LLMs contra prompt leaking e desvios de comportamento)',
      },
      {
        id: 'w14-t2',
        hours: 4,
        tag: 'HITL',
        text: 'Fluxos Human-in-the-Loop (HITL) para aprovação humana',
      },
      {
        id: 'w14-t3',
        hours: 3,
        tag: 'FastAPI',
        text: 'Noções iniciais de FastAPI para expor seu agente',
      },
    ],
  },
  {
    week: 15,
    phaseId: 5,
    title: 'Projeto Prático 3 + Início das Aplicações para Vagas 🎯',
    isProjectWeek: true,
    isMilestoneWeek: true,
    tasks: [
      {
        id: 'w15-t1',
        hours: 8,
        tag: 'Projeto 3',
        text: 'Projeto Prático 3 — Agente de Atendimento e Resolução de Problemas (consulta RAG + ferramentas + aprovação humana/HITL para ações sensíveis)',
      },
      {
        id: 'w15-t2',
        hours: 4,
        tag: 'Vagas 🎯',
        text: 'Revisão do portfólio (3 projetos no GitHub), ajustes no currículo/LinkedIn e início das aplicações para vagas de AI Engineer',
      },
    ],
  },

  // FASE 6 (24h)
  {
    week: 16,
    phaseId: 6,
    title: 'Métricas, LLM-as-a-Judge, Red Teaming e Ragas',
    tasks: [
      {
        id: 'w16-t1',
        hours: 4,
        tag: 'Métricas',
        text: 'Métricas tradicionais (acurácia, F1-score, precision, recall) vs LLM-as-a-Judge',
      },
      {
        id: 'w16-t2',
        hours: 4,
        tag: 'Segurança',
        text: 'Red Teaming (testes adversariais de vulnerabilidades e prompt leaking)',
      },
      {
        id: 'w16-t3',
        hours: 4,
        tag: 'Ragas',
        text: 'Construção de Golden Datasets vivos e framework Ragas',
      },
    ],
  },
  {
    week: 17,
    phaseId: 6,
    title: 'Regressão em CI e Projeto Prático 4 (Benchmark)',
    isProjectWeek: true,
    tasks: [
      { id: 'w17-t1', hours: 4, tag: 'CI/Testes', text: 'Testes de regressão em CI' },
      {
        id: 'w17-t2',
        hours: 8,
        tag: 'Projeto 4',
        text: 'Projeto Prático 4 — Benchmark do Agente Anterior (avaliar o Projeto 3 com Golden Dataset, Ragas, LLM-as-a-Judge e testes adversariais)',
      },
    ],
  },

  // FASE 7 (24h)
  {
    week: 18,
    phaseId: 7,
    title: 'FastAPI, Docker Essencial, CI/CD e Cloud',
    tasks: [
      {
        id: 'w18-t1',
        hours: 4,
        tag: 'FastAPI',
        text: 'FastAPI na prática (routes, paths, models e estrutura de pastas)',
      },
      {
        id: 'w18-t2',
        hours: 4,
        tag: 'Docker',
        text: 'Docker essencial (criar Dockerfile e containerizar sua API — foco prático de 2 a 3 dias)',
      },
      {
        id: 'w18-t3',
        hours: 4,
        tag: 'LLMOps',
        text: 'Fundamentos de CI/CD, Cloud (Azure, AWS ou GCP), Rate Limit, Autenticação e Logs',
      },
    ],
  },
  {
    week: 19,
    phaseId: 7,
    title: 'Projeto Prático 5 (Produção) e Visão Python vs No-Code',
    isProjectWeek: true,
    tasks: [
      {
        id: 'w19-t1',
        hours: 10,
        tag: 'Projeto 5',
        text: 'Projeto Prático 5 — Agente em Produção (API FastAPI em container Docker na nuvem com autenticação, rate limit, logs e CI/CD)',
      },
      {
        id: 'w19-t2',
        hours: 2,
        tag: 'Estratégia',
        text: 'Revisão de arquitetura + comparativo Python em produção vs No-Code (n8n para empreender)',
      },
    ],
  },
];
