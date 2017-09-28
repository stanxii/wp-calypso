/**
 * External dependencies
 */
import ReactDom from 'react-dom';
import React from 'react';
import tinymce from 'tinymce/tinymce';
import { translate } from 'i18n-calypso';

/**
 * Internal dependencies
 */
import EmbedDialog from './dialog';

// modernize all the old syntax etc
// tests for this file too, but what?
// anything from wplink/plugin that you want to bring in here?

function embed( editor ) {
	let embedDialogContainer;

	function render( visible = true ) {
		const embedUrlNode = editor.selection.getNode(),
			embedDialogProps = {
				embedUrl: embedUrlNode.innerText || embedUrlNode.textContent,
				isVisible: visible,
				onCancel: () => render( false ),
				onUpdate: ( newUrl ) => {
					editor.execCommand( 'mceInsertContent', false, newUrl );
						// todo  should i preserve the surrounding div from ^^^ when inserting?
					render( false );
				},
			};

		ReactDom.render( React.createElement( EmbedDialog, embedDialogProps ), embedDialogContainer );

		// todo document why
		if ( ! visible ) {
			editor.focus();
		}
	}

	editor.on( 'init', function() {
		embedDialogContainer = editor.getContainer().appendChild(
			document.createElement( 'div' )
		);
	} );

	editor.on( 'remove', function() {
		ReactDom.unmountComponentAtNode( embedDialogContainer );
		embedDialogContainer.parentNode.removeChild( embedDialogContainer );
		embedDialogContainer = null;
	} );

	editor.addCommand( 'embedDialog', () => render() );

	// todo maybe don't need this, but document if do. probably do.
	editor.on( 'pastepreprocess', function( event ) {
		let pastedStr = event.content;
		console.log( 1,pastedStr);

		if ( ! editor.selection.isCollapsed() ) {
			pastedStr = pastedStr.replace( /<[^>]+>/g, '' );
			pastedStr = tinymce.trim( pastedStr );

			console.log( 2,pastedStr);

			if ( /^(?:https?:)?\/\/\S+$/i.test( pastedStr ) ) {
				console.log( 'test' );

				editor.execCommand( 'mceInsertLink', false, {
					href: editor.dom.decode( pastedStr )
				} );

				event.preventDefault();
			}
		}
	} );
}

// use export default instead?

module.exports = function() {
	tinymce.PluginManager.add( 'embed', embed );
};
