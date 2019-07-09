var express = require('express');
var router = express.Router();
var database = require('./db');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* Returns if user is logged in */
router.get('/isLoggedIn', (req, res) => {
  if(!req.session.loggedIn) {
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
  req.session.loggedIn = false;
  req.session.username = undefined;
  res.json({
      'status': 'ok'
  })
})

/* Returns personal info and THE SECRET INFORMATION */
router.get('/personalInfo', (req, res) => {
  if(!req.session.loggedIn) {
      res.json({
          'status': 'failed',
          'errorMessage': 'Access denied'
      })
  } else {
      res.json({
          'status': 'ok',
          'name': req.session.username,
      })
  }
})

module.exports = router;