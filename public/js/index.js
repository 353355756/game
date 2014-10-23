$(document).ready(function(){
	$('.carousel').carousel();
  getIndexCourses();
  getIndexBindles();
  getPublicCourses()



  function getPublicCourses(){
    $.ajax({
      url: '/getPublicCourses',
      data:'_csrf='+$('#hiden-value').val(),
      async: true,
      type: 'post',
      dataType:'json',
      success :function(data){
        $('#hiden-value').val(data._csrf);
        if(data.status){
          alert(data.msg)
        }else{
          var courses = data.courses;
          if(courses.length){
            var html = '';
            for(var o in courses){
              html += '<li>';
              html += '<a href="/course/'+ courses[o].id +'">';
              if(courses[o].img == ""){
                  html += '<div><img src="/img/DefaultImg.png"></div>';
              }else{
                  html += '<div><img class="course-img-302" src="'+courses[o].img+'"></div>';
              }
              
              html += '<div class="show-text">';
              html += '<p class="price">￥'+ courses[o].price +'</p>';
              html += '<h2>'+ courses[o].name+'</h2>';
              html += '<div class="teacher-info">';
              html += '<img src="/avatar/'+ courses[o].avatar +'" class="teacher-img"/>'
              html += '<span class="teacher-name">'+courses[o].teacherName+'</span>'
              html += '</div>';
              html += '<p class="time">';
              html += '<span class="time-span">'+ courses[o].beginTime+'</span>';
              if(courses[o].num == 0){
                html += '<span  class="number-span">已满员</span>';
              }else{
                html += '<span class="number-span">还差<em>'+ courses[o].num+'</em>人满员</span>';
              }
              html += '</p>';
              html += '</div>';
              html += '</a>';
              html += '</li>'
            }
            $('.public-courses-list-ul').html(html);
            $('.public-courses-list').qkSlider();
            $("p.time .time-span").each(function(){
              countDown($(this).html(),$(this)[0]);
            })
            $(".public-courses-list li").mouseover(function(){
              $(this).children('a').children('.show-text').show();
            });
            $(".public-courses-list li").mouseout(function(){
               $(this).children('a').children('.show-text').hide();
            })
          }else{
            $(".public-courses").hide();
          }
        }
      }
    })
  }
  function getIndexBindles(){
    $.ajax({
      url: '/getIndexBundles',
      data:'_csrf='+$('#hiden-value').val(),
      async: true,
      type: 'post',
      dataType:'json',
      success :function(data){
        $('#hiden-value').val(data._csrf);
        if(data.status){
          alert(data.msg);
        }else{
          var bundles = data.bundles;
          if(bundles.length){
            var num = 1;
            var html = "";
            for(var o in bundles){
              if(num % 2 == 1){
                html += "<li class='span6 m-right20'>";
              }else{
                html += "<li class='span6'>";
              }
              html += "<a href='/bundle/"+ bundles[o]._id +"'>";
              html += "<img src='"+ bundles[o].image +"'/>";
              html += "</a>";
              html += "</li>";
              num++;
            }
            $(".bind-courses ul").html(html);
          }else{
            $(".bind-courses").hide();
          }

        }
      }
    });
  }
  function getIndexCourses(){
    $.ajax({
      url: '/getIndexCourses',
      data:'_csrf='+$('#hiden-value').val(),
      async: true,
      type: 'post',
      dataType:'json',
      success :function(data){
        $('#hiden-value').val(data._csrf);
        if(data.status){
          alert(data.msg)
        }else{
          var courses = data.courses;
          if(courses.length){
            var html = '';
            for(var o in courses){
              html += '<li>';
              html += '<a href="/course/'+ courses[o].id +'">';
              if(courses[o].img == ""){
                  html += '<div><img src="/img/DefaultImg.png"></div>';
              }else{
                  html += '<div><img class="course-img-302" src="'+courses[o].img+'"></div>';
              }
              
              html += '<div class="show-text">';
              if(courses[o].hasPublic){
                html += '<span class="hasPublic-icon"></span>'
              }
              html += '<p class="price">￥'+ courses[o].price +'</p>';
              html += '<h2>'+ courses[o].name+'</h2>';
              html += '<div class="teacher-info">';
              html += '<img src="/avatar/'+ courses[o].avatar +'" class="teacher-img"/>'
              html += '<span class="teacher-name">'+courses[o].teacherName+'</span>'
              html += '</div>';
              html += '<p class="time">';
              html += '<span class="time-span">'+ courses[o].closeTime+'</span>';
              if(courses[o].num == 0){
                html += '<span  class="number-span">已满员</span>';
              }else{
                html += '<span class="number-span">还差<em>'+ courses[o].num+'</em>人满员</span>';
              }
              
              html += '</p>';
              html += '</div>';
              html += '</a>';
              html += '</li>'
              
            }
            $('.ul-list').html(html);
            $(".ul-list .time-span").each(function(){
              countDown($(this).html(),$(this)[0]);
            })
            $(".ul-list li").mouseover(function(){
              $(this).children('a').children('.show-text').show();
            });
            $(".ul-list li").mouseout(function(){
               $(this).children('a').children('.show-text').hide();
            })
          }else{
            $(".open-courses").hide();
          }
        }
      }
    })
  }
});