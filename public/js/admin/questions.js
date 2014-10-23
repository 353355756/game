$(document).ready(function(){
  var editor = CKEDITOR.appendTo('editorSpace');
  var editor1 = CKEDITOR.appendTo('editorSpace1');

  $('.questions-read-btn').bind('click',function(){
    var preview = $('#preview');//要显示的位置
    preview.html("");

    showMahtjax(editor,preview);

    $('#editorSpace').fadeOut('6000',function(){
      $('#preview').fadeIn('fast');
    });
  });

  $('.questions-editor-btn').bind('click',function(){

    var jsonObject = {
      //"parentnode":"",
      //"node":""
    };
    var body = editor.document.getBody().getHtml();
    jsonObject.parentnode = body;

   /* var wirisIframeArray = new Array();
    var cke_widget_content = $(".cke_reset").contents();
    var wiris_widget = $(cke_widget_content).find(".cke_widget_element");
    for(var i = 0;i<wiris_widget.length;i++){
      var json = wiris_widget[i].getAttribute('data-cke-widget-data');
      var index = wiris_widget[i].parentNode.getAttribute('data-cke-widget-id');
      var wirisNode = $(wiris_widget[i]).find('.wiris').contents()[0].documentElement.innerHTML;
      //wirisIframeArray.push();
    }*/

    editor1.insertHtml(jsonObject.parentnode);
    

  });
  
});

function showMahtjax(editor,preview){
  var body = editor.document.getBody().getHtml();
  var objE = document.createElement("div"); 
  objE.innerHTML = body;

  var wiris_widget = $(objE).find(".cke_widget_element");
  for(var i = 0;i<wiris_widget.length;i++){
    var json = wiris_widget[i].getAttribute('data-cke-widget-data');
    wiris_widget[i].parentNode.innerHTML = eval("(" + json + ")").math;
  }

  var iframe = document.createElement("iframe"); 
  iframe.setAttribute("id","iframeMath");
  iframe.setAttribute("style","border:0;width:100%;height:100%;");
  iframe.setAttribute("scrolling","no");
  iframe.setAttribute("frameborder","0");
  iframe.setAttribute("allowTransparency","true");
  preview.html(iframe);

  var iframemath = window.frames['iframeMath'];
  var iframemathDocument = null;
  if(iframemath.document){
    iframemathDocument = iframemath.document;
  }else if(iframemath.contentDocument){
    iframemathDocument = iframemath.contentDocument;
  }else{
    alert("浏览器不支持");
  }
  iframemathDocument.open();
  iframemathDocument.write('<!DOCTYPE html><html><head><script type="text/javascript" src="/plug/mathjax/MathJax.js?config=MML_HTMLorMML-full"></script></head><body>'+objE.outerHTML+'</body></html>');
  iframemathDocument.close();
}
