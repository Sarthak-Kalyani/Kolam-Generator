# Kolam Explorer

## Running Mobile Frontend

- **Change to the frontend folder:**

  ```powershell
  cd frontend
  ```

- **Install dependencies:**

  ```powershell
  npm install
  # or: yarn install
  ```

- **Start Expo:**

  ```powershell
  npx expo start
  ```

- **Notes:**
  - If your mobile app needs to call the backend from a Docker container, configure the backend URL using an environment variable (see guidance below), do not hard-code a local IP inside source files.
  - For Android emulators use `10.0.2.2` to reach the host's localhost; for Docker containers use `host.docker.internal` when supported.

## Project structure (target)

The intended top-level structure after reorganization:

- `/backend` — Python/FastAPI backend (if present)
- `/ml` — YOLO / ML service
- `/generation` — Next.js generation service
- `/frontend` — React Native mobile app
- `/compose.yaml` — (optional) top-level compose file to orchestrate services
