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

router.get('/populars', function(req, res, next) {
    engine.popular(function (error, response, body) {
        if (!error && response.statusCode == 200) {
            winston.info(body);
            // console.log(body) // Show the HTML for the Google homepage.
        }
        // res.render('index',{title: 'Express',data: body});
        res.send(body);
    })
    // res.render('index', { title: 'Express' });
});

router.get('/login',function (req,res,next) {
    res.render('login');
});
router.post('/login/auth',function (req, res, next) {
    engine.bbpost('login',req.cookies.token,{'mobile':req.body.phone,'password':req.body.password},function (error,response,body) {
        if (!error && response.statusCode == 200){
            res.cookie('token',body['accessToken']);
            res.redirect('/orders');
        }else {
            res.render('error',{'message':error.message,'error':error});
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
