# Chess

## Introduction

This repository contains a chess app. Features:
- Two-player gameplay with moves sent close to real time
- Move validation
- Move history
- Chess clocks
- Responsive UI
- Draws

## Technology Stack

The chess app consists of the following components:

- Django backend with Python
- Redis channel layer for Django channels
- PostgreSQL database
- React Vite frontend with TypeScript and TailwindCSS

## Running the Project

The `.env` file contains example environmental variables for starting the application with Docker. The application has been tested with the following versions:

- Node.js: `v22.16.0`
- npm: `v11.4.1`
- Docker: `v28.1.1`
- Docker Compose: `v2.35.1`

Start the Docker containers with:
```bash
docker-compose up
```

To apply the migrations inside the Docker container, run the following command:
```bash
docker-compose exec backend python manage.py migrate
```

To run the frontend, install the dependencies with `npm install` in the `frontend` directory.
Run the frontend in the `frontend` directory with:
```bash
npm run dev
```

The frontend can be accessed at: [http://localhost:5000/](http://localhost:5000/)
