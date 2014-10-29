$(document).ready(function(){
	$('.game-create-btn').bind('click',function(){
		if($('#game-compan').val()==""){
			alert("未填写游戏公司");
		}
		if($('#game-name').val()==""){
			alert("未填写游戏名称");
		}

		var game= {};
		game.company = $('#game-compan').val();
		game.name = $('#game-name').val();

		var obj = {
			game:game,
			_csrf: $("#hiden-value").val()
		}
		$.ajax({
			url: '/admin/game',
	        data:obj,
	        async: true,
	        type: 'post',
	        dataType:'json',
	        success:function(data){
	      	  if(!data.status){
	      		alert("创建游戏成功");
	      		window.location.reload();
	      	  }else{
	      		alert(data.msg);
	      	  }
	        }
		})
	})
	$('.gamezip').bind('change',function(){
		var value = $(this).val();
		if(!/\.(zip)$/.test(value)){
			alert("上传文件的类型不正确");
			$(this).val('');
			return false;
		}else{
			var option ={
				url: '/gameupload',
				type: 'post',
				dataType: 'json',
				success: function(data){
					if(!data.error){
						$('#hiden-value').val(data._csrf);
					}
					alert(data.msg);
				},
				error: function(data){
					alert(data);
				}
			}
			$('.gameuploadform').ajaxForm(option);
			$('.gameuploadform').submit();
		}
	})
})