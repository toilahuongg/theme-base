import fs from 'node:fs/promises';
import Ajv from 'ajv/dist/2020.js';
import { blueprintPath, schemaPath } from './paths.mjs';

export async function loadJson(filePath) {
  return JSON.parse(await fs.readFile(filePath, 'utf8'));
}

export async function validateBlueprint(handle) {
  const [schema, blueprint] = await Promise.all([
    loadJson(schemaPath),
    loadJson(blueprintPath(handle))
  ]);
  const ajv = new Ajv({ allErrors: true, strict: true });
  ajv.addFormat('uri', {
    type: 'string',
    validate(value) {
      try {
        new URL(value);
        return true;
      } catch {
        return false;
      }
    }
  });
  const validate = ajv.compile(schema);
  const valid = validate(blueprint);
  if (!valid) {
    const message = validate.errors
      .map((error) => `${error.instancePath || '/'} ${error.message}`)
      .join('\n');
    throw new Error(`Blueprint ${handle} is invalid:\n${message}`);
  }
  return blueprint;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const handle = process.argv[2];
  if (!handle) {
    throw new Error('Usage: npm run validate:blueprint -- <handle>');
  }
  await validateBlueprint(handle);
  console.log(`Blueprint ${handle} is valid`);
}
