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

{/*
todo

// hitting escape should close dialog
	// dialog component should just do it automatically, but it isn't. why?
	// doesn't close when click outside dialog eitehr, wtf

*/}

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

	onChangeEmbedUrl = ( event ) => {
		this.setState( {
			embedUrl: event.target.value,
		} );
	};

	// Reset to the original state
	onCancel = () => {
		/*
		todo this is needed, right? if open, change, cancel, then reopen, it'll still have old value. why didn't unit test detect this?
		test was done wrong, or just fundamentally test doesn't match real behavior?

		*/
		this.setState( {
			embedUrl: this.props.embedUrl,
			// probably some es6 sugar to make this nicer
		} );

		this.props.onCancel();

		// todo also switching between modals can mess w/ the state, get the url for one instead of the other
			// how to test for that, too?
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
				className="embed-dialog"
				additionalClassNames="embed-dialog__modal"
				isVisible={ this.props.isVisible }
				onCancel={ this.onCancel }
				buttons={ dialogButtons }
				autoFocus={ false }
			>
				{/* autofocus above not necessary if below isn't used? */}

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
				{/* autofocusnot working. is this supposed to do what i think, or something else? */}
			</Dialog>
		);
	}
}

export default localize( EmbedDialog );
