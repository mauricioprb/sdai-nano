import type { SemMetadata } from '../types/sem-metadata.js';

export type AssessmentStatus = 'approved' | 'undetermined' | 'rejected';

export type SemMetadataAssessment = {
  score: number;
  status: AssessmentStatus;
  issues: string[];
};

type Rule = {
  weight: number;
  evaluate: (metadata: SemMetadata) => boolean;
  issue: string;
};

const RULES: Rule[] = [
  {
    weight: 20,
    evaluate: (metadata) => metadata.beamVoltageKv >= 0.5 && metadata.beamVoltageKv <= 400,
    issue: 'A tensão do feixe deve estar entre 0.5 kV e 400 kV para equipamentos SEM/TEM convencionais.',
  },
  {
    weight: 20,
    evaluate: (metadata) => metadata.magnification >= 100,
    issue: 'Magnificação abaixo de 100 sugere captura fora do regime microscópico.',
  },
  {
    weight: 15,
    evaluate: (metadata) => Boolean(metadata.detector && metadata.detector.length > 0),
    issue: 'Detector não informado dificulta rastreio da cadeia de aquisição.',
  },
  {
    weight: 15,
    evaluate: (metadata) => metadata.operator.trim().length >= 3,
    issue: 'Nome do responsável técnico muito curto ou ausente.',
  },
  {
    weight: 15,
    evaluate: (metadata) => metadata.sampleId.trim().length >= 4,
    issue: 'Identificador da amostra com menos de 4 caracteres.',
  },
  {
    weight: 15,
    evaluate: (metadata) => validateRecency(metadata.capturedAt, 5),
    issue: 'Registro sem data recente (mais de 5 anos) exige revalidação manual.',
  },
];

export function assessSemMetadata(metadata: SemMetadata): SemMetadataAssessment {
  let score = 0;
  const issues: string[] = [];

  for (const rule of RULES) {
    if (rule.evaluate(metadata)) {
      score += rule.weight;
    } else {
      issues.push(rule.issue);
    }
  }

  score = Math.min(100, Math.max(0, score));
  const status = resolveStatus(score, issues.length);

  return {
    score,
    status,
    issues,
  };
}

function resolveStatus(score: number, issueCount: number): AssessmentStatus {
  if (score >= 80 && issueCount <= 1) {
    return 'approved';
  }

  if (score >= 50) {
    return 'undetermined';
  }

  return 'rejected';
}

function validateRecency(timestamp: string, years: number) {
  const captured = new Date(timestamp);
  if (Number.isNaN(captured.getTime())) {
    return false;
  }

  const now = new Date();
  const diff = now.getTime() - captured.getTime();
  const limit = years * 365 * 24 * 60 * 60 * 1000;

  return diff <= limit;
}
