# # -------------------- Base --------------------
# FROM node:25-bullseye AS base
# WORKDIR /usr/src/app

# # -------------------- Deps --------------------
# FROM base AS deps
# COPY package.json package-lock.json ./

# # native build deps for node-canvas
# RUN apt-get update && apt-get install -y \
#     python3 \
#     build-essential \
#     libcairo2-dev \
#     libjpeg-dev \
#     libpango1.0-dev \
#     libpng-dev \
#     libgif-dev \
#     librsvg2-dev

# RUN npm ci --omit=dev
# RUN npm install -D typescript

# # -------------------- Build --------------------
# FROM deps AS build
# COPY . .
# RUN npm run build

# # -------------------- Release --------------------
# FROM node:25-bullseye-slim AS release
# WORKDIR /usr/src/app
# COPY --from=build /usr/src/app/dist ./dist
# COPY --from=build /usr/src/app/node_modules ./node_modules
# COPY package.json ./

# EXPOSE 3000
# CMD ["node", "dist/index.js"]


FROM node:25-bullseye-slim AS release
WORKDIR /usr/src/app

# copy full source (not dist)
COPY . .

# install deps normally
RUN npm install

EXPOSE 3000
CMD ["npm", "run", "dev"]