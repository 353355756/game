$(document).ready(function(){
	//获得applyList的总数
	var total = $('.user-num').val();
	var name = $(".query-name").val();
	var type = $(".query-type").val();
	$('.select-list li a').each(function(){
		
		if(type == $(this).attr("rel")){
			$(this).addClass('current');
		}
		if(!type && $(this).attr('rel') == undefined){
			$(".select-list .all").addClass('current');
		}
	})
	//进行分页
	$(".qk-page").pagination(total,{items_per_page:20,callback:back});
	function back(page,per_item){
		$.ajax({
			url: '/admin/users',
			data: 'nickname='+name+'&type='+ type +'&skipPage='+page+'&perPage='+per_item+'&total='+total+'&_csrf='+$('#hiden-value').val(),
			async: true,
			type: 'post',
			dataType:"json",
			success:function(data){
				$("#hiden-value").val(data._csrf);
				if(!data.status){
					var html = "";
					var users = data.users;
					if(users.length){
						for(var o in users){
							html += "<tr>";
							html += "<td>"+ users[o].id +"</td>";
							html += "<td><a href='/admin/user/show/"+ users[o].id +"''>"+ users[o].email +"</a></td>";
							html += "<td>"+ users[o].nickname+"</td>";
							html += "<td>"+ users[o].realname+"</td>";
							if(users[o].role == 0){
								html += "<td>管理员</td>";
							}else if(users[o].role == 1){
								html += "<td>游戏玩家</td>";
							}else if(users[o].role == 2){
								html += "<td>游戏公司</td>";
							}else if(users[o].role == 3){
								html += "<td>游戏管理员</td>";
							}
							html += "<td>"+ users[o].mobile+"</td>";
							if(users[o].actived){
								html += "<td>已激活</td>";
							}else{
								html += "<td>未激活</td>";
							}
							html += "<td>"+ changeTimeFormat(users[o].created,3) +"</td>";
							html += "<td><a class='orange deleteUser' style='margin-left:15px;float:left;' rel='"+users[o].id+"'>删除</a></td>";
							html += "</tr>";
						}
					}else{
						html += "<tr ><td colspan='7' class='text-center'>没有找到相关的用户</td></tr>";
					}
					$('.normal-table tbody').html(html);
					$(".deleteUser").click(function(){
						deleteUser($(this),$(this).attr('rel'));
					});
					$(".teacherCourses").click(function(){
						techerCoursesNum($(this).attr('rel'));
					});
					
				}else{
					alert("error");
				}
			}
		});
	}
	$(".query-name").bind('keydown', function(e){
		if(e.keyCode == 13){
			$('.query-btn').trigger('click');
		}
	})
	$('.query-btn').bind('click',function(){
		var name = $(".query-name").val();

		if(name != ""){
			window.location.href='/admin/users?nickname='+name;
		}else{
			window.location.href='/admin/users';
		}
	})
});

