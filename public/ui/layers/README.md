# Camadas da cena (montagem incremental)

Coloque cada export do Figma aqui. O código referencia por nome fixo.

| Arquivo | Camada | Status |
|---------|--------|--------|
| `background.png` | Fundo ciclorama | ✅ |
| `nav.svg` | Referência visual do menu (UI real: `CADUTopBar`) | ✅ |
| `cloud-blue-*.png` / `cloud-soft-1.png` | Nuvens azuladas (referência c2, nuvem1, C3) | ✅ |
| `c2.svg`, `nuvem1.svg`, `C3.svg` | Nuvens SVG (mesma tonalidade) | ✅ |
| `cadu.svg` | CADU (centro) | ✅ |
| `clouds.png` | Nuvens | pendente |
| `platform.png` | Plataforma / palco | pendente |
| `toys.png` | Brinquedos | pendente |
| `ui.png` | Interface (glass) | pendente |

Quando todas estiverem prontas, `SHOW_TEMPLATE_COMPOSITE` em `src/constants/templateLayers.js` pode voltar a `false` (camadas separadas são a fonte de verdade).
