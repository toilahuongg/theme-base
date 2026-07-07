import fs from 'node:fs/promises';
import path from 'node:path';
import { themePath } from './paths.mjs';

async function ensureDirectory(filePath) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
}

function bulletList(values) {
  return values.map((value) => `- ${value}`).join('\n');
}

function buildMerchantDoc(blueprint) {
  return `# ${blueprint.theme.name} merchant guide

This guide is generated from the blueprint and core theme files.
Use the blueprint and \`packages/core\` as the source of truth when the generated output needs to change.

## Merchant topics

${bulletList(blueprint.docs.merchantTopics)}

## Storefront summary

${blueprint.listing.summary}
`;
}

function buildAiHandoffDoc(blueprint) {
  return `# ${blueprint.theme.name} AI handoff

Generated from \`blueprints/${blueprint.theme.handle}.json\`.
Source of truth:

- Blueprint metadata and tokens drive the generated theme.
- Core theme files under \`packages/core\` are copied into the published output.
- Regenerate the theme instead of editing generated files by hand.

## Notes for future changes

${bulletList(blueprint.docs.aiNotes)}
`;
}

function buildListingDraftDoc(blueprint) {
  return `# ${blueprint.theme.name} listing draft

${blueprint.listing.summary}

## Feature bullets

${bulletList(blueprint.listing.featureBullets)}

## Screenshot plan

${blueprint.listing.screenshotPlan}
`;
}

function buildReleaseNotesDoc(blueprint) {
  return `# ${blueprint.theme.name} release notes

${bulletList(blueprint.listing.releaseNotes)}

Generated from the blueprint and the core theme source of truth.
`;
}

function buildQaChecklistDoc(blueprint) {
  return `# ${blueprint.theme.name} QA checklist

Generated from the blueprint. Treat the blueprint and core files as the source of truth for regressions.

## Scenarios

${bulletList(blueprint.qa.scenarios)}

## Lighthouse targets

- Performance: ${blueprint.qa.lighthouse.performance}
- Accessibility: ${blueprint.qa.lighthouse.accessibility}
`;
}

export async function writeDocs(handle, blueprint) {
  const docsDir = path.join(themePath(handle), 'docs');
  await fs.rm(docsDir, { recursive: true, force: true });
  await fs.mkdir(docsDir, { recursive: true });

  const docs = {
    'merchant.md': buildMerchantDoc(blueprint),
    'ai-handoff.md': buildAiHandoffDoc(blueprint),
    'listing-draft.md': buildListingDraftDoc(blueprint),
    'release-notes.md': buildReleaseNotesDoc(blueprint),
    'qa-checklist.md': buildQaChecklistDoc(blueprint)
  };

  for (const [fileName, content] of Object.entries(docs)) {
    const filePath = path.join(docsDir, fileName);
    await ensureDirectory(filePath);
    await fs.writeFile(filePath, `${content.trimEnd()}\n`);
  }

  return docsDir;
}
