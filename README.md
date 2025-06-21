ho## Running the Project with Docker

This project is containerized using Docker and Docker Compose for easy setup and deployment. Below are the project-specific instructions and requirements for running the application in a Dockerized environment.

### Project-Specific Docker Requirements
- **Node.js Version:** The Dockerfile uses `node:22.13.1-slim` (set via the `NODE_VERSION` build argument).
- **Build Tool:** The app is built and served using [Vite](https://vitejs.dev/).
- **Non-root User:** The production container runs as a non-root user for security.

### Environment Variables
- The Docker Compose file includes a commented `env_file: ./.env` line. If your project requires environment variables, ensure you have a `.env` file in the project root and uncomment this line in `docker-compose.yml`.

### Build and Run Instructions
1. **(Optional) Configure Environment Variables:**
   - If your app requires environment variables, create a `.env` file in the project root.
2. **Build and Start the Application:**
   - Run the following command from the project root:
     ```sh
     docker compose up --build
     ```
   - This will build the Docker image and start the service defined as `js-app`.

### Exposed Ports
- **5173:** The Vite preview server is exposed on port `5173` (mapped to the same port on your host).

### Special Configuration Notes
- No external services (databases, caches, etc.) are configured by default. If you add such services, update the `docker-compose.yml` accordingly.
- No persistent volumes are required for this service as per the current configuration.

---

*If you update the Dockerfile or add new services, remember to update this section to reflect those changes.*
