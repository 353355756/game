(function($){
	$.fn.qkSlider = function(options){
		var options= $.extend({
			"button" :  true,
			"continue" : true,
			"direction" : "left",
			speed: 800
		},options);
		var dir = options.direction;
		var $slider = $( this ),
				$wrapper = $(this).children('.open-courses-list'),
				$sliderPrev = $(this).children('.prev-btn'),
				$sliderNext = $(this).children('.next-btn'),
				$sliderMove = $(this).find('.ul-list'),
				$item = $sliderMove.children("li");
		if($item.length > 3){
			$sliderPrev.show();
			$sliderNext.show();
			var	timer = setInterval(movePrev,3000);

			$slider.on('mouseover',function(){
				clearInterval(timer);
			});
			$slider.on('mouseout',function (){
				timer = setInterval(movePrev,3000);
			});
		}
		//初始化样式
		if( dir == 'left' ) {
			var $iSteep = $item.outerWidth();
			$sliderMove.css('width',$item.length * $iSteep +'px' );
		} 

		//添加点击事件
		$sliderNext.on('click',moveNext);
		$sliderPrev.on('click',movePrev);

		
		//缓存运动样式
		var data1 = {}, data2 = {};
		data1[dir] = -$iSteep;
		data2[dir] = 0;

		//运动样式函数
		function moveNext(){
			$sliderMove.css( dir,-$iSteep+'px').children().last().prependTo( $sliderMove );
			$sliderMove.animate(data2,  options.speed);
		};

		function movePrev(){
			$sliderMove.animate( data1,  options.speed, function(){
				$sliderMove.css( dir, 0 ).children().first().appendTo( $sliderMove );
			});
		};
		
		return this; //返回当前对象,保证可链式操作
















	}
})(jQuery)