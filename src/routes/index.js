const router = require('express').Router();
const v1 = require('./v1')
const notFoundRoute = require('./notFound')
const documentation = require('../swagger')

router.use('/', documentation)

// v1 route
router.use('/api/v1', v1)

// router.use(notFoundRoute)

module.exports = router