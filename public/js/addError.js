$(document).ready(function(){
	////获得checkcourses的总数
	var cid = $("#course-id").val();
	var sid;
	$(".right-aside ul li").click(function(){
		sid = $(this).attr("rel");
		$(this).addClass("current");
		$(this).siblings().removeClass("current");
		getErrors(sid);
		if(sid!= undefined){
			$(".error-show-container h2 a").show().attr('href',"/course/"+ cid +"/errors/"+sid);
		}
	});
	$(".right-aside ul>li:eq(0)").addClass("current").trigger("click");
	function getErrors(sid){
		if(sid != undefined){
			$.ajax({
				url: '/course/'+cid+'/newerrors/'+ sid,
				data: 'cid='+cid+'&sid='+ sid +'&_csrf='+$('#hiden-value').val(),
				async: true,
				type: 'post',
				dataType:"json",
				success:function(data){
					$('#hiden-value').val(data._csrf);
					var html =""
					if(!data.status){
						if(data.errorExercises.length){
							for(var o in data.errorExercises){
								html += "<li>";
								html += "<p><img src=/errorQuestions/"+data.errorExercises[o].imgPath+"></p>";
								html += "<p class='date text-right'>"+changeTimeFormat(data.errorExercises[o].created,3)+"</p>";
							}
						}else{
							$(".error-show.container-ul li.no").show();
						}
					}else{
						alert(data.msg);
					}
					$(".error-show-container-ul").html(html);
				}
			});
		}
	}

	var uploadData = {
		_csrf:$('#hiden-value').val(),
		cid:$('#course-id').val(),
		sid:sid
	};

	var params = {
	  fileInput: $(".error-img-input").get(0),
	  dragDrop: $("#fileDragArea").get(0),
	  upButton: $("#fileSubmit").get(0),
	  url: $(".photo-form").attr("action"),
	  uploadData:uploadData,
	  filter: function(files) {
	    var arrFiles = [];
	    for (var i = 0, file; file = files[i]; i++) {
	      if (file.type.indexOf("image") == 0) {
	        if (file.size >= 512000) {
	          alert('您这张"'+ file.name +'"图片大小过大，应小于500k');  
	        } else {
	          arrFiles.push(file);  
	        }     
	      } else {
	        alert('文件"' + file.name + '"不是图片。');  
	      }
	    }
	    return arrFiles;
	  },
	  onSelect: function(files) {
	    var html = '', i = 0;
	    $("#preview").html('<div class="upload_loading"></div>');
	    var funAppendImage = function() {
	      file = files[i];
	      if (file) {
	        var reader = new FileReader()
	        reader.onload = function(e) {
	          html = html + '<div id="uploadList_'+ i +'" class="upload_append_list"><p><strong>' + file.name + '</strong>'+ 
	            '<a href="javascript:" class="upload_delete" title="删除" data-index="'+ i +'">删除</a><br />' +
	            '<img id="uploadImage_' + i + '" src="' + e.target.result + '" class="upload_image" /></p>'+ 
	            '<span id="uploadProgress_' + i + '" class="upload_progress"></span>' +
	          '</div>';
	          
	          i++;
	          funAppendImage();
	        }
	        reader.readAsDataURL(file);
	      } else {
	        $("#preview").html(html);
	        if (html) {
	          //删除方法
	          $(".upload_delete").click(function() {
	            ZXXFILE.funDeleteFile(files[parseInt($(this).attr("data-index"))]);
	            return false; 
	          });
	          //提交按钮显示
	          $("#fileSubmit").show();  
	        } else {
	          //提交按钮隐藏
	          $("#fileSubmit").hide();  
	        }
	      }
	    };
	    funAppendImage();   
	  },
	  onDelete: function(file) {
	    $("#uploadList_" + file.index).fadeOut();
	  },
	  onDragOver: function() {
	    $(this).addClass("upload_drag_hover");
	  },
	  onDragLeave: function() {
	    $(this).removeClass("upload_drag_hover");
	  },
	  onProgress: function(file, loaded, total) {
	    var eleProgress = $("#uploadProgress_" + file.index), percent = (loaded / total * 100).toFixed(2) + '%';
	    eleProgress.show().html(percent);
	  },
	  onSuccess: function(file, data) {
	  	var datajson = eval("("+data+")");
	  	$('#hiden-value').val(datajson._csrf);
			if(!datajson.status){
	    	//$("#uploadInf").append("<p>"+file.name+"上传成功!</p>");
	    	var html = "";
				html += "<li>";
				html += "<p><img src=/errorQuestions/"+datajson.errorExercises.imgPath+"></p>";
				html += "<p class='date text-right'>"+changeTimeFormat(datajson.errorExercises.created,3)+"</p>";
				$(".error-show-container-ul").prepend(html);
	    }else{
	    	$("#uploadInf").html("");
	    	$("#uploadInf").append("<p>"+file.name+"上传失败！</p>");  
	    }
	  },
	  onFailure: function(file) {
	  	$("#uploadInf").html("");
	    $("#uploadInf").append("<p>图片" + file.name + "上传失败！</p>");  
	    $("#uploadImage_" + file.index).css("opacity", 0.2);
	  },
	  onComplete: function() {
	    //提交按钮隐藏
	    $("#fileSubmit").hide();
	    //file控件value置空
	    $("#fileImage").val("");
	    $("#uploadInf").html("");
	    $("#uploadInf").append("<p>当前图片全部上传完毕，可继续添加上传。</p>");
	  }
	};
	ZXXFILE = $.extend(ZXXFILE, params);
	ZXXFILE.init();
});