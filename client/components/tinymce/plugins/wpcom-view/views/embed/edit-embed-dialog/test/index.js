/**
 * External dependencies
 */
import React from 'react';
import FormTextInput from 'components/forms/form-text-input';
import { assert } from 'chai';
import { shallow } from 'enzyme';
import { identity, noop } from 'lodash';

/**
 * Internal dependencies
 */
import { EditEmbedDialog } from '../index';

describe( 'EditEmbedDialog', function() {
	it( "should update the input field's value when input changes", function() {
		const originalUrl = 'https://www.youtube.com/watch?v=ghrL82cc-ss',
			newUrl = 'https://videopress.com/v/DNgJlco8',
			wrapper = shallow( <EditEmbedDialog embedUrl={ originalUrl } onUpdate={ noop } translate={ identity } /> ),
			mockChangeEvent = {
				target: {
					value: newUrl,
					focus: noop,
				}
			};
		let inputField = wrapper.find( FormTextInput ).get( 0 );

		assert.strictEqual( inputField.props.defaultValue, originalUrl );

		wrapper.find( FormTextInput ).simulate( 'change', mockChangeEvent );
		inputField = wrapper.find( FormTextInput ).get( 0 );
		assert.strictEqual( inputField.props.defaultValue, newUrl );
	} );

	it( 'should return the new url to onUpdate when updating', function() {
		const originalUrl = 'https://www.youtube.com/watch?v=R54QEvTyqO4',
			newUrl = 'https://videopress.com/v/x4IYthy7',
			mockChangeEvent = {
				target: {
					value: newUrl,
					focus: noop,
				}
			};
		let currentUrl = originalUrl;
		const onUpdate = ( url ) => {
			currentUrl = url;
		};
		const wrapper = shallow( <EditEmbedDialog embedUrl={ originalUrl } onUpdate={ onUpdate } translate={ identity } /> );

		wrapper.find( FormTextInput ).simulate( 'change', mockChangeEvent );
		wrapper.instance().onUpdateInternal();
		assert.strictEqual( currentUrl, newUrl );
	} );

	it( 'should not return the new url to onUpdate when canceling', function() {
		const originalUrl = 'https://www.youtube.com/watch?v=JkOIhs2mHpc',
			newUrl = 'https://videopress.com/v/GtWYbzhZ',
			mockChangeEvent = {
				target: {
					value: newUrl,
					focus: noop,
				}
			};
		let currentUrl = originalUrl;
		const onUpdate = ( url ) => {
			currentUrl = url;
		};
		const wrapper = shallow( <EditEmbedDialog embedUrl={ originalUrl } onUpdate={ onUpdate } translate={ identity } /> );

		wrapper.find( FormTextInput ).simulate( 'change', mockChangeEvent );
		wrapper.instance().onCancel();
		assert.strictEqual( currentUrl, originalUrl );
	} );

	// todo
		// not let or cause focus to get stolen
		// should test valid vs invalid embed urls? maybe only once get to preview PR
		// update the preview when new url given (other PR)
} );
