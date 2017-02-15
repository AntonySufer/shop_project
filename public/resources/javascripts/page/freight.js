/**
 * Created by Administrator on 2016/12/27.
 * @desc  模板说明
 */

var vm = new Vue({
    el:'#freight',
    data:{
        sign_token:GLOBAL.signToken,//signtoken
        user_id:GLOBAL.userId,//租户 userid
        tenant_id: GLOBAL.tenantId,//租户
        user_name: GLOBAL.userName,//租户
        content:"",//输入
        temp_id:Common.getUrlParam('tempId') || null,//模板id
        user_id:"",
        maxLength:300,
        len:0

    },
    created:function(){
        var _this=this;
        _this.freightRemark();
    },
    //观察
    watch: {
        content: function (curVal,oldVal) {
            var _this = this;
            var maxLength=_this.maxLength;
                _this.len = curVal.length;
            if (_this.len >= maxLength) {
                _this.content=curVal.substring(0, maxLength);
                _this.len=maxLength;
            }
        }
    },
    methods: {
        //查询运费模版说明
        freightRemark :function () {
            var _this=this;
            var params = {'sid': _this.tenant_id,'stid':_this.temp_id};
            var sign = sha1.toSign(_this.sign_token, params);
            $.ajax({
                type: "GET",
                url: requestUrl.sys.fright,
                data: {
                    stid:params.stid,
                    sid :params.sid,
                    sign:sign,
                },
                success: function(res){
                    if(res.status==200){
                        console.debug(res.data);
                        _this.content=res.data.remark;
                    }else{
                        layer.msg('error:'+res.info);
                    }
                }
            });

        },
        //确认修改
        freightSub : function () {
            var _this=this;
            //运费模版ID
            var stringData =JSON.stringify({ "remark": _this.content});
            var params = {'sid': _this.tenant_id,'stid':_this.temp_id, 'data': stringData,'actorUser':_this.user_name};
            var sign = sha1.toSign(_this.sign_token, params);
                $.ajax({
                    type: "POST",
                    dataType:'JSON',
                    url: requestUrl.sys.frightRemarkUpdate,
                    contentType: "application/x-www-form-urlencoded",
                    data: {
                        stid:params.stid,
                        sid :params.sid,
                        actorUser :params.actorUser,
                        data:params.data,
                        sign:sign,
                    },
                    success: function(res){
                        if(res.status==200){
                            layer.msg('模版说明成功!');
                            setTimeout(function () {
                                _this.back();
                            },2000);
                        }else{
                            alert('error:'+res.info);
                        }
                    }
                });

        },
        //放回
        back: function (event) {
            history.go(-1);
        }

    }


});

