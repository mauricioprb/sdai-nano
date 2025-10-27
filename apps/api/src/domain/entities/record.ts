export interface RecordEntity {
  id: string;
  labId: string;
  userId: string;
  equipmentId: string;
  manifestHash: string;
  jwsSignature: string;
  logLeafHash: string;
  logIndex?: number | null;
  logRoot: string;
  revoked: boolean;
  createdAt: Date;
  updatedAt: Date;
  revokedAt?: Date | null;
}
