$(document).ready(function(){
	//获得内容
	getContent();
	var couponKey;
	function getContent(){
		$.ajax({
			url: '/checkorder',
			data: '_csrf='+$('#hiden-value').val(),
			async: true,
			type: 'post',
			dataType:"json",
			success:function(data){
				if(data.status){
					alert('error');
				}else{
					if(!data.courses.length){
						history.go(-1);
					}
					var html = '';
					var courses = data.courses;
					for(var o in courses){
						html += "<tr>";
						html += "<td>"+ courses[o].name +"</td>";
						html += "<td class='text-center'>"+ courses[o].teacher.nickname +"</td>";
						html += "<td class='text-center orange'> ￥"+ courses[o].price +"</td>";
						html += "</tr>";
					}
					$('.normal-table tbody').html(html);
					$('.order-money-show').html(data.totalPrice);
					$('.should-pay-money-show').html(data.totalPrice);
					$('#hiden-value').val(data._csrf);
				}
			}
		});
	}
	//现实隐藏代金券
	$(".order-pay-coupon h3").click(function(){
		$(".order-pay-content").toggle();
	});
	//检测代金券是否有效
	$('.use-coupon-btn').click(function(){
		var coupon = $("#pay-coupon-value").val();
		$.ajax({
			url:"/checkCoupon",
			data:"coupon="+coupon+"&_csrf="+$('#hiden-value').val(),
			type:"post",
			dataType:"json",
			async: true,
			success:function(data){
				if(!data.status){
					$(".use-coupon-btn").hide();
					$(".error-message").html("已使用代金券："+ data.coupon.key +"，价值：￥"+ data.coupon.price );
					$(".show-price-list").append("<p class='orange'>-代金券：￥"+ data.coupon.price+"</p>");
					var total = $(".should-pay-money-show").html();
					couponKey = data.coupon.key;
					var showTotal = total-data.coupon.price < 0?0:total-data.coupon.price;
					$(".should-pay-money-show").html(showTotal);
				}else{
					couponKey= ""
					$(".error-message").html(data.msg);
				}

			}
		})
	})
	$('.cartlist-submit').bind('click',function(){
		$(this).unbind();
		//先获得支付码
		var data = {_csrf:$('#hiden-value').val(),couponKey:couponKey}
		$.ajax({
			url: '/submitcheckorder',
			data: data,
			async: true,
			type: 'post',
			dataType:"json",
			success:function(data){
				if(data.status){
					alert(data.msg);
				}else{
					window.location.href='/orderlist';
				}
			}
		});
	})
})