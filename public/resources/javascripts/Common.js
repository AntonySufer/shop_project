/*======================================================
 Common 常用方法
 ======================================================*/
var Common = {
    getUrlParam:function(name){
        //获取url参数 构造一个含有目标参数的正则表达式对象
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        //匹配目标参数
        var r = window.location.search.substr(1).match(reg);
        //返回参数值
        if (r != null) return unescape(r[2]);
        return null;
    },
    ajax:function(option) {
        var cfg = {
            type: "POST",
            dataType: "json",
            contentType:'application/x-www-form-urlencoded; charset=UTF-8',
            url: '',
            data: null,
            timeout:10000,
            beforeSend:null,
            success: null,//成功方法
            error: null,//失败函数
            isShowLoad: false//是否显示加载中
        };
        var CFG = $.extend(cfg, option);

        var index=0;
        if(CFG.isShowLoad){
            index=layer.load(0, {shade: false}); //0代表加载的风格，支持0-2
        }

        if(typeof CFG.beforeSend==='boolean' && CFG.beforeSend){
            CFG.beforeSend=function(xhr) {
                xhr.setRequestHeader('Authorization',Common.getCookie('accessToken'));
            }
        }
        $.ajax({
            type: CFG.type,
            url:  CFG.url,
            data: CFG.data,
            dataType: CFG.dataType,
            contentType: CFG.contentType,
            beforeSend:CFG.beforeSend,
            timeout:CFG.timeout,
            success: function (data) {
                if(data.status == 200){
                    CFG.success && CFG.success(data);
                }else{
                    if (CFG.error){
                        CFG.error(data);
                    } else{
                        layer.msg((data.errorMessage || data.error_message) || '请求失败');
                    }
                }
                CFG.isShowLoad && layer.close(index);
            },
            error: function (e) {
                if (CFG.error){
                    CFG.error(e);
                } else{
                    layer.msg('请求错误');
                }
                CFG.isShowLoad && layer.close(index);
            }
        });
    },
    getCookie:function(c_name){
        if (document.cookie.length>0){
            var c_start=document.cookie.indexOf(c_name + "=");
            if (c_start!=-1){

                c_start=c_start + c_name.length+1;
                var c_end=document.cookie.indexOf(";",c_start);

                if (c_end==-1) c_end=document.cookie.length;

                return unescape(document.cookie.substring(c_start,c_end));
            }
        }
        return "";
    },
    setCookie:function(c_name,value,expiredays){
        var exdate=new Date();
        exdate.setDate(exdate.getDate()+expiredays);
        document.cookie=c_name+ "=" +escape(value)+
            ((expiredays==null) ? "" : ";expires="+exdate.toGMTString())+";path=/";
    },
    checkAllow :function (allowStr) {
       var  perms =GLOBAL.perms;//权限
       // var  prermsStr =perms.join();//变成字符串
        if(perms.indexOf(allowStr)==-1){
              return false;
        }else{
            return true;
        }
    }
};


(function (){
    if(!Date.prototype.format){
        Date.prototype.format =function(format){
            var o = {
                "M+" : this.getMonth()+1, //month
                "d+" : this.getDate(), //day
                "h+" : this.getHours(), //hour
                "m+" : this.getMinutes(), //minute
                "s+" : this.getSeconds(), //second
                "q+" : Math.floor((this.getMonth()+3)/3), //quarter
                "S" : this.getMilliseconds() //millisecond
            };
            if(/(y+)/.test(format)) format=format.replace(RegExp.$1,
                (this.getFullYear()+"").substr(4- RegExp.$1.length));
            for(var k in o)if(new RegExp("("+ k +")").test(format))
                format = format.replace(RegExp.$1,
                    RegExp.$1.length==1? o[k] :
                        ("00"+ o[k]).substr((""+ o[k]).length));
            return format;
        };
    }
})();