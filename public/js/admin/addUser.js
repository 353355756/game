$(document).ready(function(){
	$('.user-create-btn').bind('click',function(){
		if($('.user-email').val()==""){
			alert("未填写邮箱");
		}
		if($('.user-password').val()==""){
			alert("未填写密码");
		}
		if($('.user-nickname').val()==""){
			alert("未填写用户名");
		}
		var user= {};
		user.email = $('#user-email').val();
		user.password = $('#user-password').val();
		user.nickname = $('#user-nickname').val();
		user.realname = $('#user-realname').val();
		user.role = parseInt($('#user-role').val());
		user.actived = parseInt($("#user-actived").val());
		var obj = {
			user:user,
			_csrf: $("#hiden-value").val()
		}
		$.ajax({
			url: '/admin/user',
	        data:obj,
	        async: true,
	        type: 'post',
	        dataType:'json',
	        success:function(data){
	      	  if(!data.status){
	      		alert("创建用户成功");
	      		window.location.reload();
	      	  }else{
	      		alert(data.msg);
	      	  }
	        }
		})
	})
})