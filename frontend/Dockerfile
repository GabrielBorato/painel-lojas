##### DEPENDENCIES

FROM --platform=linux/amd64 node:alpine AS deps
WORKDIR /app

COPY package.json package-lock* ./

RUN \
  if [ -f package-lock.json ]; then npm install --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

##### ORACLE

FROM node:latest AS oracle

# Navega para a pasta de instalação do Oracle Instant Client
WORKDIR /opt/oracle

# Atualiza e instala o WGET
RUN apt-get update && \
  apt-get install -y libaio1 unzip wget

# Baixa e instala o Oracle Instant Client utilizando o WGET
RUN wget https://download.oracle.com/otn_software/linux/instantclient/instantclient-basiclite-linuxx64.zip && \
  unzip instantclient-basiclite-linuxx64.zip && \
  rm -f instantclient-basiclite-linuxx64.zip && \
  mv instantclient* instantclient_latest && \
  cd instantclient_latest && \
  rm -f *jdbc* *occi* *mysql* *jar uidrvci genezi adrci && \
  echo /opt/oracle/instantclient_latest > /etc/ld.so.conf.d/oracle-instantclient.conf && \
  ldconfig

##### BUILDER

FROM node:latest AS builder
WORKDIR /app


# Biblioteca necessária para executar o Oracle Instant Client
COPY --from=oracle /opt/oracle /opt/oracle
COPY --from=oracle /usr/lib/x86_64-linux-gnu/libaio.so.1 /usr/lib/x86_64-linux-gnu/libaio.so.1
ENV LD_LIBRARY_PATH /opt/oracle/instantclient_latest
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN \
  if [ -f package-lock.json ]; then SKIP_ENV_VALIDATION=1 npm run build; \
  else echo "Lockfile not found." && exit 1; \
  fi

COPY --from=deps /app/node_modules/oracledb/build /app/.next/standalone/node_modules/oracledb/build

##### RUNNER

FROM --platform=linux/amd64 gcr.io/distroless/nodejs22-debian12 AS runner

WORKDIR /app

COPY --from=oracle /opt/oracle /opt/oracle

# Biblioteca necessária para executar o Oracle Instant Client
COPY --from=oracle /usr/lib/x86_64-linux-gnu/libaio.so.1 /usr/lib/x86_64-linux-gnu/libaio.so.1

COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

ENV LD_LIBRARY_PATH /opt/oracle/instantclient_latest
ENV NEXT_TELEMETRY_DISABLED 1
ENV UV_THREADPOOL_SIZE 10
ENV TZ=America/Sao_Paulo

EXPOSE 3000
ENV PORT 3000

CMD ["server.js"]
