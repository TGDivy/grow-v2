import { Express, Request, Response } from "express";
import { version } from "../../package.json";
import { logger } from "./logger";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Grow APP API",
            version,
            description:
                "An app to manage your projects, tasks, time and reflect, to become a better version of yourself.",
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
        servers: [
            {
                url: "http://localhost:8080",
            },
        ],
    },
    apis: ["src/routes/*.ts", "../routes.ts", "./src/scheme/*ts", "./src/routes.ts"],
};

const swaggerSpec = swaggerJsdoc(options);

const swaggerDocs = (app: Express, port: number) => {
    // Swagger page
    app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    // Docs in JSON format
    app.get("docs.json", (req: Request, res: Response) => {
        res.setHeader("Content-Type", "application/json");
        res.send(swaggerSpec);
    });

    logger.info(`Swagger docs available at http://localhost:${port}/docs`);
};

export { swaggerDocs };
