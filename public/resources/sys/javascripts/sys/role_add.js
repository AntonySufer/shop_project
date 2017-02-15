/***
 * 新建 角色
 * @date 2016 12.30
 * @auther anotny
 */
//tree 配置
var setting = {
	data: {
		simpleData: {
			enable: true,
			idKey: "menuId",//父节点
			pIdKey: "parentId",//子节点
			rootPId: -1
		},
		key: {
			url:"nourl"
		}
	},
	check:{
		enable:true,
		nocheckInherit:true
	}
};
var ztree;
var vm = new Vue({
	el:'#roleAdd',
	data:{
		isShowBtn:false,
		role_id:Common.getUrlParam('roleId') || null, //角色id
		fromUrl :Common.getUrlParam('fromUrl') || null, //判断是否修改
		tenant_id:GLOBAL.tenantId,//租户id
		user_id:GLOBAL.userId,//租户的userid
		title:"新增角色",
		role:{
			role_name:"",
			remark:"",
			menus:[]
		}
	},
	created: function() {
		this.role.menus=[];
		this.getTreeList();
    },
	methods: {
		//获取苹果树
		getTreeList :function () {
			var _this =this ;
			Common.ajax({
				type: "GET",
				beforeSend:true,
				url: requestUrl.sys.menuListAll+_this.user_id,//请求菜单信息
				success: function(res){
					var datas = $.parseJSON($.base64.decode(res.content,"utf-8"));
					 datas.menuList.forEach(function (item,index) {
						 datas.menuList[index].name=item.menuName;
					 })
					ztree = $.fn.zTree.init($("#menuTree"), setting, datas.menuList);
					//展开所有节点
					ztree.expandAll(true);
					if(_this.fromUrl != null){
						_this.title = "修改角色";
						_this.isShowBtn=Common.checkAllow('sys:role:update') || false;
						_this.getRole(_this.role_id);
					}else{
						_this.isShowBtn=Common.checkAllow('sys:role:save') || false;
					}
				}
			});
		},
		getRole: function(roleId){
			var _this =this ;
			Common.ajax({
				type: "GET",
				beforeSend:true,
				url: requestUrl.sys.roleInfo+roleId,//请求角色信息
				success: function(res){
					var datas = $.parseJSON($.base64.decode(res.content,"utf-8"));
					//勾选角色所拥有的菜单
					_this.role.role_id=datas.roleId;
					_this.role.role_name=datas.roleName;
					_this.role.remark=datas.remark;
					_this.role.menus=datas.menus;
					var menuIds =datas.menus;
					for(var i=0; i<menuIds.length; i++) {
						var node = ztree.getNodeByParam("menuId", menuIds[i]);
						ztree.checkNode(node, true, false);
					}
				}
			});
		},
		saveOrUpdate :function () {
			var _this = this ;
			if(!_this.role.role_name){
				layer.tips('请角色名称', $('#role_names'), {
					tips: [2, '#3595CC'],
					time: 2000
				});
				$('#role_names').focus();
				return ;
			}
			/*if(!_this.role.remark){
				layer.tips('请输入备注', $('#remarks'), {
					tips: [2, '#3595CC'],
					time: 2000
				});
				$('#remarks').focus();
				return false;
			}*/



			if(_this.fromUrl && _this.fromUrl !=null){
				_this.updateRole();
			}else{
				_this.saveRole();
			}
		},
		updateRole: function (event) {
			//获取选择的菜单
			var _this = this ;
			var nodes = ztree.getCheckedNodes(true);
			var menuIdList = new Array();
			for(var i=0; i<nodes.length; i++) {
				menuIdList.push(nodes[i].menuId);
			}
			_this.role.tenant_id = _this.tenant_id;
			_this.role.menus = menuIdList;
			Common.ajax({
				type: "POST",
				beforeSend:true,
				dataType : "json",
				contentType:"application/json",
				url: requestUrl.sys.roleUpdate,
				data: JSON.stringify(_this.role),
				success: function(res){
					if(res.status ==200){
						alert('操作成功', function(index){
							_this.back();
						});
					}else{
						alert(res.errorMessage);
					}

				}
			});

		},
		saveRole: function (event) {
			var _this = this ;
			Common.ajax({
				type: "GET",
				beforeSend:true,
				url: requestUrl.sys.getUserId,
				success: function (r) {
					if (r.status == 200) {
						//获取role_id
						var role_id = r.content;
						_this.role.role_id = role_id;
						_this.role.tenant_id = _this.tenant_id;
						var nodes = ztree.getCheckedNodes(true);
						var menuIdList = new Array();
						for(var i=0; i<nodes.length; i++) {
							menuIdList.push(nodes[i].menuId);
						}
						console.log(menuIdList);
						_this.role.menus = menuIdList;

						Common.ajax({
							type: "POST",
							dataType : "json",
							beforeSend:true,
							contentType:"application/json",
							url: requestUrl.sys.roleAdd,//新增角色信息
							data: JSON.stringify(_this.role),
							success: function(res){
								if(r.status ==200){
									alert('操作成功', function(index){
										_this.back();
									});
								}else{
									alert(r.errorMessage);
								}

							}
						});

					}
				}
			});


		},

		back: function (event) {
			location.href='view?route=sys&view=role';
		}
	}
});