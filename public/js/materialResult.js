$(document).ready(function(){
	$('.beginTime').each(function(){
    var time = $(this).attr('rel');
    $(this).html(changeTimeFormat(time,3));
  })
})