function deleteUser(that,uid){
	if(!confirm("确定要删除这个用户吗？")){
		return false;
	}
	$.ajax({
		url: '/admin/removeuser',
		data: 'uid='+uid+'&_csrf='+$('#hiden-value').val(),
		async: true,
		type: 'post',
		dataType:"json",
		success:function(data){
			$("#hiden-value").val(data._csrf);
			if(data.status){
				alert(data.msg);
			}else{
				alert("删除成功");
				window.location.reload();
			}
		}
	})
}
function techerCoursesNum(uid){
	$.ajax({
		url: '/admin/techerCoursesNum/'+uid,
		data: '_csrf='+$('#hiden-value').val(),
		async: true,
		type: 'post',
		dataType:"json",
		success:function(data){
			//$("#hiden-value").val(data._csrf);
			if(data.status){
				alert(data.msg);
			}else{
				//进行分页
				techerCourses(data.num,uid,data._csrf);
			}	
		}
	})
}
function techerCourses(total,uid,_csrf){
	$(".qk-page").pagination(total,{items_per_page:20,callback:cback});
	function cback(page,per_item){
		$.ajax({
			url: '/admin/techerCourses',
			data: 'uid='+uid+'&skipPage='+page+'&perPage='+per_item+'&total='+total+'&_csrf='+_csrf,
			async: true,
			type: 'post',
			dataType:"json",
			success:function(data){
				$("#hiden-value").val(data._csrf);
				if(!data.status){
					var html = "";
					var courses = data.courses;
					if(courses.length){
          	html+= '<thead><tr>';
          	html+='<th style="width:20%">课程id</th>';
          	html+='<th style="width:30%">课程名</th>';
          	html+='<th style="width:30%">课程进度</th>';
          	html+='<th style="width:20%;text-align:center">小课详情</th>';
          	html+='</tr></thead><tbody>';
						for(var c in courses){
							html += "<tr>";
							html += "<td>"+ courses[c].id +"</td>";
							html += "<td>"+ courses[c].name +"</td>";
							html += "<td style='color:red;'>"+ courses[c].schedule +"</td>";
							html += "<td><a class='orange coursesLesson' style='margin-left:15px;float:left;' rel='"+courses[c].id+"'>详情</a></td>";
							html += "</tr>";
						}
						html += "</tbody>";
					}else{
						html += "<tr ><td colspan='4' class='text-center'>没有找到相关的课程</td></tr>";
					}
					$('.normal-table').html(html);
					$(".coursesLesson").click(function(){
						coursesLessonNum($(this).attr('rel'));
					});
				}else{
					alert("error");
				}
			}
		});
	}
}
function coursesLessonNum(cid){
	$.ajax({
		url: '/admin/coursesLessonNum/'+cid,
		data: '_csrf='+$('#hiden-value').val(),
		async: true,
		type: 'post',
		dataType:"json",
		success:function(data){
			//$("#hiden-value").val(data._csrf);
			if(data.status){
				alert(data.msg);
			}else{
				//进行分页
				coursesLesson(data.num,cid,data._csrf);
			}	
		}
	})
}
function coursesLesson(total,cid,_csrf){
	$(".qk-page").pagination(total,{items_per_page:20,callback:cback});
	function cback(page,per_item){
		$.ajax({
			url: '/admin/coursesLesson',
			data: 'cid='+cid+'&skipPage='+page+'&perPage='+per_item+'&total='+total+'&_csrf='+_csrf,
			async: true,
			type: 'post',
			dataType:"json",
			success:function(data){
				$("#hiden-value").val(data._csrf);
				if(!data.status){
					var html = "";
					var lessons = data.lessons;
					if(lessons.length){
          	html+= '<thead><tr>';
          	html+='<th style="width:12%">小课id</th>';
          	html+='<th style="width:22%">预计上课时间</th>';
          	html+='<th style="width:22%">预计下课时间</th>';
          	html+='<th style="width:22%">实际上课时间</th>';
          	html+='<th style="width:22%">实际下课时间</th>';
          	html+='</tr></thead><tbody>';
						for(var l in lessons){
								html += "<tr>";
								html += "<td>"+ lessons[l].id +"</td>";
								html += "<td>"+ changeDateFormat(lessons[l].beginTime) +"</td>";
								html += "<td>"+ changeDateFormat(lessons[l].endTime) +"</td>";
								if(lessons[l].time){
									var comeArray = [];
									var leaveArray = [];
									for(var y in lessons[l].time){
										if(lessons[l].time[y].come){
											comeArray.push(new Date(lessons[l].time[y].come));
										}else{
											comeArray.push(0);
										}
										if(lessons[l].time[y].leave){
											leaveArray.push(new Date(lessons[l].time[y].leave));
										}else{
											leaveArray.push(0);
										}
									}
									var comMax = Math.max.apply(null,comeArray);
									var comMin = Math.min.apply(null,comeArray);
									var leaveMax = Math.max.apply(null,leaveArray);
									var leaveMin = Math.min.apply(null,leaveArray);
									if (comMax>leaveMax) {
										html += "<td>"+ changeDateFormat(Math.min.apply(null,comeArray)) +"</td>";
										html += "<td>缺少下课时间</td>";
									}else if(comMin>leaveMin&&leaveMin!=0){
										html += "<td>缺少上课时间</td>";
										html += "<td>"+ changeDateFormat(Math.max.apply(null,leaveArray)) +"</td>";
									}else{
										html += "<td>"+ changeDateFormat(Math.min.apply(null,comeArray)) +"</td>";
										html += "<td>"+ changeDateFormat(Math.max.apply(null,leaveArray)) +"</td>";
									}
								}else{
									html += "<td>未有获得时间</td>";
									html += "<td>未有获得时间</td>";
								}
							html += "</tr>";
						}
						html += "</tbody>";
					}else{
						html += "<tr ><td colspan='4' class='text-center'>没有找到相关的课程</td></tr>";
					}
					$('.normal-table').html(html);
				}else{
					alert("error");
				}
			}
		});
	}
}