function onErrorCallback( sectionNameString ) {
    function callback( error, sectionNameString ) {
		if ( ! LoadingError.isRetry() ) {
			LoadingError.retry( sectionNameString );
		} else {
			console.error(error);
			context.store.dispatch( { type: "SECTION_SET", isLoading: false } );
			LoadingError.show( sectionNameString );
		}
		return;
    }
    return callback;
}

function requireCallback( sectionString, moduleString ) {
    function callback( require, sectionString, moduleString ) {
		context.store.dispatch( { type: "SECTION_SET", isLoading: false } );
		controller.setSection( sectionString )( context );
		if ( ! _loadedSections[ moduleString ] ) {
			require( moduleString )( controller.clientRouter );
			_loadedSections[ moduleString ] = true;
		}
		context.store.dispatch( activateNextLayoutFocus() );
		next();
    }
    return callback;
}

page( pathRegex, function( context, next ) {
	var envId = envIdString;
	if ( envId && envId.indexOf( config( "env_id" ) ) === -1 ) {
		return next();
	}
	if ( _loadedSections[ moduleString ] ) {
		controller.setSection( sectionString )( context );
		context.store.dispatch( activateNextLayoutFocus() );
		return next();
	}
	if ( config.isEnabled( "restore-last-location" ) && restoreLastSession( context.path ) ) {
		return;
	}
	context.store.dispatch( { type: "SECTION_SET", isLoading: true } );

    const callback = requireCallback( sectionString, moduleString);
    const onError = onErrorCallback( sectionNameString );

	require.ensure([], callback, onError, sectionNameString );
}

