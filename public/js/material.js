$(document).ready(function(){
	var total = $('#material-total').val();
	$(".qk-page").pagination(total,{items_per_page:10,callback:back});
	function back(page,per_item){
		$.ajax({
			url: '/material',
			data: 'skipPage='+page+'&perPage='+per_item+'&total='+total+'&_csrf='+$('#hiden-value').val(),
			async: true,
			type: 'post',
			dataType:"json",
			success:function(data){
				$('#hiden-value').val(data._csrf);
				if(data.status){
					alert("获取数据错误");
				}else{
					var html = "";
					if(!data.materials.length){
						html += "<p class='text-center'>您还没有上传资料</p>";
						$('.material-table').remove();
						$('.qk-page').remove();
						$('.material-right').append(html);
					}else{
						for(var o in data.materials){
							html +=	"<tr>";
							html += "<td>"+ data.materials[o].name +"</td>";
							if(data.materials[o].classify == 1){
								html += "<td>資料</td>";
							}else if(data.materials[o].classify == 2){
								html += "<td>教案</td>";
							}else if(data.materials[o].classify == 4){
								html += "<td>PK题</td>";
							}
							
							html += "<td><a class='preview-icon' href='/material/view/"+  data.materials[o]._id +"'></a></td>";
							html += "<td><span class='delete-icon' rel='"+ data.materials[o]._id +"'></span><td>";
							html +="</tr>"
						}
						$('.material-table tbody').html(html);

						$('.delete-icon').click(function(){
							var id = $(this).attr('rel');
							$.ajax({
								url: '/material/delete/'+id,
								data: '_csrf='+$('#hiden-value').val(),
								async: true,
								type: 'post',
								dataType:"json",
								success:function(data){
									$('#hiden-value').val(data._csrf);
									alert(data.msg);
									window.location.reload();
								}
							});
						})
					}
				}
			}
		})
	}
})