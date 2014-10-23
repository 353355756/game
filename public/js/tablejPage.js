(function($) { 
	$.fn.tablejPage=function(opts){
		opts=$.extend({
				tableId:"",
				perPage:10,
				callBack:null
		},opts||{});
		return this.each(function(){
			
			var $this=$(this);
			var total=$("#"+opts.tableId+" tbody").children("tr").size();
			var html="";
			var pageNum=Math.ceil(total/opts.perPage)==0?1:Math.ceil(total/opts.perPage);
			for(var i=0;i<pageNum;i++){
				if(i==0){
					html+="<a class='jPageButton currentPage' rel='"+i+"'>"+(i+1)+"</a>";
				}else{
					html+="<a class='jPageButton' rel='"+i+"'>"+(i+1)+"</a>";
				}
			}
			$this.html(html);
			$(".jPageButton").each(function(index){
				$(this).bind("click",function(){
					$(this).siblings().removeClass("currentPage");
					$(this).addClass("currentPage");
					var pageNum=parseInt($(this).attr("rel"));
					$("#"+opts.tableId+" tbody").children("tr").each(function(index){
						if(index<pageNum*opts.perPage||index>=(pageNum+1)*opts.perPage){
							$(this).hide();
						}else{
							$(this).show();
						}

					});
				});
			})
		});

	};
})(jQuery); 