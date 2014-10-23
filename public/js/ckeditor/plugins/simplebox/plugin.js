CKEDITOR.plugins.add( 'simplebox', {
    // Simple Box widget code.
    requires: 'widget',

    icons: 'simplebox',

    init: function( editor ) {
      editor.widgets.add( 'simplebox', {
        dialog: 'simplebox',
        button: 'Create a simple box',
        template: '<div class="simplebox">' +
                    '<h2 class="simplebox-title">Title</h2>' +
                    '<div class="simplebox-content"><p>Content...</p></div>' +
                  '</div>',
        editables: {
          title: {
              selector: '.simplebox-title',
              allowedContent: 'br strong em'
          },
          content: {
              selector: '.simplebox-content'
          }
        },
        allowedContent:'div(!simplebox); div(!simplebox-content); h2(!simplebox-title)',
        requiredContent: 'div(simplebox)',
        init: function() {
          var width = this.element.getStyle( 'width' );
          if ( width )
              this.setData( 'width', width );
          if ( this.element.hasClass( 'align-left' ) )
              this.setData( 'align', 'left' );
          if ( this.element.hasClass( 'align-right' ) )
              this.setData( 'align', 'right' );
          if ( this.element.hasClass( 'align-center' ) )
              this.setData( 'align', 'center' );
        }
      });

      CKEDITOR.dialog.add( 'simplebox', this.path + 'dialogs/simplebox.js' );
    }
} );