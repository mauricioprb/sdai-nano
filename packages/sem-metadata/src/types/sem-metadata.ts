import { isoTimestampSchema } from '@sdai/shared';
import { z } from 'zod';

const semMetadataShape = {
  instrument: z.object({
    manufacturer: z
      .string({ required_error: 'Fabricante do instrumento é obrigatório.' })
      .min(1, 'Fabricante do instrumento é obrigatório.'),
    model: z
      .string({ required_error: 'Modelo do instrumento é obrigatório.' })
      .min(1, 'Modelo do instrumento é obrigatório.'),
  }),
  operator: z
    .string({ required_error: 'Responsável técnico é obrigatório.' })
    .min(1, 'Responsável técnico deve ser preenchido.'),
  beamVoltageKv: z
    .number({ invalid_type_error: 'Tensão do feixe deve ser numérica.' })
    .min(0.1, 'Tensão do feixe deve ser maior que 0.1 kV.')
    .max(1000, 'Tensão do feixe não deve exceder 1000 kV.'),
  magnification: z
    .number({ invalid_type_error: 'Magnificação deve ser numérica.' })
    .positive('Magnificação deve ser positiva.'),
  detector: z.string().min(1, 'Detector deve ser informado.').optional(),
  facility: z
    .string({ required_error: 'Instalação responsável é obrigatória.' })
    .min(1, 'Instalação responsável é obrigatória.'),
  modality: z.enum(['SEM', 'TEM'], {
    required_error: 'Modalidade deve ser SEM ou TEM.',
    invalid_type_error: 'Modalidade deve ser SEM ou TEM.',
  }),
  capturedAt: isoTimestampSchema,
  sampleId: z
    .string({ required_error: 'Amostra precisa de identificação.' })
    .min(1, 'Amostra precisa de identificação.'),
  notes: z.string().max(500, 'Observações devem conter até 500 caracteres.').optional(),
} satisfies z.ZodRawShape;

export const semMetadataSchema = z.object(semMetadataShape).strict();

export type SemMetadata = z.infer<typeof semMetadataSchema>;
