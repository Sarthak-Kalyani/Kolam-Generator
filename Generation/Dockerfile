
# # Version prev
# FROM node:25-bullseye-slim AS release
# WORKDIR /usr/src/app

# # copy full source (not dist)
# COPY . .

# # install deps normally
# RUN npm install

# EXPOSE 3000
# ENV NEXT_TURBOPACK=0
# CMD ["npm", "run", "dev"]


FROM node:25-bullseye-slim AS release

WORKDIR /usr/src/app

# Copy only package files first (better caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the full project AFTER installing deps
COPY . .

# Build Next.js (Tailwind + PostCSS runs here)
RUN npm run build

# Expose the port Next.js will use
EXPOSE 3000

# Start the production server
CMD ["npm", "start"]
