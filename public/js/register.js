$(document).ready(function(){
	$('.register-btn').bind('click',function(){
		var flag = true;
		$('input').each(function(){
			if($(this).val() == ''){
				flag = false;
				return false;
			}
		})
		$('.error-tips').each(function(){
			if($(this).html() != ""){
				flag = false;
				return false;
			}
		})
		if(flag){
			$('.register-form').submit();
		}
		
	})
	$('.nickname').bind('blur',function(){
		changeBlur($(this),'nickname',"用户名不能为空");
		
	});
	$('.email').bind('blur',function(){
		changeBlur($(this), 'email',"邮箱不能为空");
	});
	$('.password').bind('blur',function(){
		var value = $(this).val();
		if(value.length < 6){
			$(this).parent('span').siblings('.error-tips').html("密码不能少于6位数");
		}else{
			$(this).parent('span').siblings('.error-tips').html("");
		}
	})
	$('.re-pass').bind('blur',function(){
		var value = $(this).val();
		if(value != $('.password').val()){
			$('.password').parent('span').siblings('.error-tips').html("密码不一致");
		}else{
			$('.password').parent('span').siblings('.error-tips').html("");
		}
	})
	function changeBlur(that,type,error){
		var value = that.val();
		if(value== ""){
			that.parent('span').siblings('.error-tips').html(error);
			return;
		}else{
			that.parent('span').siblings('.error-tips').html("");
		}
		if("email" == type){
			if(checkEmail(value)){
				that.parent('span').siblings('.error-tips').html("");
			}else{
				that.parent('span').siblings('.error-tips').html("邮箱格式不正确");
				return;
			}
		}
		var obj;
		if('email' == type){
			obj ={ 'email':value, _csrf:$('#hiden-value').val() };
		}else if('nickname' == type){
			obj ={ 'nickname':value, _csrf:$('#hiden-value').val() }
		}
		
		checkRegister(obj,that);
	}
	function checkRegister(obj,that){
		$.ajax({
			url: '/checkregister',
			data: obj,
			async: true,
			type: 'post',
			dataType:"json",
			success:function(data){
				$("#hiden-value").val(data._csrf);
				if(data.status){
					that.parent('span').siblings('.error-tips').html(data.msg);
				}else{
					that.parent('span').siblings('.error-tips').html("");
				}
			}
		});
	}
	function checkEmail(value){
		var m=/^([a-zA-Z0-9]+[_|\_|\.|-|\-]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.|-|\-]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
		if(!m.test(value)){
			return false;
		}else{
			return true;
		}
	}

})