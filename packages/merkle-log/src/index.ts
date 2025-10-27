import { digitalSignatureSchema, type DigitalSignature } from '@sdai/shared';
import { randomBytes, createHmac } from 'crypto';
import { hashLeaf, hashNode } from './internal/hash.js';

export type MerkleEntry = {
  digest: string;
  signature: string;
};

export type TreeSigner = (payload: string) => Promise<DigitalSignature> | DigitalSignature;

export type SignedTreeHead = {
  root: string;
  size: number;
  timestamp: string;
  signature: DigitalSignature;
};

export type MerkleLogOptions = {
  signer: TreeSigner;
  clock?: () => Date;
};

const EMPTY_ROOT = '0'.repeat(64);

export class MerkleLog {
  private readonly signer: TreeSigner;
  private readonly clock: () => Date;
  private readonly leaves: string[] = [];

  constructor(options: MerkleLogOptions) {
    this.signer = options.signer;
    this.clock = options.clock ?? (() => new Date());
  }

  async append(entry: MerkleEntry): Promise<SignedTreeHead> {
    // Concatena o digest do statement com a assinatura para fabricar a folha.
    const leafHash = hashLeaf(`${entry.digest}:${entry.signature}`);
    this.leaves.push(leafHash);

    const root = this.computeRoot();
    const timestamp = this.clock().toISOString();
    const payload = JSON.stringify({ root, size: this.leaves.length, timestamp });
    const signature = digitalSignatureSchema.parse(await Promise.resolve(this.signer(payload)));

    return {
      root,
      size: this.leaves.length,
      timestamp,
      signature,
    };
  }

  async snapshot(): Promise<SignedTreeHead> {
    if (this.leaves.length === 0) {
      const timestamp = this.clock().toISOString();
      const payload = JSON.stringify({ root: EMPTY_ROOT, size: 0, timestamp });
      const signature = digitalSignatureSchema.parse(await Promise.resolve(this.signer(payload)));

      return {
        root: EMPTY_ROOT,
        size: 0,
        timestamp,
        signature,
      };
    }

    const root = this.computeRoot();
    const timestamp = this.clock().toISOString();
    const payload = JSON.stringify({ root, size: this.leaves.length, timestamp });
    const signature = digitalSignatureSchema.parse(await Promise.resolve(this.signer(payload)));

    return {
      root,
      size: this.leaves.length,
      timestamp,
      signature,
    };
  }

  private computeRoot(): string {
    if (this.leaves.length === 0) {
      return EMPTY_ROOT;
    }

    let currentLevel = [...this.leaves];

    // Calcula a raiz juntando nós em pares.
    while (currentLevel.length > 1) {
      const nextLevel: string[] = [];

      for (let index = 0; index < currentLevel.length; index += 2) {
        const left = currentLevel[index];
        const right = currentLevel[index + 1] ?? left;
        nextLevel.push(hashNode(left, right));
      }

      currentLevel = nextLevel;
    }

    return currentLevel[0] ?? EMPTY_ROOT;
  }
}

export function createInMemorySigner(secret?: string): TreeSigner {
  const key = secret ? Buffer.from(secret, 'hex') : randomBytes(32);

  return (payload: string) => {
    // Assinatura simples via HMAC apenas para validar o fluxo localmente.
    return createHmac('sha256', key).update(payload).digest('hex');
  };
}
