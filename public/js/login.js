$(document).ready(function(){
	//输入提醒
	$(".user-input-text").each(function(){
		$(this).bind('focus',function(){
			$(this).siblings('.tips').hide();
			$(this).children("input").focus();
		});
		$(this).bind('blur',function(){
			var value = $(this).val();
			if(!value){
				$(this).siblings(".tips").show();
			}
		})
	});

	//鼠標移入諮詢塊，進行移動
	$('.reference').bind('click',function(){
		if($(this).css('right')=="-85px"){
			$(this).animate({
			    right: '+=85px',
			  }, 200,function(){
			  });
		}else if($(this).css('right')== '0px'){
			$(this).animate({
			    right: '-=85px',
			  }, 200);
		}
		
	})

	$(".tips").each(function(){
		$(this).bind('click',function(){
			$(this).hide();
			$(this).siblings("input").focus();
		})
	})

	//勾选多日登录
	$(".check-box").click(function(){
		if($(this).hasClass("checked-box")){
			$(this).removeClass("checked-box");
		}else{
			$(this).addClass("checked-box");
		}
	})
	$('body').bind('keydown',function(e){
	    if(e.keyCode==13){
	    	login();
	    }
	  })
	$(".user-login-btn").click(function(){
		login();

	});
	function login(){
		var email = $('.login-user-name').val();
		var password = $('.login-user-password').val();
		if(email == "" || password == ""){
			$(".white").html("邮箱或密码为空");
			return false;
		}
		$('.login-form').submit();
	}

	
})