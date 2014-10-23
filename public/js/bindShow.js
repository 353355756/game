$(document).ready(function(){
	$(".can-check").each(function(){
		$(this).bind('click',function(){
			if($(this).hasClass('checked')){
				$(this).removeClass('checked');
			}else{
				$(this).addClass('checked');
			}
		})
	})

	$('.bind-buy-btn').click(function(){
		var bid = $(this).attr("rel");
		if($(".checked").length == 0){
			alert("您还没有选择任意一样课程");
			return;
		};
		var cids = [];
		$(".checked").each(function(){
			var cid = $(this).attr('rel');
			cids.push(cid);
		});
		var postData ={	
				'_csrf':$('#hiden-value').val(),
				'cids':cids
				}
		$.ajax({
			url:'/addCourses2CartList',
			data:postData,
			type: 'post',
			dataType: 'json',
			success: function(data){
				if(data.status){
					if(data.msg == "未登录"){
						alert("请先登陆");
						window.location.href='/login';
					}else if(data.msg="用户未激活，请先激活再购买课程"){
						alert("用户未激活，请先激活再购买课程");
					}else{
						alert("课程无法加入选课单请稍候再试");
					}
				}else{
					getCartNum();
					window.location.href= '/cartlist';
				}
			}
		})

	})

})