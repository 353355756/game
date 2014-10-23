/**
 * This jQuery plugin displays pagination links inside the selected elements.
 *
 * @author Gabriel Birke (birke *at* d-scribe *dot* de)
 * @version 1.2
 * @param {int} maxentries Number of entries to paginate
 * @param {Object} opts Several options (see README for documentation)
 * @return {Object} jQuery Object
 */
 //maxentries，表示总共有多少条信息
jQuery.fn.pagination = function(maxentries, opts){
	//默认选项
	opts = jQuery.extend({
		//每页显示多少个
		items_per_page:12,
		//表示...前面有几个按钮
		num_display_entries:10,
		//目前为第几页
		current_page:0,
		//表示。。。后面有几个按钮
		num_edge_entries:0,
		//表示herf里面的内容
		link_to:"#",
		//表示prev的标签显示内容
		prev_text:"",
		next_text:"",
		ellipse_text:"...",
		//prev是否一致显示
		prev_show_always:true,
		next_show_always:true,
		//回调函数
		callback:function(){return false;}
	},opts||{});
	//这个this为对应的DOM封装的Jquery对象
	return this.each(function() {
		//这个this为DOM对象
		/**
		 * Calculate the maximum number of pages
		 */
		//返回一共多少页
		function numPages() {
			return Math.ceil(maxentries/opts.items_per_page);
		}
		
		/**
		 * Calculate start and end point of pagination links depending on 
		 * current_page and num_display_entries.
		 * @return {Array}
		 */
		 //获得的是。。。中间的个数
		function getInterval()  {
			//。。。前面的按钮取一半
			var ne_half = Math.ceil(opts.num_display_entries/2);
			//一共多少页
			var np = numPages();
			//一共多少页减去一共可以显示的个数
			var upper_limit = np - opts.num_display_entries;
		
			//1.比较现在页面与。。。前按钮个数一半的差值
			//current_page-ne_halef 
			var start = current_page>ne_half?Math.max(Math.min(current_page-ne_half, upper_limit), 0):0;
			//= =没看明白
			var end = current_page>ne_half?Math.min(current_page+ne_half, np):Math.min(opts.num_display_entries, np);
			return [start,end];
		}
		
		/**
		 * This is the event handling function for the pagination links. 
		 * @param {int} page_id The new page number
		 */
		 //page_id为page的ID，evt为事件
		 //这是点击的回调事件
		 //每点击一次，page要重新创建一次
		function pageSelected(page_id, evt){
			
			//获得page_id给current_page
			current_page = page_id;
			//
			drawLinks();
			//传递的为id以及dom的jquery对象
			var continuePropagation = opts.callback(page_id, opts.items_per_page);
			if (!continuePropagation) {
				//取消默认事件，其实就是取消点击a的超链接，页面刷新
				if (evt.stopPropagation) {
					evt.stopPropagation();
				}
				else {
					evt.cancelBubble = true;
				}
			}
			//如果有返回值那么返回内容
			return continuePropagation;
		}
		
		/**
		 * This function inserts the pagination links into the container element
		 */
		function drawLinks() {
			//清空内容
			panel.empty();
			//获得开始于结束的数组；
			var interval = getInterval();
			//获得页面的总数
			var np = numPages();
			// This helper function returns a handler function that calls pageSelected with the right page_id
			//返回事件句柄
			var getClickHandler = function(page_id) {
				return function(evt){ return pageSelected(page_id,evt); }
			}
			
			// Helper function for generating a single link (or a span tag if it's the current page)
			//添加item
			var appendItem = function(page_id, appendopts){
				page_id = page_id<0?0:(page_id<np?page_id:np-1); // Normalize page id to sane value
				appendopts = jQuery.extend({text:page_id+1, classes:""}, appendopts||{});
				if(page_id == current_page){
					var lnk = jQuery("<span class='current'>"+(appendopts.text)+"</span>");
				}
				else
				{
					var lnk = jQuery("<a>"+(appendopts.text)+"</a>")
						.bind("click", getClickHandler(page_id));
						
						
				}
				//这里可以给id添加标签
				if(appendopts.classes){lnk.addClass(appendopts.classes);}
				panel.append(lnk);
			}
			// Generate "Previous"-Link
			//如果有默认的prev_text同时现在页面大于0或者前一页一直显示
			if(opts.prev_text && (current_page > 0 || opts.prev_show_always)){
				//添加一个点击
				appendItem(current_page-1,{text:opts.prev_text, classes:"prev"});
			}
			// Generate starting points
			//interval[0]为...中间开始ide
			if (interval[0] > 0 && opts.num_edge_entries > 0)
			{
				var end = Math.min(opts.num_edge_entries, interval[0]);
				for(var i=0; i<end; i++) {
					appendItem(i);
				}
				if(opts.num_edge_entries < interval[0] && opts.ellipse_text)
				{
					jQuery("<span>"+opts.ellipse_text+"</span>").appendTo(panel);
				}
			}
			// Generate interval links
			for(var i=interval[0]; i<interval[1]; i++) {
				appendItem(i);
			}
			// Generate ending points
			if (interval[1] < np && opts.num_edge_entries > 0)
			{
				if(np-opts.num_edge_entries > interval[1]&& opts.ellipse_text)
				{
					jQuery("<span>"+opts.ellipse_text+"</span>").appendTo(panel);
				}
				var begin = Math.max(np-opts.num_edge_entries, interval[1]);
				for(var i=begin; i<np; i++) {
					appendItem(i);
				}
				
			}
			// Generate "Next"-Link
			if(opts.next_text && (current_page < np-1 || opts.next_show_always)){
				appendItem(current_page+1,{text:opts.next_text, classes:"next"});
			}
		}
		
		// Extract current_page from options
		var current_page = opts.current_page;
		// Create a sane value for maxentries and items_per_page
		maxentries = (!maxentries || maxentries < 0)?1:maxentries;
		opts.items_per_page = (!opts.items_per_page || opts.items_per_page < 0)?1:opts.items_per_page;
		// Store DOM element for easy access from all inner functions
		//panel为dom的jquery对象
		var panel = jQuery(this);
		// Attach control functions to the DOM element 
		this.selectPage = function(page_id){ pageSelected(page_id);}
		this.prevPage = function(){ 
			if (current_page > 0) {
				pageSelected(current_page - 1);
				return true;
			}
			else {
				return false;
			}
		}
		this.nextPage = function(){ 
			if(current_page < numPages()-1) {
				pageSelected(current_page+1);
				return true;
			}
			else {
				return false;
			}
		}
		// When all initialisation is done, draw the links
		drawLinks();
        // call callback function
    opts.callback(current_page, opts.items_per_page);
		
	});
}


