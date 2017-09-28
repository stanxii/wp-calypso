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

/**
 * Shows the URL of am embed and allows it to be edited.
 */
export class EmbedDialog extends React.Component {
	static propTypes = {
		embedUrl: PropTypes.string,
		isVisible: PropTypes.bool,

		// Event handlers
		onCancel: PropTypes.func.isRequired,
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
	};

	/**
	 * Reset `state.embedUrl` whenever the component's dialog is opened or closed.
	 *
	 * If this were not done, then switching back and forth between multiple embeds would result in
	 * `state.embedUrl` being incorrect. For example, when the second embed was opened,
	 * `state.embedUrl` would equal the value of the first embed, since it initially set the
	 * state.
	 *
	 * @param {object} nextProps The properties that will be received.
	 */
	componentWillReceiveProps = ( nextProps ) => {
		this.setState( {
			embedUrl: nextProps.embedUrl,
		} );
	};

	onChangeEmbedUrl = ( event ) => {
		this.setState( {
			embedUrl: event.target.value,
		} );
	};

	onCancel = () => {
		this.props.onCancel();
	};

	onUpdate = () => {
		this.props.onUpdate( this.state.embedUrl );
	};

	onKeyDownEmbedUrl = ( event ) => {
		if ( event.key !== 'Enter' ) {
			return;
		}

		event.preventDefault();
		this.onUpdate();
	};

	render() {
		// todo
		// autofocus not working. is this supposed to do what i think, or something else?
			//remove the one in Dialog too, if don't use it in FormTextInput
				// this isn't needed in devdocs, might not be needed for tinymce after figure out remaining issue
			// autofocus works in devdocs/design, so probably the issue is something w/ tinymce

		// hitting escape should close dialog
			//	dialog component should just do it automatically, but it isn't. why?
			//	doesn't close when click outside dialog eitehr, wtf

		const { translate } = this.props,
			dialogButtons = [
				<Button onClick={ this.onCancel }>
					{ translate( 'Cancel' ) }
				</Button>,
				<Button primary onClick={ this.onUpdate }>
					{ translate( 'Update' ) }
				</Button>
			];

		return (
			<Dialog
				autoFocus={ false }
				buttons={ dialogButtons }
				className="embed-dialog"
				additionalClassNames="embed-dialog__modal"
				isVisible={ this.props.isVisible }
				onCancel={ this.onCancel }
			>
				<h3 className="embed-dialog__title">
					{ translate( 'Embed URL' ) }
				</h3>

				<FormTextInput
					autoFocus={ true }
					className="embed-dialog__url"
					defaultValue={ this.state.embedUrl }
					onChange={ this.onChangeEmbedUrl }
					onKeyDown={ this.onKeyDownEmbedUrl }
				/>
			</Dialog>
		);
	}
}

export default localize( EmbedDialog );
