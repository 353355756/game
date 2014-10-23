$(document).ready(function(){

	getCartList();

	$(".check-all-btn").bind('click',function(){
		if($(this).hasClass("checked")){
			isCheckedAll(false);
			$(this).removeClass("checked");
		}else{
			$(this).addClass("checked");
			isCheckedAll(true);
		}
		// $(this).hasClass("checked").each(function(){
		// 	console.log($(this).attr('rel'));
		// })
	})



	//获得选中的课程的价格
	function getSelectCoursePrice(course){
		$.ajax({
			url:'/getselectcourseprice',
			data: '_csrf='+$('#hiden-value').val()+'&courses='+courses,
			async: true,
			type: 'post',
			dataType:"json",
			success:function(data){

			}
		})
	}
	//检验是否能够获得生成订单
	$(".cartlist-submit").bind("click",function(){
		var cartIds = [];
		var length = 0;
		$(".check-item-box").each(function(){
			if($(this).hasClass("checked")){
				var cartId = $(this).attr('rel');
				cartIds.push(cartId);
				length++;
			}
		})
		if(length == 0){
			alert("请选择要支付的课程");
			return false;
		}
		var obj={
			cartIds: cartIds,
			_csrf: $('#hiden-value').val()
		}
		$.ajax({
			url: '/checkcart',
			data: obj,
			async: true,
			type: 'post',
			dataType:"json",
			success:function(result){
				if(result.status){
					alert(result.msg);
				}else{
					var data = result.data;
					var flag = true;
					for(var o in data){
						if(data[o].why){
							$("#checkedCourse-error-tip").qkDialog({
			          width:500,
			          height:150,
			          closeButton:'close-btn',
				      });
				      flag = false;
							showCheckedError(data[o].why);
							break;
						}
					}
					if(flag){
						window.location.href='/checkorder';
					}
				}
			}
		});

	})

	
});

//選課單中全選，或者全不選
function isCheckedAll(bool){
	$(".check-item-box").each(function(){
		if(bool){
			if(!$(this).hasClass("checked")){
				$(this).addClass("checked");
			}
		}else{
			if($(this).hasClass("checked")){
				$(this).removeClass("checked");
			}
			
		}
	});
}
//處理無法報名的課程的信息
function showCheckedError(data){
	for(var o in data){
		var cid = data[o].cid;
		var why = data[o].why;
		$(".check-item-box").each(function(){
			var attr = $(this).attr('rel');
			if(cid == attr){
				$(this).parent("td").parent("tr").addClass("delete-tr");
				$(this).parent("td").parent("tr").children(".status").html(why);

			}
		})
	}
}
function getCartList(){
		$.ajax({
			url: '/cartlist',
			data: '_csrf='+$('#hiden-value').val(),
			async: true,
			type: 'post',
			dataType:"json",
			success: function(data){
				if(data.status){
					alert("error");
				}else{
					$('#hiden-value').val(data._csrf);
					if(data.result.length == 0){
						$('.no-course').show();
					}else{

						$('.total-price').html("￥"+ data.totalPrice);
						var result = data.result;
						var length = 0;
						var html = '';
						for(var o in result){
							length++;
							if(length == result.length){
								if(result[o].canSubmit){
									html += "<tr class='last-tr'>";
								}else{
									html += "<tr class='delete-tr last-tr'>";
								}
							}else{
								if(result[o].canSubmit){
									html += "<tr>";
								}else{
									html += "<tr class='delete-tr'>";
								}
							}

							html += '<td><span rel="'+ result[o].cartId +'" class="check-item-box checked"></span></td>';
							html += '<td><a href="/course/'+ result[o].id +'">'+ result[o].name +'</a></td>';
							html += '<td class="text-center">'+ result[o].tname +'</td>';
							html += '<td class="text-center orange">'+ result[o].price +'</td>';
							if(result[o].canSubmit){
								html += "<td class='text-center status'>可报名</td>"; 
							}else{
								html += "<td class='text-center orange status'>"+ result[o].why +"</td>"; 
							}
							html += "<td class='text-center'><span class='operation green'  rel='"+ result[o].cartId +"'>[删除]</span></td>"; 
							html += "</tr>";
						}
						$('.cartlist-table tbody').html(html);
						$('.has-courses').show();

							$(".check-item-box").each(function(){
								$(this).bind("click",function(){
									if($(this).hasClass("checked")){
										$(this).removeClass("checked");
										if($(".check-all-btn").hasClass('checked')){
											$(".check-all-btn").removeClass('checked');
										}
									}else{
										$(this).addClass("checked");
									}
								})
							})
						$(".operation").each(function(){
							$(this).bind("click",function(){
								var that = $(this);
								if(window.confirm("您确定要在选课单中删除該课程吗？")){
									var cartId = $(this).attr('rel');
									$.ajax({
										url:'/deleteCheckcart',
						        type:'post',
						        data:'cartId='+cartId+'&_csrf='+$('#hiden-value').val(),
						        dataType:'json',
						        success:function(data){
						        	if(data.status){
						        		alert("出错了");
						        	}else{
						        		$('#hiden-value').val(data._csrf);
						        		that.parent("td").parent("tr").remove();
						        		$(".total-price").html("￥"+data.totalPrice);
						        		getCartNum();
						        	}
						        }
						    	});
								}else{
									return false;
								}
							})
						})
					}
					
				}
			}
		})
	}