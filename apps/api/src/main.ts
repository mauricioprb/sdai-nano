import { buildDependencies } from './infrastructure/container.js';
import { createApp } from './interfaces/http/app.js';

async function bootstrap() {
  const deps = buildDependencies();
  const app = createApp(deps);
  const port = Number(process.env.PORT ?? 3333);

  app.listen(port, () => {
    console.log(`API pronta na porta ${port}, cuidando da proveniência.`);
  });
}

bootstrap().catch((error) => {
  console.error('Erro fatal ao iniciar a API de proveniência:', error);
  process.exit(1);
});
