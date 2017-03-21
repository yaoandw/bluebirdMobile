/**
 * Created by yaoandw on 2016/12/27.
 */
var BBConstant =  {
    error_status_login : 10001,
    error_status_biz : 10002,
    error_status_ok : 200,
    base_url : "https://www.jojo.la",
    // debug : typeof v8debug === 'object'
    debug : process.env.NODE_ENV == 'development'
}

module.exports = BBConstant;