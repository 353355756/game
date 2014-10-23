$(document).ready(function(){
	$('.modify-mobile').bind('click',function(){
		$('.phone-span').html('<input type="text" class="mobile-modify-value" name= "mobile">');
		$(this).hide();
	})
	$(".nick-name").bind('blur',function(){
		var value = $(this).val();
		var that = $(this);
		if(value == ""){
			$(this).parent('span').siblings('.error').html("昵称不能为空");
		}else{
			$(this).parent('span').siblings('.error').html("");
		}
	})
	$(".real-name").bind('blur',function(){
		var value = $(this).val();
		var that = $(this);
		if(value == ""){
			$(this).parent('span').siblings('.error').html("真实姓名不能为空");
		}else{
			$(this).parent('span').siblings('.error').html("");
		}
	})
	//修改用户信息
	$('.user-info-submit').bind('click',function(){
		var flag = true;
		var nickName = $('.nick-name').val();
		var realName = $('.real-name').val();
		var gender 	 =$(":radio:checked").val() == undefined? "":$(":radio:checked").val();
		var mobile = $('.mobile-modify-value').val() == undefined? "": $('.mobile-modify-value').val();
		var brief = $('.user-brief').val();
		if(mobile != ""){
			if(isMobile(mobile)){
				$(".phone-error").html("");
			}else{
				$(".phone-error").html("电话号码格式不正确")
			}
			
		}
		$("input[type=text]").each(function(){
			if($(this).val() == ""){
				flag = false;
				if($(this).hasClass('real-name')){
					$(this).parent('span').siblings('.error').html("真实姓名不能为空");

				}else if($(this).hasClass('nick-name')){
					$(this).parent('span').siblings('.error').html("昵称不能为空");
				}else if($(this).hasClass('mobile-modify-value')){
					$(this).parent('span').siblings('.error').html("电话号码不能为空");
				}
			}
		})
		$('.error').each(function(){
			if($(this).html() != ""){
				flag = false;
			}
		})
		if(flag){
			$.ajax({
				url: '/userinfo',
				data:'realname='+realName+'&nickname='+nickName+'&gender='+gender+'&mobile='+mobile+'&brief='+brief+"&_csrf="+$("#hiden-value").val(),
				async: true,
				dataType:'json',
				type: 'post',
				success:function(result){
					$("#hiden-value").val(result._csrf);
					if(result.status == 0){
						alert( "修改成功");
					}else{
						alert("修改失败，请重新修改");
					}
					window.location.reload();
				}
			})
		}
	})
	//修改密码
	$(".pw-submit").bind('click',function(){
		var  oldPS=$(".opw").val();
		var  newPS=$(".npw").val();
		var submitPS = $(".rnpw").val();
		if(newPS == submitPS){
			$.ajax({
					url: '/password',
					data:'oldpw='+oldPS+'&newpw='+newPS+"&_csrf="+$('#hiden-value').val(),
					async: true,
					type: 'post',
					success:function(result){
						$('#hiden-value').val(result._csrf);
						if(result.status==0){
							alert('修改成功');
						}else{
							alert(result.msg);
						}
						window.location.reload();
					}
			});
		}else{
			$(".npw").css('border','1px solid #CB4D72');
			$(".rnpw").css('border','1px solid #CB4D72')
			$(".rnpw-error").html("密码输入不一致");
			$(".npw-error").html("密码输入不一致");
		}
	});
//修改头像
	$('.img-input').bind('change',function(){
		var value = $(this).val();
		if(!/\.(gif|jpg|jpeg|png|GIF|JPG|PNG|JPEG)$/.test(value)){
			alert("上传文件的类型不正确");
			$(this).val('');
			return false;
		}else{
			var option ={
				url: '/avatarload',
				type: 'post',
				dataType: 'json',
				success: function(data){
					if(!data.error){
						$('#hiden-value').val(data._csrf);
						clipImg(data.url);
					}else{
						alert(data.msg);
					}
				},
				error: function(data){
					alert(data);
				}
			}
			$('.photo-form').ajaxForm(option);
			$('.photo-form').submit();
		}
	})
	//剪切图片
	var x1,y1,width,height,imgurl;
	function clipImg(url){
		imgurl = url;
		var clip;
		var img = new Image();
		 img.src= '/avatar/'+url;
		 img.onload  = function(){
		 	var width = img.width+40;
		 	var height = img.height+100;
		 	$('.show-img').attr('src',img.src);
		 	$('.image-clip').height(img.height+100);
			$('.image-clip').width(img.width+40);
			$(".show-img").Jcrop({
				bgColor:'black',
				bgOpacity: .5,
				setSelect: [0,0,150,150],
				minSize: [150,150],
				aspectRatio: (3/3),
				onChange:getPosition
			},function(){
				clip = this;
				$('.image-clip').qkDialog({
					width:width,
					height:height,
					closeButton:'cancel-clip-btn',
					callback:function(){
						clip.destroy();
					}
				})
			})
  	}
	}
	function getPosition(p){
		x1 = parseInt(p.x);
		y1 = parseInt(p.y)+1;
		width = parseInt(p.w);
		height = parseInt(p.h);
	}
	$('.submit-clip-btn').bind('click',function(){
		$.ajax({
			url:'/userphoto',
			data:'url='+imgurl+"&x="+x1+"&y="+y1+"&height="+height+"&width="+width+'&_csrf='+$('#hiden-value').val(),
			type: 'post',
			dataType: 'json',
			success: function(data){
				if(!data.err){
					alert("头像已修改");
					window.location.reload();
				}else{	
					alert(data.msg);
					window.location.reload();
				}
			}
		})
	});

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