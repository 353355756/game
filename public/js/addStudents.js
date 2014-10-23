$(document).ready(function(){


	$('.students-textarea').keydown(function(event){  
    if(event.keyCode==13){
    	var value = $(this).val();
    	value +=";";  
      var height = $(this).height();
      height += 30;
      $(this).height(height);
      $(this).val(value);
    }  
  });
  $('.send-email').click(function(){
  	var value = $('.students-textarea').val();
    value =value.replace(/\n/g, "");
  	if("" == value){
  		alert("请输入您要发送支付码的学生的邮件");
  	}else{
  		value = value.split(';');
  		var cid =  $('.course-id').val();
      var obj = {
        emails:value,
        cid: cid,
        _csrf: $("#hiden-value").val()
      }
  		$.ajax({
  			url: '/postemailtostudent',
        data: obj,
        async: true,
        type: 'post',
        dataType:"json",
        success:function(data){
        	if(data.status){
        		alert("发送失败");
        	}else{
        		alert("发送成功");
        	}
        	window.location.reload();
        }
  		})
  	}
  });  


})