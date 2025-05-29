# Variables
SRC = src/app.ts
ENV=development

# Commandes
.PHONY: run test audit install clear-cache up wait-master wait-replica start-server

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

cache:
	@echo "Vidage du cache de Bun..."
	-@bun --bun cache-clear || echo "Commande cache-clear non disponible, passage à l'étape suivante"

up:
	@make cache
	@make install
	@make run

wait-master:
	@echo "⏳ Attente de la base master..."
	@until nc -z mariadb 3306; do \
		echo "⏳ master pas prêt, attente..."; \
		sleep 2; \
	done
	@echo "✅ Master prêt !"

wait-replica:
	@echo "⏳ Attente de la réplica..."
	@until nc -z pinguiz-sql-replica 3306; do \
		echo "⏳ réplica pas prête, attente..."; \
		sleep 2; \
	done
	@echo "✅ Réplica prête !"

start-server: wait-master wait-replica
	@echo "🚀 Lancement du serveur"
	@bun install
	@bun --watch src/app.ts

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