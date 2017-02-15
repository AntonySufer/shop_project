/**
 * Created by phewa on 2016/12/29.
 */
$(function(){
    //加载订单信息
    var query='{"status":"100,200,300"}';
    var par = {'query':query,'sid':GLOBAL.tenantId};
    var sign=sha1.toSign(GLOBAL.signToken,par);

    Common.ajax({
        type: "GET",
        url: requestUrl.page.getCount,
        data: {
            query:query,
            sid:GLOBAL.tenantId,
            sign:sign,
        },
        success: function(res){
            $("#payment").text(res.data.total_100);//待付款订单
            $("#shipped").text(res.data.total_200);//待发货订单
            $("#receipt").text(res.data.total_300);//待收货订单
        }
    });
    //加载可用余额
    Common.ajax({
        type: "POST",
        beforeSend:true,
        url: requestUrl.page.balance.replace('{tenant_id}',GLOBAL.tenantId),
        data: {
            tenant_id:GLOBAL.tenantId,
        },
        success: function(res){
            $("#balance").text('¥'+res.content);//可用余额
        }
    });
})