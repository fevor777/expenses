import pino from 'pino';
import { loadConfig } from './config.js';
import { createHttpApp } from './server.js';

async function main(): Promise<void> {
  const config = loadConfig();
  const logger = pino({ level: config.logLevel });
  const app = createHttpApp(config, logger);

  app.listen(config.port, () => {
    logger.info(
      {
        authMode: config.authMode,
        ...(config.ownerUid ? { defaultOwnerUid: config.ownerUid } : {}),
        port: config.port,
      },
      'expenses-mcp listening'
    );
  });
}

main().catch(error => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(message);
  process.exitCode = 1;
});