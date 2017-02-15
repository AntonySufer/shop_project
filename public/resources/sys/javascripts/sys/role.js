/***
 *
 * @date 2017.1.5
 * @author antony
 * @desc 角色列表
 */

var vm = new Vue({
	el:'#roles',
	data:{
		tenantId:GLOBAL.tenantId, //租户id
		roleList:[],
		page :1,
		roles:[],//用户id列表
		page_size :10,
	},
	computed: {
		//权限按钮
		isShowSave: function () {
			return Common.checkAllow('sys:role:save') || false;
		},
		isShowUp: function () {
			return Common.checkAllow('sys:role:update') || false;
		},
		isShowDet: function () {
			return Common.checkAllow('sys:role:delete') || false;
		}
	},
	created: function() {
		this.getRoleData();
	},
	methods: {

		getRoleData : function () {
			var _this=this;
			Common.ajax({
				type: "GET",
				beforeSend:true,
				url: requestUrl.sys.roleList+_this.tenantId,//请求用户列表
				data: {
					page_number:_this.page,
					page_size :_this.page_size,

				},
				success: function(res){
					var datas = $.parseJSON($.base64.decode(res.content,"utf-8"));
					var page = datas.page;
					page.list.forEach(function (item,index) {
						var time =item.createTime;
						if(time){
							page.list[index].createTime=new Date(time).format('yyyy-MM-dd hh:mm:ss');
						}

					})
					_this.roleList =page.list;

					$(".roles_check_all" ).on("click",function(){
						_this.roles=[];
						var isCheck =$(this).is(':checked');
						if(isCheck){
							$(".chilidrens").each(function() {
								$(this).attr("checked", 'checked');
								$(this).prop("checked",true);
								var userId =$(this).val();
								_this.roles.push(userId);
							});
						}else{
							_this.roles=[];
							$(".chilidrens").each(function() {
								$(this).attr("checked", 'false');
								$(this).prop("checked",false);
							});
						}
					});

					$("#roleList" ).on("click",'.chilidrens',function(){
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
						_this.roles=[];
						$(".roles_check_all" ).attr("checked", 'false');
						$(".roles_check_all" ).prop("checked",false);
						_this.getRoleData();
					}
				}
			});
			if(!totalPage || totalPage<=1){
				$('#pagination').empty();
			}
		},
		update: function (checks) {
			if(checks.length<=0){
				alert('请选中一行');
				return;
			}
			if(checks.length>1){
				alert('只能选择一条记录');
				return;
			}
			location.href='view?route=sys&view=role_add&fromUrl=updateUrl&roleId='+checks[0];

		},
		del: function (checks) {
			var _this=this;
			console.log(checks);
			if(!checks || checks.length<=0){
				alert('您还未选中行');
				return ;
			}

			var params ={
				roles:checks
			}

			var  layerT =layer.confirm('确定要删除选中的记录？', {
				btn: ['确定','取消'] //按钮
			}, function(){
				layer.closeAll(layerT);
				Common.ajax({
					type: "POST",
					beforeSend:true,
					dataType : "json",
					contentType:"application/json",
					url: requestUrl.sys.roleDet,
					data: JSON.stringify(params),
					success: function(res){
						if(res.status==200){
							alert('删除成功');
							_this.roles=[];
							_this.getRoleData();

						}
					}
				});
			});

		}
	}
});