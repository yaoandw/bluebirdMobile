/**
 * Created by yaoandw on 2016/12/27.
 */
var request = require('request');
var winston = require('winston');
var BBConstant = require('./BBConstant.js');

function generateErrorWithResponseObject(body) {
    var keys = Object.keys(body);
    for(var k in keys){
        var key = keys[k];
        if (key == "result") {
            continue;
        }
        var value = body[key];
        if (value.constructor === Array){
            var rtn = "";
            for(var v in value){
                var val = value[v];
                rtn = rtn +=val;
            }
            if (rtn.length > 0) {
                return rtn;
            }
        }
    }
    return "系统异常";
}

//javascript define class
//http://www.ruanyifeng.com/blog/2012/07/three_ways_to_define_a_javascript_class.html
var RESTEngine =  {
    //类方法
    //base url request
    bbpost : function (query,token,params,callback) {
        this.bbrequest('POST',query,token,params,callback);
    },

    bbget : function (query,token,params,callback) {
        this.bbrequest('GET',query,token,params,callback);
    },
    bbrequest : function (method,query,token,params,callback) {
        var options = {
            method: method,
            url: BBConstant.base_url + '/' + query,
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer "+token
            },
            form:params

        };
        request.debug = BBConstant.debug
        request(options, function (error, response, body) {
            winston.info('body: '+body);
            winston.info('error: '+error);
            winston.info('response: '+response);
            body = JSON.parse(body);
            body.bbErrorCode = BBConstant.error_status_ok;
            var result = body['result'];
            if(!(typeof result === "undefined") && !result){
                body.bbErrorMsg = generateErrorWithResponseObject(body);
                body.bbErrorCode = BBConstant.error_status_biz;
            }
            if (response.statusCode == 401){
                body.bbErrorMsg = '未登录';
                body.bbErrorCode = BBConstant.error_status_login;
            }
            callback(error,response,body);
        })
    },

    popular : function (callback) {
        request.get(BBConstant.base_url + '/populars', callback)
    },
    // passwordLogin : function (req,callback) {
    //     this.bbpost('login',req.cookies,token,{'mobile':req.body.phone,'password':req.body.password},callback)
    // },
    // messageList : function (req,callback) {
    //     this.bbpost('messages',req.cookies,token,{'pageSize':req.body.pageSize,'page':req.body.page},callback)
    // },
    createNew: function(){
        //实例方法
        var cat = {};
        cat.name = "大毛";
        cat.makeSound = function(){ alert("喵喵喵"); };
        return cat;
    }
}


// var engine = Object.create(RESTEngine);
// var engine = RESTEngine.createNew();
module.exports = RESTEngine;