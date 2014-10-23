$(document).ready(function(){
	$(".show-errors ul li").mouseover(function(){
		$(this).children(".delete-btn").show();
	})
	$(".show-errors ul li").mouseout(function(){
		$(this).children(".delete-btn").hide();
	})
	$(".show-errors ul li").click(function(){
		$(this).children(".error-content").hide();
		$(this).children(".modify-content").show();
		$(this).children(".modify-content").children("input").focus();
	});
	//1.判断input与html的内容是否相等，如果相等不进行修改，如果不相等进行保存
	$(".show-errors ul li .modify-content input").blur(function(){
		var html = $(this).parent().siblings(".error-content").html();
		var input = $(this).val();
		if(html == input){
			$(this).parent().hide();
			$(this).parent().siblings(".error-content").show();
		}else{
			//进行修改保存，如果成功了，修改error-content里内容
			var id = $(this).attr("rel");
			var cid = $("#course-id").val();
			var that = $(this);
			var content = $(this).val();
			$.ajax({
				url: '/course/'+cid+'/error/'+id+'/modify',
				data: 'content='+content+'&_csrf='+$('#hiden-value').val(),
				async: true,
				type: 'post',
				dataType:"json",
				success:function(data){
					if(data.status){
						alert("修改错误");
					}else{
						that.parent().hide();
						that.parent().siblings(".error-content").show().html(content);
					}
				}
			});
			
		}
	})
})