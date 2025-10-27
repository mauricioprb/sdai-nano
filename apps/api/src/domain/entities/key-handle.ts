export type KeyAlgorithm = 'Ed25519';
export type KeyHandleStatus = 'active' | 'revoked' | 'expired';

export interface KeyHandle {
  id: string;
  userId: string;
  algorithm: KeyAlgorithm;
  keyId: string;
  status: KeyHandleStatus;
  createdAt: Date;
  updatedAt: Date;
  activatedAt?: Date | null;
  revokedAt?: Date | null;
  expiresAt?: Date | null;
}
