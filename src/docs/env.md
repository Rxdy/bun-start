# Documentation des variables d'environnement

Ce document décrit les variables d'environnement utilisées dans le projet **Pinguiz**, une API développée avec **Hono**, **Bun**, et **TypeScript**. Ces variables sont définies dans le fichier `.env` à la racine du projet, qui contient des valeurs par défaut pour le développement. Ce fichier est versionné dans Git pour servir de modèle pour les nouveaux projets. Pour les environnements spécifiques (ex. production), utilisez un fichier `.env.local` (non versionné) pour surcharger les valeurs sensibles.

## Table des matières

-   [API](#api)
-   [MySQL](#mysql)
-   [phpMyAdmin](#phpmyadmin)
-   [Hashage](#hashage)
-   [JWT](#jwt)
-   [CORS](#cors)
-   [Cookie](#cookie)
-   [SMTP (Email)](#smtp-email)

## API

Variables pour configurer le serveur API.

| Variable | Description                                             | Valeur par défaut | Exemple |
| -------- | ------------------------------------------------------- | ----------------- | ------- |
| `PORT`   | Port sur lequel l’API écoute (utilisé par Hono).        | `3000`            | `3000`  |
| `ENV`    | Environnement de l’application (`dev`, `prod`, `test`). | `dev`             | `prod`  |

## MySQL

Variables pour configurer la connexion à la base de données MySQL.

| Variable              | Description                                                 | Valeur par défaut | Exemple                |
| --------------------- | ----------------------------------------------------------- | ----------------- | ---------------------- |
| `MYSQL_ROOT_PASSWORD` | Mot de passe de l’utilisateur root pour MySQL.              | `root_password`   | `strong_root_password` |
| `MYSQL_DATABASE`      | Nom de la base de données utilisée par l’application.       | `namedb`          | `my_app_db`            |
| `MYSQL_USER`          | Nom d’utilisateur MySQL pour l’application.                 | `user`            | `app_user`             |
| `MYSQL_PASSWORD`      | Mot de passe de l’utilisateur MySQL.                        | `user_password`   | `secure_user_password` |
| `MYSQL_HOST`          | Nom d’hôte ou service Docker pour le serveur MySQL.         | `mysql`           | `db_host`              |
| `MYSQL_PORT`          | Port du serveur MySQL.                                      | `3306`            | `3306`                 |
| `MYSQL_DIALECT`       | Dialecte de la base de données (pour l’ORM, ex. Sequelize). | `mysql`           | `mysql`                |

## phpMyAdmin

Variables pour configurer phpMyAdmin, utilisé pour gérer la base de données MySQL.

| Variable       | Description                                       | Valeur par défaut | Exemple                |
| -------------- | ------------------------------------------------- | ----------------- | ---------------------- |
| `PMA_HOST`     | Nom d’hôte du serveur MySQL pour phpMyAdmin.      | `mysql`           | `mysql`                |
| `PMA_USER`     | Nom d’utilisateur pour se connecter à phpMyAdmin. | `user`            | `app_user`             |
| `PMA_PASSWORD` | Mot de passe pour phpMyAdmin.                     | `user_password`   | `secure_user_password` |

## Hashage

Variables pour la gestion du hachage des mots de passe.

| Variable       | Description                                                                 | Valeur par défaut  | Exemple            |
| -------------- | --------------------------------------------------------------------------- | ------------------ | ------------------ |
| `HASH_MDP`     | Nombre de tours pour l’algorithme de hachage (ex. bcrypt).                  | `10`               | `12`               |
| `PASS_DEFAULT` | Mot de passe par défaut pour les utilisateurs (à utiliser avec précaution). | `default_password` | `initial_password` |

## JWT

Variables pour la gestion des JSON Web Tokens (JWT) utilisés dans l’authentification.

| Variable     | Description                                         | Valeur par défaut | Exemple              |
| ------------ | --------------------------------------------------- | ----------------- | -------------------- |
| `JWT_SECRET` | Clé secrète pour signer et vérifier les tokens JWT. | `your_jwt_secret` | `long_random_secret` |

**Note** : En production, générez une clé sécurisée avec `openssl rand -base64 32`.

## CORS

Variables pour configurer le middleware CORS (Cross-Origin Resource Sharing).

| Variable           | Description                                              | Valeur par défaut                             | Exemple                        |
| ------------------ | -------------------------------------------------------- | --------------------------------------------- | ------------------------------ |
| `CORS_ORIGIN`      | Origines autorisées, séparées par des virgules.          | `http://localhost:3000,http://localhost:5173` | `https://myapp.com`            |
| `CORS_METHODS`     | Méthodes HTTP autorisées, séparées par des virgules.     | `GET,POST,PUT,DELETE,OPTIONS`                 | `GET,POST`                     |
| `CORS_HEADERS`     | Headers autorisés, séparés par des virgules.             | `Content-Type,Authorization`                  | `Content-Type,X-Custom-Header` |
| `CORS_AGE`         | Durée (en secondes) du cache des pré-vérifications CORS. | `86400`                                       | `86400` (24 heures)            |
| `CORS_CREDENTIALS` | Autorise les credentials (ex. cookies) si `true`.        | `true`                                        | `false`                        |

## Cookie

Variables pour la gestion des cookies.

| Variable        | Description                                            | Valeur par défaut | Exemple |
| --------------- | ------------------------------------------------------ | ----------------- | ------- |
| `COOKIE_SECURE` | Cookies envoyés uniquement via HTTPS (`true` en prod). | `false`           | `true`  |

## SMTP (Email)

Variables pour configurer l’envoi d’emails via `nodemailer` (utilisé par la classe `Mailer`).

| Variable        | Description                                              | Valeur par défaut                   | Exemple                         |
| --------------- | -------------------------------------------------------- | ----------------------------------- | ------------------------------- |
| `SMTP_HOST`     | Nom d’hôte du serveur SMTP.                              | `smtp.example.com`                  | `smtp.gmail.com`                |
| `SMTP_PORT`     | Port du serveur SMTP (587 pour TLS, 465 pour SSL).       | `587`                               | `587`                           |
| `SMTP_SECURE`   | Utilise SSL (`true`) ou TLS/STARTTLS (`false`).          | `false`                             | `true`                          |
| `SMTP_USER`     | Nom d’utilisateur ou email pour l’authentification SMTP. | `smtp_user`                         | `user@gmail.com`                |
| `SMTP_PASSWORD` | Mot de passe ou token pour l’authentification SMTP.      | `smtp_password`                     | `app_specific_password`         |
| `SMTP_FROM`     | Adresse et nom de l’expéditeur des emails.               | `"Pinguiz App <no-reply@mail.com>"` | `"My App <no-reply@myapp.com>"` |

**Note** : Pour Gmail, utilise un mot de passe d’application (voir [Google Account Help](https://support.google.com/accounts/answer/185833)). Personnalisez ces valeurs dans `.env.local` pour la production.

---
