const express = require('express')
const {register} = require('../controlers/auth')
const router = express.Router()

router.post('/register',register)
module.exports = router