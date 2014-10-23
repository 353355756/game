$(document).ready(function(){
	var swf = $("#material-preview").attr('rel');
	$('#material-preview').FlexPaperViewer(
      	{config : {
	          SWFFile : escape("/pdf/"+swf),
	          Scale : 0.6,
	          ZoomTransition : 'easeOut',
	          ZoomTime : 0.5,
	          ZoomInterval : 0.2,
	          FitPageOnLoad : true,
	          FitWidthOnLoad : true,
	          FullScreenAsMaxWindow : true,
	          ProgressiveLoading : true,
	          MinZoomSize : 0.2,
	          MaxZoomSize : 5,
	          SearchMatchAll : false,
	          InitViewMode : 'Portrait',
	          RenderingOrder : 'flash',
	          StartAtPage : '',
	          //jsDirectory : '/flex_paper/',
	          ViewModeToolsVisible : true,
	          ZoomToolsVisible : true,
	          NavToolsVisible : true,
	          CursorToolsVisible : true,
	          SearchToolsVisible : true,
	          WMode : 'window',
	          localeChain: 'zh_CN'
	      	}
  		}
    );  


})