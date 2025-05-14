import {
    Sequelize,
    type Options,
    type PoolOptions,
    type Transaction,
} from "sequelize";
import { initializeAllModels } from "../models";
import { logger } from "../class/logger";

type Dialect = "mysql" | "postgres" | "mariadb" | "sqlite" | "mssql";

class Database {
    public abyss: Sequelize | undefined;
    private static instance: Database;
    private poolConfig: PoolOptions;

    private constructor() {
        this.poolConfig = {
            max: 10,
            min: 0,
            acquire: 30000,
            idle: 10000,
        };
    }

    public async initialize() {
        if (!this.abyss) {
            const abyssConfig = {
                name: process.env.MYSQL_DATABASE || "abyss_db",
                user: process.env.MYSQL_USER || "root",
                password: process.env.MYSQL_PASSWORD || "password",
                host: process.env.MYSQL_HOST || "mysql",
                port: process.env.MYSQL_PORT || "3306",
                dialect: (process.env.MYSQL_DIALECT as Dialect) || "mysql",
            };

            const sequelizeOptions: Options = {
                host: abyssConfig.host,
                port: Number(abyssConfig.port),
                dialect: abyssConfig.dialect,
                dialectOptions: {
                    charset: "utf8mb4",
                },
                logging: (msg, timing) => {
                    logger.loggerSequelize.info({
                        message: msg,
                        executionTime: timing ? `${timing}ms` : "unknown",
                    });
                },
                pool: this.poolConfig,
            };

            this.abyss = new Sequelize(
                abyssConfig.name,
                abyssConfig.user,
                abyssConfig.password,
                sequelizeOptions
            );

            logger.loggerApi.info({
                message: "Pool initialisé",
                pool: {
                    max: this.poolConfig.max,
                    min: this.poolConfig.min,
                    acquire: this.poolConfig.acquire,
                    idle: this.poolConfig.idle,
                },
            });

            await initializeAllModels(this.abyss);
            await this.testConnection(this.abyss, abyssConfig.name);
        }
        return this.abyss;
    }

    private async testConnection(sequelize: Sequelize, dbName: string) {
        try {
            await sequelize.authenticate();
            logger.loggerApi.info(`✅ [MySQL] Connecté à ${dbName}`);
        } catch (error) {
            logger.loggerApi.error(
                `❌ [MySQL] Erreur de connexion à ${dbName}:`,
                error
            );
            throw error;
        }
    }

    public static getInstance(): Database {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }

    public async close() {
        if (this.abyss) {
            await this.abyss.close();
            logger.loggerSequelize.info("🛑 [MySQL] Connexion fermée");
            this.abyss = undefined;
        }
    }

    public async logPoolStats() {
        if (!this.abyss) {
            logger.loggerApi.warn(
                "⚠️ [MySQL] Pas de connexion active pour logger les stats"
            );
            return;
        }

        try {
            const [processList] = await this.abyss.query("SHOW PROCESSLIST");
            logger.loggerApi.info({
                message: "État du pool et connexions MySQL",
                poolStats: {
                    max: this.poolConfig.max,
                    min: this.poolConfig.min,
                    acquire: this.poolConfig.acquire,
                    idle: this.poolConfig.idle,
                },
                activeConnections: processList.length,
            });
        } catch (error) {
            logger.loggerApi.error(
                "❌ [MySQL] Erreur lors de la récupération des stats du pool:",
                error
            );
        }
    }

    // Nouvelle méthode pour exécuter des transactions
    public async withTransaction<T>(
        callback: (sequelize: Sequelize, transaction: Transaction) => Promise<T>
    ): Promise<T> {
        const sequelize = await this.initialize();
        const t = await sequelize.transaction();

        logger.loggerApi.info("📦 [MySQL] Transaction démarrée");

        try {
            const result = await callback(sequelize, t);
            await t.commit();
            logger.loggerApi.info("✅ [MySQL] Transaction validée");
            return result;
        } catch (error) {
            await t.rollback();
            logger.loggerApi.error(
                "❌ [MySQL] Transaction annulée à cause d'une erreur:",
                error
            );
            throw error;
        }
    }
}

export default Database.getInstance();
