import swaggerJsdoc, { Options } from "swagger-jsdoc";

const options: Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "AimeffexMart API",
      version: "1.0.0",
      description: "Backend APIs for AimeffexMart application"
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Development server"
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ["./src/routes/*.ts"]
};

export const swaggerSpec = swaggerJsdoc(options);
