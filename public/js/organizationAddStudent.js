$(document).ready(function(){
	$('.user-create-btn').bind('click',function(){
		if($('#user-email').val()==""){
			alert("未填写邮箱");
			return false;
		}
		if($('#user-realname').val()==""){
			alert("未填写真实姓名");
			return false;
		}
		var now = new Date();
		var user= {};
		user.email = $('#user-email').val();
		user.realname = $('#user-realname').val();
		user.nickname = $("#user-realname").val()+now.getFullYear()+(now.getMonth()+1)+now.getMinutes();
		user.mobile = $("#user-mobile").val();
		user.theSchool = $("#user-theSchool").val();
		user.grade = $("#user-grade").val();
		var obj = {
			user:user,
			_csrf: $("#hiden-value").val()
		}
		$.ajax({
			url: '/organizationsignupstudent',
      data:obj,
      async: true,
      type: 'post',
      dataType:'json',
      success:function(data){
      	if(!data.status){
      		alert("添加学生完成");
      		window.location.href='/organization/student/'+ data.id+'/show';
      	}else{
      		alert(data.msg);
      	}
      }
		})


	})


})