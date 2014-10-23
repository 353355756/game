$(document).ready(function(){
	$("#realname").bind('blur',function(){
		var value = $(this).val();
		if(value == ""){
			$(this).parent().siblings('.tips').children('span').html("真实姓名不能为空");
		}else{
			$(this).parent().siblings('.tips').children('span').html("");
		}
	})
	$("#mobile").bind('blur',function(){
		var value = $(this).val();
		if(value == ""){
			$(this).parent().siblings('.tips').children('span').html("手机号码不能为空");
		}else{
			$(this).parent().siblings('.tips').children('span').html("");
		}
		if(isMobile(value)){
			$(this).parent().siblings('.tips').children('span').html("");
		}else{
			$(this).parent().siblings('.tips').children('span').html("手机号码格式错误");
		}
	})
	$("#applyNumber").bind('blur',function(){
		var value = $(this).val();
		if(value == ""){
			$(this).parent().siblings('.tips').children('span').html("证件号码不能为空");
		}else{
			$(this).parent().siblings('.tips').children('span').html("");
		}
	})
	$("#userBrief").bind('blur',function(){
		var value = $(this).val();
		if(value == ""){
			$(this).parent().siblings('.tips').children('span').html("个人简介不能为空");
		}else{
			$(this).parent().siblings('.tips').children('span').html("");
		}
	})
	$('.phone-front-btn').bind('click',function(){
		$('.phone-front').trigger('click');
	})
	$('.phone-front').bind('change',function(){
		value=$(this).val();
   	value = value.split('\\');
    value = value[value.length-1];
		$('.phone-front-name').html(value);
		$('.fornt-name-tips').html('');
	})
	$('.phone-back-btn').bind('click', function(){
		$('.phone-back').trigger('click');
	})
	$('.phone-back').bind('change',function(){
		value=$(this).val();
   	value = value.split('\\');
    value = value[value.length-1];
		$('.phone-back-name').html(value);
		$('.back-name-tips').html('');
	})

	$('.apply-btn ').bind('click',function(){
		var flag = true;
		$("input").each(function(){
			if($(this).val() == ""){
				flag = false;
				return ;
			}
		})
		$('.tips span').each(function(){
			if($(this).html() != ""){
				flag = false;
				return ;
			}
		})
		if($('.phone-front').val() == ""){
			flag= false;
			$(".fornt-name-tips").html("图片不能为空")
		}
		if(flag){
			var option ={
				url: '/applyteacher',
				type: 'post',
				dataType: 'json',
				success: function(data){
					if(data.status){
						alert(data.msg);
					}else{
						alert("申请已提交，请等待审核");
						window.location.href='/';
					}
				}
			}
			$('#apply-teacher-form').ajaxForm(option);
			$('#apply-teacher-form').submit();
		}
	})
})

function isMobile(value){
	if(value==""){
		return true;
	}
	var reg0 = /^1[3458]\d{9}$/;
	var value = value.replace(" ","")
	if (value==""){
		return false;
	}
	if (reg0.test(value)){
		return true;
	}else{
		return false;
	}
}