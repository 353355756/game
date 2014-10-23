$(document).ready(function(){
	/*具体有三个功能
		1.实现未结束跟全部标签的切换，重点为切换的时候要提醒，如果要切换了，那么该标签下选中的课程要重新选择
		2.实现每个标签下课程的处理，选中与不选中状态的切换
		3.实现课程与学生的绑定
	*/


	$(".relative-course-type li").each(function(){
		$(this).bind('click', function(){
			$(this).siblings().removeClass("current");
			$(this).addClass('current');
			if($(this).hasClass("no-end")){
				$(".show-all span").each(function(){
					if($(this).hasClass("no-finish")){
						$(this).show();
					}else{
						$(this).hide();
					}
				})
			}else{
				$(".show-all span").each(function(){
					$(this).show();
				})
			}
		})
	})

	$(".show-all span").click(function(){
		$(this).toggleClass("hasBind");
	})

	$(".relative-course-btn").bind('click',function(){
		//获得所有绑定的课程
		var courses = [];
		$(".show-all span").each(function(){
			if($(this).hasClass("hasBind")){
				courses.push($(this).attr('rel'));
			}
		})
		var data = {
			_csrf: $("#hiden-value").val(),
			courses: courses
		}
		$.ajax({
			url:"/organization/student/"+ $(".user-id").val()+"/courses",
			data:data,
			async: true,
      type: 'post',
      dataType:'json',
      success:function(data){
      	$("#hiden-value").val(data._csrf);
      	alert(data.msg);
      	if(!data.status){
      		window.location="/organization/student/"+$(".user-id").val()+"/show";
      	}else{
      		window.location.reload();
      	}
      	
      	
      }
		})
	})
})