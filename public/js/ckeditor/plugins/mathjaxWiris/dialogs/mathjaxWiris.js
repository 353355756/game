/**
 * @license Copyright (c) 2003-2014, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

'use strict';

CKEDITOR.dialog.add( 'mathjaxWiris', function( editor ) {

	var wiris_editor,
		lang = editor.lang.mathjaxWiris;
	return {
		title: lang.title,
		minWidth: 800,
		minHeight: 350,
		contents: [
			{
				id: 'info',
				elements: [
					{
						id: 'preview',
						type: 'html',
						height: '800px',
						html:
							'<div style="width:100%;height:350px;text-align:center;">' +
								'<iframe class="wiris" style="border:0;width:100%;height:100%;" scrolling="no" frameborder="0" allowTransparency="true"></iframe>' +
							'</div>',

						onLoad: function( widget ) {
							var iFrame = CKEDITOR.document.getById( this.domId ).getChild( 0 );
							var wiris_editor = new CKEDITOR.plugins.mathjaxWiris.frameWiris( iFrame, editor );
							
						},

						setup: function( widget ) {
							if(CKEDITOR.wiris_editor){
								CKEDITOR.wiris_editor.setMathML(widget.data.math);
							}
						},

						commit: function( widget ) {
							var ml = CKEDITOR.wiris_editor.getMathML();
							ml = ml.substring(0,ml.length-7).concat("<mo>&#160;</mo></math>");
							widget.setData( 'math',  ml );
						},

						onHide: function(){
							CKEDITOR.wiris_editor.setMathML('<math xmlns="http://www.w3.org/1998/Math/MathML"></math>');
						}
					}
				]
			}
		]
	};
} );
