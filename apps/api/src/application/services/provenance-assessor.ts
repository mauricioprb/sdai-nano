import { MerkleLog } from '@sdai/merkle-log';
import { assessSemMetadata } from '@sdai/sem-metadata';
import type { ImagingAsset } from '../../domain/entities/imaging-asset.js';
import type { ProvenanceVerdict } from '../../domain/value-objects/provenance-verdict.js';

export class ProvenanceAssessor {
  constructor(private readonly merkleLog: MerkleLog) {}

  async evaluate(asset: ImagingAsset): Promise<ProvenanceVerdict> {
    const assessment = assessSemMetadata(asset.metadata);
    const signedTreeHead = await this.merkleLog.append({
      digest: asset.statementDigest,
      signature: asset.signature,
    });

    return {
      assetId: asset.id,
      score: assessment.score,
      status: assessment.status,
      signedTreeHead,
    };
  }
}
