$(document).ready(function(){
	//生成富文本编辑器
	var ue = UE.getEditor('editor');
	
	var maxStudent = 100;
	var minStudent = 10;


	$('.student-max').bind('blur',function(){
		maxStudent = $(this).val()==""?100:parseInt($(this).val());
		if(isNaN(maxStudent)){
			$(this).val(100);
		}
		$(this).val(parseInt(maxStudent));

	})
	$('.student-min').bind('blur',function(){
		minStudent = $(this).val()==""?10:parseInt($(this).val());
		if(isNaN(minStudent)){
			$(this).val(10);
		}
		$(this).val(parseInt(minStudent));
	})
	$('.first-step-next').bind('click',function(){
		if($("#teacher-id")[0]){
			var teacherId = $("#teacher-id").val();
			if(!teacherId){
				showError("#teacher-id","教师ID不能为空",true)
				return false;
			}
		}
		var courseName = $('#course-name').val();
		if(!courseName){
			showError("#course-name","请输入课程名",true);
			return false;
		}
		if(maxStudent < minStudent){
			var student = maxStudent;
			maxStudent = minStudent;
			minStudent = student;
		}



		$('.course-add-tips').css("background",'url("/img/Imgs.png") 0px -248px no-repeat');
	  $('.step-two').addClass('past');
		changeDiv('.create-course-second-step','.create-course-first-step');

	});
	//第二层的切换
	$('.second-step-prev').bind('click',function(){
		$('.step-two').removeClass('past');
	  $('.course-add-tips').css("background",'url("img/Imgs.png") 0px -208px no-repeat');
		changeDiv('.create-course-first-step','.create-course-second-step');
	})
	
	
	$('.second-step-next').bind('click',function(){
		$('.step-three').addClass('past');
	  $('.course-add-tips').css("background",'url("/img/Imgs.png") 0px -288px no-repeat');
		changeDiv('.create-course-third-step','.create-course-second-step');
	})
	
	//第3层的切换
	$('.third-step-prev').bind('click',function(){
		$('.step-three').removeClass('past');
	  $('.course-add-tips').css("background",'url("/img/Imgs.png") 0px -248px no-repeat');
		changeDiv('.create-course-second-step','.create-course-third-step');
	})
	$('.third-step-next').bind('click',function(){
		//显示课程名
		$('.course-text h1').html($("#course-name").val());
		//显示课程图片
		$('.course-img img').attr('src',$('.show-clip-img').attr('src'));
		//显示最大最小人数
		$('.number-show').html(minStudent+"/"+maxStudent);

		//显示课长
		$('.time-show').html($(".course-num").html()+"节课("+$(".course-time").html()+")")
		$('.course-content-detail').html(ue.getContent())
		var beginDate = (qk.ok()).arr[0].beginTime;
		$(".begin-time-show ").html(changeTimeFormat(beginDate,3));

		$('.step-four').addClass('past');
		$('.course-add-tips').css("background",'url("/img/Imgs.png") 0px -328px no-repeat');
		       	
		$('.course-content-detail').html(ue.getContent());
		var qkResult=qk.ok();
    	schedule=qkResult.arr;
    	if(schedule.length){
    		$("#course-content-schedule").qkClassDate({
    			data:qkResult.dataArr
    		});
			changeDiv('.create-course-fourth-step','.create-course-third-step');
		}else{
			alert("您没有选择课程");
		}
	})
	$('.fourth-step-prev').bind('click',function(){
		$('.step-four').removeClass('past');
	  $('.course-add-tips').css("background",'url("/img/Imgs.png") 0px -288px no-repeat');
		changeDiv('.create-course-third-step','.create-course-fourth-step');
	})
	$('.create-course-compelete').bind('click',function(){
		$(this).unbind();
		var tags =[];
		$("dd span").each(function(){
			if($(this).hasClass("selected")){
				tags.push($(this).attr('rel'));
			}
		});
		var myselfTag = $('#course-tags').val();
		if(myselfTag){
			myselfTag = myselfTag.split(' ');
			for(var i in myselfTag){
				tags.push(myselfTag[i]);
			}
		}
		var tid = "";
		if($("#teacher-id")[0]){
			tid = $("#teacher-id").val();
		}
		var datas ={
	        'name': $("#course-name").val(),
	        'price' : 0,
	        'detail' : ue.getContent(),
	        'img' : $('.show-clip-img').attr('src'),
	        'maxStudentsNum' : maxStudent,
	        'minStudentsNum' : minStudent,
	        'poster' :'' ,
	        'tags' : tags ,
	        'schedules' : schedule,
	        'tid' : tid,
	        'brief': $('#course-brief').val(),
	        '_csrf': $('#hiden-value').val(),
	        'isOpen': true
	    }
		$.ajax({
			url: '/createcourse',
	      data:datas,
	      async: true,
	      type: 'post',
	      dataType:'json',
	      success :function(data){
	      	if(!data.status){
	      		window.location.href='/courseresult/0/'+data.cid;
	      	}else{
	      		window.location.href='/courseresult/1/0';
	      	}
	      }
		})
	})
	$('.tags-icon-div').bind('click',function(){
		$(this).hide();
		$('.show-tags').show();
		$(this).parent().parent().css('height','250px');
		$(this).parent().css('height','250px');
	})



	//上传图片
	$('#course-img-upload').bind('change',function(){
		var value = $(this).val();
		if(!/\.(gif|jpg|jpeg|png|GIF|JPG|PNG|JPEG)$/.test(value)){
			alert("图片类型错误");
			$(this).val('');
			return false;
		}else{
			var option ={
				url: '/imgupload',
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
				}
			}
			$('#course-img-form').ajaxForm(option);
			$('#course-img-form').submit();
		}
	})
	//剪切图片
	var x1,y1,width,height,imgurl;
	function clipImg(url){
		imgurl = url;
		var clip;
		var img = new Image();
		img.src= '/courseImg/'+url;
  	img.onload  = function(){
		 	var width = img.width+40;
		 	var height = img.height+100;
		 	$('.show-img').attr('src',img.src);
		 	$('.image-clip').height(img.height+100);
			$('.image-clip').width(img.width+40);
			$("#show-img").Jcrop({
				bgColor:'black',
				bgOpacity: .5,
				setSelect: [0,0,302,200],
				minSize: [302,200],
				aspectRatio: (3/2),
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
		$(this).unbind('click');
		$.ajax({
			url:'/clipimg',
			data:'url='+imgurl+"&x="+x1+"&y="+y1+"&height="+height+"&width="+width+'&_csrf='+$('#hiden-value').val(),
			type: 'post',
			dataType: 'json',
			success: function(data){
				if(!data.err){
					$('#hiden-value').val(data.csrf);
					$('.show-clip-img').attr('src','');
					$('.show-clip-img').attr('src','/courseImg/'+data.url);
					$('#cancel-clip-btn').trigger('click');
				}else{	
					alert(data.err);
				}
			}
		})
	});
	//切换标签
	
	$(".show-tags dd span").each(function(){
		$(this).click(function(){
			if($(this).hasClass('selected')){
				$(this).removeClass('selected')
			}else{
				$(this).addClass('selected');
			}
		})
  })

	function changeDiv(show,hide){
		$(hide).fadeOut('fast',function(){
			$(show).fadeIn('slow');
		});
	}

	//
	var Data = function(){
	    this.name='qk';
	    this.reservedHours=99999;
	    this.checkDays=0;//默认的从现在的时间到开始选课程的时间
	    this.schedules=[];
	    this.otherSchedules=[[],[]];
  	}
	var data=new Data();
	var qk;
	var schedule;
	var duringDay = 3
	var now = new Date()-0;
  $.ajax({
		url:'/getUsedSchedule',
		data:'_csrf='+$('#hiden-value').val(),
		type: 'post',
		dataType: 'json',
		success: function(sList){
			if(!sList.status){	
				data.otherSchedules = sList.times;
				$('#hiden-value').val(sList._csrf);

		  	data.otherSchedules[0].push( { 'startTime':now-0, 'endTime':now-0});
		  	qk = $("#qk-picker").qkDatePicker(data).addPage();
		  	$('.add-picker').bind('click',function(){
		    	qk.addPage();
		  	})
		  	$('.del-picker').bind('click',function(){
		  		if(data.schedules.length>1){
		    		qk.removePage(data.schedules.length-1);
		  		}
		  	});
			}else{
				alert(sList.msg);
			}
		}
  })

});

function showError(id,msg,isfocus){
	if(isfocus){
		$(id).focus();
	}

	$(id).parent("span").siblings('.tips').children('span').html(msg);
}