# Variables
SRC = src/app.ts
ENV=development

# Commandes
.PHONY: run test audit install clear-cache up migrate undo-migrate undo-migrate-by-name seed undo-seed generate-migration generate-seed

run:
	bun --hot $(SRC)

test:
	bun test

audit:
	@echo "Vérification des dépendances obsolètes..."
	@bun outdated
	@echo "\nAudit de sécurité des dépendances..."
	@bun audit || npm audit

install:
	bun install

up:
	@make cache
	@make install
	@make run

migrate:
	npx sequelize-cli db:migrate --env $(ENV)

undo-migrate:
	npx sequelize-cli db:migrate:undo --env $(ENV)

undo-migrate-by-name:
	@echo "Nom requis : make undo-migrate-by-name name=20240530103000-create-user.js"
	@test $(name)
	npx sequelize-cli db:migrate:undo --name $(name) --env $(ENV)

seed:
	npx sequelize-cli db:seed:all --env $(ENV)

undo-seed:
	npx sequelize-cli db:seed:undo:all --env $(ENV)

generate-migration:
	@test $(name)
	npx sequelize-cli migration:generate --name $(name)

generate-seed:
	@test $(name)
	npx sequelize-cli seed:generate --name $(name)