$(document).ready(function(){
	////获得checkcourses的总数
	var total = $('#total').val();
	//进行分页
	$(".qk-page").pagination(total,{items_per_page:20,callback:back});
	function back(page,per_item){
		$.ajax({
			url: '/organization/students',
			data: 'skipPage='+page+'&perPage='+per_item+'&total='+total+'&_csrf='+$('#hiden-value').val(),
			async: true,
			type: 'post',
			dataType:"json",
			success:function(data){
				if(!data.status){
					var users = data.users;
					var html = '';
					for(var o in users){
						html += '<tr>';
						html += '<td>'+users[o].id+'</td>';
						html += '<td>'+users[o].realname+'</td>';
						html += '<td>'+users[o].email+'</td>';
						html += '<td>'+users[o].theSchool+'</td>';
						html += '<td>'+users[o].grade+'</td>';
						html += '<td class="text-center"><a href="/organization/student/'+ users[o].id+'/show" class="small-green-btn" >详情</a></td>';
						html += '<td class="text-center"><a rel="'+ users[o].id+'" class="small-green-btn deleteUser" >删除</a></td>';
						html += '</tr>';
					}
					$('.normal-table tbody').html(html);
					$('.deleteUser').click(function(){
						deleteUser($(this),$(this).attr('rel'));
					})
				}else{
					alert(data.msg);
				}
			}
		});
	}
})
function deleteUser(that,uid){
	if(!confirm("确定要删除这个用户吗？")){
		return false;
	}
	$.ajax({
		url: '/organization/student/'+uid+'/delete',
		data: '_csrf='+$('#hiden-value').val(),
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