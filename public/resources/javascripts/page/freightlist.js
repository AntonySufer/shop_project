/**
 * Created by Administrator on 2016/12/27.
 * @auther antony
 * @desc 运费管理列表
 */


var vm = new Vue({
    el:'#freightList',
    data:{
        freightList:[],
        page:1,
        page_size:5,
        tenant_id: GLOBAL.tenantId,//租户,
        sign_token:GLOBAL.signToken,
        user_id:GLOBAL.userId//租户 userid
    },
    computed: {
        //权限按钮
        isShowBtn: function () {
            return Common.checkAllow('sys:freight:update') || false;
        }
    },
    created:function(){
        this.getData();
    },
    methods: {
        insertDeail:function (tempId) {
           //进入修改
            location.href='view?view=freight&tempId='+tempId;
        },

        //获取运费模板列表
        getData:function(){
            var _this=this;
            var params ={
                sid:_this.tenant_id,
                page:_this.page,
                pageSize:_this.page_size
            };

            Common.ajax({
                type: "GET",
                url: requestUrl.sys.frightList,
                data: {
                    sid:params.sid,
                    page:_this.page,
                    pageSize:_this.page_size,
                    sign:sha1.toSign(_this.sign_token,params)
                },
                success: function(res){
                    if(res.status==200){
                         _this.freightList= res.data;
                       _this.Paging({totalCount:res.total,size:_this.page_size|| 5});
                    }else{
                        console.log(res.info);
                    }
                },
                error :function (err) {
                    console.log(err);
                }
            });
        },
        //分页
        Paging: function (page) {
            var _this=this;
            var totalPage=(page.totalCount%page.size == 0 ?page.totalCount/page.size : (Math.floor(page.totalCount/page.size) +1));
            //分页
            laypage({
                cont: 'pageFenye', //容器。值支持id名、原生dom对象，jquery对象,
                pages: totalPage, //总页数
                skip: false, //是否开启跳页.
                skin: '#1ab394',//加载内置皮肤，也可以直接赋值16进制颜色值，如:#c00
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

