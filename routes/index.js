const express = require('express')
const router = express.Router()

router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' })
})

router.get('/register', (req, res) => {
    res.render('register')
})

router.get('/login', (req, res) => {
    res.render('login')
})

router.get('/admin', (req, res) => {
    res.render('')
})

module.exports = router