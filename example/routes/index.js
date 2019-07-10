var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Express' });
});

/* Returns if user is logged in */
router.get('/isLoggedIn', (req, res) => {
    if (!req.session.loggedIn) {
        res.json({
            'status': 'failed',
            'errorMessage': 'Not Logged in.'
        })
    } else {
        res.json({
            'status': 'ok'
        })
    }
})

/* Logs user out */
router.get('/logout', (req, res) => {
    clearCookie(fido2MiddlewareConfig.cookie.name)
    req.session.username = undefined;
    res.json({
        'status': 'ok'
    })
})

module.exports = router;