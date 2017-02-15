/**
 * Created by Administrator on 2016/12/27.
 * @desc  账户信息
 */

var vm = new Vue({
    el:'#accounts',
    data:{
        accountsInfo:"",
        telPhone:"",
        user_id:GLOBAL.userId,//租户 userid
        oldPsd:"",//旧密码
        newPsd:"",//新
        subPsd:"",//确认
    },
    computed: {
        //权限按钮
        isShowPwdBtn: function () {
            return Common.checkAllow('sys:user:password') || false;
        }
    },
    created:function(){

        this.getAccountsInfo();
    },
    methods: {
        //确认修改
        updatePsd : function () {
            var _this=this;
            //登录信息中拿----end
            var params={"user_id":_this.user_id,"old_pwd":_this.oldPsd,"new_pwd":_this.newPsd};
            Common.ajax({
                type: "POST",
                dataType : "json",
                beforeSend:true,
                contentType:"application/json",
                url: requestUrl.sys.updataPwd,
                data: JSON.stringify(params),
                success: function(res){
                    if(res.status==200){
                        layer.msg('修改密码成功!');
                        setTimeout(function () {
                            location.reload();
                        },2000);
                    }
                }
             });

        },
        //验证
        checkNameTel : function () {
            var   _this = this ;
            if(!_this.oldPsd){
                layer.tips('旧密码不能为空', $('#old_password'), {
                    tips: [2, '#1ab394'],
                    time: 2000
                });
                $('#old_password').focus();
                return ;
            }
            if(!_this.newPsd){
                layer.tips('新密码不能为空', $('#new_password'), {
                    tips: [2, '#1ab394'],
                    time: 2000
                });
                $('#new_password').focus();
                return ;
            }
            if(_this.oldPsd == _this.newPsd){
                layer.tips('不能与旧密码相同', $('#new_password'), {
                    tips: [2, '#1ab394'],
                    time: 2000
                });
                $('#new_password').focus();
                return ;
            }
            if(!_this.subPsd){
                layer.tips('确认密码不能为空', $('#confirm_password'), {
                    tips: [2, '#1ab394'],
                    time: 2000
                });
                $('#confirm_password').focus();
                return ;
            }

            if(_this.newPsd.length<8 ){
                layer.tips('密码不能少于八位', $('#new_password'), {
                    tips: [2, '#1ab394'],
                    time: 2000
                });
                $('#new_password').focus();
                return ;
            }

            if(_this.subPsd.length<8){
                layer.tips('确认密码不能少于八位', $('#confirm_password'), {
                    tips: [2, '#1ab394'],
                    time: 2000
                });
                $('#confirm_password').focus();
                return ;
            }

            if(_this.newPsd !=_this.subPsd){
                layer.tips('两次密码输入不一致', $('#confirm_password'), {
                    tips: [2, '#1ab394'],
                    time: 2000
                });
                $('#confirm_password').focus();
                return ;
            }
            _this.updatePsd();
        },
        //放回
        back: function (event) {
            history.go(-1);
        },
        getAccountsInfo :function () {
            var _this=this;
            //登录信息中拿----end
            Common.ajax({
                type: "GET",
                dataType:'JSON',
                beforeSend:true,
                url: requestUrl.sys.userInfo+_this.user_id,
                data: {},
                success: function(res){
                    if(res.status==200){
                        var data = $.parseJSON($.base64.decode(res.content,"utf-8"));
                        console.debug('user:'+$.base64.decode(res.content,"utf-8"));
                        _this.telPhone=data.mobile;
                    }else{
                        alert('error:'+res.info);
                    }
                }
            });
        }

    }
});

