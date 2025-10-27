import { semMetadataSchema } from './types/sem-metadata.js';
import type { SemMetadata } from './types/sem-metadata.js';

export function extractSemMetadata(input: unknown): SemMetadata {
  // Permite entrada em JSON ou objeto já estruturado.
  const candidate = typeof input === 'string' ? safeJsonParse(input) : input;
  return semMetadataSchema.parse(candidate);
}

function safeJsonParse(payload: string) {
  try {
    return JSON.parse(payload);
  } catch (error) {
    throw new Error('Conteúdo fornecido não é um JSON válido para metadados SEM/TEM.');
  }
}
