# Stage 1: Build js files from ts
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

RUN npm prune --production

# Stage 2: Build image for production
FROM node:22-alpine AS runner

ENV PORT=3300

# Install Chromium for Puppeteer
RUN apk update && apk add chromium>131.0.6778.85-r0

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3300

CMD ["node", "dist/main.js"]
