var express = require('express');
var router = express.Router();
var serverConf = require('./util/getServerConf');
var conf=serverConf.getServerSyncConf(); //默认读取一次配置文件
var dateV=new Date();
var timeStamp= 'v='+dateV.getFullYear()+(dateV.getMonth()+1)
    +dateV.getDate()+dateV.getHours()+dateV.getMinutes();

/* 全局拦截器*/
//router.get('*',function(req, res, next){
//    var accessToken=req.cookies.access_token;
//    if(accessToken){
//
//    }else{
//        res.redirect('/login');
//    }
//    getAccessToken(req,function(err,data){
//        if(err){
//            //logger.info('/menu/index getAccessToken error:',err);
//            res.redirect('/');
//        }else{
//            if(data){
//                var tokenObj=JSON.parse(data);
//                if(tokenObj.role===2){
//                    //(店主登录)数据传递
//                    res.locals.data=data;
//                    next();
//                }else{
//                    res.redirect('/login');
//                }
//            }else{
//                res.redirect('/login');
//            }
//        }
//    });
//});
/* 应用主页 */
router.get('/', function(req, res, next) {
    serverConf.getServerConf(function(err,objConf){
        //每次进店铺主页异步读取一次配置文件
        if(!err){
            conf=objConf;
        }
    });
    var cookies=req.cookies;
    if(!cookies.accessToken){
        res.redirect('/login');
    }else{
        res.render('index',
            {
                confRoot : conf.confRoot,
                mallRoot : conf.mallRoot,
                accessToken:cookies.accessToken,
                libVersion : conf.libVersion,
                fileVersion : timeStamp||conf.fileVersion,
                resourcesUrl: conf.resourcesUrl,
                staticCss_Url: conf.staticCssUrl,
                staticImage_Url: conf.staticImageUrl,
            });
    }

});

/* �店铺内路由控制器*/
router.get('/login', function(req, res, next) {

    res.render('login',
        {
            confRoot : conf.confRoot,
            mallRoot : conf.mallRoot,
            libVersion : conf.libVersion,
            fileVersion : timeStamp||conf.fileVersion,
            resourcesUrl: conf.resourcesUrl,
            staticCss_Url: conf.staticCssUrl,
            staticImage_Url: conf.staticImageUrl,
        });
});

router.get('/view', function(req, res, next) {

    var destination=req.query.route || '',
        view=req.query.view;
    if(destination){
        destination=destination.replace('-','/').replace('-','/')+'/';
    }
    var routeModel=destination+view;
    var cookies=req.cookies;

    if(!cookies.accessToken){
        res.redirect('/login');
    }else {
        res.render(routeModel,
            {
                confRoot: conf.confRoot,
                mallRoot: conf.mallRoot,
                libVersion: conf.libVersion,
                fileVersion: timeStamp || conf.fileVersion,
                resourcesUrl: conf.resourcesUrl,
                userId: cookies.userId,
                userName: cookies.userName,
                tenantId: cookies.tenantId,
                signToken: cookies.signToken,
                accessToken: cookies.accessToken,
                menus: cookies.menus,
                perms: cookies.perms,
            });
    }
});

module.exports = router;
