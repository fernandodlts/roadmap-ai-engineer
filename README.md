# AI Engineer Roadmap

Site pessoal interativo para acompanhar o plano de estudos rumo à sua vaga como **AI Engineer** (8 fases, 19 semanas, 228 horas totais, 5 projetos práticos e ritmo personalizável).

## Stack

- **React 19** + **TypeScript**
- **Vite** + **Tailwind CSS v4**
- **Lucide Icons** + **Vitest** (testes unitários de cálculo de datas e persistência)
- Persistência em `localStorage` + backup manual (Exportar / Importar JSON)

## Funcionalidades

- **Painel Geral**: acompanhamento em tempo real da **Meta 1 (Marco de Vagas — Fases 0 a 5, 180h)** e **Meta 2 (Domínio Completo — Fases 0 a 7, 228h)** com cálculo dinâmico de horas, dias (`2h/dia`), semanas (`12h/sem`) e data prevista pulando domingos.
- **Trilha por Fase**: navegação por sub-abas (Fase 0 a Fase 7), checkboxes por tópico ou semana inteira, materiais recomendados expansíveis e anotações pessoais salvas automaticamente.
- **Projetos & Portfólio**: checklist de 4 marcos por projeto (3 obrigatórios para aplicar + 2 diferenciais pós-Fase 5) e link para o repositório GitHub.
- **Biblioteca de Estudos**: 41 recursos curados com busca instantânea, filtro por tipo/fase/favoritos e marcação de concluído.
- **Rotina & Timer**: cronômetro sincronizado com relógio real (não atrasa em segundo plano), **Revisão Espaçada (D+1, D+7, D+21)** baseada nos tópicos concluídos do roadmap, **gerador de prompt de revisão ativa** para Claude/ChatGPT + atalhos para plataformas reais (LeetCode Python, SQLBolt, LeetCode SQL 50, StrataScratch), tracker semanal adaptável e estratégia de carreira.
- **Personalizar Meu Ritmo**: tela dedicada (`?tab=ritmo`) para configurar horas/dia (`0,5h` a `12h`), dias exatos da semana (Seg–Dom) ou ativar o modo **No meu ritmo (sem dias fixos)** com prévia instantânea nas metas.

## Comandos locais

```bash
npm install
npm run dev      # servidor local de desenvolvimento
npm test         # executa testes unitários (Vitest)
npm run build    # valida TypeScript e gera bundle de produção em dist/
npm run preview  # pré-visualiza o build de produção localmente
```

## Deploy gratuito na Vercel via GitHub

1. Inicialize o repositório e suba o código para o GitHub:
   ```bash
   git init
   git add .
   git commit -m "feat: migra roadmap AI Engineer 2026 para React + Vite + TS"
   git branch -M main
   git remote add origin https://github.com/<seu-usuario>/roadmap-ai-engineer.git
   git push -u origin main
   ```
2. Acesse [vercel.com/new](https://vercel.com/new), conecte o repositório do GitHub e clique em **Deploy** (a Vercel detecta automaticamente Vite via `vercel.json` com build `npm run build` e saída `dist/`).
