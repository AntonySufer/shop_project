var fs= require('fs');
var path = require('path');
var stripJsonComments = require('strip-json-comments');
var logger = require('./logUtil').logger;

module.exports = getAuthConf=function(){
    //读取配置文件，格式内容一定要是JSON格式
    var obj={};
    try{
        var json = fs.readFileSync(path.resolve(__dirname, '../../conf/auth.json'),'utf8').toString();
            obj=JSON.parse(stripJsonComments(json));
    }catch(e){
        logger.error('[%s] [master:%s] [%s]', Date(), process.pid,'getAuthConf auth.json error:'+ e);
    }
    return obj;
};


