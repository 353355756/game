$(document).ready(function(){
	var Date = function(){
		this.name = "qk";
		this.reservedHours = -3;
		this.schedules = [];
		this.otherSchedules = [[],[]];
	}
	var data = new Date();
	var qk;
	$.ajax({
		url:'/getUsedSchedule',
		data:'_csrf='+$('#hiden-value').val(),
		type: 'post',
		dataType: 'json',
		success: function(sList){
			if(!sList.status){	
				data.otherSchedules = sList.times;
				var stillCreateNum = $('.stillCreateNum').val();
				var closeTime = $('.closeTime').val();
				data.reservedHours = -stillCreateNum;
				data.limitTime = closeTime;
				qk = $("#publicPicker").qkDatePicker(data).addPage();

				$('#hiden-value').val(sList._csrf);

			}else{
				alert(sList.msg);
			}
		}
  })
	$(".cancel-btn").bind('click',function(){
		history.go(-1);
	})
	$(".create-public-course").bind('click',function(){
		var qkResult = qk.ok();
		var schedule = qkResult.arr;
		var cid = $('.course-id').val();
		var studentMax = $(".maxStudentsInput").val();
		if(studentMax == ""){
			studentMax = 100;
		}
		if(schedule == ""){
			alert("请选择公开课日期");
			return false;
		}else{
			$(this).unbind('click');
			var obj = {
				cid :cid,
				schedule:schedule,
				studentMax:studentMax,
				_csrf: $("#hiden-value").val()
			}
			$.ajax({
				url:"/addpubliccourse",
				data:obj,
				async:true,
				type:"post",
				dataType:"json",
				success:function(data){
					if(data.status){
						alert("创建失败");
						window.location.reload();
					}else{
						alert("创建成功")
						history.go(-1);
					}
					$("#hiden-value").val(data._csrf);
				}
			})
		}
	})
})