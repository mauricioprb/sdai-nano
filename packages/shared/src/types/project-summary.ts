export type ProjectSummary = {
  title: string;
  description: string;
  keywords: string[];
};

export const projectSummary: ProjectSummary = {
  title: 'SDAI — Proveniência de Microscopia Eletrônica',
  description:
    'Plataforma para rastrear a proveniência verificável de imagens SEM/TEM com veredito baseado em metadados e assinatura digital.',
  keywords: ['proveniência', 'microscopia eletrônica', 'SEM', 'TEM'],
};
