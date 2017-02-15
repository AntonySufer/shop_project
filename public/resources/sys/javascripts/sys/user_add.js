//用户ID
var vm = new Vue({
	el:'#userAdd',
	data:{
		title:"新增管理员",
		roleList:[],
        isShowBtn:false,
        beforeSend:true,
        fromUrl :Common.getUrlParam('fromUrl') || null,
		user:{
			status:1,//默认正常
            tenant_id:GLOBAL.tenantId,//租户id
            user_name:"",
            user_id:Common.getUrlParam('userId') || null,
            roles:[]
		}
	},
	created: function() {
        this.user.roles=[];
		if(this.user.user_id != null){
            this.isShowBtn=Common.checkAllow('sys:user:update') || false;
			this.title = "修改管理员";
            this.disableds='disabled';
			this.getUser(this.user.user_id);
		}else{
            //添加save
            this.isShowBtn=Common.checkAllow('sys:user:save') || false;
		}
		//获取角色信息
		this.getRoleList();
    },
	methods: {
		getUser: function(userId){
            var _this =this ;
            Common.ajax({
                type: "GET",
                beforeSend:true,
                url: requestUrl.sys.userInfo+userId,//请求用户信息
                success: function(res){
                    var datas = $.parseJSON($.base64.decode(res.content,"utf-8"));
                        _this.user.status =datas.status;
                        _this.user.user_name =datas.userName;
                        _this.user.email =datas.email;
                        _this.user.isLock =datas.isLock;
                        _this.user.mobile =datas.mobile;
                         _this.user.roles =datas.roles;

                }
            });
		},
        //获取角色
		getRoleList: function(){
            var _this =this ;
            Common.ajax({
                type: "GET",
                url: requestUrl.sys.roleListAll+_this.user.tenant_id,//请求角色列表
                success: function(res){
                    var roleList = $.parseJSON($.base64.decode(res.content,"utf-8"));
                    console.log(roleList);
                    _this.roleList = roleList.role_list;
                }
            });
		},
        saveOrUp :function () {
            var _this =this ;
            if(!_this.user.user_name){
                layer.tips('请用户名称', $('#name'), {
                    tips: [2, '#3595CC'],
                    time: 2000
                });
                $('#name').focus();
                return ;
            }
            //修改不密码
            if(_this.fromUrl == null){
                if(!_this.user.password){
                    layer.tips('请输入密码', $('#pwds'), {
                        tips: [2, '#3595CC'],
                        time: 2000
                    });
                    $('#pwds').focus();
                    return ;
                }

                if(_this.user.password.lenght<8){
                    layer.tips('密码请输入八位以上', $('#pwds'), {
                        tips: [2, '#3595CC'],
                        time: 2000
                    });
                    $('#pwds').focus();
                    return ;
                }
            }

            var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
            if(_this.user.email){
                if(!reg.test(_this.user.email)){
                    layer.tips('请输入正确邮箱格式', $('#emails'), {
                        tips: [2, '#3595CC'],
                        time: 2000
                    });
                    $('#emails').focus();
                    return ;
                }
            }


            if(!_this.user.mobile){
                layer.tips('请输入手机号', $('#tel'), {
                    tips: [2, '#3595CC'],
                    time: 2000
                });
                $('#tel').focus();
                return ;
            }
            var isMob = /^1[3|5|8|7|2|4|6|9]\d{9}$/;
            if(!isMob.test(_this.user.mobile)){
                layer.tips('请输入正确手机号格式', $('#tel'), {
                    tips: [2, '#3595CC'],
                    time: 2000
                });
                $('#tel').focus();
                return ;
            }

            if(_this.fromUrl && _this.fromUrl !=null){
                _this.updateUser();
            }else{
                _this.saveInfo();
            }
        },
		saveInfo: function (event) {
            var _this = this ;
            Common.ajax({
                type: "GET",
                beforeSend:true,
                url: requestUrl.sys.getUserId,
                success: function(r){
                    if(r.status ==200){
                      var  userId =r.content;
                        _this.user.user_id =userId;
                        var saveUrL =requestUrl.sys.userAdd;
                        Common.ajax({
                            type: "POST",
                            dataType : "json",
                            beforeSend:true,
                            contentType:"application/json",
                            url: saveUrL,
                            data: JSON.stringify(_this.user),
                            success: function(r){
                                if(r.status ==200){
                                    alert('操作成功', function(index){
                                        _this.back();
                                    });
                                }else{
                                    alert(r.errorMessage);
                                }
                            }
                        });

                    }else{
                        alert(r.errorMessage);
                    }
                }
            });


		},
        //修改
        updateUser :function () {
                    var _this = this ;
                        var updateUrl =requestUrl.sys.userInfoUpdate;
                    Common.ajax({
                            type: "POST",
                            beforeSend:true,
                            dataType : "json",
                            contentType:"application/json",
                            url: updateUrl,
                            data: JSON.stringify(_this.user),
                            success: function(r){
                                if(r.status ==200){
                                    alert('操作成功', function(index){
                                        _this.back();
                                    });
                                }else{
                                    alert(r.errorMessage);
                                }
                            }
                        });

        },
		back: function (event) {
            location.href='view?route=sys&view=user';
		}
	}
});