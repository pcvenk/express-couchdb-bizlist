var express = require('express');
var router = express.Router();

//INDEX ROUTE
router.get('/', function(req, res) {
  res.send('respond with a resource');
});

//ADD ROUTE
router.get('/add', function(req, res) {
  res.render('addBusiness');
});



module.exports = router;
