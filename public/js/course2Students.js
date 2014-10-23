$(document).ready(function(){
	////获得checkcourses的总数
	var total = $('.students-total').val();
	var cid;
	$(".relative-course").click(function(){
		cid = $(this).attr("rel");
		$(this).addClass("current");
		$(this).siblings().removeClass("current");
		showRelativeStudent(cid);
	});
	$(".course-lists>span:eq(0)").addClass("current").trigger("click");
	//进行分页
	function showRelativeStudent(cid){
		$(".qk-page").pagination(total,{items_per_page:20,callback:back});
		function back(page,per_item){
			$.ajax({
				url: '/organization/relativestudents',
				data: 'cid='+cid+'&skipPage='+page+'&perPage='+per_item+'&total='+total+'&_csrf='+$('#hiden-value').val(),
				async: true,
				type: 'post',
				dataType:"json",
				success:function(data){
					$('#hiden-value').val(data._csrf);
					if(!data.status){
						var html = "";
						var users = data.users;
						for(var o in users){
							html += "<tr>";
							html += "<td>"+users[o].id+"</td>";
							html += "<td>"+users[o].realname+"</td>";
							html += "<td>"+users[o].email+"</td>";
							html += "<td>"+users[o].theSchool+"</td>";
							html += "<td>"+users[o].grade+"</td>";
							if(users[o].isBind){
								html +="<td class='align-center'><span class='relative-bind isBind' rel='"+users[o].id+"'>已关联<span></td>";
							}else{
								html +="<td class='align-center'><span class='relative-bind' rel='"+users[o].id+"'>未关联<span></td>";
							}
						}
						$(".students-table tbody").html(html);
						$(".relative-bind").click(function(){
							relativeStudent($(this));
						})
					}else{
						alert(data.msg);
					}
				}
			});
		}
	}
	function relativeStudent(that){
		var isBind = !(that.hasClass("isBind"));
		var sid = that.attr("rel");
		var data = {
			cid:cid,
			isBind:isBind,
			sid:sid,
			_csrf:$("#hiden-value").val()
		}
		$.ajax({
			url: '/organization/course/students',
			data: data,
			async: true,
			type: 'post',
			dataType:"json",
			success:function(data){
				$('#hiden-value').val(data._csrf);
				if(!data.status){
					if(!isBind){
						that.html("未关联").removeClass("isBind")
					}else{
						that.html("已关联").addClass("isBind");
					}
				}else{
					alert(data.msg);
				}

			}
		})
	}
})


