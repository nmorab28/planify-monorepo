import http from 'node:http';
import { runLoadTest } from '../../scripts/load-test-core.mjs';

const PORT = Number(process.env.PORT || 4010);

const sendJson = (response, status, payload) => {
  response.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  });
  response.end(JSON.stringify(payload));
};

const readJson = (request) =>
  new Promise((resolve, reject) => {
    let body = '';

    request.on('data', (chunk) => {
      body += chunk;
    });
    request.on('end', () => {
      if (!body) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(error);
      }
    });
    request.on('error', reject);
  });

const page = `<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Planify | Pruebas de carga</title>
    <style>
      :root {
        color-scheme: light;
        --bg: #f4f7fb;
        --panel: #ffffff;
        --ink: #162033;
        --muted: #62708a;
        --line: #d9e1ef;
        --primary: #1955a6;
        --primary-strong: #0c3f86;
        --success: #147a4d;
        --danger: #bd2d38;
        --warning: #a86600;
      }

      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        min-height: 100vh;
        background: var(--bg);
        color: var(--ink);
        font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      }

      header {
        background: #123b73;
        color: #ffffff;
        padding: 24px clamp(18px, 4vw, 48px);
      }

      h1 {
        margin: 0;
        font-size: clamp(24px, 3vw, 36px);
        line-height: 1.1;
        letter-spacing: 0;
      }

      header p {
        max-width: 920px;
        margin: 10px 0 0;
        color: #d9e7ff;
      }

      main {
        width: min(1180px, calc(100% - 32px));
        margin: 24px auto 40px;
      }

      .panel {
        background: var(--panel);
        border: 1px solid var(--line);
        border-radius: 8px;
        box-shadow: 0 12px 30px rgba(31, 51, 84, 0.08);
      }

      form {
        display: grid;
        grid-template-columns: repeat(4, minmax(150px, 1fr));
        gap: 14px;
        padding: 18px;
        align-items: end;
      }

      label {
        display: grid;
        gap: 6px;
        color: var(--muted);
        font-size: 13px;
        font-weight: 700;
      }

      select,
      input,
      button {
        min-height: 42px;
        border-radius: 6px;
        font: inherit;
      }

      select,
      input {
        width: 100%;
        border: 1px solid var(--line);
        color: var(--ink);
        padding: 0 12px;
        background: #ffffff;
      }

      button {
        border: 0;
        background: var(--primary);
        color: #ffffff;
        font-weight: 800;
        cursor: pointer;
      }

      button:hover {
        background: var(--primary-strong);
      }

      button:disabled {
        cursor: wait;
        opacity: 0.7;
      }

      .status {
        margin: 16px 0;
        color: var(--muted);
        min-height: 24px;
      }

      .summary {
        display: grid;
        grid-template-columns: repeat(4, minmax(160px, 1fr));
        gap: 14px;
        margin: 16px 0;
      }

      .metric {
        padding: 18px;
      }

      .metric span {
        display: block;
        color: var(--muted);
        font-size: 13px;
        font-weight: 700;
      }

      .metric strong {
        display: block;
        margin-top: 8px;
        font-size: 28px;
        line-height: 1;
      }

      .table-wrap {
        overflow-x: auto;
      }

      table {
        width: 100%;
        border-collapse: collapse;
        min-width: 820px;
      }

      th,
      td {
        padding: 13px 14px;
        border-bottom: 1px solid var(--line);
        text-align: left;
        vertical-align: middle;
      }

      th {
        color: var(--muted);
        font-size: 12px;
        text-transform: uppercase;
      }

      .ok {
        color: var(--success);
        font-weight: 800;
      }

      .danger {
        color: var(--danger);
        font-weight: 800;
      }

      .bar {
        width: 100%;
        min-width: 120px;
        height: 8px;
        background: #e6edf7;
        border-radius: 999px;
        overflow: hidden;
      }

      .bar span {
        display: block;
        height: 100%;
        background: var(--primary);
      }

      .empty {
        padding: 28px;
        color: var(--muted);
      }

      @media (max-width: 820px) {
        form,
        .summary {
          grid-template-columns: 1fr;
        }
      }
    </style>
  </head>
  <body>
    <header>
      <h1>Pruebas de carga Planify</h1>
      <p>Ejecuta una prueba sencilla contra el frontend y los endpoints principales de Strapi para validar disponibilidad, errores y tiempos de respuesta antes de la demo.</p>
    </header>

    <main>
      <section class="panel">
        <form id="test-form">
          <label>
            Modo
            <select name="mode">
              <option value="smoke">Smoke</option>
              <option value="load" selected>Carga</option>
              <option value="stress">Estrés</option>
            </select>
          </label>
          <label>
            Duración en segundos
            <input name="durationSeconds" type="number" min="1" max="180" value="20" />
          </label>
          <label>
            Concurrencia
            <input name="concurrency" type="number" min="1" max="80" value="8" />
          </label>
          <button id="run-button" type="submit">Ejecutar prueba</button>
        </form>
      </section>

      <p id="status" class="status">Listo para ejecutar.</p>

      <section id="summary" class="summary"></section>

      <section class="panel table-wrap">
        <div id="empty" class="empty">Los resultados aparecerán aquí.</div>
        <table id="results" hidden>
          <thead>
            <tr>
              <th>Endpoint</th>
              <th>Requests</th>
              <th>Fallos</th>
              <th>p50</th>
              <th>p95</th>
              <th>Máximo</th>
              <th>Estados</th>
              <th>p95 visual</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </section>
    </main>

    <script>
      const form = document.querySelector('#test-form');
      const button = document.querySelector('#run-button');
      const status = document.querySelector('#status');
      const summary = document.querySelector('#summary');
      const table = document.querySelector('#results');
      const tbody = table.querySelector('tbody');
      const empty = document.querySelector('#empty');

      const formatMs = (value) => Math.round(value) + 'ms';
      const formatPct = (value) => (value * 100).toFixed(2) + '%';

      const metric = (label, value) => '<article class="panel metric"><span>' + label + '</span><strong>' + value + '</strong></article>';

      const render = (result) => {
        summary.innerHTML =
          metric('Requests', result.totals.count) +
          metric('Errores', result.totals.failed) +
          metric('Throughput', result.totals.throughput.toFixed(2) + ' req/s') +
          metric('Tasa de error', formatPct(result.totals.errorRate));

        const maxP95 = Math.max(...result.endpoints.map((endpoint) => endpoint.p95), 1);

        tbody.innerHTML = result.endpoints
          .map((endpoint) => {
            const statuses = Object.entries(endpoint.statuses)
              .map(([code, count]) => code + ':' + count)
              .join(', ');
            const width = Math.min(100, Math.round((endpoint.p95 / maxP95) * 100));
            const failClass = endpoint.failed > 0 ? 'danger' : 'ok';

            return '<tr>' +
              '<td><strong>' + endpoint.label + '</strong></td>' +
              '<td>' + endpoint.count + '</td>' +
              '<td class="' + failClass + '">' + endpoint.failed + '</td>' +
              '<td>' + formatMs(endpoint.p50) + '</td>' +
              '<td>' + formatMs(endpoint.p95) + '</td>' +
              '<td>' + formatMs(endpoint.max) + '</td>' +
              '<td>' + statuses + '</td>' +
              '<td><div class="bar"><span style="width:' + width + '%"></span></div></td>' +
            '</tr>';
          })
          .join('');

        empty.hidden = true;
        table.hidden = false;
      };

      form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const data = Object.fromEntries(new FormData(form).entries());
        button.disabled = true;
        table.hidden = true;
        empty.hidden = false;
        summary.innerHTML = '';
        status.textContent = 'Ejecutando prueba, espera unos segundos...';

        try {
          const response = await fetch('/api/run', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              mode: data.mode,
              durationSeconds: Number(data.durationSeconds),
              concurrency: Number(data.concurrency),
            }),
          });
          const body = await response.json();

          if (!response.ok) {
            throw new Error(body.error || 'No fue posible ejecutar la prueba.');
          }

          render(body);
          status.textContent = 'Prueba completada en ' + body.elapsedSeconds.toFixed(1) + ' segundos.';
        } catch (error) {
          status.textContent = 'Error: ' + error.message;
        } finally {
          button.disabled = false;
        }
      });
    </script>
  </body>
</html>`;

const server = http.createServer(async (request, response) => {
  if (request.method === 'GET' && request.url === '/') {
    response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    response.end(page);
    return;
  }

  if (request.method === 'GET' && request.url === '/health') {
    sendJson(response, 200, { ok: true });
    return;
  }

  if (request.method === 'POST' && request.url === '/api/run') {
    try {
      const body = await readJson(request);
      const result = await runLoadTest({
        mode: body.mode,
        durationSeconds: body.durationSeconds,
        concurrency: body.concurrency,
      });

      sendJson(response, 200, result);
    } catch (error) {
      sendJson(response, 500, { error: error.message });
    }
    return;
  }

  sendJson(response, 404, { error: 'Ruta no encontrada' });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Dashboard de carga disponible en http://localhost:${PORT}`);
});
