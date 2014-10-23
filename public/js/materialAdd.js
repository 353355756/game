$(document).ready(function(){
	var percent;
	function changePercent(){
		var i = 1;
		percent = setInterval(function(){
			if(i <20){
				var name = "loading-percent-"+5*i;
				$(".loading-percent a").removeClass().addClass(name);
				i++
			}else{
				clearInterval(percent);
			}
		},1000)
	}

	$('.beginTime').each(function(){
    var time = $(this).attr('rel');
    $(this).html(changeTimeFormat(time,3));
  })
	var flag = false;

	$("#filename").bind('change',function(){
		var value;
		$("input[name='classify']").each(function(){
		
			if($(this).attr('checked')){

				value = $(this).val();

			}
		})
		var html="";
		if(isAccessType($(this).val(),value)){
			html=$(this).val();
     	html = html.split('\\');
      html = html[html.length-1];
      $(".show-upload-file-name").removeClass('orange').html(html);
			flag=true;
		}else{
			$(".show-upload-file-name").addClass('orange').html("文件类型错误");
			flag=false;
		}
	});

	$('.material-add-commit').bind('click',function(){
		//判断用户是否上传了文件
		var value = $('#filename').val();
		if(value == "" || flag == false){
			$('.show-upload-file-name').addClass('orange').html("请选择文件");
			return false;
		}
		$(this).parent().remove();
		$(".loading-percent").show();
		changePercent();
		var lid = $(".lesson-id").val();
		var option ={
			url: '/material/add/'+lid,
			type: 'post',
			dataType: 'json',
			success: function(data){
				clearInterval(percent);
				$(".loading-percent a").removeClass().addClass("loading-percent-100");
				window.location.href='/material/result/'+lid+'/'+data.status;
				
			},
			error: function(data){
				alert(data);
			}
		}
		$('#addMaterial').ajaxForm(option);
		$('#addMaterial').submit();
	})
})

function isAccessType(objFile,value) {
  var objtype=objFile.substring(objFile.lastIndexOf(".")).toLowerCase();
  if(value == 1){
  	var fileType=new Array(".pdf",".xls",".doc",".docx",".ppt",".pptx",".xlsx");
  }else{
  	var fileType=new Array(".pdf",".xls",".doc",".docx",".ppt",".pptx",".xlsx");
  }
  
  for(var i=0; i<fileType.length; i++){
    if(objtype==fileType[i])
    {
     return true;
     break;
    }
  }
  return false;
}