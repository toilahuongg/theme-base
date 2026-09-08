# Lighthouse Run Checklist — Theme Review

Purpose: produce Lighthouse numbers that are comparable run-to-run and representative of how the Theme Store evaluates themes. Theme Store review evaluates home, product, and collection pages, desktop and mobile, and takes a plain average of the three page scores per device. Verify the current minimum and page set at `https://shopify.dev/docs/storefronts/themes/store/requirements` before each submission cycle.

## 1. Prerequisites

- [ ] Node.js 18+ installed (`node --version`).
- [ ] Lighthouse CLI installed: `npm install -g lighthouse`.
- [ ] A storefront URL for each page type: home, product, collection. Use a representative product (with gallery, price, variant selector) and a collection with at least 12-24 items. If the theme ships a benchmark-style catalog, use it.
- [ ] Access to the storefront. Password-protected stores: pass the storefront password header so the page renders as a real shopper sees it:
  `lighthouse <url> --extra-headers '{"Shopify-Storefront-Private-Token":"<password>"}'` (or configure the storefront_digest cookie from a logged-in session).
- [ ] No other heavy tabs/apps running on the machine (background CPU skews scores).
- [ ] The theme under test is the ACTIVE theme (or use a preview theme URL). Record which theme/version was tested.

## 2. Page set

Run all three pages, both devices, in one session:

| Page | URL pattern | Notes |
| --- | --- | --- |
| Home | `/` | hero + featured sections |
| Product | `/products/<handle>` | use a full-featured product |
| Collection | `/collections/<handle>` | use the largest representative collection |

If the store has other critical page types (blog, cart), run them as supplementary; the report must clearly separate the official three from supplements.

## 3. Device + network configuration (MUST be identical for baseline and final)

- [ ] Mobile: Lighthouse mobile emulation (default preset — Moto G Power, 412x823, DPR 1.75).
- [ ] Desktop: Lighthouse desktop preset (1350x940, no throttling on the device itself; apply the preset's network settings).
- [ ] Network: use the Lighthouse preset defaults (mobile: simulated Fast 4G, 150 ms RTT, 1.6 Mbps down / 750 Kbps up; desktop: simulated slow 4G per the preset). Do not run on an unthrottled personal connection and compare it to throttled runs.
- [ ] Do not change throttle/emulation between baseline and final runs. Record the exact flags.

## 4. Cache state

- [ ] Warm cache protocol: for each page+device, run Lighthouse TWICE; discard the first run (cold cache, also warms disk cache), keep the second (warm).
- [ ] Alternative cold-cache protocol: run once with `--disable-storage-reset` off (default clears storage between runs) and record it as "cold". Pick one protocol per report and state it. The Theme Store evaluates with its own cache policy; warm-cache numbers are the stable comparison baseline.
- [ ] Do not mix warm and cold runs inside one average.

## 5. Repeat for stability

- [ ] Run each page+device at least 3 times (after the warm-up run) and use the MEDIAN performance score for the report. Lighthouse scores vary several points between identical runs; a single run is not a number you can compare.
- [ ] Record all raw runs in the report appendix; the median is the headline.

## 6. Commands (reference)

```bash
# Mobile, home, warm protocol (run twice per page, keep second):
lighthouse https://STORE.myshopify.com/ \
  --preset=desktop --only-categories=performance \
  --output=json --output-path=./lh-home-desktop.json

# Mobile:
lighthouse https://STORE.myshopify.com/ \
  --only-categories=performance \
  --output=json --output-path=./lh-home-mobile.json
```

Repeat for `/products/<handle>` and `/collections/<handle>`, mobile and desktop. Extract scores:

```bash
node -e "const j=require('./lh-home-mobile.json');console.log(j.categories.performance.score*100)"
```

## 7. Record in the report

For every run record:

1. Tool + version (`lighthouse --version`).
2. URL (full, with theme preview id if applicable).
3. Device preset, network throttle, cache protocol, run count, median.
4. Score breakdown beyond the headline: LCP, CLS, TBT, and the byte-weighted audits ("Reduce JavaScript execution time", "Eliminate render-blocking resources", "Defer offscreen images") — these tell you WHAT to fix.
5. Plain average per device: `(home + product + collection) / 3`, desktop and mobile separately.

## 8. Interpretation rules

- Threshold = current Theme Store minimum (verify at the requirements URL). Internal target = 75 per the budget YAML. Never ship at "exactly 60" — see the HARD RULE in SKILL.md.
- If mobile average >= 75 and desktop average >= 75 with at least 3 median runs, performance is submission-ready; hand `docs/performance-report.md` to `theme-qa-reviewer`.
- If below target: re-run `scripts/audit-basics.mjs` and work `references/performance-checklist.md` for the areas the breakdown audits name, then re-measure with identical conditions.
- If Lighthouse cannot run (no network to the storefront, no Chrome): measure what is available (theme-check, asset sizes, manual Network tab timings on a loaded page), state the limitation in the report, and say the verdict is provisional pending a real Lighthouse run.

## 9. Regression guard

- [ ] If the project uses the Shopify Lighthouse CI GitHub Action, record whether it passed and note its budget config in the report.
- [ ] After any later-stage change (editor schema tweaks, accessibility fixes), re-run the median warm mobile set once before submission — a 2-3 point regression is normal; a drop past 75 mobile means the change needs a performance look before QA signs off.
