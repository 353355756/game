$(document).ready(function(){
  var total;
  var type;
  var select = $("#select-type").val();
	$('.show-step').each(function(){
      $(this).bind('click',function(){
      	//切换样式
        if($(this).hasClass('normal-step')){
          $(this).addClass('current').siblings().removeClass('current').removeClass('currentWaring');
        }else{
          $(this).addClass('currentWaring').siblings().removeClass('current').removeClass('currentWaring');
        }
        total = $(this).children('div').html();
        type = $(this).attr('rel');
        showCourseTable(total,type);
      })
    });

   if(select == 1){
    $(".show-step-during").trigger('click');
  }else if(select == 2){
    $(".show-step-before-onsale").trigger('click');
  }else if(select == 3){
    $(".show-step-fail").trigger('click');
  }else if (select == 4){
    $(".show-step-teached").trigger('click');
  }else if(select == 5){
    $(".show-step-onsale").trigger('click');
  }else if(select == 6){
    $(".show-step-is-open").trigger('click');
  }else if(select == 7){
    $(".show-step-waiting-teach").trigger('click');
  }else{
    $('.show-step-teaching').trigger('click');
  }
 


  function showCourseTable(total,type){
    //显示课程表
    $(".qk-page").pagination(total,{items_per_page:10,callback:back});
    function back(page,per_item){
      $.ajax({
        url: '/getmanagercourse',
        data: 'skipPage='+page+'&perPage='+per_item+'&total='+total+'&_csrf='+$('#hiden-value').val()+"&type="+type,
        async: true,
        type: 'post',
        dataType:"json",
        success:function(data){
          $("#hiden-value").val(data._csrf);
          //$("#select-type").val(data.select);
          if(data.status){
            alert(data.err);
          }else{
            if(data.courses.length){
              createTable(data.courses,type);
            }else{
               $(".show-status-table-div").html("<p style='text-align:center'>没有找到对应的课程</p> ");
            }
          }
        }
      });
    }
  }
});
function createTable(data,type){
  var html = "";
  //审核中
  if(type == 1){//审核中
    html += "<h2>";
    html += "</h2>";
    html += "<table class='normal-table'>";
    html += "<thead>";
    html += "<th style='width:80px;'>编号</th>";
    html += "<th style='width:500px;'>课程名称</th>";
    html += "<th style='width:120px;'>类型</th>";
    html += "</thead>";
    html += "<tbody>";
    for(var o in data){
      html += "<tr>";
      html += "<td>"+data[o].id +"</td>";
      html += "<td><a href='/course/"+ data[o].id +"'>"+data[o].name+"</a></td>";
      if(data[o].isOpen){
        html += "<td>公开课程</td>";
      }else{
        html += "<td>精品课程</td>";
      }
      html += "</tr>";
    }
    html += "</tbody>";
    html += "</table>";
    $(".show-status-table-div").html(html);
    $(".show-status-table-div h2").html("<span class='audit-icon'></span>审核中");
  }else if(type == 3){//审核失败
    html += "<h2>"; 
    html += "</h2>";
    html += "<table class='normal-table'>";
    html += "<thead>";
    html += "<th style='width:80px;'>编号</th>";
    html += "<th style='width:400px;'>课程名称</th>";
    html += "<th style='width:115px;'>类型</th>";
    html += "<th style='width:100px;text-align:center'>重新创建</th>"
    html += "</thead>";
    html += "<tbody>";
    for(var o in data){
      html += "<tr>";
      html += "<td>"+data[o].id +"</td>";
      html += "<td><a href='/course/"+ data[o].id +"'>"+data[o].name+"</a></td>";
      if(data[o].isOpen){
        html += "<td>公开课程</td>";
      }else{
        html += "<td>精品课程</td>";
      }
      html += "<td style='text-align:center'><a href='/createcourse' class='small-green-btn' rel='"+data[o].id +"'>是</a><td>"
      html += "</tr>";
    }
    html += "</tbody>";
    html += "</table>";

    $(".show-status-table-div").html(html);
    $(".show-status-table-div h2").html("<span class='fail-icon'></span>审核失败");
  }else if(type == 2){
    html += "<h2>";
    html += "<span class='waitsale-icon'></span>";
    html += "</h2>";
    html += "<table class='normal-table'>";
    html += "<thead>";
    html += "<th style='width:80px;'>编号</th>";
    html += "<th style='width:290px;'>课程名称</th>";
    html += "<th style='width:80px;'>类型</th>";
    html += "<th style='width:100px'>招生时间</th>";
   // html += "<th style='width:85px;text-align:center'>管理</th>";
    html += "</thead>";
    html += "<tbody>";
    for(var o in data){
      html += "<tr>";
      html += "<td>"+data[o].id +"</td>";
      html += "<td><a href='/course/"+ data[o].id +"'>"+data[o].name+"</a></td>";
      if(data[o].isOpen){
        html += "<td>公开课程</td>";
      }else{
        html += "<td>精品课程</td>";
      }
      html += "<td>"+ changeTimeFormat(data[o].saleTime,2) +"</td>"
      //html += "<td style='text-align:center'><a href='/addpubliccourse/"+data[o].id+"' class='reapply-course small-green-btn'>建公开课</a></td>";
      html += "</tr>";
    }
    html += "</tbody>";
    html += "</table>";
    $(".show-status-table-div").html(html);
    $(".show-status-table-div h2").html("<span class='waitsale-icon'></span> 等待招生");
  }else if(type == 5){//招生中
    html += "<h2>";
    html += "<span class='onsale-icon'></span>";
    html += "</h2>";
    html += "<table class='normal-table'>";
    html += "<thead>";
    html += "<th style='width:80px;'>编号</th>";
    html += "<th style='width:290px;'>课程名称</th>";
    html += "<th style='width:80px;'>类型</th>";
    html += "<th style='width:160px;text-align:center'>招生</th>"
   // html += "<th style='width:85px;text-align:center'>管理</th>";
    html += "</thead>";
    html += "<tbody>";
    for(var o in data){
      html += "<tr>";
      html += "<td>"+data[o].id +"</td>";
      html += "<td><a href='/course/"+ data[o].id +"'>"+data[o].name+"</a></td>";
      if(data[o].isOpen){
        html += "<td>公开课程</td>";
      }else{
        html += "<td>精品课程</td>";
      }
      html += "<td style='text-align:center'>"+ data[o].students +"</td>";
      //html += "<td style='text-align:center'><a href='/addpubliccourse/"+data[o].id+"' class='reapply-course small-green-btn'>建公开课</a></td>";
      //html += "<td style='text-align:center'><a href='/getstudents/"+data[o].id+"' class='reapply-course small-green-btn'>查看报名列表</a></td>";
      html += "</tr>";
    }
    html += "</tbody>";
    html += "</table>";
    $(".show-status-table-div").html(html);
    $(".show-status-table-div h2").html("<span class='onsale-icon'></span> 招生中");
  }else if(type == 6){//是否开课
    html += "<h2>";
    html += "<span class='isopen-icon'></span>";
    html += "</h2>";
    html += "<table class='normal-table'>";
    html += "<thead>";
    html += "<th style='width:80px;'>编号</th>";
    html += "<th style='width:220px;'>课程名称</th>";
    html += "<th style='width:150px;text-align:center'>招生人数</th>"
    html += "<th style='width:150px;text-align:center'>最小报名数</th>"
    html += "<th style='width:100px;text-align:center'>是否开课</th>";
    html += "</thead>";
    html += "<tbody>";
    for(var o in data){
      html += "<tr>";
      html += "<td>"+data[o].id +"</td>";
      html += "<td><a href='/course/"+ data[o].id +"'>"+data[o].name+"</a></td>";
      html += "<td style='text-align:center'>"+ data[o].students +"</td>";
      html += "<td style='text-align:center'>"+ data[o].minStudentsNum +"</td>";
      html += "<td class='clearfix isOpen-btn'><a  class='course-yes' rel='"+ data[o].id +"'>是</a><a  class='course-no' rel='"+ data[o].id +"'>否</a></td>"
      html += "</tr>";
    }
    html += "</tbody>";
    html += "</table>";
    $(".show-status-table-div").html(html);
    $(".show-status-table-div h2").html("<span class='isopen-icon'></span> 是否开课");
    $(".isOpen-btn a").bind("click",function(){
      var isYes = $(this).hasClass("course-yes");
      var cid = $(this).attr('rel');
      var that = $(this);
      $.ajax({
        url:"/isopencourse",
        data:"cid="+cid+"&_csrf="+$('#hiden-value').val()+"&isYes="+isYes,
        dataType:"json",
        type:"post",
        success:function(data){
          alert(data.msg);
          if(!data.status){
            that.parent().parent().remove();
          }
        }
      })
    })
  }else if(type == 7){
    html += "<h2>";
    html += "<div class='waitcourse-icon'></div>";
    html += "<span></span>";
    html += "</h2>";
    html += "<table class='normal-table'>";
    html += "<thead>";
    html += "<th style='width:80px;'>编号</th>";
    html += "<th style='width:340px;'>课程名称</th>";
    html += "<th style='width:100px;text-align:center'>类型</th>";
    html += "<th style='width:80px;text-align:center'>学生</th>"
    html += "<th style='width:100px;text-align:center'>上课时间</th>";
    html += "</thead>";
    html += "<tbody>";
    for(var o in data){
      html += "<tr>";
      html += "<td>"+data[o].id +"</td>";
      html += "<td><a href='/course/"+ data[o].id +"'>"+data[o].name+"</a></td>";
      if(data[o].isOpen){
        html += "<td>公开课程</td>";
      }else{
        html += "<td>精品课程</td>";
      }
      html += "<td class='text-center'>"+ data[o].students+"</td>";
      html += "<td class='text-center'>"+ changeTimeFormat(data[o].beginDate,2) +"</td>";
      html += "</tr>";
    }
    html += "</tbody>";
    html += "</table>";
    $(".show-status-table-div").html(html);
    $(".show-status-table-div h2").html("<span class='waitcourse-icon'></span>等待上课");
  }else if(type == 8){
    html += "<h2>";
    html += "<div class='onclass-icon'></div>";
    html += "<span></span>";
    html += "</h2>";
    html += "<table class='normal-table'>";
    html += "<thead>";
    html += "<tr>";
    html += "<th style='width:80px;'>编号</th>";
    html += "<th style='width:400px;'>课程名称</th>";
    html += "<th style='width:120px;'>类型</th>";
    html += "<th style='width:100px;text-align:center'>学生</th>";
    html += "</tr>";
    html += "</thead>";
    html += "<tbody>";
    for(var o in data){
      html += "<tr>";
      html += "<td>"+data[o].id +"</td>";
      html += "<td><a href='/course/"+ data[o].id +"'>"+data[o].name+"</a></td>";
      if(data[o].isOpen){
        html += "<td>公开课程</td>";
      }else{
        html += "<td>精品课程</td>";
      }
      html += "<td class='text-center'>"+ data[o].students+"</td>";
      html += "</tr>";
    }
    html += "</tbody>";
    html += "</table>";
    $(".show-status-table-div").html(html);
    $(".show-status-table-div h2").html("<span class='onclass-icon'></span>上课中");
  }else if(type == 4){//已结课
    html += "<h2>";
    html += "<div class='step-teaching'></div>";
    html += "<span></span>";
    html += "</h2>";
    html += "<table class='normal-table'>";
    html += "<thead>";
    html += "<th style='width:80px;'>编号</th>";
    html += "<th style='width:500px;'>课程名称</th>";
    html += "<th style='width:120px;'>类型</th>";
    html += "</thead>";
    html += "<tbody>";
    for(var o in data){
      html += "<tr>";
      html += "<td>"+data[o].id +"</td>";
      html += "<td><a href='/course/"+ data[o].id +"'>"+data[o].name+"</a></td>";
      if(data[o].isOpen){
        html += "<td>公开课程</td>";
      }else{
        html += "<td>精品课程</td>";
      }
      html += "</tr>";
    }
    html += "</tbody>";
    html += "</table>";
    $(".show-status-table-div").html(html);
    $(".show-status-table-div h2").html("<span class='offcourse-icon'></span>已结课");
  }
}