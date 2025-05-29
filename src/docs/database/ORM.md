# Intéraction entre ORM Sequelize et une base de donnée

## Schéma visuel

Interaction entre le constructeur (db.ts), les models, les seeds, les migrations et la base de données physique (BDD), avec l'encapsulation des tables et leurs attributs.

## Fichier constructeur (db.ts) : initialisation de Sequelize

Ce fichier est le point d'entrée de la configuration de Sequelize. On y crée une instance de la classe Sequelize avec toutes les informations nécessaires (nom de la BDD, identifiants, hôte, dialecte, options de pool, etc.).

Cette instance permet ensuite :

-   d'établir une connexion avec la base de données

-   de gérer les transactions

-   d'exécuter les migrations et seeds

-   de synchroniser les modèles

## Les models : structure logique des tables

Les models sont des représentations objets de nos tables SQL. Ils sont définis avec sequelize.define ou en étendant la classe Model.

Ils décrivent les champs, leurs types, contraintes, relations, etc. Exemple :

```ts
User.init(
    {
        email: {
            ype: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    { sequelize }
);
```

Chaque modèle correspond à une table dans la base de données.

## Les seeds : insérer des données (fixtures)

Les seeds sont des scripts pour insérer automatiquement des données dans la base. Ils ont deux fonctions principales :

-   up: pour insérer les données

-   down: pour les supprimer

Ils permettent d'ajouter :

-   des données de test

-   des données de configuration (roles, permissions)

-   un setup minimal (admin, settings, etc.)

## Les migrations : gérer l'évolution du schéma

Les migrations sont des scripts versionnés qui permettent d'ajouter, modifier ou supprimer des colonnes, des tables, des index...

Chaque migration a deux méthodes :

-   up: applique la modification

-   down: annule cette modification (rollback)

Cela permet de garder une base synchronisée sur toutes les machines/environnements.

## Trois méthodes pour synchroniser ORM et base de données

### "À l'ancienne" : scripts SQL manuels

Tu modifies la base directement avec des requêtes SQL

Tu dois maintenir manuellement la cohérence entre les models et la base

Inconvenients :

-   Aucun contrôle de version, très risqué en production

---

### .sync() : synchronisation automatique

```ts
sequelize.sync({ force: true }): // supprime toutes les tables et les recrée
```

```ts
sequelize.sync({ alter: true }): // modifie la structure existante pour correspondre aux models
```

Avantages :

-   Pratique en dev

Inconvenients :

-   Dangereux en production, aucune maîtrise précise des changements

---

### Migrations + Seeds (recommandée)

Création manuelle de scripts up/down

Exécutés avec sequelize-cli

Permet un historique, du rollback, et une compatibilité multi-env

Avantages :

-   Méthode stable et propre
-   Utilisable en dev et prod

## Composants utilisés par méthode

| Méthode              | Constructor | Models | Migrations | Seeds | Utilisation en prod |
| -------------------- | ----------- | ------ | ---------- | ----- | ------------------- |
| SQL manuel           | ❌          | ❌     | ❌         | ❌    | ✅                  |
| sequelize.sync()     | ✅          | ✅     | ❌         | ✅    | ❌                  |
| Migrations & Seeders | ✅          | ✅     | ✅         | ✅    | ✅                  |

## Migrations & Seeds : pas de lien automatique avec les models

Les migrations et seeds ne lisent PAS les models

C'est au développeur de s'assurer que les models et migrations soient alignés

✉️ Une modification d'un model implique souvent une nouvelle migration

## Roadmap de la méthode Migrations + Seeds

1. Modifier/créer un model Sequelize
1. Créer une migration pour refléter cette modification dans la base
1. (optionnel) Créer des seeds pour insérer les nouvelles données
1. Pusher le code en production
1. Exécuter les migrations → la base est adaptée
1. Exécuter les seeds (si besoin)

Exemple : ajout d'un champ "bio" à User

Tu modifies le model User

Tu crées une migration add-bio-to-user

Tu lances sequelize-cli db:migrate

Tu peux rollback avec db:migrate:undo

## Importance des rollback (undo)

Les migrations et seeds ont un grand avantage :

Pouvoir revenir en arrière si quelque chose tourne mal

Cela permet :

Des tests plus sûrs

Une prod plus stable

Une gestion fine des changements de structure ou de données
