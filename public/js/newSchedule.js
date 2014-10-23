(function($){
	/*
		思路大概如下：
		1.生成框架
		2.确定年月日的下娘
		3.根据选择的年月日生成填充代码
		4.根据选择的年月日更改已有的代码

	*/
	$.fn.schedule = function(options){

		var opts = $.extend({

		},options||{});

		return this.each(function(){
			var html = '';
			//判断哪个被选中了
			html += '<div class="schedule-div clearfix">';
			html += '<div class="schedule-div-left clearfix">';
			html += '<div class="schedule-div-head clearfix">';
			html += '<h2>课程表</h2>';
			html += '<div class="schedule-div-left-btn"><a class="show-list">本周</a><a class="show-prev">&lt</a><a class="show-next">&gt</a></div>';
			html += '<div class="schedule-div-right-btn"><a rel="0">日</a><a rel="1">周</a><a rel="2">月</a></div>';
			html += '</div>'
			html += '<div class="schedule-table-div">';
			html += '<table class="schedule-table">';
			html += '<thead>';
			html += '<tr>';
			html += '<th class="schedule-table-time"></th>';
			html += '</tr>';
			html += '</thead>';
			html += '<tbody>';
			html += '<tr>';
			html += '<td class="schedule-table-time-td">';

			html += '</td>';
			html += '<td class="schedule-table-day">';
	
			html += '<td class="schedule-table-day">';

			html += '</td>';
			html += '<td class="schedule-table-day">';

			html += '</td>';
			html += '<td class="schedule-table-day today">';

			html += '</td>';
			html += '<td class="schedule-table-day">';

			html += '</td>';
			html += '<td class="schedule-table-day">';

			html += '</td>';
			html += '<td class="schedule-table-day">';

			html += '</td>';
			html += '</tr>';
			html += '</tbody>';
			html += '</table>';
			html += '<div class="today-rect"></div>'
			html += '<div class="current-time"></div>';
			html += '</div>';
			html += '</div>';
			html += '<div class="schedule-div-right">';
			html += '<div class="show_month"></div>';
			html += '<ul class="course-list">';
			html += '</ul>';
			html += '</div>';
			html += '</div>';
			$(this).html(html);

			var select_time = opts.select_time == undefined? 1 : opts.select_time;//默认为周

			var now = new Date();
			var yeah = now.getFullYear();
			var month = now.getMonth();
			var day = now.getDate();
			var selectCourse;//判断是否已选择了某个课程
			
			$(".schedule-div-right-btn a").each(function(){

			
				if($(this).attr('rel') == select_time){
					$(this).addClass('current');
					select_schedule(select_time);
					showSchedule(select_time);
				}
				$(this).bind('click', function(){
					window.location.href='/schedule/'+opts.type+"?select="+ $(this).attr('rel');
				})
			})
		

			function select_schedule(select_time){

				$('.show-next').unbind('click');
				$('.show-prev').unbind('click');
				$(".show-next").bind('click',function(){
					//根据不同的日期进行更改
					if(select_time == 0){
						day = day + 1;
					}else if(select_time == 1){
						day = day + 7;
					}else{
						month = month + 1;
					}
					showSchedule(select_time);
				});
				$(".show-prev").bind('click',function(){
					if(select_time == 0){
						day = day - 1;
					}else if(select_time == 1){
						day = day - 7;
					}else{
						month = month - 1;
					}
					showSchedule(select_time);
				})
				$(".show-list").trigger('click');
			}
			//本周本月
			$(".show-list").bind('click',function(){
				day = now.getDate();
				month = now.getMonth();
				yeah = now.getFullYear();
				showSchedule(select_time);
			})
			
			function showSchedule(select_time,cid){

				$(".show_month").html("");
				var select_day;
				if(select_time == 0){
					select_day = day;
				}else if( select_time == 1){
					select_day = day+1-(now.getDay() || 7 );//因为周是从该周的周一开始的，所以获取的时间应为该周的周一
					
				}else{
					select_day = 0;
					
				}

				$.post("/myschedule",{
					cate:opts.type,//管理员学生与老师
					_csrf:opts._csrf,
					select_time: select_time,
					y:yeah,
					m:month,
					d:select_day
				},function(mysche){
					if(mysche.status){
						alert("获取课程表的数据错误");
					}

					var schedule = mysche.courses || [];
					//先进行所有课程的列表
					if(schedule == ""){
						$('.course-list').html('<li class="current"><a>无课</a></li>');
					}else{
						var ul 	= '';
						if(opts.type != 2){
							ul += '<li class="current"><a>显示全部课程</a></li>';
						}
						var arr =[];
						for(var o in schedule){
							var flag = true;
							for(var i=0;i<arr.length;i++){
								if(schedule[o].cid == arr[i]){
									flag = false;
								}
							}
							if(flag){
								arr.push(schedule[o].cid);
								if(schedule[o].name.length>10){
									ul +='<li rel="'+ schedule[o].cid +'"><a>'+ schedule[o].name.substring(0,9) +'...</a></li>';
								}else{
									ul +='<li rel="'+ schedule[o].cid +'"><a>'+ schedule[o].name +'</a></li>';
								
								}
							}
						}
						if(opts.type == 2 && arr.length > 0){
							
							if(selectCourse == undefined){
								selectCourse = arr[0];
							}
						}
						if(opts.type !=2 && selectCourse != undefined && arr.length> 0){
							var isSelect = false;
							for(var i =0; i<arr.length; i++){
								if(selectCourse == arr[i]){
									isSelect = true;
								}
							}
							
							if(!isSelect){
							
								selectCourse = undefined;
							}
						}
						$('.course-list').html(ul);
						$('.course-list li').each(function(){
							$(this).bind('click',function(){
								$(this).addClass('current').css("color","#FFF").siblings().removeClass('current');
								var rel = $(this).attr('rel');
								selectCourse = rel;
								_showSchedule(schedule, select_time,  rel);
							});
						})
					}
					//在显示前判断是否以前有选中的课程
					if(selectCourse){
						$(".course-list li[rel="+ selectCourse +"]").addClass('current').css("color","#FFF").siblings().removeClass('current');
					}
					_showSchedule(schedule, select_time ,selectCourse);
				});
			}


			function _showSchedule(schedule,select_time, cid){
				
				if(0 == select_time ){
					_show_day_schedule(schedule, cid);
				}else if( 1 == select_time){
					_show_week_schedule(schedule, cid);
				}else{
					_show_month_schedule(schedule, cid);
				}
				
			}

			function _show_day_schedule(schedule, cid){
				$(".show-list").html("本日");
				$(".today-rect").hide();
				//找到天schedule得最早开始的时间与最晚结束的时间
				var startHour = 8;
				var endHour = 20;
				for(var o in schedule){
					var beginTime = new Date(parseInt(schedule[o].beginTime));
					var beginHour = beginTime.getHours();
					var closeTime = new Date( parseInt(schedule[o].endTime));
					var closeHour = closeTime.getHours();
					if(beginHour< startHour){
						startHour = beginHour;
					}
					if(closeHour >= endHour ){
						endHour = (closeHour + 1);
					}
				} 
				var html = "";
				var day_today = new Date(yeah, month, day);
				html +="<thead><tr><th colspan='2'>"+ day_today.getFullYear()+"年"+(day_today.getMonth()+1)+"月"+day_today.getDate()+"日</th></tr></thead>";
				//填充表格体
				html += '<tbody>';
				html += '<tr>';
				html += '<td>';
				for(var i=0; i<(endHour - startHour);i++){
					if((startHour+i)<12){
						html += '<div class="schedule-table-time">'+ (startHour+i) +'上午</div>';
					}else if((startHour+i == 12)){
						html += '<div class="schedule-table-time">'+ (startHour+i) +'中午</div>';
					}else if((startHour+i <17)){
						html += '<div class="schedule-table-time">'+ (startHour+i) +'下午</div>';
					}else{
						html += '<div class="schedule-table-time">'+ (startHour+i) +'晚上</div>';
					}
					
				}
				html += '</td>'
				html += '<td>';
				for(var i =0; i<(endHour - startHour); i++){
					
					if(i+1 == (endHour - startHour)){
						html += '<div class="schedule-day-box last"></div>';
					}else{
						html += '<div class="schedule-day-box"></div>';
					}
				}
				html += '</td>';
				html += '</tr>';
				$(".schedule-table").html(html);
				html = "";
				var now = new Date();
				for(var o in schedule){
					if(schedule[o].cid == cid || cid == undefined){
						var beginTime = schedule[o].beginTime;
						var endTime = schedule[o].endTime;
						var height = (endTime - beginTime)/1000/60;
						var beginDate = new Date(beginTime-0);
						var endDate = new Date(endTime - 0);

						var top = (beginDate.getHours() - startHour) * 60 + beginDate.getMinutes() +32;//32是head的高度

						var class_name;
						if(now < beginTime){
							class_name = "todo";
						}else if(now < endTime){
							class_name = "doing";
						}else{
							class_name = "done";
						}
						html += "<div class='select_day_show_div "+class_name+"' style='position:absolute; left:70px; top:"+top+"px; height:"+ height+"px; width:91%'>";
						html += "<a href='/lesson/"+schedule[o].lid+"?select="+select_time+"' class='day_text'>";
						html += "<span>"+ beginDate.getHours()+":"+beginDate.getMinutes()+" - "+ endDate.getHours()+":"+ endDate.getMinutes()+"</span>";
						html += "<span>"+ schedule[o].name +"</span>";
						if(opts.type == 1){
							html += "<span>"+schedule[o].resources+ "个资料</span>"
						}else if(opts.type == 0 || opts.type == 2){
							html += "<span>"+ schedule[o].tname +"</span>"
						}
						html += "</a>";
						if(opts.type == 0 || opts.type == 2){
							if(schedule[o].recorded){
								html += "<a class='recorded-icon' target='_blank' href='/playback/add/" + schedule[o].lid+"'></a>";
							}
						}
						html += "</div>";
						$(".schedule-table").append(html);
					}
				}
				var nowHour = now.getHours();
				var minute = now.getMinutes();
				if(nowHour > endHour+1 || nowHour < startHour){
					$(".current-time").hide();
				}else{
					var currentTop = nowHour - startHour;
					//30为th的高度，5为让图片居中的高度，60为每一个时间段的高度
					$(".current-time").css("top",(((30-5)+60*currentTop)+minute)+"px").show();
				}
			}


			function _show_month_schedule(schedule, cid){
				$(".show-list").html("本月");
				$(".today-rect").hide();

				// 修改成周一到周日为 0-6
				var current = new Date(yeah, month);
				var week = (current.getDay() ||7) - 1;
				$(".show_month").html(current.getFullYear()+"年"+(current.getMonth()+1)+"月");
				var html = "";
				html += '<thead>';
				html += '<tr>';
				for(var i =0; i<7; i++){
					html+='<th class="today">周'+['一','二','三','四','五','六','日'][i]+'</th>';
				}
				html += '</tr>';
				html += '</thead>';
				//填充表格体
				html += '<tbody>';
				var num = 1;
				var nextMonth = new Date(yeah, month+1);
				var total_day = (nextMonth - current)/1000/60/60/24;
				var add_last_month_day = total_day + week;
				var column = Math.ceil(add_last_month_day/7);
				var testToday = new Date();//测试月中与今日相等的num
				for(var i=0 ;i< column;i++){
					if(i == column-1){
						html += "<tr class='month_tr last' >";
					}else{
						html += "<tr class='month_tr' >";
					}
					for(var j=0; j<7; j++){
						var class_name = "";
						
						if(yeah == testToday.getFullYear() && month == testToday.getMonth() && num == testToday.getDate()){
							class_name = "month_today";
							
						}
						if(j == 6){
							html += "<td  class='month_td last "+ class_name+"'>";
						}else{
							html += "<td  class='month_td "+ class_name +"'>";
						}
						if((i == 0 && j < week) || total_day < num){
							html += "<div ></div>"
						}else{
							html += "<div class='show_month_div'>";
							html += "<div>"+ num + "</div>";
							var today = new Date(current.getFullYear(), current.getMonth(), num);
							var tommory = new Date(current.getFullYear(), current.getMonth(), num +1);
							var count = 1;//检测个数的

							for(var o in schedule){
								if(schedule[o].cid == cid || cid == undefined){
									var beginTime = schedule[o].beginTime;
									var class_name;
									if(now < today){
										class_name = "todo";
									}else if(now < tommory){
										class_name = "doing";
									}else if(now > tommory){
										class_name = "done";
									}
									if(beginTime> today && beginTime< tommory){
										if(count <= 4){
											html += "<div class='"+ class_name +"'><a href='/lesson/"+ schedule[o].lid+"?select="+ select_time+"'>"+ schedule[o].name +"</a></div>"
										}
										count ++;
									}
								}
							}
							if(count > 4){
								html += "<div><a class='show_more'>还有"+ (count - 4) +"个课程</a></div>"
							}
							html += '</div>';
							html += '<div class="pop_month_div">';
							var show_date = (	month+1)+"月 " + num  + "日";
							html += '<div class="month_header">'+ show_date +'</div>';
							var today = new Date(now.getFullYear(), now.getMonth(), num);
							var tommory = new Date(now.getFullYear(), now.getMonth(), num +1);
							for(var o in schedule){
								if(schedule[o].cid == cid || cid == undefined){
									var beginTime = schedule[o].beginTime;
									var class_name;
									if(now < today){
										class_name = "todo";
									}else if(now < tommory){
										class_name = "doing";
									}else if(now > tommory){
										class_name = "done";
									}
									if(beginTime> today && beginTime< tommory){
										html += "<div class='"+ class_name +"'><a href='/lesson/"+ schedule[o].lid+"?select="+ select_time +"' >"+ schedule[o].name +"</a></div>"
									}
								}
							}
							html += '</div>';
							num ++;
						}
						html += "</td>";
						
					}
					html += "</tr>";
				}
				html += '</tbody>';
				$(".schedule-table").html(html);
				$(".show_more").each(function(){
					$(this).bind('mouseover',function(){
						$(this).parent().parent().siblings(".pop_month_div").show();
					})
				})
				$(".pop_month_div").each(function(){
					$(this).bind('mouseleave',function(){
						$(this).hide();
					})
				})
				$(".today-rect").hide();
				$(".current-time").hide();
			}
			function _show_week_schedule(schedule, cid){

				//以下为周课程表的计算
				var startdate = new Date(yeah,month,day + 1-(now.getDay() || 7))
				,sy = startdate.getFullYear()
				,sm = startdate.getMonth()
				,sd = startdate.getDate()
				,enddate = new Date(yeah,month,day+(7 - (now.getDay() || 7)))
				,ny = enddate.getFullYear()
				,nm = enddate.getMonth()
				,nd = enddate.getDate();
				//获得一周内最新的开始时间与就结束时间
				var startHour = 23;
				var endHour = 0;
				for(var o in schedule){
					var beginTime = new Date(parseInt(schedule[o].beginTime));
					var hour = beginTime.getHours();
					if(hour<startHour){
						startHour = hour;
					}

				}
				for(var o in schedule){
					var endTime = new Date(parseInt(schedule[o].endTime));
					var hour = endTime.getHours();
					if(hour>=endHour){
						//因为获得的hour是向上取值的，但是endhour应该是向下取值的，所以加了一个小时
						endHour = (hour+1);
						
					}
				}
				//出现这种情况多为跨天
				if(startHour> endHour){
					endHour = 23;
				}
				if(schedule[o] == undefined){
					startHour = 8;
					endHour = 20;
				}
				//获得当前的星期数，如果0-6，0是周日
				var week = (now.getDay()||7)-1;
				var html = "";
				html += '<thead>';
				html += '<tr>';
				html += '<th class="schedule-table-time"></th>';
				for(var i =0; i<7; i++){
					var now2 = new Date(sy,sm,sd+i);
					if(i==week){
						html+='<th class="today">周'+['一','二','三','四','五','六','日'][i]+'<span >'+(now2.getMonth()+1)+"/"+now2.getDate()+'</span></th>';
					}else{
						html+='<th>周'+['一','二','三','四','五','六','日'][i]+'<span>'+(now2.getMonth()+1)+"/"+now2.getDate()+'</span></th>';
					}
				}
				html += '</tr>';
				html += '</thead>';
				//填充表格体
				html += '<tbody>';
				html += '<tr>';
				html += '<td>';
				for(var i=0; i<(endHour - startHour);i++){
					if((startHour+i)<12){
						html += '<div class="schedule-table-time">'+ (startHour+i) +'上午</div>';
					}else if((startHour+i == 12)){
						html += '<div class="schedule-table-time">'+ (startHour+i) +'中午</div>';
					}else if((startHour+i <17)){
						html += '<div class="schedule-table-time">'+ (startHour+i) +'下午</div>';
					}else{
						html += '<div class="schedule-table-time">'+ (startHour+i) +'晚上</div>';
					}
					
				}
				html += '</td>'
				for(var i=0;i<7;i++){
					var now2 = new Date(sy,sm,sd+i);
					html += '<td class="schedule-table-day">';
					html += '<div class="schedule-table-tr-td-wrapper">'
					for(var j=0; j<(endHour - startHour);j++){
						html += '<div class="schedule-table-line"></div>';
					}
					if(23 == startHour && 0 == endHour){
						for(var j=0; j<8;j++){
							html += '<div class="schedule-table-line"></div>';
						}
					}
					var zIndex= 99;
					for(var o in schedule){
						var startTime = new Date(schedule[o].beginTime-0)
							,endTime = new Date(schedule[o].endTime-0);	
						if(startTime.toDateString() == now2.toDateString()){
							zIndex--;
							if(zIndex<= 0){
								zIndex = 0;
							}
							var url="";
							/*
							if(schedule[o].isOpen==1){
								url="/admin/courses_info/detail/"+schedule[o].lid+"?type=open";
							}else{
								url="/admin/courses_info/detail/"+schedule[o].lid;
							}
							*/
							url="/lesson/"+schedule[o].lid+"?select="+select_time;
							var width=99;
							var WidthNum = 0;
							var left = 0;
							//有交叉时间的课程进行处理
							for(var d in schedule){
								if( (schedule[o].beginTime-0) <= (schedule[d].beginTime-0) && (schedule[o].endTime-0) >= (schedule[d].beginTime-0)
									|| (schedule[o].beginTime-0)>=(schedule[d].beginTime-0) && (schedule[o].beginTime-0)<= (schedule[d].endTime-0)){
									WidthNum ++;
									if(WidthNum > 1){
										if(schedule[o].lid != schedule[d].lid &&  schedule[d].hasRight == undefined){
											schedule[o].hasRight = true;
										}
									}
								}
							}
							//确定left
							if(opts.type == 2){
								width= width;
							}else{
								width = width / WidthNum;
							}
							if(schedule[o].hasRight && opts.type != 2){
								left = width;
							}
							
							//判断其课程所在的位置
							var timeDuring = ((schedule[o].endTime-0)-(schedule[o].beginTime-0))/1000/60;
	
							var lessonTop = ((startTime.getHours()-startHour)*60) + startTime.getMinutes();
							var className = '';
							if(now>endTime){
								className = 'done';
							}
							else if(now>startTime){
								className = 'doing';
							}
							else{
								className = 'todo';
							}
							if(schedule[o].cid == cid || cid == undefined){
								html += "<div class='show-lesson-div "+ className+"' style='position:absolute;height:"+timeDuring+"px;z-index:"+zIndex+";top:"+ lessonTop+"px;width:"+ width+"%;left:"+ left +"px' >";
								
								if(opts.type == 0 || opts.type == 2){
									html +="<a class='class-info-a' href='"+url+"' ><p> "+schedule[o].name + "</p>";
									html += "<p> "+schedule[o].tname + "</p></a>";
									if(schedule[o].recorded === true){
										html += "<a class='recorded-icon' target='_blank' href='/playback/add/" + schedule[o].lid+"'></a>";
									}
								}else if(opts.type == 1){
									html +="<a class='class-info-a' href='"+url+"' ><p> "+schedule[o].name + "</p>";
									if(schedule[o].resources != "0")
									html += "<p>"+schedule[o].resources+ "个资料</p></a>";
								}
								html += "</div>"
							}

						}
						
					}
					html +='</div>';
					html +='</td>';
				}
				html +='</tr>';
				html +='</tbody>';

				$(".schedule-table").html(html);
				if(now.toDateString() == new Date(yeah,month,day).toDateString()){
					var currentTodayNum;
					$(".schedule-table thead tr th").each(function(index){
						if($(this).hasClass('today')){
							currentTodayNum = index;
						}
					});
					//注意由于ie会把边框的宽度与高度算进来，所以这里对ie进行了一些特殊处理
					if (!$.support.leadingWhitespace){
						var rectLeft = 65 + (currentTodayNum+2) + ((currentTodayNum-1)*105);
					}else{
						var rectLeft = 65 + ((currentTodayNum-1)*105) + currentTodayNum;
					}
					
					$(".today-rect").css("left",rectLeft+"px").show();
				}else{
					$(".today-rect").hide();
				}
				

				//定位现在的时间，如果现在的时间大于最大的时间+1或者小于开始时间，那么隐藏
				var nowHour = now.getHours();
				var minute = now.getMinutes();
				if(nowHour > endHour+1 || nowHour < startHour){
					$(".current-time").hide();
				}else{
					var currentTop = nowHour - startHour;
					//30为th的高度，5为让图片居中的高度，60为每一个时间段的高度
					$(".current-time").css("top",(((30-5)+60*currentTop)+minute)+"px").show();
				}
			}
		});

	}

})(jQuery)