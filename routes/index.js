var express = require('express');
var router = express.Router();
var request = require('request');
var winston = require('winston');
var engine = require('../utils/RESTEngine.js');

/* GET home page. */
router.get('/', function(req, res, next) {
    engine.popular(function (error, response, body) {
      if (!error && response.statusCode == 200) {
        winston.info(body);
        // console.log(body) // Show the HTML for the Google homepage.
      }
      res.render('index',{title: 'Express',data: body});
        // res.send(body);
    })
  // res.render('index', { title: 'Express' });
});

router.get('/:query', function(req, res, next) {
    var query = req.params.query;
    engine.bbget(query,null,null,function (error, response, body) {
        if (!error && response.statusCode == 200) {
            winston.info(body);
        }
        res.send(body);
    })
    // res.render('index', { title: 'Express' });
});
router.get('/:query1/:query2', function(req, res, next) {
    var query1 = req.params.query1;
    var query2 = req.params.query2;
    engine.bbget(query1+'/'+query2,req.cookies.token,null,function (error, response, body) {
        if (!error) {
            winston.info(body);
            res.send(body);
        }else {
            winston.info(error);
            res.send(error);
        }
    })
});

router.post('/:query1', function(req, res, next) {
    var query1 = req.params.query1;
    engine.bbpost(query1,req.cookies.token,req.body,function (error, response, body) {
        if (!error) {
            winston.info(body);
            res.send(body);
        }else {
            winston.info(error);
            res.send(error);
        }
    })
});

router.get('/login',function (req,res,next) {
    res.render('login');
});
router.post('/login/auth',function (req, res, next) {
    engine.bbpost('login',req.cookies.token,{'mobile':req.body.mobile,'password':req.body.password},function (error,response,body) {
        if (!error) {
            winston.info(body);
            res.cookie('token',body['accessToken']);
            res.send(body);
        }else {
            winston.info(error);
            res.send(error);
        }

    })
});

router.get('/orders',function (req, res, next) {
    engine.bbget('orders',req.cookies.token,{'pageSize':req.body.pageSize,'page':req.body.page},function (error,response,body) {
        if (!error && response.statusCode == 200){
            res.render('consumer/orderList',{'items':body['items']});
        }else {
            res.render('error',{'message':error.message,'error':error});
        }

    })
});

module.exports = router;
