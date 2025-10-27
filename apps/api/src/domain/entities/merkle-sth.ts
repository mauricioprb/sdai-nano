export interface MerkleSignedTreeHead {
  id: string;
  treeSize: bigint;
  rootHash: string;
  signature: string;
  timestamp: Date;
  createdAt: Date;
}
