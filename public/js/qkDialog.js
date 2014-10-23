(function($){
	$.fn.qkDialog=function(opts){
		//添加弹出的对象
		var opts=$.extend({
			//标题
			title:"dialog",
			//对话框的内容
			content:"content",
			//默认为外部已经写好的内容与标题
			autoWrite:false,
			//宽度默认
			width:"400",
			//高度默认
			height:"300",
			autoShow:true,
			//关闭按钮的id
			closeButton:"close",
			//关闭后的回调函数
			callback:"undefined",
			direct:"center",
			cancelButton:undefined,
			cancelCallBack:undefined,
			animation:"fade",
			duringTime:'all'//如果不是all的話傳入存在的時間秒數
		},opts||{})		
		return this.each(function(){

			$("body").append("<div id='parents'></div>");
			$("#parents").css({position:"absolute",width:"100%",height:$("body").height()+"px",display:"block",top:"0px",left:"0px","opacity":"0.4","z-index":"111","filter":"Alpha(Opacity=50)"})
			if(opts.autoWrite){
				var html="<div class='qkDialog_title'>"+opts.title+"</div>"
				html+=opts.content;
				$(this).html(html);
			}
			$(this).css("width",opts.width+"px");

			if(opts.height=='auto'){

				$(this).css("height",opts.height);
			}else{
				$(this).css("height",opts.height+"px");
			}
			if(opts.direct=="center"){
				$(this).css({"top":(document.body.clientHeight/2+$("body").scrollTop()-opts.height/2+"px"),"left":(document.body.clientWidth/2-opts.width/2+"px"),"z-index":"999"});
			}else if(opts.direct=="top"){
				$(this).css({"top":($(this).parent().scrollTop()+30+"px"),"left":($(this).parent().width()/2-opts.width/2+"px"),"z-index":"999"});
			}
			if(opts.autoShow){
				if(opts.animation == "fade"){
					$(this).fadeIn("slow",function(){
						if(opts.duringTime !='all'){
							setTimeout(disapper,opts.duringTime*1000);
						}
					})
				}else{
					$(this).show();
				}
			}
			var that=$(this);
			$("#"+opts.closeButton).bind("click",function(){
				that.hide();
				$("#parents").remove();
				if(opts.callback!="undefined"){
					opts.callback();
				}
			});
			//對cancelButton的處理
			if(opts.cancelButton != undefined){
				$("#"+opts.cancelButton).bind("click",function(){
					that.hide();
					$("#parents").remove();
					if(opts.cancelCallBack != undefined){
						opts.cancelCallBack();
					}
				})
			}
			//幾秒鐘以後消失的囘調.
			function disapper(){
				that.hide();
				$("#parents").remove();
				if(opts.callback != undefined){
					opts.callback();
				}
			}

		});
	};

})(jQuery);
