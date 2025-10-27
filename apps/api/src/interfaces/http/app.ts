import express from 'express';
import type { ProvenanceAssessor } from '../../application/services/provenance-assessor.js';

type CreateAppDeps = {
  assessor: ProvenanceAssessor;
};

export function createApp({ assessor }: CreateAppDeps) {
  const app = express();
  app.use(express.json());

  void assessor; // Mantém a injeção pronta sem expor endpoints ainda.

  return app;
}
