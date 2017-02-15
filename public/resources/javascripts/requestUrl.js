(function(confRoot,mallRoot){
	"use strict";

	if(!confRoot){
		confRoot="http://supply.mljiadev.cn";
	}

	if(!mallRoot){
		mallRoot="http://mall.mljiadev.cn/api/supply";
	}
	var requestUrl={
		page:{
			getCount:mallRoot+'/order/get_count',//商城-待发货-待付款-待收货-数量
			balance:confRoot+'/mall.supply/web/tenant/{tenant_id}/financial/balance',//供应商-资产余额
			withdrawAdd:confRoot+'/mall.supply/web/tenant/{tenant_id}/financial/withdraw/add',//提现
			supplier:confRoot+'/mall.supply/web/tenant/{tenant_id}/financial/withdraw/supplier',//提现列表
			uuid:confRoot+'/mall.supply/supply/uuid',//uuid
			getList:mallRoot+'/order/get_list',//订单列表
			getOne:mallRoot+'/order/get_one',//订单详情
			getHistory:mallRoot+'/order/get_history',//获取订单历史
			updateInfo:mallRoot+'/order/update_info',//修改订单信息
			captcha:confRoot+'/mall.supply/captcha',//图形码
			logout:confRoot+'/mall.supply/logout',//登出
			login:confRoot+'/mall.supply/login',//登录
			refreshToken:confRoot+'/mall.supply/refreshToken',//刷新token
			export:confRoot+'/mall.supply/web/order/list/export',//订单导出
			updateTotal:mallRoot+'/order/update_total',//修改订单价格
			menu:confRoot+'/mall.supply/login_permission'//加载菜单接口
		},
		sys: {
			getOneSupplier :mallRoot+'/supplier/get_one', //获取单个供应商
			updateOneSupplier :mallRoot+'/supplier/update', //修改供应商
			getOneCounts :confRoot+'/supplier/update', //获取账户信息
			frightRemarkUpdate :mallRoot+"/shipping/update",//运费模板修改
			fright :mallRoot+"/shipping/get_one",//单个运费模板indo
			frightList :mallRoot+"/shipping/get_list",//运费模板list

			updataPwd: confRoot + "/mall.supply/web/auth/modPwd",//修改密码
			userList: confRoot + "/mall.supply/web/auth/userList/",//用户列表
			getUserId: confRoot + "/mall.supply/supply/uuid",//新增时获取userid
			userAdd: confRoot + "/mall.supply/web/auth/createUser",//供应商-系统管理-用户-新增
			userInfoUpdate: confRoot + "/mall.supply/web/auth/modUser",//供应商-系统管理-用户-修改
			userDet: confRoot + "/mall.supply/web/auth/delUser",//供应商-系统管理-用户-删除
			userInfo : confRoot + "/mall.supply/web/auth/user/",////供应商-系统管理-用户-信息

			roleInfo : confRoot + "/mall.supply/web/auth/role/",////供应商-系统管理-角色-角色信息
			roleList : confRoot + "/mall.supply/web/auth/roleList/",////供应商-系统管理-角色列表
			roleAdd : confRoot + "/mall.supply//web/auth/createRole",////供应商-系统管理-角色新增
			roleUpdate : confRoot + "/mall.supply/web/auth/modRole/",////供应商-系统管理-角色-角色修改
			roleDet : confRoot + "/mall.supply/web/auth/delRole/",////供应商-系统管理-角色-角色删除
			roleListAll : confRoot + "/mall.supply/web/auth/roleListAll/",//供应商-角色-租户所创建的所有角色列表
			menuListAll : confRoot + "/mall.supply/web/auth/menuList/"//供应商-菜单-创建角色所需要加载的菜单列表


		}
	};

	window.requestUrl=requestUrl;

})(GLOBAL.confRoot,GLOBAL.mallRoot);
