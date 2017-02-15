var fs= require('fs');
var path = require('path');
var stripJsonComments = require('strip-json-comments');
var logger = require('./logUtil').logger;


var getServerSyncConf=function(){
    //同步读取
    var obj={};
    try{
        var json = fs.readFileSync(path.resolve(__dirname, '../../conf/server.json'),'utf8').toString();
        obj=JSON.parse(stripJsonComments(json));
    }catch(e){
        logger.error('[%s] [master:%s] wroker exit: %s', Date(), process.pid,'getServerSyncConf server.json error:'+ e);
    }
    return obj;
};

var getServerConf=function(fn){
    //异步读取
    fs.readFile(path.resolve(__dirname, '../../conf/server.json'),'utf8',function(err, buffer) {
        var obj={};
        if(err){
            logger.error('[%s] [master:%s] wroker exit: %s', Date(), process.pid,'getServerConf server.json error:'+ err);
            if(fn && typeof fn ==='function'){
                fn(err);
            }else{
                logger.error('回调错误，不是函数');
            }
        }else{
            try{
                var json = buffer.toString();
                obj=JSON.parse(stripJsonComments(json));
            }catch(e){
                logger.error('[%s] [master:%s] wroker exit: %s', Date(), process.pid,'getServerConf server.json error:'+ e);
            }
            if(fn && typeof fn ==='function'){
                fn(null,obj);
            }else{
                logger.error('回调错误，不是函数');
            }

        }

    });

};

module.exports = {
    getServerConf:getServerConf,
    getServerSyncConf:getServerSyncConf
};


