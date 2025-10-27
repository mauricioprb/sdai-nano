import { z } from 'zod';
export declare const identifierSchema: z.ZodString;
export declare const isoTimestampSchema: z.ZodString;
export declare const digitalSignatureSchema: z.ZodString;
export declare const baseAssetSchema: z.ZodObject<{
    id: z.ZodString;
    createdAt: z.ZodString;
    updatedAt: z.ZodOptional<z.ZodString>;
    statementDigest: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    createdAt: string;
    statementDigest: string;
    updatedAt?: string | undefined;
}, {
    id: string;
    createdAt: string;
    statementDigest: string;
    updatedAt?: string | undefined;
}>;
export type Identifier = z.infer<typeof identifierSchema>;
export type IsoTimestamp = z.infer<typeof isoTimestampSchema>;
export type DigitalSignature = z.infer<typeof digitalSignatureSchema>;
export type BaseAsset = z.infer<typeof baseAssetSchema>;
//# sourceMappingURL=common.d.ts.map