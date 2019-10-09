const router = require('express').Router();
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./src/swagger/swagger.yaml');
 
router.use('/documentation', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

module.exports = router;