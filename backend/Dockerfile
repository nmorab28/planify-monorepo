FROM node:22-bookworm-slim

RUN apt-get update && apt-get install -y \
  build-essential \
  python3 \
  git \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 1337

CMD ["npm", "run", "develop"]