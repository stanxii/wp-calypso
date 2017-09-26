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

// todo
	// test w/ multiple embedviews on a same page
	// lint branch before commit
	// add jsdoc to all functions

export class EditEmbedDialog extends React.Component {
	static propTypes = {
		embedUrl: PropTypes.string,
		isVisible: PropTypes.bool,

		// Event handlers
		onUpdate: PropTypes.func.isRequired,

		// Inherited
		translate: PropTypes.func.isRequired,
	};

	static defaultProps = {
		embedUrl: '',
		isVisible: false,
	};

	state = {
		embedUrl: this.props.embedUrl,
		isVisible: this.props.isVisible,
	};

	// set focus on input field when opening dialog or mounting component or something? good for ux
	// is that bad for a11y?

	onChangeEmbedUrl = ( event ) => {
		this.setState( {
			embedUrl: event.target.value,
		} );

		event.target.focus();
		//todo hack to avoid focus stealiing. is it needed in this pr, or just the preview branch?
		// maybe need to use refs? -- https://facebook.github.io/react/docs/refs-and-the-dom.html
		// if remove, remove from mockChangeEvent too

		// hitting enter should trigger this
			// look at how link dialog does it
			// there's a handleEnter function in ../../plugin.js
	};

	onCancel = () => {
		this.setState( { isVisible: false } );

		// hitting esc should trigger this
	};

	/**
	 * Apply internal update logic before calling the parent component's onUpdate handler.
	 */
	onUpdateInternal = () => {
		this.props.onUpdate( this.state.embedUrl );
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
					<Button primary onClick={ this.onUpdateInternal }>
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

export default localize( EditEmbedDialog );
