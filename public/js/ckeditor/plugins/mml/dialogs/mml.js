( function(){
  var exampleDialog = function(editor){
    return {
      title : "mml"/* title in string*/,
     // minWidth : /*number of pixels*/,
     // minHeight : /*number of pixels*/,
      buttons: [
        {
          type:'button',
          id:'someButtonID', /* note: this is not the CSS ID attribute! */
          label: 'Button',
          onClick: function(){
             //action on clicking the button
             alert("dian ji onClick");
          }
        },
        CKEDITOR.dialog.okButton, 
        CKEDITOR.dialog.cancelButton
      ]/*array of button definitions*/,
      onOk: function(){
        alert("dian ji onOk");
      }/*function*/ ,
      onLoad: function(){
        alert("dian ji onLoad");
      }/*function*/,
      onShow: function(){
        alert("dian ji onShow");
      }/*function*/,
      onHide: function(){
        alert("dian ji onHide");
      }/*function*/,
      onCancel: function(){
        alert("dian ji onCancel");
      }/*function*/,
      contents: [{
        id: 'page1',  /* not CSS ID attribute! */
        label: 'Page1',
        accessKey: 'P',
        elements:[ /*elements */]
        }, {
        id:'page2',
        label:'Page2',
        accessKey: 'Q',
        elements:[/*elements*/]
      }]
    }
  }
/*  CKEDITOR.dialog.add('insertHTML', function(editor) {
    return exampleDialog(editor);
  });*/
})();