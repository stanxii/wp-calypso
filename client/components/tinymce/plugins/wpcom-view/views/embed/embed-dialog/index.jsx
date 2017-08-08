/**
 * External dependencies
 */
import PropTypes from 'prop-types';
import React from 'react';

/**
 * Internal dependencies
 */
import Button from 'components/button';
import Dialog from 'components/dialog';
import FormTextInput from 'components/forms/form-text-input';
import { localize } from 'i18n-calypso';
import { identity } from 'lodash';

// todo
	// lint branch before commit
	// add jsdoc to all functions

export class EmbedDialog extends React.Component {
	static propTypes = {
		embedUrl: PropTypes.string,
		isVisible: PropTypes.bool,

		// Event handlers
		onInsert: PropTypes.func.isRequired,
			// change to not required and set default to noop? or go the other direction and make embedurl and siteid required too?
			// probably rename to something more generic, b/c this could be used outside of tinymce context

		// Inherited
		translate: PropTypes.func,
			// todo make required and move identity to unit tests unless jeff comments on remove-button PR
	};

	static defaultProps = {
		embedUrl: '',
		isVisible: false,
		translate: identity,
	};

	state = {
		embedUrl: this.props.embedUrl,
		isVisible: this.props.isVisible,
	};

	onChangeEmbedUrl = ( event ) => {
		//console.log( 'onchange - focus:', document.activeElement );

		this.setState( {
			embedUrl: event.target.value,
			// todo really need to do this manually? seems like something react could do automatically
		} );

		// the debounce works, but the focus is jumping back to the start of the editor, probably related to the onInsert problem.
		// maybe it's because the embedview inside the editor is also refreshing? how to stop that to test if that fixes problem?

		event.target.focus();
		//todo hack to avoid focus stealiing. is it needed in this pr, or just the preview branch?
		// if remove, remove from mockChangeEvent too
	};

	onCancel = () => {
		this.setState( { isVisible: false } );
	};

	onUpdate = () => {
		this.props.onInsert( this.state.embedUrl );
		this.setState( { isVisible: false } );
	};

	render() {
		const { translate } = this.props;

		return (
			<Dialog
				className="embed-dialog"
				additionalClassNames="embed-dialog__modal"
				isVisible={ this.state.isVisible }
				onClose={ this.onCancel }
				buttons={ [
					<Button onClick={ this.onCancel }>
						{ translate( 'Cancel' ) }
					</Button>,
					<Button primary onClick={ this.onUpdate }>
						{ translate( 'Update' ) }
					</Button>
				] }>
				<h3 className="embed-dialog__title">
					{ translate( 'Embed URL' ) }
				</h3>

				<FormTextInput
					className="embed-dialog__url"
					defaultValue={ this.state.embedUrl }
					onChange={ this.onChangeEmbedUrl }
				/>

				{/*

				todo now input field won't update w/ new state. er, maybe it does, but problem is that focus is often stolen?
					// working now, maybe it was the css change? make sure still working in a few

				hitting enter in input field should update, hitting escape should cancel

				exception thrown when change it twice in a row. - only in FF
					maybe related to needing to debounce?

				Warning: unmountComponentAtNode(): The node you're attempting to unmount was rendered by another copy of React.
					wrapConsole/<
					app:///./client/components/webpack-build-monitor/index.jsx:174:3
					printWarning
					app:///./node_modules/fbjs/lib/warning.js:35:7
					warning
					app:///./node_modules/fbjs/lib/warning.js:59:7
					unmountComponentAtNode
					app:///./node_modules/react-dom/lib/ReactMount.js:443:15
					wpview/</<
			   >>>	app:///./client/components/tinymce/plugins/wpcom-view/plugin.js:287:5
					...

				also verify that only whitelisted embeds will work, and that all other user input is discarded to avoid security issues
					make sure there aren't any execution sinks, etc

				test localized strings in other locale
				*/}
			</Dialog>
		);
	}
}

export default localize( EmbedDialog );
