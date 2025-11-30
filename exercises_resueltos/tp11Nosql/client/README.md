# Book Discovery Platform

A platform for discovering books, reading reviews, and community voting. Built with React and Vite.

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to a GitHub repository.
2. Go to [Vercel](https://vercel.com) and sign up/login.
3. Click "Add New..." -> "Project".
4. Import your GitHub repository.
5. Vercel will automatically detect Vite.
6. Click "Deploy".

### Netlify
1. Push your code to GitHub.
2. Go to [Netlify](https://www.netlify.com).
3. "Add new site" -> "Import an existing project".
4. Connect to GitHub and select your repo.
5. Build command: `npm run build`.
6. Publish directory: `dist`.
7. Click "Deploy site".

## 🔄 CI/CD Pipelines (GitHub Actions)

This project includes automated workflows located in `.github/workflows/`:

### 1. Build Validation (`build.yml`)
- **Trigger**: Pull Requests to `main` or `master`.
- **Action**: Installs dependencies and runs `npm run build`.
- **Goal**: Ensures that new code doesn't break the build process.

### 2. Automated Testing (`test.yml`)
- **Trigger**: Pull Requests to `main` or `master`.
- **Action**: Installs dependencies and runs unit tests (`vitest`).
- **Goal**: Prevents regressions by ensuring all tests pass before merging.

### 3. Docker Publishing (`docker.yml`)
- **Trigger**: Push to `main` or `master`.
- **Action**: Builds a Docker image and pushes it to GitHub Container Registry (ghcr.io).
- **Goal**: Automates the delivery of the containerized application.

## 🐳 Docker

### Prerequisites
- Docker installed on your machine.

### Running Locally with Docker

1. **Build the image:**
   ```bash
   docker build -t book-discovery .
   ```

2. **Run the container:**
   ```bash
   docker run -p 8080:80 book-discovery
   ```

3. **Access the app:**
   Open [http://localhost:8080](http://localhost:8080) in your browser.

### Docker Optimization
- Uses **Multi-stage builds**:
  - `builder` stage: Installs dependencies and builds the app.
  - `production` stage: Uses lightweight `nginx:alpine` to serve the static files.
- **Nginx**: Configured to handle SPA routing (redirects all requests to `index.html`).

## 🛠️ Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start dev server:**
   ```bash
   npm run dev
   ```

3. **Run tests:**
   ```bash
   npm run test
   ```
