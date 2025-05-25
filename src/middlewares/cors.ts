import { type Context, type Next } from "hono";

interface CorsOptions {
    origins: string[] | ((origin: string | null) => boolean); // Origines autorisées ou fonction de validation
    methods?: string[]; // Méthodes HTTP autorisées (ex. GET, POST)
    headers?: string[]; // Headers autorisés
    credentials?: boolean; // Autoriser les cookies/credentials
    maxAge?: number; // Durée du cache des pré-vérifications (en secondes)
}

export const cors = (options: CorsOptions) => {
    return async (c: Context, next: Next) => {
        try {
            const origin = c.req.header("Origin");
            const requestMethod = c.req.method;

            let isOriginAllowed = false;
            if (typeof options.origins === "function") {
                isOriginAllowed = options.origins(origin);
            } else {
                isOriginAllowed = origin
                    ? options.origins.includes(origin)
                    : false;
            }

            if (isOriginAllowed && origin) {
                c.header("Access-Control-Allow-Origin", origin);
                if (options.credentials) {
                    c.header("Access-Control-Allow-Credentials", "true");
                }
                if (options.methods) {
                    c.header(
                        "Access-Control-Allow-Methods",
                        options.methods.join(", ")
                    );
                }
                if (options.headers) {
                    c.header(
                        "Access-Control-Allow-Headers",
                        options.headers.join(", ")
                    );
                }
                if (options.maxAge) {
                    c.header(
                        "Access-Control-Max-Age",
                        options.maxAge.toString()
                    );
                }
            } else if (requestMethod !== "OPTIONS") {
                return c.json({ error: "Origine non autorisée" }, 403);
            }

            if (requestMethod === "OPTIONS") {
                return c.newResponse(null, { status: 204 });
            }

            await next();
        } catch (error) {
            console.error("Erreur dans le middleware CORS:", error);
            return c.json({ error: "Erreur serveur" }, 500);
        }
    };
};
