$(document).ready(function(){
	var cid;
	var oid;
	$(".order-comment").bind('click',function(){
		cid = $(this).attr('cid');
		oid = $(this).attr('rel');
		$("#popEvaluate").qkDialog({
      width:700,
      height:380,
      closeButton:'close',
      callback:closeComment
  	});
	});

	$('.order-appeal').bind('click',function(){
		cid = $(this).attr('cid');
		oid = $(this).attr('rel');
		$("#apply-return-money").qkDialog({
      width:700,
      height:415,
      closeButton:'apply-close',
      callback:closeReturn
  	});
	});
	//提交申诉
	$('.return-submit').click(function(){
		$(this).unbind();
		var mobile = $('.resetMobile').val();
		var reason = $('.apply-reason').val();
		if(!isMobile(mobile)){
			$('.mobile-error').html("电话号码格式不正确");
			return false;
		}else{
			$('.mobile-error').html(" ");
		}
		if(reason == ""){
			alert("申诉理由不能为空");
			return false;
		}
		//进行申诉
		$.ajax({
			url:'/applyreturn',
		  type:'post',
		  data:'cid='+cid+"&oid="+oid+"&reason="+reason+"&_csrf="+$("#hiden-value").val()+"&mobile="+ mobile,
		  dataType:'json',
		  success:function(data){
		  	$("#hiden-value").val(data._csrf);
		  	if(data.status){
		  		alert("申诉失败");
		  	}else{
		  		alert("申诉成功");
		  	}
		  	window.location.reload();
		  }
		});
	})
	$(".evaluate-submit").click(function(){
		$(this).unbind();
		var comment = $('.evaluate-content-textarea').val();
		if(comment == ""){
			alert("评价不能为空");
			return false;
		}
		$.ajax({
			url:'/ordercomment',
		  type:'post',
		  data:'cid='+cid+"&oid="+oid+"&comment="+comment+"&_csrf="+$("#hiden-value").val(),
		  dataType:'json',
		  success:function(data){
		  	$("#hiden-value").val(data._csrf);
		  	if(data.status){
		  		alert("评价失败");
		  	}else{
		  		alert("评价成功");
		  	}
		  	window.location.reload();
		  }
		});

	})
})



function closeComment(){
	$('.evaluate-content-textarea').val('');
}
function closeReturn(){
	$('.apply-reason').val('');
}

function isMobile(value){
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