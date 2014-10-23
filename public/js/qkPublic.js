$(document).ready(function(){
  $(".user-show img").bind('mouseover',function(){
    $(".pop-info").show();
  });
  $(".pop-info").bind('mouseout',function(){
    $(this).hide();
  })
  $(".pop-info").bind('mouseover',function(){
    $(this).show();
  })

  $("pop-info ul li").each(function(){
    $(this).bind('mouseover',function(){
      $(this).addClass('current');
      $(this).siblings().removeClass('current');
    })
  })
})
if($('.container').find('.cart-num')[0]){
  getCartNum();
}

function getCartNum(){
  $.ajax({
    url:'/getcartnum',
    data:'_csrf='+$('#hiden-value').val(),
    async: true,
    type: 'post',
    dataType:'json',
    success:function(data){
     
      $('#hiden-value').val(data._csrf);
      if(data.count){
        if(data.count>9){
          $(".cart-num").css("display","inline-block").html("9");
        }else{
          $(".cart-num").css("display","inline-block").html(data.count);
        }
        
      }else{
        $(".cart-num").hide();
      }
        
    }
  });
}
//数字时间戳转换成日期时间函数，time为传入的数字时间戳，如果数字时间戳先前作了/1000运算，请先*1000再传入
function changeTimeFormat(time,type) {
    var date = new Date(parseInt(time));
    var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
    var currentDate = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    var hh = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    var mm = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    var ss =date.getSeconds()<10?"0" + date.getSeconds() : date.getSeconds();
    if(type ==1){
      return date.getFullYear() + "年" + month + "月" + currentDate+"日 ";
    }else if(type ==2){
       return date.getFullYear() + "-" + month + "-" + currentDate+"";
    }else if(type == 3){
      return date.getFullYear() + "年" + month + "月" + currentDate+"日 "+hh + ":" + mm;
    }else{
      return date.getFullYear() + "年" + month + "月" + currentDate+"日 "+hh + ":" + mm +":" +ss;
    }
    //返回格式：yyyy-MM-dd hh:mm:ss
}
function countDown(date,timer){
  var time_now_server,time_now_client,time_end,time_server_client,timerID;
  var date = parseInt(date);
  time_end=new Date(date);//结束的时间
  time_end=time_end.getTime();
  time_now_client=new Date();
  time_now_client=time_now_client.getTime();
  timerID=setTimeout(show_time,1000);
  function show_time(){
   timer.innerHTML =time_server_client;
   var time_now,time_distance,str_time;
   var int_day,int_hour,int_minute,int_second;
   var time_now=new Date();
   time_now=time_now.getTime();
   time_distance=time_end-time_now;

   if(time_distance>0){
    int_day=Math.floor(time_distance/86400000)
    time_distance-=int_day*86400000;
    int_hour=Math.floor(time_distance/3600000)
    time_distance-=int_hour*3600000;
    int_minute=Math.floor(time_distance/60000)
    time_distance-=int_minute*60000;
    int_second=Math.floor(time_distance/1000)
    if(int_hour<10)
     int_hour="0"+int_hour;
    if(int_minute<10)
     int_minute="0"+int_minute;
    if(int_second<10)
     int_second="0"+int_second;
    str_time="剩余时间:<em>"+int_day+"天"+int_hour+":"+int_minute+":"+int_second+"</em>";
    timer.innerHTML=str_time;
    setTimeout(show_time,1000);
   }else{
    timer.innerHTML ="剩余时间:课程报名已结束";
    clearTimeout(timerID)
   }
  } 
}
function changeDateFormat(time,type) {
    var date = new Date(time);
    var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
    var currentDate = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    var hh = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    var mm = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    var ss =date.getSeconds()<10?"0" + date.getSeconds() : date.getSeconds();
    if(type ==1){
      return date.getFullYear() + "年" + month + "月" + currentDate+"日 ";
    }else if(type ==2){
       return date.getFullYear() + "-" + month + "-" + currentDate+"";
    }else if(type == 3){
      return date.getFullYear() + "年" + month + "月" + currentDate+"日 "+hh + ":" + mm;
    }else{
      return date.getFullYear() + "年" + month + "月" + currentDate+"日 "+hh + ":" + mm +":" +ss;
    }
    //返回格式：yyyy-MM-dd hh:mm:ss
}