'use strict';

var express = require('express');
var router = express.Router();
var uuid = require('node-uuid');

const NodeCouchDb = require('node-couchdb');


// not admin party
const couch = new NodeCouchDb({
    auth: {
        user: 'cecko',
        pass: 'mojegeslo'
    }
});

var flashmsg = undefined;

//INDEX ROUTE
router.get('/', function (req, res) {
    const dbName = "bizlist";
    const viewUrl = "_design/allbusiness/_view/all";

    const queryOptions = {};

    couch.get(dbName, viewUrl, queryOptions).then(({data, headers, status}) => {
        // console.log(data.rows);
        res.render('business', {
            businesses: data.rows,
            msgdisplay: flashmsg
        });
        console.log('========');
        console.log(req.flash('success'));

    }, err => {
        res.send(err);
    });
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
        couch.insert("bizlist", {
            _id: uuid.v1(),
            name: req.body.name,
            category: req.body.category,
            website: req.body.website,
            phone: req.body.phone,
            address: req.body.address,
            city: req.body.city,
            zip: req.body.zip

        }).then(({data, headers, status}) => {
            req.flash('success', 'Business successfully added');
            res.redirect('/business');

            //todo fix the display msg
            router.locals.flashmsg = req.flash('success');
            console.log('*******');
            console.log(router.locals.flashmsg);

        }, err => {
            res.send(err);
        });
    }
});

//SHOW ROUTE
router.get('/show/:id', function(req, res, next){
    couch.get('bizlist', req.params.id).then(({data, headers, status}) => {
        res.render('show-business', {
            business: data
        });
    }, err => {
        res.send(err);
    });

});

//EDIT ROUTE
router.get('/edit/:id', function(req, res){
    couch.get('bizlist', req.params.id).then(({data, headers, status}) => {
        res.render('edit-business', {
            business: data
        });
    }, err => {
        res.send(err);
    });
});

//UPDATE ROUTE
router.post('/update/:id', function(req, res){

    //validation checking
    req.checkBody('name', 'Name field is required').notEmpty();
    req.checkBody('category', 'Category field is required').notEmpty();
    req.checkBody('city', 'City field is required').notEmpty();

    var errors = req.validationErrors();

    if (errors) {
        //grabbing the selected biz
        couch.get('bizlist', req.params.id).then(({data, headers, status}) => {
            res.render('edit-business', {
                business: data,
                errors: errors
            });
        }, err => {
            res.send(err);
        });

    } else{
        couch.get('bizlist', req.params.id).then(({data, headers, status}) => {
            couch.update('bizlist', {
                _id: req.params.id,
                _rev: data._rev,
                name: req.body.name,
                category: req.body.category,
                website: req.body.website,
                phone: req.body.phone,
                address: req.body.address,
                city: req.body.city,
                state: req.body.state,
                zip: req.body.zip

            }).then(({data, headers, status}) => {
                req.flash('success', 'Business Updated');
                res.redirect('/business');

                //todo fix the display msg
                // router.locals.flashmsg = req.flash('success');
                console.log('*******');
                console.log(router.locals.flashmsg);

            }, err => {
                res.send(err);
            });
        }, err => {
            res.send(err);
        });
    }
});


module.exports = router;
