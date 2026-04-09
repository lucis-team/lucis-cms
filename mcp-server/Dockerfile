FROM node:22-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

RUN apk add --no-cache tini

ENV NODE_ENV=production
WORKDIR /app

COPY package.json index.js ./

EXPOSE 3001

USER node

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "index.js"]
