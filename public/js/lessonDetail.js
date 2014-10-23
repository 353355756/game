$(document).ready(function(){
  var num = $('.resourceNum').val();
  var lid = $('.lesson-id').val();
  //绑定的内容
  var arr = $('.bindImg').val();
  arr = arr.split(",");
  $('.pic').each(function(){
    var value = $(this).children('span').html();
    if(isInArr(arr,value)){
      $(this).show();
    }
  })
  function isInArr(arr,value){
    for(var o in arr){
      if(value == arr[o]){
        return true;
      }
    }
    return false;
  }
  $('#check-list .pic').each(function(){
    var value = $(this).children('span').html()
    if(isInArr(arr,value)){
      $('#checked').append($(this).clone());
      $(this).addClass('selected');
      $("#count").html($("#checked div").length + "个");
    }
  })

  $('.delete-icon').each(function(){
    $(this).bind('click',function(){
      var id = $(this).attr('rel');
      var that = $(this);
      $.ajax({
        url: '/material/deletesummary/'+id+"/"+lid,
        data: '_csrf='+$('#hiden-value').val(),
        async: true,
        type: 'post',
        dataType:"json",
        success:function(data){
          $('#hiden-value').val(data._csrf);
          if(!data.status){
            that.parent().parent().remove();
          }else{
            alert(data.msg);
            window.location.reload();
          }
        }
      });
    })
  })

  $('.beginTime').each(function(){
    var time = $(this).attr('rel');
    $(this).html(changeTimeFormat(time,3));
  })

	$(".qk-page").pagination(num,{items_per_page:6,callback:back});
	function back(page,per_item){
    $.ajax({
      url: "/lesson/getmaterial/"+lid,
      type: "post",
      data: 'skipPage='+page+'&perPage='+per_item+'&total='+num+'&_csrf='+$('#hiden-value').val(),
      dateType: "json",
      success: function(data) {
        $('#hiden-value').val(data._csrf);
        if(data.status){
          alert(data.msg);
        }else{
          var html = "";
          var resources = data.resources;
          for(var o in resources){
            html += "<tr>";
            html += "<td>"+ resources[o].name +"</td>";
            if(resources[o].classify == 1){
              html +="<td>教案</td>";
            }else if(resources[o].classify == 2){
              html +="<td>习题</td>";
            }else if(resources[o].classify == 4){
              html +="<td>PK题</td>";
            }
            if(resources[o].isBind){
              html +="<td><span class='bind-btn bind' rel='"+ resources[o].id +"'>已绑定</span></td>"
            }else{
              html +="<td><span class='bind-btn unbind' rel='"+ resources[o].id +"'>未绑定</span></td>"
            }
            html += "</tr>"
          }
          $(".bind-resource-table tbody").html(html);
          $(".bind-btn").bind('click',function(){
            operationBind($(this));
          })
        }
      }
    });
	}
  function operationBind(that){
    if(that.hasClass('bind')){
      var status = $(".status").html();
      if(status == "正在上课中"){
        alert("正在上课无法接绑资料");
        return false;
      }
      $.ajax({
        url: "/lesson/unbind",
        type: "post",
        data: 'lid='+lid+'&rid='+that.attr("rel")+'&_csrf='+$('#hiden-value').val(),
        dateType: "json",
        success: function(data){
          $('#hiden-value').val(data._csrf);
          if(data.status){
            alert(data.msg);
          }else{
            $(that).removeClass('bind').addClass('unbind').html("未绑定");
          }
        }
      })
    }else{
      $.ajax({
        url: "/lesson/bind",
        type: "post",
        data: 'lid='+lid+'&rid='+that.attr("rel")+'&_csrf='+$('#hiden-value').val(),
        dateType: "json",
        success: function(data){
          $('#hiden-value').val(data._csrf);
          if(data.status){
            alert(data.msg);
          }else{
            $(that).removeClass('unbind').addClass('bind').html("已绑定");
          }
        }
      })
    }
  }
  //进行小课评价的操作
  $('.commit-add-btn').click(function(){
    var lid = $('.lesson-id').val();
    var comment = $('.comment-content').val();
    $.ajax({
      url:'/lesson/comment',
      data:'lid='+lid+"&comment= "+comment+"&_csrf="+$('#hiden-value').val(),
      dateType:'json',
      type:'post',
      success:function(data){
        if(data.status){
          alert('提交失败')
        }else{
          alert('提交成功');
        }
        window.location.reload();
      }
    })
  })
  $('.commit-modify-btn').click(function(){
    $('.comment-modify').hide();
    $('.comment-content').html($('.comment-modify p').html());
    $('.comment-add').show();
  })

	//绑定资料的弹出操作
	$(".bind-new-material").bind('click',function(){
      $("#material-bind-pop").qkDialog({
        width:720,
        height:450,
        closeButton:"bind-close-btn",
        cancelButton:"bottom-close-btn",
        cancelCallBack:showResult
      });
    })
	$(".bind-new-img").click(function(){
    $("#graphoc-bind").qkDialog({
      width:640,
      height:500,
      closeButton:'graphic-close-btn',
      cancelButton:'bind-graphic-submit',
      callback:unchangeImg
    });
  })

  function unchangeImg(){
    $(".bind-img-list #checked").html("");
    $('#check-list .pic').each(function(){
      $(this).removeClass('selected');
      var value = $(this).children('span').html()
      if(isInArr(arr,value)){
        $('#checked').append($(this).clone());
        $(this).addClass('selected');
        $("#count").html($("#checked div").length + "个");
      }
    })
  }
  //点击选择科目
  $("#chose span").each(function(){
    $(this).bind('click',function(){
      $(this).addClass('cur').siblings().removeClass('cur');
      var id = $(this).attr("id");
      $("#check-list").children().each(function(){
        if($(this).hasClass(id)){
          $(this).css("display","block");
        }else{
          $(this).hide();
        }
      })
    })
  });
  $("#default").trigger('click');
  //点击显示全部
  $("#right").click(function showAll() {
    $("#check-list>div").css("display","block");
  });
  //点击切换状态
  $("#check-list .pic").click(function() {
    var that = $(this);
    if (that.hasClass("selected")) {
      that.removeClass("selected");
      var content = that.html();
      $('#checked div').each(function(){
        if($(this).html() == content){
          $(this).remove();
        }
      })
    } else {
      $("#checked").append(that.clone());
      that.addClass("selected");
    }
    $("#count").html($("#checked div").length + "个");
  });
  //点击移除
  $("#checked .pic").bind('click',function() {
    var that = $(this);
    var content = that.html();
    $('#check-list .pic').each(function(){
      if($(this).html() == content){
        $(this).removeClass('selected');
        that.remove();
      }
    })
    that.remove();
    $("#count").html($("#checked div").length + "个");
  });
	//cancel按钮的显示
	function showResult(){
      $("#pop-correct").qkDialog({
        width:360,
        height:180,
        duringTime:2,
        closeButton:"corrent-close-btn",
        callback:reloadPage
      })
    }
  function reloadPage(){
    window.location.reload();
  }


  $(".bind-graphic-submit").bind('click',function() {
    //要传的数据
    var arr = [];
    var lid = $('.lesson-id').val();
    $("#checked div").each(function(){
      var value = $(this).children("span").text();
      arr.push($.trim(value));
    })
    if(arr.length == 0){
      alert("至少绑定一个图形");
      return false;
    }
    $('#graphic-close-btn').trigger('click');
    var data ={
              lid: lid,
              imgs: arr,
              _csrf: $('#hiden-value').val()
              }
    $.ajax({
      url: "/lesson/setbindimg",
      type: "post",
      data: data,
      dateType: "json",
      success: function(data) {
        if(data.status != 0){
          $("#pop-error").qkDialog({
            width:360,
            height:180,
            closeButton:"error-close-btn",
            cancelButton:"rebind-btn",
            cancelCallBack:rebind,

          })
        }else{
          $("#pop-correct").qkDialog({
            width:360,
            height:180,
            callback:reloadPage,
            duringTime:2,
            closeButton:"corrent-close-btn"
          })
        }  
      }
    });
  });

  function rebind(){
    $("#graphoc-bind").qkDialog({
      width:640,
      height:420,
      closeButton:'graphic-close-btn'
    });
  }

})