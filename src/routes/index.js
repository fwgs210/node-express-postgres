const router = require('express').Router();
const v1 = require('./v1')
const v2 = require('./v2')

// v1 route
router.use('/api/v1', v1)
router.use('/api/v2', v2)

module.exports = router