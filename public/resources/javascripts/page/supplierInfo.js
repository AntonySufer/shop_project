/**
 * Created by Administrator on 2016/12/27.
 * @desc  供应商信息
 */

    var vm = new Vue({
        el:'#supplierInfo',
        data:{
            sign_token:GLOBAL.signToken,
            user_id:GLOBAL.userId,//租户 userid
            tenant_id: GLOBAL.tenantId,//租户
            name:"",
            contact_name:"",
            contact_mobile:"",
            service_name :"",
            service_phone:"",
        },
        computed: {
            //权限按钮
            isShowBtn: function () {
                return Common.checkAllow('sys:supplier:update') || false;
            }
        },
        created:function(){
            this.supplierInfo();
        },
        //观察
        watch: {
            service_name: function (curVal,oldVal) {
                var _this = this;
                var maxLength=10;
                if(curVal){
                    var len = curVal.length;
                    if (len >= maxLength) {
                        _this.service_name=curVal.substring(0, maxLength);
                    }
                }

            }
        },
        methods: {
            //获取供应商信息
            supplierInfo: function () {
                var _this = this;

                var params = {'sid': _this.tenant_id};
                var sign = sha1.toSign(_this.sign_token, params);
                $.ajax({
                    type: "GET",
                    url: requestUrl.sys.getOneSupplier,
                    data: { sid: params.sid, sign: sign},
                    success: function (res) {
                        if (res.status == 200) {
                            _this.name=res.data.name;
                            _this.contact_name=res.data.contact_name;
                            _this.contact_mobile=res.data.contact_mobile||'暂未设置';
                            _this.service_name=res.data.service_name;
                            _this.service_phone=res.data.service_phone;
                        } else {
                            alert('error:' + res.info);
                        }
                    }
                });
            },
            //确认修改
            updateSupplier: function () {
                var _this = this;
                var stringData = JSON.stringify({ "service_name": _this.service_name, "service_phone": _this.service_phone});
                var params = {'sid': _this.tenant_id, 'data': stringData};
                var sign = sha1.toSign(_this.sign_token, params);
                $.ajax({
                    type: "POST",
                    url: requestUrl.sys.updateOneSupplier,
                    contentType: "application/x-www-form-urlencoded",
                    data: {data: stringData,sid: _this.tenant_id, sign: sign },
                    success: function (res) {
                        if (res.status == 200) {
                            layer.msg('修改客服信息成功!');
                            setTimeout(function () {
                                location.reload();
                            }, 2000);
                        } else {
                            alert('error:' + res.info);
                        }
                    }
                });
            },
            //验证
            checkNameTel: function () {
                var _this = this;
                var name = _this.service_name;
                var tel = _this.service_phone;
                if (!name) {
                    layer.tips('客服名称不能为空!', $('#service_name'), {
                        tips: [2, '#1ab394'],
                        time: 2000
                    });
                    $('#service_name').focus();
                    return;
                }
                if (name.length>7) {
                    layer.tips('客服名称不能超过7个字符!', $('#service_name'), {
                        tips: [2, '#1ab394'],
                        time: 2000
                    });
                    $('#service_name').focus();
                    return;
                }
                if (!tel) {
                    layer.tips('客服电话不能为空!', $('#service_phone'), {
                        tips: [2, '#1ab394'],
                        time: 2000
                    });
                    $('#service_phone').focus();
                    return;
                }
                var isPhone = /^([0-9]{3,4}-)?[0-9]{7,8}$/;
                var isMob = /^1[3|5|8|7|2|4|6|9]\d{9}$/
                if(!isPhone.test(tel) && !isMob.test(tel) ){
                        layer.tips('请输入正确的电话号码!', $('#service_phone'), {
                            tips: [2, '#1ab394'],
                            time: 2000
                        });
                        $('#service_phone').focus();
                        return ;

                }

                _this.updateSupplier();

            },
            //放回
            back: function (event) {
                location.reload();
            },
            checkPhone: function (phone) {
                if (!(/^1(3|4|5|7|8)\d{9}$/.test(phone)))
                    return false;
                else
                    return true;
            }
        }

    });

