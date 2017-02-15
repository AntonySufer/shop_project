/***
 * @date 2017.1.3
 * @auther antony
 */



var vm = new Vue({
	el:'#user',
	data:{
        page :1,
        tenant_id:GLOBAL.tenantId, //租户id
        page_size :10,
        checkedNames :[],//选中
        userList :""
	},
    computed: {
        //权限按钮
        isShowSave: function () {
            return Common.checkAllow('sys:user:save') || false;
        },
        isShowUp: function () {
            return Common.checkAllow('sys:user:update') || false;
        },
        isShowDet: function () {
            return Common.checkAllow('sys:user:delete') || false;
        }
    },
	created: function() {
        console.log(this.isShowSave+"//"+this.isShowUp+"//"+this.isShowDet);
	    this.getdata();
	},
	methods: {
		update: function (checks) {

            if(checks.length<=0){
                alert('请选中一行');
                return;
            }
            if(checks.length>1){
                alert('只能选择一条记录');
                return;
            }
            location.href='view?route=sys&view=user_add&fromUrl=updateUrl&userId='+checks[0];
		},
		getdata : function () {
            var _this=this;

           Common.ajax({
                type: "GET",
                beforeSend:true,
                url: requestUrl.sys.userList+_this.tenant_id,//请求用户列表
                data: {
                    page_number:_this.page,
                    page_size :_this.page_size,

                },
                success: function(res){

                   var datas = $.parseJSON($.base64.decode(res.content,"utf-8"));
                    var page = datas.page;

                    page.list.forEach(function (item,index) {
                        var time =item.createTime
                        if(time){
                            page.list[index].createTime=new Date(time).format('yyyy-MM-dd hh:mm:ss');
                        }
                        //是否锁定，0：未锁定 1：锁定
                        var isLock =item.isLock;
                        if(isLock==0){
                            page.list[index].isLockDesc='未锁定';
                        }else{
                            page.list[index].isLockDesc='锁定';
                        }

                        //是否关闭
                        var status =item.status;
                        if(status=='0'){
                            page.list[index].statusDesc='禁用';
                        }else{
                            page.list[index].statusDesc='正常';
                        }
                    })
                    _this.userList =page.list;

                    $(".checkAll" ).on("click",function(){
                        _this.checkedNames=[];
                        var isCheck =$(this).is(':checked');
                        if(isCheck){
                            $(".chilidrens").each(function() {
                                $(this).attr("checked", 'checked');
                                $(this).prop("checked",true);
                                var userId =$(this).val();
                                _this.checkedNames.push(userId);
                            });
                            }else{
                            _this.checkedNames=[];
                            $(".chilidrens").each(function() {
                                $(this).attr("checked", 'false');
                                $(this).prop("checked",false);
                            });
                        }
                    });

                    $("#tableList" ).on("click",'.chilidrens',function(){
                        var isCheck =$(this).is(':checked');
                        if(!isCheck){
                            $(".checkAll" ).attr("checked", 'false');
                            $(".checkAll" ).prop("checked",false);
                        }
                    });


                    _this.Paging(datas.page.totalPage,_this.page);
                }
            });
		},
        //分页
        Paging: function (totalPage,pages) {
            var _this= this;
           //分页
            laypage({
                cont: 'pageFenye', //容器。值支持id名、原生dom对象，jquery对象,
                pages: totalPage, //总页数
                skip: false, //是否开启跳页.
                skin: '#1ab394', //加载内置皮肤，也可以直接赋值16进制颜色值，如:#c00
                groups: 4, //连续显示分页数
                curr:pages,
                jump: function(obj,first){

                    if(!first){
                        _this.page=obj.curr;
                        _this.checkedNames=[];
                        _this.getdata();
                    }
                }
            });
            if(!totalPage || totalPage<=1){
                $('#pagination').empty();
            }
        },
		del: function (checks) {
            var _this=this;
             console.log(checks);
			if(!checks || checks.length<=0){
                alert('您还未选中行');
				return ;
			}

			var params ={
                users:checks
            }
            console.log(JSON.stringify(params));
           var layerT= layer.confirm('确定要删除选中的记录？', {
                btn: ['确定','取消'] //按钮
            }, function(){
                layer.closeAll(layerT);
                Common.ajax({
                    type: "POST",
                    dataType : "json",
                    beforeSend:true,
                    contentType:"application/json",
                    url: requestUrl.sys.userDet,
                    data: JSON.stringify(params),
                    success: function(res){
                        if(res.status==200){
                            alert('删除成功');
                            _this.checkedNames=[];
                            _this.getdata();

                        }
                    }
                });
			});
		}
	}
});