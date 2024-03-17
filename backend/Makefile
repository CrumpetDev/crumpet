ifneq (,$(wildcard ./.env.development))
    include .env.development
    export
endif

# Define the path to the Docker Compose file
DC_FILE := -f docker-compose.dev.yml

# Default values for variables
PG_CONTAINER := db
PG_USER := $(DB_USERNAME)
PG_PASSWORD := $(DB_PASSWORD)
PG_DB := $(DB_NAME)
PG_HOST := $(DB_HOST)
PG_PORT := $(DB_PORT)

# Command to execute Django manage.py within the Docker web service container
MANAGE := docker-compose $(DC_FILE) exec web python manage.py

# Docker commands
DOCKER_DEV_BUILD := docker-compose $(DC_FILE) build
DOCKER_DEV_UP := docker-compose $(DC_FILE) up
DOCKER_DEV_DOWN := docker-compose $(DC_FILE) down

docker-dev-build:
	$(DOCKER_DEV_BUILD) ${ARGS}

docker-dev-up:
	$(DOCKER_DEV_UP) ${ARGS}

docker-dev-down:
	$(DOCKER_DEV_DOWN) ${ARGS}

# Ensure the database container is running
ensure-db-up:
	@echo "Ensuring the database container $(PG_CONTAINER) is up..."
	docker-compose $(DC_FILE) up -d $(PG_CONTAINER)

# Ensure the web container is running
ensure-web-up:
	@echo "Ensuring the web container is up..."
	docker-compose $(DC_FILE) up -d web

# Reset the database
reset-db: ensure-db-up
	@echo "Resetting the database..."
	docker-compose $(DC_FILE) exec $(PG_CONTAINER) psql -U $(PG_USER) -d postgres -p $(PG_PORT) -c "DROP DATABASE IF EXISTS $(PG_DB);"
	docker-compose $(DC_FILE) exec $(PG_CONTAINER) psql -U $(PG_USER) -d postgres -p $(PG_PORT) -c "CREATE DATABASE $(PG_DB);"
	@echo "Database $(PG_DB) has been reset."

# Apply migrations
migrate: ensure-db-up ensure-web-up
	$(MANAGE) migrate

# Seed the database
seed-db: ensure-db-up ensure-web-up
	$(MANAGE) seed

# Comprehensive database setup (reset, migrate, seed)
setup-db: reset-db migrate seed-db

# Custom command to enter the Docker shell
docker-dev-sh:
	docker-compose $(DC_FILE) exec web /bin/bash