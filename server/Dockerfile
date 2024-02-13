FROM denoland/deno:alpine
WORKDIR /app
COPY . .
RUN deno cache mod.ts
CMD ["run", "--allow-net", "--allow-read", "--allow-env", "mod.ts"]