import { z } from 'zod';

export const identifierSchema = z
  .string({ required_error: 'Identificador é obrigatório.' })
  .min(1, 'Identificador deve conter ao menos 1 caractere.');

export const isoTimestampSchema = z.string().datetime({ message: 'Timestamp ISO inválido.' });

export const digitalSignatureSchema = z
  .string({ required_error: 'Assinatura digital é obrigatória.' })
  .regex(/^[0-9a-fA-F]+$/, 'Assinatura deve estar em hexadecimal.');

export const baseAssetSchema = z.object({
  id: identifierSchema,
  createdAt: isoTimestampSchema,
  updatedAt: isoTimestampSchema.optional(),
  statementDigest: z
    .string({ required_error: 'Resumo criptográfico é obrigatório.' })
    .regex(/^[0-9a-f]{64}$/i, 'Resumo deve seguir o formato SHA-256 em hexadecimal.'),
});

export type Identifier = z.infer<typeof identifierSchema>;
export type IsoTimestamp = z.infer<typeof isoTimestampSchema>;
export type DigitalSignature = z.infer<typeof digitalSignatureSchema>;
export type BaseAsset = z.infer<typeof baseAssetSchema>;
