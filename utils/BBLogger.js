var winston = require('winston');

var BBLogger = {
  createNew: function(){
    //实例方法
    var logger = new winston.Logger();
    logger.add(winston.transports.File, { filename: 'bluebirdMobile.log' });
    return logger;
  }
}

module.exports = BBLogger.createNew();