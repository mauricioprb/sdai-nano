import { createHash } from 'crypto';

export function hashLeaf(payload: string) {
  // Garante separador distinto para evitar colisões entre nós e folhas.
  return createHash('sha256').update(`leaf:${payload}`).digest('hex');
}

export function hashNode(left: string, right: string) {
  return createHash('sha256').update(`node:${left}:${right}`).digest('hex');
}
