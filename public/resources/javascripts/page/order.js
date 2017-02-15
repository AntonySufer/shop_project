/**
 * Created by phewa on 2016/12/27.
 */

    var vm = new Vue({
        el:'#app',
        data:{
            isShowSearch:false,//搜索权限
            isShowExport:false,//导出权限
            isShowOut:false,//出库权限
            isShowDeliver:false,//发货权限
            isShowPrint:false,//打印权限
            items:[],
            allSelect:[],//全部id
            selectIng:[],//用户选中的id
            page:1,
            page_size:10,
            tenant_id:'',
            shippingType:'shippingName',
            paraText:'',
            param: {
                productName: '',//商品名称
                startDate: '',//开始时间
                endDate: '',//结束时间
                shippingTelephone: '',//收货人手机号码 string
                shippingName: '',//收货人姓名 string
                telephone: '',//买家账号 string
                firstname: '',//买家昵称 string
                status:Common.getUrlParam('status') || 0,//订单状态
                payType: 0,//支付类型 1=支付宝，2=微信，3=美丽宝
                orderNumber: '',//订单号
            }
        },
        computed: {
            isShowSearch: function () {
                return Common.checkAllow('sys:order:search') || false;
            },
            isShowExport: function () {
                return Common.checkAllow('sys:order:export') || false;
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
        },
        methods: {
            //最近7天
            setDate:function(){
                var currentDate=new Date(),
                    _endDate=new Date(currentDate.setDate(currentDate.getDate()-7));//将结束值设为开始日期的30天

                var endDate=new Date().format('yyyy-MM-dd hh:mm:ss'),
                    startDate=_endDate.format('yyyy-MM-dd hh:mm:ss');

                this.param.startDate=startDate;
                this.param.endDate=endDate;
                $('#startDate').val(startDate);
                $('#endDate').val(endDate);
            },
            //搜索
            search:function(){
                this.param[this.shippingType]=this.paraText;
                this.page=1;
                this.items=[];
                this.getData();
            },
            //导出
            export:function(){
                var _this=this;
                //生成sign格式
                var query=JSON.stringify(_this.param);
                var par = {'query':query, 'page':_this.page,'pageSize':_this.page_size,'sid':GLOBAL.tenantId};
                var sign=sha1.toSign(GLOBAL.signToken,par);
                window.open(requestUrl.page.export+'?page='+this.page+'&pageSize='+this.page_size+'&sid='+GLOBAL.tenantId+'&query='+query+'&sign='+sign+'&token='+GLOBAL.signToken);
            },
            //出库 发货
            updateInfo:function(obj){
                var _this=this;
                var data=[];
                for(var i=0;i<obj.ids.length;i++){
                    data[i]={};
                    data[i][obj.ids[i]]={"seller_remark":obj.seller_remark,"status":obj.status};
                }
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
                        _this.getData();
                        layer.msg(obj.message);
                    }
                });
            },
            //出库
            theLibrary:function(){
                var _this=this;
                if(this.selectIng.length<1){
                    layer.msg('请勾选订单后再操作');
                    return;
                }
                //取出选中状态等于200的选项
                var result=[];
                for(var i=0;i<this.items.length;i++){
                    if(this.items[i].main.status==200 && this.selectIng.indexOf(parseInt(this.items[i].main.order_number))>-1){
                        result.push(parseInt(this.items[i].main.order_number));
                    }
                }
                if(result.length<1){
                    layer.msg('所选没有待出库项');
                    return;
                }
                this.selectIng=result;

                layer.confirm('确认出库？', {
                    btn: ['确定','取消'] //按钮
                }, function(){
                    _this.updateInfo({ids:_this.selectIng,seller_remark:'',status:'210',message:'出库成功'});
                });
            },
            //发货
            delivery:function(){
                if(this.selectIng.length<1){
                    layer.msg('请勾选订单后再操作');
                    return;
                }
                //取出选中状态等于200的选项
                var result=[];
                for(var i=0;i<this.items.length;i++){
                    if(this.items[i].main.status==210 && this.selectIng.indexOf(parseInt(this.items[i].main.order_number))>-1){
                        result.push(parseInt(this.items[i].main.order_number));
                    }
                }
                if(result.length<1){
                    layer.msg('所选没有待发货项');
                    return;
                }
                this.selectIng=result;

                layer.prompt({title: '卖家留言', formType: 2,placeholder:'卖家留言,最多输入50个字符',maxlength:50}, function(text, index){
                    layer.close(index);
                    vm.updateInfo({ids:vm.selectIng,seller_remark:text,status:'300',message:'发货成功'});
                });
            },
            //打印发货单
            print:function(){
                if(this.selectIng.length<1){
                    layer.msg('请勾选订单后再操作');
                    return;
                }
                location.href="view?view=orderPrint&id="+this.selectIng.join(',');
            },
            //获取数据
            getData:function(){
                var _this=this;
                //生成sign格式
                var query=encodeURIComponent(JSON.stringify(_this.param));
                var par = {'query':query, 'page':_this.page,'pageSize':_this.page_size,'sid':GLOBAL.tenantId};
                var sign=sha1.toSign(GLOBAL.signToken,par);

                Common.ajax({
                    type: "GET",
                    url: requestUrl.page.getList,
                    data: {
                        query:query,
                        page:_this.page,
                        pageSize:_this.page_size,
                        sid:GLOBAL.tenantId,
                        sign:sign,
                    },
                    isShowLoad:true,
                    success: function(res){
                        _this.items=res.data;
                        _this.Paging({totalCount:parseInt(res.total),size:res.rows || _this.page_size});
                        for(var i=0;i<_this.items.length;i++){
                            _this.allSelect.push(parseInt(_this.items[i].main.order_number));
                        }
                    },error:function(){
                        _this.items=[];
                    }
                });
            },
            //分页
            Paging: function (page) {
                var _this=this;
                var totalPage=(page.totalCount%page.size == 0 ?page.totalCount/page.size : (Math.floor(page.totalCount/page.size) +1));
                //分页
                laypage({
                    cont: $('#pagination'), //容器。值支持id名、原生dom对象，jquery对象,
                    pages: totalPage, //总页数
                    skip: false, //是否开启跳页.
                    skin: '#1ab394', //加载内置皮肤，也可以直接赋值16进制颜色值，如:#c00
                    groups: 4, //连续显示分页数
                    curr:_this.page,
                    jump: function(obj,first){
                        if(!first){
                            _this.page=obj.curr;
                            _this.getData();
                        }
                    }
                });
                if(!totalPage || totalPage<=1){
                    $('#pagination').empty();
                }
            },
            //全选
            allChange:function(){
                //全选
                if(document.getElementById("checkboxOneInput").checked){
                    //设为全选
                    this.selectIng=this.allSelect.concat();
                }else{
                    //设为全不选
                    this.selectIng=[];
                }
            },
            //跳到详情页
            goDetailPage:function(id){
                location.href='view?view=orderDetail&id='+id;
            }
        }
    });
    /**
     * 绑定页面日期控件
     * */
    function setDate(startId,endId,vueStartTime,vueEndTime){

        var start = {
            elem: startId,
            format: 'YYYY-MM-DD hh:mm:ss',
            max: new Date().format('yyyy-MM-dd hh:mm:ss'), //最大日期
            istime: true,
            istoday: false,
            choose: function(datas){
                end.min = datas; //开始日选好后，重置结束日的最小日期
                end.start = datas //将结束日的初始值设定为开始日
                vm.$set(vueStartTime,datas);
            }
        };

        var end = {
            elem: endId,
            format: 'YYYY-MM-DD hh:mm:ss',
            max: new Date().format('yyyy-MM-dd hh:mm:ss'),
            istime: true,
            istoday: false,
            choose: function(datas){
                start.max = datas; //结束日选好后，重置开始日的最大日期
                vm.$set(vueEndTime,datas);
            }
        };
        setTimeout(function(){
            laydate(start);
            laydate(end);
            $(startId).val('');
            $(endId).val('');
        },500);
    }
    setDate('#startDate','#endDate','param.startDate','param.endDate');
