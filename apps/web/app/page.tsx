import { projectSummary } from '@sdai/shared';

export default function HomePage() {
  return (
    <main className="page">
      <section className="hero">
        <h1>{projectSummary.title}</h1>
        <p>{projectSummary.description}</p>
      </section>
      <section className="details">
        <p>
          Este protótipo apresenta a camada de visualização para acompanhar a proveniência de imagens
          SEM e TEM, conectando-se aos pacotes compartilhados que calculam vereditos técnicos.
        </p>
      </section>
    </main>
  );
}
