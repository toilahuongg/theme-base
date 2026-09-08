# scripts/README.md — Manual Uniqueness Review Procedure

This skill ships no runnable script. Uniqueness is a comparative judgment: there is no measurable output a script could emit, and a script that printed "unique" would be a false authority. The agent performs the review manually, using the read-only commands below only to gather evidence. The verdict lives in `docs/uniqueness-matrix.md`, written by the reviewer.

The golden rule applied throughout:

> "If the source theme could reproduce the new UX using normal theme settings plus modest CSS customization: FAIL."

## 1. Why no automation

- The verdict depends on merchant capability ("could a merchant reproduce this with settings plus modest CSS?"), which cannot be executed programmatically.
- The comparison is between two theme experiences across ten core experiences; each row requires reading schema, templates, and behavior, not diffing bytes.
- A diff of two theme directories measures code distance, not experiential difference. Two themes can share 90% of code and be genuinely different in one structural behavior; two themes can differ in every CSS file and be the same experience.

Automation that IS used: the read-only evidence commands below, run by the agent to speed up inspection.

## 2. Evidence gathering

Run from the new theme root. The source theme may be a sibling checkout; adjust paths.

### 2.1 Inventory the new theme's building blocks

```
# List templates and sections the new theme actually ships
find templates sections -name '*.liquid' -o -name '*.json' | sort

# List schema-defined settings across all sections and the global schema
cat config/settings_schema.json
grep -rl '"type":' sections snippets | sort
```

Interpretation: build the map of what the new theme can express. Then do the same for the source theme and compare the maps, not the files.

### 2.2 Find the source theme's settings capabilities (the schema test)

```
# Dump every setting id the source theme exposes
grep -o '"id": *"[^"]*"' /path/to/source/config/settings_schema.json | sort -u
grep -o '"id": *"[^"]*"' /path/to/source/sections/*.liquid | sort -u
```

Interpretation: any claimed new behavior whose setting id already exists in the source (or whose source setting covers it, e.g. `enable_mega_menu` vs "mega menu columns") is source flexibility, not a difference. This list is the ammunition for the golden rule: for each row, name the source settings that reproduce the new UX.

### 2.3 Compare structure, not bytes

```
# Which templates/sections exist in the new theme that the source lacks
comm -23 <(cd /path/to/new && find templates sections -type f | sort) \
         <(cd /path/to/source && find templates sections -type f | sort)

# Coarse code distance for orientation only (NOT a verdict)
diff -rq /path/to/source/sections /path/to/new/sections | head -50
```

Interpretation: new files are candidates for structural difference, not proof of it. A new section that wraps the source's building blocks with new names is an empty shell. `diff -rq` output is orientation; it tells you where to look, never what to conclude.

### 2.4 Trace the claimed experience to code

For each of the ten core experiences (header, navigation, mega menu, product card, collection page, PDP, cart, search, mobile nav, media), open the template/section that renders it in BOTH themes and compare behavior: which Liquid objects are read, which schema types exist, which JavaScript runs. Cite file:line in the matrix.

## 3. The settings-reproduction test (golden-rule experiment)

For each row, run this thought experiment explicitly and record the result:

1. Enumerate the source settings that touch this experience (Section 2.2).
2. Ask: with the source theme at its full settings range, can a merchant produce the new layout/behavior? A "yes" on any part means that part is surface.
3. Ask: what remains after settings? Can modest CSS in the theme's custom-CSS facility (colors, fonts, radius, spacing, animations, gradients, hover effects, image crops) cover it? A "yes" means FAIL.
4. The residue after settings and CSS is the candidate structural difference. Test it on the five axes: interaction model, page architecture, media treatment, shopping paradigm, content model. It must be visible in code (schema, Liquid, JavaScript), survive edge cases, and hold across breakpoints.

Record per row: which source setting ids reproduced the behavior, what CSS covered, and what (if anything) is left as genuinely structural.

## 4. Edge cases to force before any PASS

A structural difference must survive degenerate states:

- Mega menu with one item and no images picked
- Product with no images, no variants, long and short titles
- Collection with one product; collection with zero products
- Empty cart; cart with one line item and many
- Search with empty query and with no results
- Mobile width for every desktop claim; desktop width for every mobile claim
- Reduced-motion preference for any animation claim

If the "difference" collapses into source behavior in any of these states, downgrade the row to WEAK or FAIL.

## 5. Output rules

Write `docs/uniqueness-matrix.md` from `templates/uniqueness-matrix.md`:

- One row per core experience with source -> new mapping, settings-reproduction result, verdict PASS/WEAK/FAIL, and file:line evidence.
- Overall verdict: PASS only if every row is PASS; WEAK if zero FAIL and one or more WEAK; FAIL if any row is FAIL or the theme is a reskin.
- Required changes per FAIL/WEAK row: the concrete structural change and the owning sibling (theme-art-director, commerce-ux-architect, shopify-liquid-architect, theme-editor-architect, shopify-commerce-engineer).
- Run `checklists/uniqueness-review-checklist.md` before finalizing.

## 6. Anti-patterns

- Do not run `diff -r` and report "x% code changed" as evidence; code distance is not uniqueness.
- Do not count settings the new theme adds; an option is not a structural difference.
- Do not accept doc claims the code does not deliver; judge code.
- Do not count app-powered behavior; the theme must own the experience.
- Do not grade with anything other than PASS / WEAK / FAIL.
