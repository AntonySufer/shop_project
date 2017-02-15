/**
 * Created by phewa on 2016/12/27.
 */
$(function(){
    Common.ajax({
        type: "POST",
        beforeSend:true,
        url: requestUrl.page.balance.replace('{tenant_id}',GLOBAL.tenantId),
        data: {
            tenant_id:GLOBAL.tenantId,
        },
        success: function(res){
            $("#balance").text(res.content);//可用余额
        }
    });
})