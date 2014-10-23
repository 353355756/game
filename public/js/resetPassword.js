$(document).ready(function(){
	$('.reset-passwor-btn').click(function(){
		var newPassword = $("#password").val();
		var rePasswrod = $("#re-password").val();
		if(newPassword == ""){
			$(".tips").html("密码不能为空")
			return false;
		}
		if(newPassword != rePasswrod){
			$(".tips").html("密码输入不一致");
			$(".re-tips").html("密码输入不一致");
			return false;
		}
		var mailString = $('#hiden-mail').val();
		$.ajax({
			url: '/resetpassword',
			data: 'password='+newPassword+'&mailString='+mailString +'&_csrf='+$('#hiden-value').val(),
			async: true,
			type: 'post',
			dataType:"json",
			success:function(data){
				if(data.status){
					alert("修改错误");
				}else{
					alert("修改成功，请登陆");
					window.location.href='/login'
				}
			}
		});



	})


})