import swaggerJSDoc from 'swagger-jsdoc';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Spots API for Busking Project',
    version: '1.0.0',
    description: 'Performers, Spots Data + Graphics, and Prediction Model',
  },
  servers: [
    {
      url: 'http://localhost:4000',
      description: 'Development server',
    },
  ],
};

const options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: ['./src/routes/*.ts'],
};

export const swaggerSpec = swaggerJSDoc(options);