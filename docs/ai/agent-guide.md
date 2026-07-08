# AI Agent Guide

This repo is a source-first Shopify theme factory. AI agents should treat blueprints and core packages as the authoritative inputs and generated themes as disposable output.

## Required Workflow

Before editing anything, read:

- `docs/architecture/overview.md`
- `docs/ai/blueprint-authoring.md`
- `docs/ai/review-checklist.md`

Then follow this sequence:

1. Edit the blueprint or core source.
2. Run `npm run validate:blueprint -- <handle>`.
3. Run `npm run generate -- <handle>`.
4. Run `npm run check:theme-structure -- <handle>`.
5. Run `shopify theme check --path themes/<handle>`.
6. Run `shopify theme package --path themes/<handle>`.
7. Inspect the generated theme structure and output.

## Editing Rule

Make durable fixes in source:

- blueprint changes in `blueprints/<handle>.json`,
- shared logic in `packages/core`,
- generator behavior in `packages/generator`.

Do not make durable fixes only in `themes/<handle>`. If you need to patch generated output to understand a bug, move the real fix back into source before finishing.

## What To Check

Always check:

- blueprint validity,
- generated structure,
- theme schema and Liquid correctness,
- mobile layout,
- keyboard focus,
- and Theme Store readiness.

## What Not To Do

- Do not edit generated themes as the final source of truth.
- Do not skip validation because a change seems small.
- Do not assume a generated fix is durable unless it comes from source.

## Recommended Mental Model

Blueprints describe intent and configuration. Core packages define reusable implementation. Generated themes are the output of those inputs.
