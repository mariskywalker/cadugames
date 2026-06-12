# Relatório de remoção — `cadu-games`

Executado em 9 de junho de 2026.

## Verificação pré-remoção

Busca em `app/`, `components/`, `lib/` e `context/` por imports ou referências aos alvos:

| Alvo | Imports ativos em código fonte |
|------|-------------------------------|
| `DesignShowcase` | Nenhum (apenas definição em `components/base/`) |
| `ValeMarcoTrail` | Nenhum |
| `ValeOrbitalAction` | Nenhum |
| `ProgressBar` | Apenas `DesignShowcase.tsx` (também removido) |
| Barrels `components/*/index.ts` | Nenhum `from '@/components/…'` sem arquivo explícito |

Rotas em `app/` **não foram alteradas**. `public/` **não foi alterado**.

---

## Arquivos removidos (10)

### Componentes inutilizados (4)

| Arquivo | Motivo |
|---------|--------|
| `components/base/DesignShowcase.tsx` | Fora do grafo de imports das rotas ativas |
| `components/life/vale/ValeMarcoTrail.tsx` | Substituído por `ValePalavrasHub` / `ValeFloatingLight` |
| `components/life/vale/ValeOrbitalAction.tsx` | Não referenciado pelo hub 3D ativo |
| `components/ui/ProgressBar.tsx` | Consumidor único era `DesignShowcase` |

### Barrels sem consumidores (6)

| Arquivo |
|---------|
| `components/base/index.ts` |
| `components/child/index.ts` |
| `components/layout/index.ts` |
| `components/parent/index.ts` |
| `components/profile/index.ts` |
| `components/ui/index.ts` |

---

## Pós-remoção

- Pasta `components/base/` ficou vazia (pode ser removida manualmente se desejado).
- `lib/theme.ts` permanece no repositório; era importado apenas por `DesignShowcase`. O tema visual ativo continua em `lib/theme.css` (via `app/globals.css`).
- `lib/valeScene.ts` exporta `valeMarcoPositions`, antes usado só por `ValeMarcoTrail`; export órfão opcional para limpeza futura.

## Não alterado (conforme regras)

- `app/**` (rotas)
- `public/**` (assets)
- `CLEANUP_CADU_GAMES.md` (análise anterior)
