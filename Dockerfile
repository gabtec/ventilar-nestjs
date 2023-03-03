# ARG NODE_VERSION 18.13.0
ARG NODE_VERSION=18.14.2

FROM node:${NODE_VERSION}-slim as build-api-stage

WORKDIR /usr/src/api

COPY package*.json ./

RUN npm install

# COPY src ./src
COPY . .

RUN npm run build

# -------- PROD STAGE ----------------

FROM node:${NODE_VERSION}-alpine as production

WORKDIR /usr/src/api

COPY package*.json ./
# RUN npm install --only=production --silent
# RUN npm cache clean --force
ENV NODE_ENV=production 
RUN npm ci

COPY --chown=node:node --from=build-api-stage /usr/src/api/dist ./dist
COPY --chown=node:node --from=build-api-stage /usr/src/api/package.json .
COPY --chown=node:node --from=build-api-stage /usr/src/api/.env.production .
# COPY --from=build-api-stage /usr/src/app/dist ./dist
# COPY --from=build-api-stage /usr/src/app/package.json .
# COPY --from=build-api-stage /usr/src/app/.env .

# CMD ["npm", "run start:prod"]
EXPOSE 3002


USER node
CMD ["node", "dist/main"]