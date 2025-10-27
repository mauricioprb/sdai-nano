import type { SignedTreeHead } from '@sdai/merkle-log';

export type ProvenanceStatus = 'approved' | 'rejected' | 'undetermined';

export interface ProvenanceVerdict {
  assetId: string;
  score: number;
  status: ProvenanceStatus;
  signedTreeHead: SignedTreeHead;
}
