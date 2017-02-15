var log4js = require('log4js');
var path = require('path');

//log4js.configure(path.resolve(__dirname, '../../conf/log4js.json'));
//var consoleLog = log4js.getLogger('console');
//'date_File'

var fileLogger = log4js.getLogger();
    fileLogger.info('小提示: This server is started ');

exports.logger = fileLogger;

// express
exports.use = function(app) {
    //app.use(log4js.connectLogger(fileLogger, {level:'debug', format:':method :url'}));
}

