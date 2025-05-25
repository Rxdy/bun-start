# Variables
SRC = src/app.ts

# Commandes
.PHONY: run test audit install clear-cache up

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