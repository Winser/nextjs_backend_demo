import swaggerJSDoc, { OAS3Options } from "swagger-jsdoc";

const swaggerOptions: OAS3Options = {
  swaggerDefinition: {
    openapi: "3.1.0",
    info: {
      title: "Backend Demo API",
      version: "1.0.0",
      description: "API documentation for the Backend Demo project",
    },
    securitySchemes: {
      JWT: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    tags: []
  },
  apis: ["./src/routes/**/*.ts"],
};

export default swaggerJSDoc(swaggerOptions);