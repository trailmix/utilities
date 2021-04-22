FROM alpine:3.13.2 AS organizer

# Installation files
WORKDIR /out/usr/src/install
COPY src src
COPY mod.ts .
COPY import_map.json .

FROM hayd/alpine-deno:1.9.0 AS runner
COPY --from=organizer /out /

# Install 
WORKDIR /usr/src/install
ENV PATH "/root/.deno/bin:$PATH"
