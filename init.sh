#!/bin/sh

echo "📦 Lancement du serveur..."
bun install
bun --watch src/app.ts