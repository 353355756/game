$(document).ready(function(){
  var email = $('.emailAddress').attr('rel');
  var hash={
      'qq.com'      : 'http://mail.qq.com',
      'gmail.com'   : 'http://mail.google.com',
      'sina.com'    : 'http://mail.sina.com.cn',
      '163.com'     : 'http://mail.163.com',
      '126.com'     : 'http://mail.126.com',
      'yeah.net'    : 'http://www.yeah.net/',
      'sohu.com'    : 'http://mail.sohu.com/',
      'tom.com'     : 'http://mail.tom.com/',
      'sogou.com'   : 'http://mail.sogou.com/',
      '139.com'     : 'http://mail.10086.cn/',
      'hotmail.com' : 'http://www.hotmail.com',
      'live.com'    : 'http://login.live.com/',
      'live.cn'     : 'http://login.live.cn/',
      'live.com.cn' : 'http://login.live.com.cn',
      '189.com'     : 'http://webmail16.189.cn/webmail/',
      'yahoo.com.cn': 'http://mail.cn.yahoo.com/',
      'yahoo.cn'    : 'http://mail.cn.yahoo.com/',
      'eyou.com'    : 'http://www.eyou.com/',
      '21cn.com'    : 'http://mail.21cn.com/',
      '188.com'     : 'http://www.188.com/',
      'foxmail.com' : 'http://www.foxmail.com',
      'eyou.com'    :'http://www.eyou.com'
  };
  $(".emailAddress").each(function() {
    var url = email.split('@')[1];
    for (var j in hash){
      $(this).attr("href", hash[url]);
    }
  });
  $('.reactive').bind('click',function(e){
    $(this).unbind();
    var that = $(this);
    $(this).val("发送中...");
    obj ={ _csrf:$('#hiden-value').val() };
    $.ajax({
      url: '/sendActiveEmail',
      data: obj,
      async: true,
      type: 'post',
      dataType:"json",
      success:function(data){
        if(data.status){
          alert("发送失败");
          window.location.reload();
        }else{
          $(that).html("已发送").removeClass('green').addClass('orange').unbind();
        }

      }
    })
  })
})