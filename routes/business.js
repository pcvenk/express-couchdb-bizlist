var express = require('express');
var router = express.Router();
var uuid = require('node-uuid');

const NodeCouchDb = require('node-couchdb');


// not admin party
const couchAuth = new NodeCouchDb({
    auth: {
        user: 'admin',
        pass: '1234'
    }
});

//INDEX ROUTE
router.get('/', function (req, res) {
    res.send('respond with a resource');
});

//NEW ROUTE
router.get('/new', function (req, res) {
    res.render('addBusiness');
});

//CREATE ROUTE
router.post('/create', function (req, res) {

    req.checkBody('name', 'Name field is required').notEmpty();
    req.checkBody('category', 'Category field is required').notEmpty();
    req.checkBody('city', 'City field is required').notEmpty();

    var errors = req.validationErrors();

    if (errors) {
        res.render('addBusiness', {
            errors: errors
        });
    } else {
        res.send('All is well');
    }
});


module.exports = router;
