import { MerkleLog, createInMemorySigner } from '@sdai/merkle-log';
import { ProvenanceAssessor } from '../application/services/provenance-assessor.js';

export function buildDependencies() {
  const merkleLog = new MerkleLog({ signer: createInMemorySigner() });
  const assessor = new ProvenanceAssessor(merkleLog);

  return {
    merkleLog,
    assessor,
  };
}
