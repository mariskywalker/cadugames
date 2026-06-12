# CADU Games

Experiência web do ecossistema CADU — Next.js, TypeScript, Tailwind, React Three Fiber.

Deploy: **https://cadugames.vercel.app/**

## Desenvolvimento

```bash
npm install
npm run dev
```

http://localhost:3001

## Deploy (Vercel)

| Campo     | Valor           |
| --------- | --------------- |
| Framework | Next.js         |
| Build     | `npm run build` |
| Output    | `.next` (auto)  |
| Root      | `.`             |

Push na branch `main` dispara deploy automático.

## Rotas principais

| Rota | Tela |
|------|------|
| `/` | Home — CADU no palco |
| `/opening` | Abertura |
| `/child/diary` | Diário emocional |
| `/child/life` | Vida / dimensões |
| `/parent/dashboard` | Dashboard da mãe |

## Estrutura

```
app/              Rotas Next.js
components/home/  Cena inicial (CADU + palco)
components/vale/  Vale das Palavras (3D)
lib/              Assets, mock data, cena 3D
public/           Imagens, modelos GLB/OBJ, camadas da home
```
