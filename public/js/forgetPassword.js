$(document).ready(function(){
	$('.forget-email-btn').click(function(){
		var email = $("#forget-email").val();
		if(!checkEmail(email)){
			$('.tips').html("邮箱不正确")
			return false;
		}
		var that = $(this);
		$.ajax({
			url: '/forgetpassword',
			data: 'email='+email+'&_csrf='+$('#hiden-value').val(),
			async: true,
			type: 'post',
			dataType:"json",
			success:function(data){
				if(data.status){
					alert("发送邮件出错");
				}else{
					that.hide();
					$('.forget-email-div').hide();
					$('.show-result').show();
				}
			}
		});
	})

	function checkEmail(value){
		var m=/^([a-zA-Z0-9]+[_|\_|\.|-|\-]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.|-|\-]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
		if(!m.test(value)){
			return false;
		}else{
			return true;
		}
	}
})