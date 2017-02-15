var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var template = require('art-template');
var os = require('os');

var app = express();
var logger=require('./routes/util/logUtil').logger;


// 视图引擎设置
template.config('base', '');
template.config('extname', '.html');
template.config('encoding', 'utf-8');
template.config('cache', true);
template.config('openTag', '{{{');
template.config('closeTag', '}}}');
//template.config('compress', true);


app.engine('.html', template.__express);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//路由配置
app.use('/', require('./routes/route'));


if (process.env.NODE_USER) {
  logger.info("run as "+process.env.NODE_USER);
  process.setuid(process.env.NODE_USER);
}

var network = os.networkInterfaces();
var netInfo=network['本地连接']||network['eth0']||[];

process.on("uncaughtException", function (err) {

  var info=netInfo.filter(function(item){
    return item.family=='IPv4';
  }),serverIp=(info.length>0 ? info[0].address : ' 空 ');

  //系统级异常监控
  logger.info('进程异常:',err.message + "\n\n" + err.stack + "\n\n" + err.toString());

  setTimeout(function () {
    process.exit(1);
  }, 5000);

});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  logger.info('[404] url:'+req.path+' error msg:'+err.message+' stacktraces:',err);
  console.log('[404] url:'+req.path+' error msg:'+err.message+' stacktraces:',err);
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    logger.info('[development] error url:'+req.path+' error msg:'+err.message+' stacktraces:',err);
    console.log('[development] error url:'+req.path+' error msg:'+err.message+' stacktraces:',err);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);

  logger.info('[production] error url:'+req.path+' error msg:'+err.message+' stacktraces:',err);
  console.log('[production] error url:'+req.path+' error msg:'+err.message+' stacktraces:',err);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
