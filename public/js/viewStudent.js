$(document).ready(function(){
  $('.user-update-btn').bind('click',function(){
    if($('#user-email').val()==""){
      alert("未填写邮箱");
    }
    if($('#user-realname').val()==""){
      alert("未填写用户名");
    }
    var user= {};
    user.realname = $('#user-realname').val();
    user.mobile = $("#user-mobile").val();
    user.theSchool = $("#user-theSchool").val();
    user.grade = $("#user-grade").val();
    var obj = {
      user:user,
      _csrf: $("#hiden-value").val()
    }
    $.ajax({
      url: '/course/:cid/error/:id/modify',
      data:obj,
      async: true,
      type: 'post',
      dataType:'json',
      success:function(data){
        $("#hiden-value").val(data._csrf);
        if(!data.status){
          alert("修改学生完成");
          window.location.reload();
        }else{
          alert(data.msg);
        }
      }
    })
  })
})