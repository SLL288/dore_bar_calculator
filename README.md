# Doré Gold Bar Calculator

Professional React + TypeScript calculator for alluvial and doré gold bar pricing. It estimates density-based karat from an editable traditional reference table, applies spot price and handling fees, and produces a print-ready transaction proof report.

## Local Development

```bash
npm install
npm run dev
```

## Production Build

```bash
npm run build
```

The static production files are generated in `dist/`.

## Cloudflare Pages

Use these settings when linking the GitHub repo to Cloudflare Pages:

- Framework preset: `Vite`
- Build command: `npm run build`
- Build output directory: `dist`
- Node.js version: `20`

## Notes

- Live gold spot price uses `https://api.gold-api.com/price/XAU/USD`.
- The TradingView chart displays `OANDA:XAUUSD` with 4-hour bars.
- The density-to-karat table is editable in `src/utils/goldCalculator.ts`.
