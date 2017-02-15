/**
 * Created by Administrator on 2016/12/27.
 */
    var vm = new Vue({
        el:'#app',
        data:{
           items:[],
           page:1,
           page_size:10,
           tenant_id:GLOBAL.tenantId,
           status:{
                INIT:'提现中',
                SUCCESS:'已打款',
                FAIL:'已拒绝',
            }
        },
        created:function(){
            if(!Common.checkAllow('sys:financial:supplier')){
                location.href='view?view=home';
            }
            this.getData();
        },
        methods: {
            getData:function(){
                var _this=this;
                Common.ajax({
                    beforeSend:true,
                    isShowLoad:true,
                    url: requestUrl.page.supplier.replace('{tenant_id}',_this.tenant_id),
                    data: {
                        tenant_id:_this.tenant_id,
                        page:_this.page,
                        page_size:_this.page_size,
                    },
                    success: function(res){
                        _this.items=JSON.parse(res.content);
                        _this.Paging({totalCount:res.total_count,size:res.rows || _this.page_size});
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
                    skin: '#18a689', //加载内置皮肤，也可以直接赋值16进制颜色值，如:#c00
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
        }
    });