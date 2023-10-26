const express = require('express')
const router = express.Router()
const ravenRoutes = require('./raven-routes')

router.use(express.json())

router.use('/api/raven', ravenRoutes)

module.exports = router