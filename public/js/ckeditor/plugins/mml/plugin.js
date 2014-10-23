CKEDITOR.plugins.add('mml', {

  init: function( editor ) {
       // alert( 'Editor "' + editor.name + '" is being initialized!' );
       //icons: CKEDITOR.plugins.getPath('mml') + 'mml.png';
        var pluginName = 'mml';
        console.log(this.path + 'dialogs/mml.js');
        CKEDITOR.dialog.add(pluginName, this.path + 'dialogs/mml.js');
        editor.addCommand(pluginName, new CKEDITOR.dialogCommand(pluginName));
        editor.ui.addButton('Footnote',{
          label: 'Footnote or Citation',
          command: pluginName,
          icon: CKEDITOR.plugins.getPath('mml') + 'mml.png'
        });
    }
});