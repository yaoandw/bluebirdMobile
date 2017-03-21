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
    console.info(req.headers);
    // console.info(req.header('authorization'));
    engine.bbget(query,req.header('authorization'),null,function (error, response, body) {
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
    engine.bbget(query1+'/'+query2,req.header('authorization'),null,function (error, response, body) {
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
    engine.bbpost(query1,req.header('authorization'),req.body,function (error, response, body) {
        if (!error) {
            winston.info(body);
            res.send(body);
        }else {
            winston.info(error);
            res.send(error);
        }
    })
});

// router.get('/login',function (req,res,next) {
//     res.render('login');
// });
router.post('/login/auth',function (req, res, next) {
    engine.bbpost('login',req.header('authorization'),{'mobile':req.body.mobile,'password':req.body.password},function (error,response,body) {
        if (!error) {
            winston.info(body);
            winston.info(body['accessToken']);
            // res.cookie('accessToken',body['accessToken'], {maxAge: 365 * 24 * 60 * 60 * 1000});
            res.send(body);
        }else {
            winston.info(error);
            res.send(error);
        }

    })
});



//------------------------test-------------------
router.get('/test/test/getCookieTest', function (req, res,next) {
    // 如果请求中的 cookie 存在 isVisit, 则输出 cookie
    // 否则，设置 cookie 字段 isVisit, 并设置过期时间为1分钟
    if (req.cookies.isVisit) {
        console.log(req.cookies);
        res.send("再次欢迎访问");
    } else {
        // res.cookie('isVisit', 1, {maxAge: 60 * 1000});
        res.send("please visit setCookieTest first");
    }
});
router.get('/test/test/setCookieTest', function (req, res,next) {
    // 如果请求中的 cookie 存在 isVisit, 则输出 cookie
    // 否则，设置 cookie 字段 isVisit, 并设置过期时间为1分钟
    res.cookie('isVisit', 1, {maxAge: 60 * 1000});
    res.send("欢迎第一次访问");
});

module.exports = router;
