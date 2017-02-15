
var vm = new Vue({
    el:'#app',
    data:{
        isOrderBtn:false,
        isShowOut:false,//出库权限
        isShowDeliver:false,//发货权限
        isShowPrint:false,//打印权限
        item:[],
        page:1,
        page_size:20,
        tenant_id:'',
        id:Common.getUrlParam('id'),
        historyItems:[],//操作记录
    },
    computed: {
        isOrderBtn: function () {
            if(this.item.main.status==100 && Common.checkAllow('sys:order:change')){
                return true;
            }
            return false;
        },
        isShowOut: function () {
            return Common.checkAllow('sys:order:out') || false;
        },
        isShowDeliver: function () {
            return Common.checkAllow('sys:order:deliver') || false;
        },
        isShowPrint: function () {
            return Common.checkAllow('sys:order:print') || false;
        },
    },
    created:function(){
        this.getData();
        this.getOperation();
    },
    methods: {
        getData:function(){
            var _this=this;
            //生成sign格式
            var par = {'orderNumber':_this.id,'sid':GLOBAL.tenantId};
            var sign=sha1.toSign(GLOBAL.signToken,par);
            $.ajax({
                type: "GET",
                url: requestUrl.page.getOne,
                data: {
                    orderNumber:_this.id,
                    sid:GLOBAL.tenantId,
                    sign:sign,
                },
                success: function(res){
                    if(res.status==200){
                        var data=res.data;
                        for(var i=0;i<data.item.length;i++){
                            data.item[i].receipts=data.item[i].price * data.item[i].quantity;
                        }
                        _this.item=data;
                    }
                }
            });
        },
        //出库 发货
        updateInfo:function(obj){
            var _this=this;
            var data=[{}];
            data[0][_this.id]={"seller_remark":obj.seller_remark,"status":obj.status};

            var datastring=JSON.stringify(data);

            var par = {'actorUser':GLOBAL.userName,'data':datastring,'sid':GLOBAL.tenantId};
            var sign=sha1.toSign(GLOBAL.signToken,par);

            Common.ajax({
                url: requestUrl.page.updateInfo,
                data: {
                    data:datastring,
                    sid:GLOBAL.tenantId,
                    actorUser:GLOBAL.userName,
                    sign:sign,
                },
                success: function(res){
                    layer.msg(obj.message);
                    _this.getData();
                }
            });
        },
        //出库
        theLibrary:function(){
            var _this=this;
            layer.confirm('确认出库？', {
                btn: ['确定','取消'] //按钮
            }, function(){
                _this.updateInfo({seller_remark:'',status:'210',message:'出库成功'});
            });
        },
        //发货
        delivery:function(){
            layer.prompt({title: '卖家留言', formType: 2,placeholder:'卖家留言,最多输入50个字符',maxlength:50}, function(text, index){
                layer.close(index);
                vm.updateInfo({seller_remark:text,status:'300',message:'发货成功'});
            });
        },
        //操作记录
        getOperation:function(){
            var _this=this;
            var par = {'orderNumber':_this.id,'sid':GLOBAL.tenantId};
            var sign=sha1.toSign(GLOBAL.signToken,par);

            Common.ajax({
                type: "GET",
                url: requestUrl.page.getHistory,
                isShowLoad:true,
                data: {
                    sid:GLOBAL.tenantId,
                    orderNumber:_this.id,
                    sign:sign,
                },
                success: function(res){
                    _this.historyItems=res.data;
                }
            });

        },
        print:function(){
            location.href='view?view=orderPrint&id='+this.id;
        },
        //修改商品实收（元）
        saveOrderInfo:function(){
            var total={item:{}};
            var items=this.item.item;
            for(var i=0;i<items.length;i++){
                if(items[i].receipts<=0){
                    layer.msg('实收金额必须大于0');
                    return;
                }
                total.item[items[i].id]=items[i].receipts;
            }

            var queryTotal=JSON.stringify(total);
            var par = {'total':queryTotal, 'orderNumber':vm.id,'sid':GLOBAL.tenantId,'actorUser':GLOBAL.userName};
            var sign=sha1.toSign(GLOBAL.signToken,par);

            Common.ajax({
                url: requestUrl.page.updateTotal,
                data: {
                    actorUser:GLOBAL.userName,
                    orderNumber:vm.id,
                    sid:GLOBAL.tenantId,
                    total:JSON.stringify(total),
                    sign:sign,
                },
                success: function(res){
                    layer.msg('修改成功');
                    vm.getData();
                }
            });
        },
        clearNoNum : function (value,old_price,quantity,price) {
            var price= old_price>0?(old_price*quantity):(price*quantity);
            if(value>price) {
                layer.msg('不能大于应收金额');
                return value.toString().charAt(0);
            }
            value = value.replace(/[^\d.]/g, ""); //清除"数字"和"."以外的字符
            value = value.replace(/^\./g, ""); //验证第一个字符是数字而不是
            value = value.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的
            value = value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
            value = value.replace(/^(\-)*(\d+)\.(\d{0,2}).*$/, '$1$2.$3'); //只能输入两个小数
            return value;
        },
    }
});

