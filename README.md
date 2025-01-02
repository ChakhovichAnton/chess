# Chess

## Introduction

This repository contains a chess game. It consists of the following components:

- Django backend
- PostgreSQL database
- React frontend

The `.env` file contains environmental variables for starting the application with Docker.

## Running the Project

Start the Docker containers with:
`docker-compose up`

To make a migration of the chess app inside the Docker container, run the following command:
`docker-compose exec backend python manage.py makemigrations chess`

To apply the migrations inside the Docker container, run the following command:
`docker-compose exec backend python manage.py migrate`

To run the frontend, install the dependencies with `npm install` in the `frontend` directory.
Run the frontend in the `frontend` directory with `npm run dev`.
Access the frontend at `http://localhost:5000/`
