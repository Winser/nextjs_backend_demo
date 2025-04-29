
const swaggerUi = require('swagger-ui-express');
import swaggerConfig from "../../swagger.config";

const swaggerController = require('express').Router();
swaggerController.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerConfig));

export default swaggerController;