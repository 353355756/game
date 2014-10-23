(function($){
		$.fn.qkDatePicker = function(data){
			var pages = [],lessons;
			var html=	'<div class="qkSchePage">';
			html+=		'<table class="qkTimeTable">';
			html+=		'	<tr style="height:80px;">';
			html+=		'    	<td style="width:50px;text-align:center">';
			html+=		'        	开始';
			html+=		'        </td>';
			html+=		'        <td style="width:40px;text-align:center">';
			html+=		'        	<table>';
			html+=		'            	<tr class="trans">';
			html+=		'                	<td class="timeAjuster" id="sh_plus">&nbsp;';
			html+=		'                    </td>';
			html+=		'                </tr>';
			html+=		'            	<tr>';
			html+=		'                	<td>';
			html+=		'                    	<input type="text" class="timeInput" id="startHour" value="08"  />';
			html+=		'                    </td>';
			html+=		'                </tr>';
			html+=		'            	<tr class="trans">';
			html+=		'                	<td class="timeAjuster" id="sh_minus">&nbsp;';
			html+=		'                    </td>';
			html+=		'                </tr>';
			html+=		'            </table>';
			html+=		'        </td>';
			html+=		'        <td class="green" style="width:20px;text-align:center">：';
			html+=		'        </td>';
			html+=		'        <td style="width:40px;text-align:center">';
			html+=		'        	<table>';
			html+=		'            	<tr class="trans">';
			html+=		'                	<td class="timeAjuster " id="sm_plus">&nbsp;';
			html+=		'                    </td>';
			html+=		'                </tr>';
			html+=		'            	<tr>';
			html+=		'                	<td>';
			html+=		'                    	<input type="text" class="timeInput" id="startMinute" value="30" />';
			html+=		'                    </td>';
			html+=		'                </tr>';
			html+=		'            	<tr class="trans">';
			html+=		'                	<td class="timeAjuster " id="sm_minus">&nbsp;';
			html+=		'                    </td>';
			html+=		'                </tr>';
			html+=		'            </table>';
			html+=		'        </td>';
			html+=		'        <td style="width:600px;">';
			html+=		'			<div style="margin-left:30px;">'
			html+=		'				<div class="chSlider" id="ch_slider">';
			html+=      '                   <div class="control-circle"></div>';
			html+=      '                	<ul class="control-ul">';
			html+=      '                		<li class="first"></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li>';
			html+=      '                	</ul>';
			html+=      '               </div>';
			html+=		'				<div class="showTimeSplit">'
			html+=		'					<table cellpadding="0" cellspacing="0" border="0" class="hRuler">'
			html+=		'						<tr>'
			html+=		'							<td >15分钟</td><td>30分钟</td><td>45分钟</td><td>60分钟</td><td>75分钟</td><td>90分钟</td><td>105分钟</td><td>120分钟</td>'
			html+=		'						</tr>'
			html+=		'					</table>'
			html+=		'				</div>'
			html+=		'			</div>'
			html+=		'        </td>';
			html+=		'        <td style="width:40px;text-align:center">';
			html+=		'        	<input type="text" class="timeInput" id="endHour" value="08" readonly />';
			html+=		'        </td>';
			html+=		'        <td class="red" style="width:20px;text-align:center">：';
			html+=		'        </td>';
			html+=		'        <td style="width:40px;text-align:center">';
			html+=		'           <input type="text" class="timeInput" id="endMinute" value="45" readonly />';
			html+=		'        </td>';
			html+=		'    	<td style="width:40px;">';
			html+=		'        	结束';
			html+=		'        </td>';
			html+=		'    </tr>';
			html+=		'    <tr style="height:360px;">';
			html+=		'    	<td colspan="9">';
			html+=		'			<div class="qkCalender" id="qkcalender">';
			html+=		'				<table cellpadding="0" cellspacing="0" style="width:100%;">';
			html+=		'					<tr class="thead">';
			html+=		'						<td class="monthAjuster disabled" id="mPrev" style="width:24px;height:24px;">';
			html+= 		'							';
			html+= 		'						</td>';
			html+= 		'						<td class="monthNow" id="mNow">';
			html+= 		'						</td>';
			html+= 		'						<td class="monthAjuster" id="mNext" style="width:24px;height:24px;">';
			html+= 		'							';
			html+= 		'						</td>';
			html+= 		'					</tr>';
			html+= 		'					<tr>';
			html+= 		'						<td class="dataTable" id="datatable" colspan="3">';
			html+= 		'							<table style="width:100%;margin:0px auto;"></table>';
			html+= 		'						</td>';
			html+= 		'					</tr>';
			html+= 		'				</table>';
			html+=		'			</div>';
			html+=		'       </td>';
			html+=		'    </tr>';
			html+=		'    <tr class="hide">';
			html+=		'    	<td colspan="9">';
			html+=		'			<table class="qkProgress " id="qkprogress">';
			html+=		'				<tr>';
			html+=		'					<td class="progressLocked">';
			html+=		'					</td>';
			html+=		'					<td class="progressScheduled">';
			html+=		'					</td>';
			html+=		'					<td class="progressReserved">';
			html+=		'					</td>';
			html+=		'				</tr>';
			html+=		'			</table>';
			html+=		'       </td>';
			html+=		'    </tr>';
			html+=		'</table>';

			html+=	'</div>';
			var page=$(html)
			//完成时的检测
			this.ok = function(){
				if(this.find('.conflicted').hasClass('selected')){
					alert('课程安排存在时间冲突，请您检查');
					return false;
				}
				/*
				if(data.reservedHours>0){
					if(!confirm("您预定的课时没有完全分配，您确定要放弃剩余课时吗")){
						return false;
					}
					//修改预定总课时数
				}
				*/
				//由于答应后台，传对象后发现，我写的组建都是传数组的。因此碍于面子，我牺牲效率，写了两个数组，arr传给后台处理，dataArr，用于自己组件的处理
				var arr = [];
				var dataArr = [];
				$.each(data.schedules,function(i,sche){
					$.each(sche.days,function(i,d){
						var s = new Date(d[0],d[1],d[2],sche.start[0],sche.start[1]) - 0
							,e = s + sche.duration * (1000*60*15);
						arr.push({beginTime : s,endTime : e});
						dataArr.push([s,e]);
					});
				});
				arr.sort(function(a,b){
					return a['beginTime']-b['endTime'];
				});
				dataArr.sort(function(a,b){
					return a[0]-b[0];
				})
				return { arr: arr, dataArr: dataArr, reservedHours:data.reservedHours };
			}
			//生成新课程选择器
			this.addPage = function(){
				//只针对clone的对象内进行查找
				var newPage = page.clone()
					//用于日历中显示当前的日期
					,monthTag = newPage.find('#mNow')
					//制定日历中显示日期内容
					,calender = newPage.find('#datatable')
					//开始日期的小时
					,sh = newPage.find("#startHour")
					//开始日期的分钟
					,sm = newPage.find("#startMinute")
					//结束日期的小时
					,eh = newPage.find("#endHour")
					//结束日期的分钟
					,em = newPage.find("#endMinute")
					//显示上一个月的按钮
					,mprev = newPage.find('#mPrev')
					//显示下一个月的按钮
					,mnext = newPage.find('#mNext')
					//用作拖动上课时长的按钮
					,circle = newPage.find(".control-circle")
					//显示课长的条
					,control = newPage.find(".control-ul")
					//对小时跟分钟的限制
					,limits = [23,59]
					//获得现在的日期，获得年，获得月
					,now = new Date()
					,y = now.getFullYear()
					,m = now.getMonth()
					//获得星期显示，周日，周一，周二，周三，周四，周五，周六
					,wd = now.getDay()
					//我记得是检测是否有点击的标志
					,mousedown
					//
					,id = data.schedules.length
					,sche = {
						id:id,
						start:[8,30],
						duration:1,
						days:[]
					};
				//reservedHours表示可以选择多少课时
				if(data.reservedHours<0){
					//表示个公开课的课时数
					lessons = -data.reservedHours;
				}
				//获得年跟月
				newPage.getYearMonth = function(){
					return [y,m];
				}

				//改变开始的时间
				//返回的为，开课日期，跟上课日期[[],[]]
				var length = data.otherSchedules[0].length
				//最后的上课的日期
				var lastTime = data.otherSchedules[0][length-1].endTime;
				lastTime = new Date(lastTime);
				//最后开课的小时与分钟，用于显示在选择开课时间上
				var lastHour = lastTime.getHours();
				var lastMinute = lastTime.getMinutes()+6;
				//
				lastHour =  lastHour < 10 ? '0' + lastHour : (lastHour >23 ? 23 : lastHour);
				sh.val(lastHour);
				setClassTime(0,lastHour);
				lastMinute =  (lastMinute < 10 ? '0' + lastMinute : (lastMinute >59 ? 59 : lastMinute));
				sm.val(lastMinute);
				setClassTime(1,lastMinute);
				//对开始时间的小时数跟分钟数进行设定
				newPage.attr("id",id);
				this.append(newPage);
				pages.push(newPage);
				data.schedules.push(sche);
				//不知
				newPage[0].onselectstart = function(){
					return false;
				}
				//判断鼠标是否按下了
				newPage.mousedown(function(){
					mousedown = true;
				}).mouseup(function(){
					mousedown = false;
				});
				//设置每次添加的时间是1×分钟
				sche.duration = 1;
				//按钮的事件
				circle.bind('mousedown',function(){
					control.children("li").each(function(index){
						$(this).bind('mouseover',function(){
							hasSelect(index,this);
						})
					})
				})
				circle.bind('mouseup',function(){
					control.children("li").each(function(index){
						$(this).unbind('mouseover');
					})
				})
				//控制器事件
				control.children('li').each(function(index){
					$(this).bind('click',function(){
						hasSelect(index,this);
					});
					$(this).bind('mouseup',function(){
						circle.trigger("mouseup");
					});
				})

				function hasSelect(num,that){
					$(that).parent("ul").children("li").each(function(index){
						var value = num + 1;
						if(index <= (value-1) && !$(this).hasClass('first')){
							$(this).addClass('selected');

						}else{
							$(this).removeClass('selected');
						}
						
						var hourCost = sche.days.length * ( value - sche.duration);
						if(lessons > -1){
							sche.duration = value;
							setClassTime(1,sm.val());
							setStatus(y,m);
						}else if(data.reservedHours >= hourCost){
							data.reservedHours -= hourCost;
							sche.duration = value;
							setClassTime(1,sm.val());
							setStatus(y,m);
						}
						$(that).parent("ul").siblings(".control-circle").css("left", (((value - 1)*81))+ "px" );
					})
					
				}
				
				setCalender();
				
				newPage.find('.timeAjuster').each(function(index, element) {
					if(index === 0 || index === 2){
						this.onclick = function(){
							if($(this).hasClass("disabled")){
								return false;
							}
							var i = index/2
								,num = [sh,sm][i].val()-0+1
							num = num < 0 ? 0 : (num < 10 ? '0' + num :(num > limits[i] ? limits[i] :num));
							setClassTime(i,num,1,1);
						}
					}else{
						this.onclick = function(){
							if($(this).hasClass("disabled")){
								return false;
							}
							
							var i = (index-1)/2
								,num = [sh,sm][i].val()- 1
								num = num < 0 ? '00' : (num < 10 ? '0' + num : num);
							setClassTime(i,num,1,0);
						}
					}
				});
				sh.bind('blur',function(){
					var num = this.value - 0 || 0;
					num = num < 0 ? '00' : (num < 10 ? '0' + num : (num >23 ? 23 : num));
					sh.val(num);
					setClassTime(0,num);
				})
				sm.bind('blur',function(){
					var num = this.value - 0 || 0;
					num = num < 0 ? '00' : (num < 10 ? '0' + num : (num >59 ? 59 : num))
					sm.val(num);
					setClassTime(1,num);
				})
				mprev.click(function(){
					if($(this).hasClass("disabled")){
						return false;
					}
					m--;
					if(m==-1){
						m=11;
						y--;
					}
					if(y === now.getFullYear() && m === now.getMonth()){
						$(this).addClass("disabled");
					}					
					setCalender();
				});
				
				mnext.click(function(){
					mprev.removeClass("disabled");
					m++;
					if(m==12){
						m=0;
						y++;
					}
					setCalender();
				});
				


				function setClassTime(i,num,byArrow,isAdd){
					//[sh,sm][i].val(num);
					sche.start[i] = num - 0;
	
					if(i === 0){
						var beginHour= (sh.val()-0);
						var endHour = (eh.val()-0);
						if(byArrow){
						//修改小时数
							if(isAdd){
								if(beginHour < 23){
									beginHour++;
									endHour++
									//如果大于24那么结束时间变为对应的第二天的时间
									if(endHour>23){
										endHour = endHour - 24;
									}
									sh.val(beginHour);
									eh.val(endHour);
								}	
							}else{
								if(beginHour>0){
									beginHour--;
									endHour--;
									if(endHour < 0){
										endHour = endHour + 24;
									}
									sh.val(beginHour);
									eh.val(endHour);
								}
							}
						}else{
							var beginHours = sh.val() - 0;
							var beginMinute = sm.val() - 0;
							var endMinute =  beginMinute + sche.duration * 15;

							if(endMinute >= 60){
								var addHours = Math.floor(endMinute/60);
								var addMinutes = (endMinute % 60) < 10? '0' + (endMinute % 60) : (endMinute % 60);
							}else{
								var addHours = 0;
								var addMinutes = endMinute;
							}
							var finalHours = (sh.val()-0)+addHours;
							if(finalHours > 23){
										finalHours = finalHours - 24;
							}
							if(finalHours < 0){
										finalHours = finalHours + 24;
							}
							finalHours = finalHours < 10 ? '0' +finalHours : finalHours;
							eh.val(finalHours);
						}

					}
					if(i === 1){
						if(byArrow){
							sm.val(num);
							//现判定开始时间的分钟数，然后获得结束时间的分钟数，互相加一，如果结束时间的分钟数大于等于60，那么结束时间的小时数加一
							var beginMinute = sm.val()-0;
							var endMinute = em.val()-0;
							if(isAdd){
								if(beginMinute < 59){
									beginMinute++;
									endMinute++;
									if(endMinute >= 60){
										var endHour = ($("#endHour").val()-0)+1;
										if(endHour>23){
											endHour = endHour - 24;
										}
										var endMinute = endMinute % 60;
										eh.val(endHour);
									}
									em.val(endMinute);
								}
							}else{
								if(beginMinute >= 0){
									beginMinute--;
									endMinute--;
									if(endMinute < 0){
										var endHour = (eh.val()-0)-1;
										if(endHour < 0){
											endHour = endHour + 24;
										}
										endMinute = endMinute + 60;
										eh.val(endHour);
									}
									em.val(endMinute);
								}
							}

						}else{
							var beginHours = sh.val() - 0;
							var beginMinute = sm.val() - 0;
							var endMinute =  beginMinute + sche.duration * 15;

							if(endMinute >= 60){
								var addHours = Math.floor(endMinute/60);
								var addMinutes = (endMinute % 60) < 10? '0' + (endMinute % 60) : (endMinute % 60);
							}else{
								var addHours = 0;
								var addMinutes = endMinute;
							}
							var finalHours = (sh.val()-0)+addHours;
							finalHours = finalHours < 10 ? '0' +finalHours : finalHours;
							if(finalHours > 23){
										finalHours = finalHours - 24;
							}
							if(finalHours < 0){
										finalHours = finalHours + 24;
							}
							eh.val(finalHours);
							em.val(addMinutes);
						}
					}
					
					setCalender();
				}
				




				function setCalender(){
					//dayNum求出该月的日期的天书
					var dayNum = ((new Date(y,m+1,1)) - (new Date(y,m,1))) / 3600 / 24000
						,l = 0
						,html = '<table style="width:100%;margin:0px auto;" id="'+y + '-' + m +'" class="calenderTable"><tr class=" weekDay borderBottomDotted"><td>一</td><td>二</td><td>三</td><td>四</td><td>五</td><td>六</td><td>日</td></tr><tr>';
					
					monthTag.html(y + " 年 " + ((m + 1) < 10 ? "&nbsp;" + (m+1):m + 1) + " 月");
					//对每一天进行判断，是否可以进行选择
					for(var i=1;i<dayNum+1;i++){
						var date = new Date(y,m,i)
							,day = (date.getDay() || 7) - 1
							//开始时间设定在每天的八点半，设定在前面设置了
							,startTime = new Date(y,m,i,sche.start[0],sche.start[1]) - 0
							//结束时间是9点半，duration设定了中间的时长
							,endTime = new Date(y,m,i,sche.start[0] ,sche.start[1]+ sche.duration * 15) - 0;
							//这一个是进行夸天运算的，如果当startTIme大于endTime那么endTime+1天
						endTime += endTime < startTime ? 24*3600000 : 0;
												
						if(i===1){
							for(var j=0;j<day;j++){
								html+='<td class="calDays noDay"><span>&nbsp;</span></td>';
							}
						}
						else if(day%7===0){
							html+="<tr>";
						}
						
						html+='<td class="calDays';
						//如果限制的时间在这一天内，那么这一天所有的时间都不可选
						if(date - 0 < now - 0 + (data.checkDays - 1) * 24 * 3600000 || (data.limitTime && ((date - 0)+24*3600000) > data.limitTime)){
							html += " disabled";
						}
						else{
							$.each([0,1],function(n0,v0){
								$.each(data.otherSchedules[v0],function(n1,v1){
									$.each([startTime,endTime],function(n2,v2){
										if(v2 > v1.beginTime - 300000 && v2 < v1.endTime + 300000){
											html += [" disabled"," scheduled"][v0];
											return true;
										}
										return true;
									});
								})
							});
							
							$.each(sche.days,function(n,v){
								if(v[0] == y && v[1] == m && v[2]-0 == i){
									html += " selected";
									return true;
								}
							});	
						}
						
						html+='" id="'+i+'"><span>'+i+'</span></td>';
						
						if(i == dayNum){
							for(var j=day+1;j<7;j++){
								html+='<td class="calDays disabled">&nbsp;</td>';
							}
						}
						
						if(day%7===6 || i == dayNum){
							html+="</tr>";
							l++;
						}
						
						if(i == dayNum && l<6){
							for(var k=l;k<6;k++){
								html+="<tr>";
								for(j=0;j<7;j++){
									html+='<td class="calDays disabled">&nbsp;</td>';
								}
								html+="</tr>";
							}
						}
					}
					html += '</table>';
					
					calender.html(html);
					
					calender.find('.calDays').mouseover(function(){
						if(mousedown && this.className == "calDays"){
							if(lessons > 0){
								lessons --;
								$(this).addClass("selected");
								sche.days.push([y,m,this.id]);
								setStatus(y,m);
							}
							else if(data.reservedHours>=sche.duration){
								data.reservedHours -= sche.duration;
								$(this).addClass("selected");
								sche.days.push([y,m,this.id]);
								setStatus(y,m);
							}
							else{
								return false;
							}
						}
					}).mousedown(function(){
						if(!this.id || $(this).hasClass("disabled")){
							return false;
						}
						if($(this).hasClass("scheduled")){
							if(!$(this).hasClass("selected")){
								if(!confirm("您已经参与了该时间段其他老师的课程，您确定要放弃听课，在该时段为您的学生授课吗？")){
									return false;
								}
							}
						}
						
						if($(this).hasClass("conflicted")){
							if(!$(this).hasClass("selected")){
								alert("您已经在该时间段分配了课程，无法重复分配");
								return false;
							}
						}
						
						if($(this).hasClass("selected")){
							var self = this
								,index;
							$.each(sche.days,function(i,v){
								if(y==v[0]&&m==v[1]&&self.id==v[2]){
									index = i;
								}
							});
							sche.days.splice(index,1);
							$(this).removeClass("selected");
							if(lessons > -1){
								lessons ++;
							}
							else{
								data.reservedHours += sche.duration;
							}
						}
						else{
							if(lessons > 0){
								lessons --;
								$(this).addClass("selected");
								sche.days.push([y,m,this.id])
							}
							else if(data.reservedHours>=sche.duration){
								data.reservedHours -= sche.duration;
								$(this).addClass("selected");
								sche.days.push([y,m,this.id])
							}
						}

						setStatus(y,m);
					});
					setStatus(y,m)
				}
				return this;
			}
			
			function setStatus(y,m){
				$.each(data.schedules,function(index,sche){
					var h1 = 0
						,h2 = lessons > -1 ? sche.days.length : sche.duration * sche.days.length
						,h3 = lessons > -1 ? lessons : data.reservedHours
						,t0 = [
								sche.start[0] * 60 + sche.start[1],
								sche.start[0] * 60 + sche.start[1] + sche.duration * 15
						]
					
					$(".qkSchePage[id='"+index+"'] .calenderTable .calDays").removeClass("conflicted");
					
					$.each(data.schedules,function(i,s){
						if(i != index){
							h1 += lessons > -1 ? 1 : s.days.length * s.duration;
							
							var t1 = [
								s.start[0] * 60 + s.start[1],
								s.start[0] * 60 + s.start[1] + s.duration * 15
							]
							if((t0[0]>t1[0]-5&&t0[0]<t1[1]+5)||(t0[1]>t1[0]-5&&t0[1]<t1[1]+5)){
								var cTable = $(".qkSchePage[id='"+index+"'] .calenderTable")[0]
									cYM = cTable.id.split('-');
								$(".qkSchePage[id='"+index+"'] .calenderTable .calDays").each(function(i,c){
									var conflicted
										,id = this.id;
									$.each(s.days,function(i,d){
										if(d[0] == cYM[0] && d[1] ==cYM[1] && d[2] == id){
											conflicted = true;
										}
									});
									if(conflicted){
										$(this).addClass("conflicted");
									}
								});
							}
						}
					});
					
					var allDay=0;
					var allTime = 0;
					for(var i=0;i< data.schedules.length;i++){
						allDay = allDay + data.schedules[i].days.length;
						//console.log(data.schedules[i].days);
						var tips = Math.abs(data.reservedHours) - data.schedules[i].days.length;
						$('.public-class-leave').html(tips);
						allTime = allTime + (data.schedules[i].days.length * data.schedules[i].duration * 15);
					}
					
					//$('.public-class-leave').html(data.schedules);
					$(".show-datepicker-info").html("已创建了<span class='text-info course-num'>"+allDay+"</span>节课,共<span class='text-info course-time'>"+minuTohour(allTime)+"</span>");
					$(".show-datepicker-info").attr('rel',allDay);
				});
			}
			//删除日历选择器
			this.removePage = function(){
				pages[data.schedules.length-1].detach();
				var arr = pages.pop().getYearMonth;
				var lastsche=data.schedules.pop();
				data.reservedHours += lastsche.duration * lastsche.days.length;
				setStatus(arr[0],arr[1]);
				return this;
			}
			
			return this;
		}
	})(jQuery);

	function minuTohour(minu){
		var hour = Math.floor(minu/60);
		var minu = minu % 60;
		if(hour){
			return hour + "小时" + minu + "分钟";
		}else{
			return minu + "分钟";
		}
		
	}
