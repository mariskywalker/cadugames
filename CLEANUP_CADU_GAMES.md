# Limpeza — `cadu-games`

Relatório estático gerado em 9 de junho de 2026.

**Escopo analisado:** `app/`, `components/`, `lib/`  
**Ignorado:** `public/`, `models/`, `backgrounds/`, `node_modules/`, `.next/`

**Método:** grafo de imports a partir de `app/**/page.tsx` e `app/**/layout.tsx`, incluindo `import()` dinâmico (ex.: `ValePalavrasHub`, `GlbIcon`). Páginas órfãs = rotas sem `href` em `lib/navigation.ts` nem em `<Link href="…">` / `href:` no código alcançável. Imports mortos = símbolos importados de `@/` ou caminhos relativos que não aparecem no corpo do arquivo (heurística em todos os `.ts`/`.tsx` de `app`, `components` e `lib`).

**Inventário:** 71 arquivos fonte no escopo (`app` 12 · `components` 47 · `lib` 11 · `context` 1 usado só como ponte via `app/layout.tsx`). **60 alcançáveis** · **11 inalcançáveis**.

---

## 1. Componentes nunca utilizados

Arquivos em `components/` que **não entram** no grafo de imports a partir das páginas e layouts do App Router:

| Arquivo | Observação |
|---------|------------|
| `components/base/DesignShowcase.tsx` | Showcase de design system; nenhuma rota ou componente ativo o importa. |
| `components/life/vale/ValeMarcoTrail.tsx` | Trilha SVG de marcos sobre o Vale; substituída pelo fluxo atual (`ValePalavrasHub` + `ValeFloatingLight`). |
| `components/life/vale/ValeOrbitalAction.tsx` | Ação orbital no hub 3D; não referenciado por `ValePalavrasHub` nem por outro arquivo ativo. |
| `components/ui/ProgressBar.tsx` | Usado apenas por `DesignShowcase.tsx` (também inalcançável). |

### Barrels `index.ts` sem consumidores

Nenhum arquivo do projeto importa estes barrels (`from '@/components/…'`); todos os consumos são por caminho direto ao `.tsx`:

- `components/base/index.ts`
- `components/child/index.ts`
- `components/layout/index.ts`
- `components/parent/index.ts`
- `components/profile/index.ts`
- `components/ui/index.ts`

---

## 2. Páginas órfãs

Rotas existentes no App Router **sem link** na navegação (`lib/navigation.ts`, `ParentTopNav`, `ParentBottomNav`, `BottomNavigation`) nem em qualquer `href` no código alcançável:

| Rota | Arquivo | Situação |
|------|---------|----------|
| `/parent/profile` | `app/parent/profile/page.tsx` | Renderiza `SkillProgressList`, mas a rota não aparece em `parentNavigation`, `parentTopNavigation`, `ParentBottomNav` nem em links de outras telas. Documentada apenas no `README.md`. |

### Páginas com navegação ativa (referência)

| Rota | Arquivo |
|------|---------|
| `/` | `app/page.tsx` |
| `/child/life` | `app/child/life/page.tsx` |
| `/child/life/[dimension]` | `app/child/life/[dimension]/page.tsx` (ex.: `/child/life/comunicacao`) |
| `/child/diary` | `app/child/diary/page.tsx` |
| `/parent/dashboard` | `app/parent/dashboard/page.tsx` |
| `/parent/journey` | `app/parent/journey/page.tsx` |
| `/parent/report` | `app/parent/report/page.tsx` |
| `/parent/therapist` | `app/parent/therapist/page.tsx` |

---

## 3. Imports mortos

**Nenhum import morto identificado** em `app/`, `components/` ou `lib/`.

Verificação em todos os 70 arquivos `.ts`/`.tsx` dessas pastas: cada símbolo importado de `@/…` ou de caminho relativo aparece no corpo do arquivo (após remoção de linhas `import` e de comentários/strings).

> `tsconfig.json` não habilita `noUnusedLocals` / `noUnusedParameters`, e o projeto não possui `eslint.config.*` configurado; a conclusão acima veio da análise estática descrita no método.

---

## Resumo

| Categoria | Quantidade |
|-----------|------------|
| Componentes `.tsx` inutilizados | **4** |
| Barrels `index.ts` sem uso | **6** |
| Páginas órfãs | **1** (`/parent/profile`) |
| Imports mortos em `app` / `components` / `lib` | **0** |
