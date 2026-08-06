import { createApp } from './server.js';

const port = Number(process.env.PORT ?? 3000);
const host = process.env.HOST ?? '127.0.0.1';

const app = createApp();

app.listen(port, host, () => {
  process.stdout.write(`task-api listening on http://${host}:${port}\n`);
});

function shutdown(signal: string): void {
  process.stdout.write(`Received ${signal}, shutting down\n`);
  app.close(() => process.exit(0));
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
