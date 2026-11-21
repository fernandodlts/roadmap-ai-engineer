import { useMemo, useState } from 'react';
import { Check, ExternalLink, Search, Star, X } from 'lucide-react';
import { PHASES, RESOURCES, RESOURCE_TYPES } from '../../data';
import type { ResourceType, RoadmapState } from '../../types/roadmap';

interface LibraryTabProps {
  state: RoadmapState;
  onToggleStudied: (resId: string) => void;
  onToggleFavorite: (resId: string) => void;
}

const TYPE_COLORS: Record<ResourceType, string> = {
  'Vídeo / Curso': 'bg-rose-500/15 text-rose-300 border-rose-500/30',
  'Guia / Doc': 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
  'GitHub / Arquivo': 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  Livro: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  'Plataforma / Fonte': 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
};

export function LibraryTab({ state, onToggleStudied, onToggleFavorite }: LibraryTabProps) {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'Todos' | ResourceType>('Todos');
  const [phaseFilter, setPhaseFilter] = useState<string>('Todas');
  const [onlyFavorites, setOnlyFavorites] = useState(false);

  const phaseOptions = useMemo(() => ['Todas', ...PHASES.map((p) => p.code)], []);

  const studiedCount = useMemo(
    () => RESOURCES.filter((r) => Boolean(state.studiedResources[r.id])).length,
    [state.studiedResources],
  );

  const favCount = useMemo(
    () => RESOURCES.filter((r) => Boolean(state.favoriteResources[r.id])).length,
    [state.favoriteResources],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return RESOURCES.filter((res) => {
      if (typeFilter !== 'Todos' && res.type !== typeFilter) return false;
      if (phaseFilter !== 'Todas' && `Fase ${res.phaseId}` !== phaseFilter) return false;
      if (onlyFavorites && !state.favoriteResources[res.id]) return false;
      if (q) {
        return (
          res.title.toLowerCase().includes(q) ||
          res.source.toLowerCase().includes(q) ||
          res.type.toLowerCase().includes(q) ||
          `fase ${res.phaseId}`.includes(q)
        );
      }
      return true;
    });
  }, [search, typeFilter, phaseFilter, onlyFavorites, state.favoriteResources]);

  const hasActiveFilters =
    search.trim().length > 0 ||
    typeFilter !== 'Todos' ||
    phaseFilter !== 'Todas' ||
    onlyFavorites;

  const resetFilters = () => {
    setSearch('');
    setTypeFilter('Todos');
    setPhaseFilter('Todas');
    setOnlyFavorites(false);
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <section className="rounded-2xl p-5 sm:p-6 bg-slate-900/90 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
            Biblioteca de Estudos
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-0.5">
            Onde Estudar Cada Tópico do Roadmap
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Vídeos, guias interativos, repositórios GitHub, livros e cursos gratuitos organizados
            por fase.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
            <div className="text-base font-extrabold text-emerald-400">
              {studiedCount}/{RESOURCES.length}
            </div>
            <div className="text-[11px] text-slate-400">Estudados</div>
          </div>
          <div className="px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
            <div className="text-base font-extrabold text-amber-400">{favCount}</div>
            <div className="text-[11px] text-slate-400">Favoritos</div>
          </div>
        </div>
      </section>

      {/* Filtros e Busca */}
      <section className="rounded-2xl p-4 sm:p-5 bg-slate-900/90 border border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nome, autor ou tecnologia (ex.: Karpathy, BM25, LangGraph, Ragas, FastAPI)..."
              className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:outline-none text-xs sm:text-sm text-slate-100 placeholder-slate-500"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                aria-label="Limpar busca"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => setOnlyFavorites((prev) => !prev)}
            className={`inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold border transition-colors shrink-0 cursor-pointer ${
              onlyFavorites
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${onlyFavorites ? 'fill-amber-300' : ''}`} />
            <span>Somente Favoritos ({favCount})</span>
          </button>
        </div>

        {/* Filtro por Tipo */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-semibold text-slate-400 mr-1">Tipo:</span>
          {RESOURCE_TYPES.map((tp) => (
            <button
              key={tp}
              type="button"
              onClick={() => setTypeFilter(tp)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                typeFilter === tp
                  ? 'bg-indigo-600 text-white border-indigo-500'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              {tp}
            </button>
          ))}
        </div>

        {/* Filtro por Fase */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-400 mr-1">Fase:</span>
            {phaseOptions.map((ph) => (
              <button
                key={ph}
                type="button"
                onClick={() => setPhaseFilter(ph)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                  phaseFilter === ph
                    ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                {ph}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>
              Mostrando <strong className="text-slate-200">{filtered.length}</strong> de{' '}
              {RESOURCES.length}
            </span>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="text-cyan-400 hover:text-cyan-300 font-semibold cursor-pointer"
              >
                Limpar
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Grade de Recursos */}
      {filtered.length === 0 ? (
        <div className="p-10 rounded-2xl bg-slate-900/70 border border-slate-800 text-center space-y-3">
          <p className="text-sm font-bold text-slate-300">
            Nenhum recurso encontrado com esses filtros.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors cursor-pointer"
          >
            Limpar filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((res) => {
            const isStudied = Boolean(state.studiedResources[res.id]);
            const isFav = Boolean(state.favoriteResources[res.id]);
            const badgeCls = TYPE_COLORS[res.type];

            return (
              <article
                key={res.id}
                className={`rounded-2xl p-4 sm:p-5 bg-slate-900/90 border flex flex-col justify-between gap-4 transition-colors ${
                  isStudied
                    ? 'border-emerald-500/40 bg-emerald-950/10'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                        Fase {res.phaseId}
                      </span>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${badgeCls}`}>
                        {res.type}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => onToggleFavorite(res.id)}
                      title={isFav ? 'Remover dos favoritos' : 'Salvar nos favoritos'}
                      aria-label={isFav ? 'Remover dos favoritos' : 'Salvar nos favoritos'}
                      className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                        isFav
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : 'bg-slate-950 text-slate-500 border-slate-800 hover:text-amber-300'
                      }`}
                    >
                      <Star className={`w-3.5 h-3.5 ${isFav ? 'fill-amber-300' : ''}`} />
                    </button>
                  </div>

                  <div>
                    <h3
                      className={`text-sm font-bold leading-snug ${
                        isStudied ? 'text-slate-300' : 'text-white'
                      }`}
                    >
                      {res.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">{res.source}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-800/80">
                  <button
                    type="button"
                    onClick={() => onToggleStudied(res.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                      isStudied
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                    }`}
                  >
                    {isStudied && <Check className="w-3.5 h-3.5" />}
                    <span>{isStudied ? 'Estudado' : 'Marcar estudado'}</span>
                  </button>

                  <a
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 transition-colors"
                  >
                    <span>Acessar</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
