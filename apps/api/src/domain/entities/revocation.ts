export interface Revocation {
  id: string;
  recordId: string;
  reason?: string | null;
  createdByUserId?: string | null;
  createdAt: Date;
}
