$(document).ready(function(){
	var cid = $("#course-id").val();
	var openCourse = $("#course-isOpen").val();
	$('.course-price-btn').bind('click',function(){
		var cids = [];
		cids.push($(this).attr('rel'));
		var postData ={	
			'_csrf':$('#hiden-value').val(),
			'cids':cids
		}
		if(openCourse == 'true'){
			$.ajax({
				url:'/addOpenCourses',
				data:postData,
				type: 'post',
				dataType: 'json',
				success: function(data){
					$('#hiden-value').val(data._csrf);
				//	var cid = $('.course-price-btn').attr('rel');
					if(data.status){
						if(data.msg == "未登录"){
							alert("请先登陆");
							window.location.href='/login';
						}else{
							alert(data.msg);
						}
					}else{
						$('.course-right.pull-right').html('<p class="un-add-cartlist-btn">已付款</p>'+$('.course-right.pull-right .teacher-info').html());
					}
				}
			})
		}else{
			$.ajax({
				url:'/addCourses2CartList',
				data:postData,
				type: 'post',
				dataType: 'json',
				success: function(data){
					$('#hiden-value').val(data._csrf);
				//	var cid = $('.course-price-btn').attr('rel');
					if(data.status){
						if(data.msg == "未登录"){
							alert("请先登陆");
							window.location.href='/login';
						}else{
							alert(data.msg);
						}
					}else{
						getCartNum();
						window.location.href= '/cartlist';
					}
				}
			})
		}
	})
	//添加公开课
	$(".addUserToPublicLesson").bind('click',function(){
		var lid = $(this).attr('rel');
		var that = $(this);
		$.ajax({
			url:'/addusertopubliclesson',
			data:"lid="+lid+"&_csrf="+$("#hiden-value").val(),
			type: 'post',
			dataType: 'json',
			success: function(data){
				$('#hiden-value').val(data._csrf);
				alert(data.msg);
				if(data.status == 0){
					that.removeClass("small-green-btn").removeClass("addUserToPublicLesson").addClass("orange").html("已参加");
				}
			}
		})
	});
	$(".publish-comment").bind('click',function(){
		$(".create-comment").show();
		$(this).hide();
	})
	var total = $('#comment-num').val();
	$(".qk-page").pagination(total,{items_per_page:10,callback:back});
	
	function back(page,per_item){
		$.ajax({
			url: '/comment/getcommentsbycourse',
			data: 'skipPage='+page+'&perPage='+per_item+'&total='+total+'&_csrf='+$('#hiden-value').val()+"&cid="+cid,
			async: true,
			type: 'post',
			dataType:"json",
			success:function(data){
				$('#hiden-value').val(data._csrf);
				if(data.status){
					alert(data.msg);
				}else{
					var comments = data.comments;
					var uid = $("#user-id").val();
					var tid = $("#teacher-id").val();
					var role = $("#role-type").val();
					var html = "";
					for(var o in comments){
						html += "<dl>";
						html += 	"<dt>";
						html += 		"<div class='comment-content clearfix' rel='"+ comments[o]._id +"'>";
						html += 			"<div class='comment-content-left pull-left'>";
						html += 				"<img src='/avatar/"+ comments[o].avatar+"'/>";
						html += 			"</div>";
						html += 			"<div class='comment-content-right pull-left'>";
						html +=					"<p class='user-name green'>"+ comments[o].nickname +"</p>"
						html +=					"<p class='comment-content'>"+ comments[o].review +"</p>"
						html +=					"<p class='comment-date'><span class='time'>"+ changeTimeFormat(comments[o].created)+"</span>";
						if(uid == tid || role == 4 || role == 3){
							html +=					"<a class='normal-gray-btn reply-comment'>回复</a>"
						}
						html +=  				"</p>";
						html +=       "</div>";
						html +=		"</dt>";
						html +=		"<dd>";
						if(data.comments[o].childs){
							for(var i in data.comments[o].childs){
								html += 		"<div class='comment-answer'>";
								html +=				"<p class='user-name green teacher'>"+ data.comments[o].childs[i].nickname +"</p>";
								html +=				"<p class='comment-content'>"+ data.comments[o].childs[i].review +"</p>";
								html += 		"</div>";
							}
						}
						html += 	"</dd>";
						html += "</dl>";
					}
					$(".show-comments").html(html);
					$(".reply-comment").click(function(){
						$(this).hide();
						var html = "";
						html += "<div class='comment-response-question'>"
						html += 		"<textarea class='replay-text'></textarea>";
						html += 		"<a class='normal-gray-btn comment-create-btn'>提交</a>";
						html += "</div>";
						$(this).parent("p").parent("div").parent("div").parent("dt").append(html);
						$(".comment-create-btn").bind('click',function(){
							var commentId= $(this).parent("div").siblings(".comment-content").attr('rel');
							var review = $(this).siblings("textarea").val();
							var tid = $("#teacher-id").val();
							var that = $(this);
							$.ajax({
								url: '/comment/addreplybycourse',
								data: 'review='+review+'&_csrf='+$('#hiden-value').val()+"&cid="+cid+"&commentId="+commentId+"&tid="+ tid,
								async: true,
								type: 'post',
								dataType:"json",
								success:function(data){
									$('#hiden-value').val(data._csrf);
									if(data.status){
										alert(data.msg);
									}else{
										var html = "";
										html += 	"<div class='comment-answer'>";
										html +=			"<p class='user-name green teacher'>"+ data.comment.nickname +"</p>";
										html +=			"<p class='comment-content'>"+ data.comment.review +"</p>";
										html += 	"</div>";
										that.parent("div").parent("dt").parent("dl").children("dd").prepend(html);
										that.parent("div").remove();
									}
								}
							})
						})
					})
				}
			}
		});
	}
	$(".comment-create-btn").bind('click',function(){
		var review = $('.comment-review').val();
		var that = $(this);
		$.ajax({
			url: '/comment/addcommnetbycourse',
			data: 'review='+review+'&_csrf='+$('#hiden-value').val()+"&cid="+cid,
			async: true,
			type: 'post',
			dataType:"json",
			success:function(data){
				$('#hiden-value').val(data._csrf);
				html = "";
				html += "<dl>";
				html += 	"<dt>";
				html += 		"<div class='comment-content clearfix'>";
				html += 			"<div class='comment-content-left pull-left'>";
				html += 				"<img src='/avatar/"+ data.comment.avatar+"'/>";
				html += 			"</div>";
				html += 			"<div class='comment-content-right pull-left'>";
				html +=					"<p class='user-name green'>"+ data.comment.nickname +"</p>"
				html +=					"<p class='comment-content'>"+ data.comment.review +"</p>"
				html +=					"<p class='comment-date'><span class='time'>"+ changeTimeFormat(data.comment.created)+"</span></p>"
				html +=       "</div>"
				html +=		"</dt>";
				html += "</dl>";
				$(".show-comments").prepend(html);
				that.parent(".create-comment").hide();
				$(".comment-review").val("");
				$(".publish-comment").show();
			}
		});
	})
});