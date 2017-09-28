/**
 * External dependencies
 */
import debugFactory from 'debug';
const debug = debugFactory( 'lib/load-script/callback-handler' );

/**
 * Module variables
 */
const callbacksForURLsInProgress = {};

export function isLoading( url ) {
	return callbacksForURLsInProgress.hasOwnProperty( url );
}

export function removeScriptCallback( url, callback ) {
	debug( `Removing a known callback for a script from "${ url }"` );

	if ( ! callbacksForURLsInProgress.hasOwnProperty( url ) ) {
		return;
	}

	const index = callbacksForURLsInProgress[ url ].indexOf( callback );

	if ( -1 === index ) {
		return;
	}

	if ( 1 === callbacksForURLsInProgress[ url ].length ) {
		delete callbacksForURLsInProgress[ url ];
		return;
	}

	callbacksForURLsInProgress[ url ].splice( index, 1 );
}

export function removeScriptCallbacks( url ) {
	debug( `Removing all callbacks for a script from "${ url }"` );

	delete callbacksForURLsInProgress[ url ];
}

export function removeAllScriptCallbacks() {
	debug( 'Removing all callbacks for scripts from all URLs' );

	Object.keys( callbacksForURLsInProgress ).map( key => {
		delete callbacksForURLsInProgress[ key ];
	} );
}

export function getCallbacks() {
	return callbacksForURLsInProgress;
}

export function addScriptCallback( url, callback ) {
	if ( isLoading( url ) ) {
		debug( `Adding a callback for an existing script from "${ url }"` );
		callbacksForURLsInProgress[ url ].push( callback );
	} else {
		debug( `Adding a callback for a new script from "${ url }"` );
		callbacksForURLsInProgress[ url ] = [ callback ];
	}
}

export function executeCallbacks( url, callbackArguments = null ) {
	if ( callbacksForURLsInProgress.hasOwnProperty( url ) ) {
		const debugMessage = `Executing callbacks for "${ url }"`;
		debug( callbackArguments === null ? debugMessage : debugMessage + ` with args "${ callbackArguments }"` );

		callbacksForURLsInProgress[ url ].filter( cb => typeof cb === 'function' ).forEach( function( cb ) {
			cb( callbackArguments );
		} );
		delete callbacksForURLsInProgress[ url ];
	}
}
