/**
 * A little module for loading a external script
 */

/**
 * External dependencies
 */
import debugFactory from 'debug';
const debug = debugFactory( 'lib/load-script' );

/**
 * Internal dependencies
 */
import config from 'config';
import {
	addScriptCallback,
	executeCallbacks,
	isLoading,
} from './callback-executor';

// NOTE: This exists for compatibility.
export {
	removeScriptCallback,
} from './callback-executor';

/**
 * Module variables
 */
export const JQUERY_URL = 'https://s0.wp.com/wp-includes/js/jquery/jquery.js';

//
// loadScript and loadjQueryDependentScript
//

export function loadScript( url, callback ) {
	// If this script is not currently being loaded, create a script element and attach to document head.
	const shouldLoadScript = ! isLoading( url );

	addScriptCallback( url, callback );

	if ( shouldLoadScript ) {
		attachToHead( createScriptElement( url ) );
	}
}

// NOTE: __config and __loadScript are used for testing only.
export function loadjQueryDependentScript( url, callback ) {
	debug( `Loading a jQuery dependent script from "${ url }"` );

	// It is not possible to expose jQuery globally in Electron App: https://github.com/atom/electron/issues/254.
	// It needs to be loaded using require and npm package.
	if ( config.isEnabled( 'desktop' ) ) {
		debug( `Attaching jQuery from node_modules to window for "${ url }"` );
		window.$ = window.jQuery = require( 'jquery' );
	}

	if ( window.jQuery ) {
		debug( `jQuery found on window, skipping jQuery script loading for "${ url }"` );
		loadScript( url, callback );
		return;
	}

	loadScript( JQUERY_URL, function( error ) {
		if ( error ) {
			callback( error );
		}
		loadScript( url, callback );
	} );
}

//
// Internal functions
//
function createScriptElement( url, onload = _handleRequestSuccess, onerror = _handleRequestError ) {
	debug( `Creating script element for "${ url }"` );
	const script = document.createElement( 'script' );
	script.src = url;
	script.type = 'text/javascript';
	script.async = true;
	script.onload = () => {
		onload.bind( script )( url );
	};
	script.onerror = () => {
		onerror.bind( script )( url );
	};
	return script;
}

function attachToHead( element ) {
	debug( 'Attaching element to head' );
	document.getElementsByTagName( 'head' )[ 0 ].appendChild( element );
}

function _handleRequestSuccess( url ) {
	debug( `Handling successful request for "${ url }"` );
	executeCallbacks( url );
	this.onload = null;
}

function _handleRequestError( url ) {
	debug( `Handling failed request for "${ url }"` );
	executeCallbacks( url, new Error( `Failed to load script "${ url }"` ) );
	this.onerror = null;
}
