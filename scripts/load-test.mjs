import { formatMs, runLoadTest } from './load-test-core.mjs';

const statusText = (statuses) =>
  Object.entries(statuses)
    .map(([status, count]) => `${status}:${count}`)
    .join(', ');

const printSummary = (result) => {
  console.log('');
  console.log(`Planify ${result.mode} test`);
  console.log(`API: ${result.apiUrl}`);
  console.log(`Frontend: ${result.frontendUrl}`);
  console.log(
    `Duración: ${result.elapsedSeconds.toFixed(1)}s | Concurrencia: ${result.concurrency}`
  );
  console.log(
    `Requests: ${result.totals.count} | OK: ${result.totals.ok} | Fallidos: ${result.totals.failed}`
  );
  console.log(`Throughput: ${result.totals.throughput.toFixed(2)} req/s`);
  console.log('');
  console.log('Endpoint | req | error | p50 | p95 | max | status');
  console.log('--- | ---: | ---: | ---: | ---: | ---: | ---');

  for (const endpoint of result.endpoints) {
    console.log(
      `${endpoint.label} | ${endpoint.count} | ${endpoint.failed} | ${formatMs(endpoint.p50)} | ${formatMs(
        endpoint.p95
      )} | ${formatMs(endpoint.max)} | ${statusText(endpoint.statuses)}`
    );
  }
};

const main = async () => {
  console.log(`Autenticando usuario de carga: ${process.env.PLANIFY_LOAD_EMAIL || 'coordinator@planify.edu'}`);

  const result = await runLoadTest();
  printSummary(result);

  const maxAllowedErrorRate = Number(process.env.PLANIFY_LOAD_MAX_ERROR_RATE || 0.02);

  if (result.totals.errorRate > maxAllowedErrorRate) {
    throw new Error(
      `Tasa de error ${(result.totals.errorRate * 100).toFixed(2)}% supera el máximo ${(
        maxAllowedErrorRate * 100
      ).toFixed(2)}%`
    );
  }
};

main().catch((error) => {
  console.error(`ERROR ${error.message}`);
  process.exit(1);
});
