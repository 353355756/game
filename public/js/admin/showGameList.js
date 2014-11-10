$(document).ready(function(){
	//获得applyList的总数
	var total = $('.game-num').val();
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
			url: '/show/games',
			data: 'skipPage='+page+'&perPage='+per_item+'&total='+total+'&_csrf='+$('#hiden-value').val(),
			async: true,
			type: 'post',
			dataType:"json",
			success:function(data){
				$("#hiden-value").val(data._csrf);
				if(!data.status){
					var html = "";
					var games = data.games;
					var url = data.url;
					if(games.length){
						for(var o in games){
							html += "<tr>";
							html += "<td>"+ games[o]._id +"</td>";
							html += "<td>"+ games[o].name+"</td>";
							html += "<td>"+ games[o].company.nickname+"</td>";
							html += "<td><a target='view_window' href='"+ url+"game/"+games[o]._id+"/"+games[o].gameFilePath+"'>"+ url+"game/"+games[o]._id+"/"+games[o].gameFilePath+"</a></td>";
							html += "<td>"+ changeTimeFormat(games[o].created,3) +"</td>";
							html += "<td><a class='orange' style='margin-left:25px;float:left;' href='/admin/game/show/"+games[o]._id+"'><i class='icon-pencil'></i></a></td>";
							html += "</tr>";
						}
					}else{
						html += "<tr ><td colspan='4' class='text-center'>没有找到相关的游戏</td></tr>";
					}
					$('.normal-table tbody').html(html);		
				}else{
					alert("error");
				}
			}
		});
	}
});