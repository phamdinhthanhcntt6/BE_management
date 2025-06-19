import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "User Management API",
      version: "1.0.0",
      description: "API documentation for User Management System"
    },
    servers: [
      {
        url: "http://localhost:5000/api",
        description: "Development server"
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              description: "User ID"
            },
            name: {
              type: "string",
              description: "User name"
            },
            email: {
              type: "string",
              description: "User email"
            },
            password: {
              type: "string",
              description: "User password (hashed)"
            },
            role: {
              type: "string",
              enum: ["user", "admin"],
              description: "User role"
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "User creation date"
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "User last update date"
            }
          }
        }
      }
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./src/routes/*.ts"], // đường dẫn chứa comment swagger
};

const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app: Express) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: "User Management API Documentation"
  }));
  
  // Endpoint để lấy swagger.json
  app.get("/swagger.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });
};

// Nếu muốn export ra file JSON:
// import fs from 'fs'
// fs.writeFileSync('./swagger.json', JSON.stringify(swaggerSpec, null, 2))
