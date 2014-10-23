$(document).ready(function(){
	////获得checkcourses的总数
	var total = $('.total').val();
	//进行分页
	showOrganiztionCourses();
	function showOrganiztionCourses(){
		$(".qk-page").pagination(total,{items_per_page:20,callback:back});
		function back(page,per_item){
			$.ajax({
				url: '/organization/courses',
				data: 'skipPage='+page+'&perPage='+per_item+'&total='+total+'&_csrf='+$('#hiden-value').val(),
				async: true,
				type: 'post',
				dataType:"json",
				success:function(data){
					console.log(123321);
					$('#hiden-value').val(data._csrf);
					if(!data.status){
						var html = "";
						var courses = data.courses;
						for(var o in courses){
							html += "<tr>";
							html += "<td>" + courses[o].name+ "</td>";
							html += "<td>" + courses[o].teacher.realname+ "</td>";
							html += "<td class='text-center'><a class='small-green-btn', href='/organization/courses/"+ courses[o]._id +"/add/error'>添加错题</a></td>";
						}
						$(".organization-courses-table tbody").html(html);
					}else{
						alert(data.msg);
					}
				}
			});
		}
	}
})


