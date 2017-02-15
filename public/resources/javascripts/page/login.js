var vm = new Vue({
    el:'#rrapp',
    data:{
        username: '',//用户名
        password: '',//密码
        captcha:'',
        //图形验证码
        imgCode:{
            image:'',
            captchaKey:''
        }
    },
    beforeCreate: function(){
        if(self != top){
            top.location.href = self.location.href;
        }
    },
    created:function(){
        this.refreshCode();
    },
    methods: {
        //刷新图形码
        refreshCode: function(){
            var _this=this;
            $.get(requestUrl.page.captcha,function(data){
                _this.imgCode.image=data.image;
                _this.imgCode.captchaKey=data.captchaKey;
            });
        },
        //验证
        verification:function(){
            if(!this.username){
                layer.tips('请输入帐号', $('#username'), {
                    tips: [2, '#3595CC'],
                    time: 2000
                });
                $('#username').focus();
                return false;
            }
            if(!this.password){
                layer.tips('请输入密码', $('#password'), {
                    tips: [2, '#3595CC'],
                    time: 2000
                });
                $('#password').focus();
                return false;
            }
            if(!this.captcha){
                layer.tips('请输入验证码', $('#captcha'), {
                    tips: [2, '#3595CC'],
                    time: 2000
                });
                $('#captcha').focus();
                return false;
            }
            return true;
        },
        //登录
        login: function (event) {
            if(!this.verification()) return;

            $.ajax({
                type: "POST",
                url: requestUrl.page.login,
                data: {user_name:vm.username,password:vm.password,captcha:vm.captcha,captchaKey:vm.imgCode.captchaKey},
                dataType: "json",
                timeout:10000,
                success: function(result){
                    if(result.status == 200 && result.content){//登录成功
                        var data=$.parseJSON(($.base64.decode(result.content,"utf-8")));
                        setCookie('userId',data.userId,1);
                        setCookie('userName',data.userName,1);
                        setCookie('tenantId',data.tenantId,1);
                        setCookie('signToken',data.signToken,1);
                        setCookie('accessToken',data.token,1);
                        setCookie('refreshToken',data.refreshToken,1);
                        location.href ='/';
                    }else{
                        layer.msg(result.errorMessage);
                        vm.refreshCode();
                    }
                },
                error:function(){
                    layer.msg('请求错误');
                    vm.refreshCode();
                }
            });
        }
    }
});
function setCookie(c_name,value,expiredays){
    var exdate=new Date();
    exdate.setDate(exdate.getDate()+expiredays);
    document.cookie=c_name+ "=" +escape(value)+ ((expiredays==null) ? "" : ";expires="+exdate.toGMTString())+";path=/";
}