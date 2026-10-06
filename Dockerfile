# Multi-stage build: each FROM starts a new stage. Later stages copy only what they need from earlier ones,
# so the final production image contains Nginx + the built files, not Node or node_modules.

# ---- deps: install packages once; this layer is cached until package*.json changes ----
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ---- dev: Vite dev server (used by `docker compose up`) ----
FROM deps AS dev
COPY . .
EXPOSE 5173
# --host 0.0.0.0 so the server is reachable from outside the container
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# ---- build: produce dist/ ----
FROM deps AS build
COPY . .
# Vite bakes VITE_* variables into the JavaScript at build time, so the endpoint is a build argument,
# not a runtime environment variable.
ARG VITE_CONTACT_ENDPOINT=""
ENV VITE_CONTACT_ENDPOINT=$VITE_CONTACT_ENDPOINT
RUN npm run build

# ---- prod: tiny Nginx image serving the static files ----
FROM nginx:alpine AS prod
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
