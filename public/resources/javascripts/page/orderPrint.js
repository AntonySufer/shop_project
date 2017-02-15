
var vm = new Vue({
    el:'#app',
    data:{
        items:[],
        count:0,
        supplier:{name:'',service_name:'',service_phone:''},
    },
    created:function(){
        var ids=Common.getUrlParam('id');
        if(!ids) return;
        this.supplierInfo();
        var ids=ids.split(',');
        this.count=ids.length;
        for(var i=0;i<ids.length;i++){
            this.getData(ids[i]);
        }
    },
    watch:{
        items:function(val){
            if(this.count==this.items.length){
                setTimeout(function(){
                    window.print();
                },500)
            }
        }
    },
    methods: {
        getData:function(id){
            var _this=this;
            //生成sign格式
            var par = {'orderNumber':id,'sid':GLOBAL.tenantId};
            var sign=sha1.toSign(GLOBAL.signToken,par);
            Common.ajax({
                type: "GET",
                url: requestUrl.page.getOne,
                timeout:5000,
                data: {
                    orderNumber:id,
                    sid:GLOBAL.tenantId,
                    sign:sign,
                },
                success: function(res){
                    if(res.status==200){
                        _this.items.push(res.data);
                    }
                },
                error:function(){
                    _this.items.push({});
                }
            });
        },
        supplierInfo: function () {
            var _this = this;
            var params = {'sid': GLOBAL.tenantId};
            var sign = sha1.toSign(GLOBAL.signToken, params);
            Common.ajax({
                type: "GET",
                url: requestUrl.sys.getOneSupplier,
                data: { sid: params.sid, sign: sign},
                success: function (res) {
                    _this.supplier.name=res.data.name;
                    //_this.contact_name=res.data.contact_name;
                    //_this.contact_mobile=res.data.contact_mobile;
                    _this.supplier.service_name=res.data.service_name;
                    _this.supplier.service_phone=res.data.service_phone;
                }
            });
        },
    }
});

