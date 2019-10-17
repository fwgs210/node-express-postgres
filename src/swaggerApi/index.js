const router = require('express').Router();
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./public/documentation.yaml');
 
router.use('/documentation', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

module.exports = router;