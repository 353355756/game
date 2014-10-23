(function($){
	$.fn.qkClassDate=function(opts){
		var opts=$.extend({
			courseId:"",
			data:""
			
		},opts||{});

	var now=new Date();
	//获得世界时的年份
	var nYear=now.getFullYear();
	//月份
	var nMonth=now.getMonth();
	//日
	var nDate=now.getDate();
	//先获得该月的第一天，再获得该月的第一天是星期几
	var fdMonth=new Date(nYear,nMonth,1);
	var fdWeek=fdMonth.getDay();
	var showMonth=(nMonth+1)>=10?(nMonth+1):"0"+(nMonth+1)
	//星期数组,拿出数组以后可以方便的修改
	var weekArray=["一","二","三","四","五","六","日"];
	//获得日期的行数，思路是，如果一个月有31天的话，那么第一天是在星期一的位置上，但是如果第一天是星期三的话，可以想象整个
	//时间的位置往后推移了三天，星期一与星期二的位置空出来了，其实就是加上了第一天的星期数-1
	var monthDayArray=new Array(31,28+is_leap(nYear),31,30,31,30,31,31,30,31,30,31);
	//显示需要的表格数量
	var trNum=Math.ceil((monthDayArray[nMonth]+fdWeek-1)/7);
	$(this).each(function(){
		//由于在一个函数中引用了this，而该函数的this指向明显改变了，所以用self引用
		var self=this;

		function init(){
			showCalender();
			
		}
		function showCalender(){
			var title="";
			title+="<table id='qkClassDateHeaderTable'>";
			title+="	<thead>";
			title+="		<tr>";
			title+="			<th id='qkClassDateHeaderTablePre' title='上一月'>&nbsp;</th>";
			title+="			<th colspan='5'>"+showMonth+"月</th>";
			title+="			<th id='qkClassDateHeaderTableNext' title='下一月'>&nbsp;</th>";
			title+="		</tr>";
			title+="	</thead>";
			title+="	<tbody>";
			title+="		<tr class='qkClassDateWeek'>";
			for(var i=0;i<weekArray.length;i++){
			title+="			<td>"+weekArray[i]+"</td>";
			}
			title+="		</tr>";
			for(var j=0;j<trNum;j++){
				title+="	<tr>";
					for(k=0;k<7;k++){
						tdNum=j*7+k;
						//fdweek-1表示，如果是星期三的话，那么应该减去2，而不是减去三，加一表示整体日期向前添加一天
						//由于js的日历是从星期日开始算的，所以整体添加一天就是从星期一开始算起
						dateStr=tdNum-(fdWeek-1)+1;
						(dateStr<=0||dateStr>monthDayArray[nMonth])?dateStr="&nbsp;":dateStr=tdNum-(fdWeek-1)+1;
						if(dateStr=="&nbsp;"){
							title+="<td>"+dateStr+"</td>";
						}else{
							title+="<td class='qkClassDateDay'><span>"+dateStr+"</span></td>";
						}
						
					}
				title+="	</tr>";
			}
			title+="	</tbody>";
			title+="</table>";
		
			$(self).html(title);
			if(opts.courseId!="" || opts.data){
				var colorDiv=""; 
				colorDiv+="<div id='showInfoBlock' class='clearfix'>";
				colorDiv+="</div>";
				$(self).append(colorDiv);
				getClassTime();

			}
			changeMonth();
		}
		function changeMonth(){
			$("#qkClassDateHeaderTablePre").click(function(){
				nMonth--;
				if(nMonth<0){
					nYear--;
					nMonth=11;
				}
				fdMonth=new Date(nYear,nMonth,1);
				fdWeek=fdMonth.getDay();
				showMonth=(nMonth+1)>=10?(nMonth+1):"0"+(nMonth+1);
				showCalender();
			});
			$("#qkClassDateHeaderTableNext").click(function(){
				nMonth++;
				if(nMonth>11){
					nYear++;
					nMonth=0;
					
				}
				fdMonth=new Date(nYear,nMonth,1);
				fdWeek=fdMonth.getDay();
				showMonth=(nMonth+1)>=10?(nMonth+1):"0"+(nMonth+1);
				showCalender();
			});
		}
		function getClassTime(){
			if(opts.data){
				showClass(opts.data);
			}else{
				$.ajax({
				  url:"/course/getLessonList",
			        data:"cid="+opts.courseId,
			        async:true,
			        type:'post',
			        dataType:'json',
			        success:function(data){
			        	var lessonArray=new Array();
			        	for(var i in data){
			        		var arr=[data[i].beginTime,data[i].endTime];
			        		lessonArray.push(arr);
			        	}
			        	
			        	showClass(lessonArray);
				    }

				})
			}
			

		};
		function showClass(lessonArray){
        	//因为是顺序排列的，如果第一个不跟比较的是同一天的话，那么后面的肯定不跟第一个是同一天的
        	//先在sort里存储一个，同时定义好sort的结构，而为数组
        	var sortLessonArray=[[lessonArray[0]]];

        	//把存储在sort里的元素删除掉
        	if(!opts.data){
        		lessonArray.shift();
        	}
        	
        	//接下来应该分别判断sort与lesson中是否为同一天，如果为，那么存入sort当前数组里，如果不是存在下一个数组里
        	for(var j=0;j<lessonArray.length;j++){
        		if(issameDay(lessonArray[j][0],sortLessonArray[sortLessonArray.length-1][0][0])){
        			sortLessonArray[sortLessonArray.length-1].push(lessonArray[j]);
        		}else{
        			sortLessonArray.push([lessonArray[j]]);
        		}
        	}
        	for(var k=0;k<sortLessonArray.length;k++){

        		var day=isSameMonthandYear(nYear,nMonth,sortLessonArray[k][0][0]);
        		if(day==0){
        			continue;
        		}
        		$(".qkClassDateDay").each(function(){
        			var calendarNum=$(this).children("span").html();
        			if(day==calendarNum){
        				if(sortLessonArray[k].length==1){
        					$(this).addClass("oneClass");
        				}else if(sortLessonArray[k].length==2){
        					$(this).addClass("oneClass");
        				}else if(sortLessonArray[k].length>=3){
        					$(this).addClass("oneClass");
        				}
        				var title="";
        				for(var w=0;w<sortLessonArray[k].length;w++){
        					title+=changeTimeFormat(sortLessonArray[k][w][0])+"---";
        					title+=changeTimeFormat(sortLessonArray[k][w][1])+"                                                                           ";
        				}
        				$(this).attr("title",title);
        			}

        		})
        	}
		}


		init();
	})
}
	//判断是否是闰年
	function is_leap(year) { return (year%100==0 ? res=(year%400==0 ? 1 : 0) : res=(year%4==0 ? 1: 0)); } //是否为闰年

	function issameDay(one,two){
		var oneDay=new Date(one);
		var twoDay=new Date(two);
		if(oneDay.getFullYear()==twoDay.getFullYear()&&oneDay.getMonth()==twoDay.getMonth()&&oneDay.getDate()==twoDay.getDate()){
			return true;
		}else{
			return false;
		}
	}
	function isSameMonthandYear(year,month,timeStamp){
		var date=new Date(timeStamp);
		if(year==date.getUTCFullYear()&&month==date.getUTCMonth()){
			return date.getDate();
		}else{
			return 0;
		}
	}

})(jQuery);