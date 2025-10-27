export interface MerkleLeaf {
  id: string;
  recordId: string;
  leafHash: string;
  logIndex: number;
  treeSize: bigint;
  rootHash: string;
  createdAt: Date;
}
