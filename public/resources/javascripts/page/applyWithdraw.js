/**
 * Created by phewa on 2016/12/27.
 */
    var vm = new Vue({
        el:'#app',
        data:{
            balance:0,//余额
            model:{
                tenant_id:'',//供应商id
                withdraw_no:'',//提现单号（uuid前端提供）
                operation_id:GLOBAL.userId,//操作人id
                price:'',//提现金额
                desc:'',//提现说明
            }
        },
        created:function(){
            if(!Common.checkAllow('sys:financial:add')){
                location.href='view?view=assets';
            }
            this.getCount();
            this.getUid();
        },
        methods: {
            //获取uuid
            getUid:function(){
                Common.ajax({
                    beforeSend:true,
                    type: "GET",
                    url: requestUrl.page.uuid,
                    success: function(res){
                        vm.model.withdraw_no=res.content;
                    }
                });
            },
            //获取余额
            getCount:function(){
                Common.ajax({
                    type: "POST",
                    beforeSend:true,
                    url: requestUrl.page.balance.replace('{tenant_id}',GLOBAL.tenantId),
                    data: {
                        tenant_id:GLOBAL.tenantId,
                    },
                    success: function(res){
                        vm.balance=res.content;
                        $("#price").attr('placeholder','当前余额'+vm.balance+"元,提现金额必须大于3000");
                    }
                });
            },
            verification:function(){
                if(!this.model.price){
                    layer.tips('请输入提现金额', $('#price'), {
                        tips: [2, '#18a689'],
                        time: 2000
                    });
                    $('#price').focus();
                    return false;
                }
                if(isNaN(this.model.price)){
                    layer.tips('提现金额只能为数字', $('#price'), {
                        tips: [2, '#18a689'],
                        time: 2000
                    });
                    $('#price').focus();
                    return false;
                }
                if(parseInt(this.model.price)<3000){
                    layer.tips('提现金额3000元起', $('#price'), {
                        tips: [2, '#18a689'],
                        time: 2000
                    });
                    $('#price').focus();
                    return false;
                }
                if(parseInt(this.model.price)>this.balance){
                    layer.tips('提现金额不能大于余额', $('#price'), {
                        tips: [2, '#18a689'],
                        time: 2000
                    });
                    $('#price').focus();
                    return false;
                }
                if(!this.model.desc){
                    layer.tips('请填写备注信息', $('#desc'), {
                        tips: [2, '#18a689'],
                        time: 2000
                    });
                    $('#desc').focus();
                    return false;
                }
                if(!this.model.withdraw_no){
                    this.getUid();
                    layer.msg('发生错误,请重试！');
                    return false;
                }
                return true;
            },
            clearNoNum : function (value) {
                value = value.replace(/[^\d.]/g, ""); //清除"数字"和"."以外的字符
                value = value.replace(/^\./g, ""); //验证第一个字符是数字而不是
                value = value.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的
                value = value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
                value = value.replace(/^(\-)*(\d+)\.(\d{0,2}).*$/, '$1$2.$3'); //只能输入两个小数
                return value;
            },
            add: function () {
                if(!this.verification()) return;
                Common.ajax({
                    url: requestUrl.page.withdrawAdd.replace('{tenant_id}',GLOBAL.tenantId),
                    beforeSend:true,
                    data: this.model,
                    success: function(res){
                        layer.msg('提现成功');
                        setTimeout(function(){
                            location.href='view?view=applySuccess';
                        },1000);
                    }
                });
            },
        }
    });
