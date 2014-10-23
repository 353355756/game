$(document).ready(function(){
	var user= {};
	user.nickname = "liuliang2";
	user.role = 1;

	var obj = {
		user:user,
		_csrf: $("#hiden-value").val()
	}
	$.ajax({
		url: '/game/4',
        data:obj,
        async: true,
        type: 'post',
        dataType:'json',
        success:function(data){
        	$("#hiden-value").val(data._csrf);
      	  	if(!data.status){
      	  		alert(data.count);
      	  	}else{
				alert("err");
      	  	}
        }
	})
})

