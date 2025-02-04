const express = require(`express`)
const app = express()
app.use(express.json())
const {authenticate, register} = require(`../controllers/auth-controller.js`)

app.post(`/`, authenticate)
app.post(`/regist`, register)

module.exports = app

// const express = require('express')
// const router = express.Router()

// const { authenticate } = require('../controllers/auth-controller.js')
// router.post('/auth', (req, res, next) => {
//     console.log('POST /auth request received') // Log request
//     next()
// }, authenticate)

// module.exports = router


