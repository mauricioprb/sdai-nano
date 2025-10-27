import type { SemMetadata } from '@sdai/sem-metadata';

export interface ImagingAsset {
  id: string;
  metadata: SemMetadata;
  statementDigest: string;
  signature: string;
}
