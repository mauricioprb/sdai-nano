export interface ManifestMetadata {
  type: 'SEM' | 'TEM';
  payload: unknown;
}

export interface Manifest {
  id: string;
  recordId: string;
  imageSha256: string;
  metadata: ManifestMetadata;
  verdict: boolean;
  provenanceScore: number;
  verdictSource: 'metadata';
  timestamp: Date;
  schemaVersion: string;
  createdAt: Date;
  updatedAt: Date;
}
