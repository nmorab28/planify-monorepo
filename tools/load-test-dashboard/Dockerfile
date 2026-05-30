FROM node:20-alpine

WORKDIR /app

COPY scripts/load-test-core.mjs scripts/load-test-core.mjs
COPY tools/load-test-dashboard/server.mjs tools/load-test-dashboard/server.mjs

ENV PORT=4010

EXPOSE 4010

CMD ["node", "tools/load-test-dashboard/server.mjs"]
