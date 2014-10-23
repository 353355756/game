$(document).ready(function(){
	var total = $('#order-total').val();
	//获取订单内容
	$(".qk-page").pagination(total,{items_per_page:10,callback:back});
	function back(page,per_item){
		$.ajax({
			url: '/orderlist',
			data: 'skipPage='+page+'&perPage='+per_item+'&total='+total+'&_csrf='+$('#hiden-value').val(),
			async: true,
			type: 'post',
			dataType:"json",
			success:function(data){
				$('#hiden-value').val(data._csrf);
				if(data.status){
					alert("error");
				}else{
					var result = data.result;
					var html = "";
					for(var o in result){
						html += "<tr>";
						html += "<td class='orders-table-order-id'><a href='/orderview/"+ result[o].oid +"'>"+ result[o].oid +"</a></td>";
						html += "<td>";
						for(var i in result[o].courses){
							html += "<p><a href='/course/"+ result[o].courses[i].id+"'>"+ result[o].courses[i].name +"</a></p>";
						}
						html += "</td>"
						html += "<td class='orders-table-price'>￥"+ result[o].price+"</td>";
						html += "<td class='orders-coupon-price'>-￥"+ (result[o].price - result[o].payPrice) +"</td>";
						html += "<td class='orders-table-time'>"+ changeTimeFormat(result[o].created)+"</td>";
						html += "<td class='orders-table-btn'>";
						if(result[o].status == 1){
							html += "<a class='had-cancel'>已取消</a>"
						}else if(result[o].status == 2){
							html += "<a class='order-pay-btn' href='/orderapply/"+ result[o].oid+"'>付款</a>";
							html += "<a rel='"+ result[o].oid +"' class='order-cancel-btn'>[取消]</a>";
						}else if(result[o].status == 3){
							html += "<a class='had-cancel'>已付款</a>"
						}else{
							alert('status is error');
							return false;
						}
						html += "<a class='view-detail' href='/orderview/"+ result[o].oid +"'>[查看]</a>";
						html += "</td>"
						$(".orders-table tbody").html(html);
						cancelOrder();
					}
				}
			}
		});
	}

	//取消订单
	function cancelOrder(){
		$('.order-cancel-btn').each(function(){
			$(this).bind('click',function(){
				var oid = $(this).attr('rel');
				var that = $(this);
				$.ajax({
					url: '/cancelorder',
					data: 'oid='+oid+'&_csrf='+$('#hiden-value').val(),
					async: true,
					type: 'post',
					dataType:"json",
					success:function(data){
						$('#hiden-value').val(data._csrf);
						if(data.status){
							alert("出错了,无法取消订单");
						}else{
							var html ='';
							html += "<a class='had-cancel'>已取消</a>";
							html += "<a href='/orderview/"+ oid +"' class='view-detail'>[查看]</a>"
							that.parent('td').html(html);
						}
					}
				});
			})
		})
	}
});