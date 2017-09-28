/**
 * External dependencies
 */
import React from 'react';
import FormTextInput from 'components/forms/form-text-input';
import { assert } from 'chai';
import { mount, shallow } from 'enzyme';
import { identity, noop } from 'lodash';

/**
 * Internal dependencies
 */
import { EmbedDialog } from '../dialog';
import useFakeDom from 'test/helpers/use-fake-dom';

describe( 'EmbedDialog', function() {
	it( 'should render', function() {
		const url = 'https://www.youtube.com/watch?v=JkOIhs2mHpc',
			wrapper = shallow(
			<EmbedDialog
				embedUrl={ url }
				onCancel={ noop }
				onUpdate={ noop }
				translate={ identity }
			/>
		);

		assert.isTrue( wrapper.hasClass( 'embed-dialog' ) );
		assert.isFalse( wrapper.instance().props.isVisible );
		assert.strictEqual( wrapper.find( FormTextInput ).length, 1 );
		assert.strictEqual( wrapper.find( FormTextInput ).get( 0 ).props.defaultValue, url );
	} );

	it( "should update the input field's value when input changes", function() {
		const originalUrl = 'https://www.youtube.com/watch?v=ghrL82cc-ss',
			newUrl = 'https://videopress.com/v/DNgJlco8',
			wrapper = shallow(
				<EmbedDialog
					embedUrl={ originalUrl }
					onCancel={ noop }
					onUpdate={ noop }
					translate={ identity }
				/>
			),
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
		const wrapper = shallow(
			<EmbedDialog
				embedUrl={ originalUrl }
				onCancel={ noop }
				onUpdate={ onUpdate }
				translate={ identity }
			/>
		);

		assert.strictEqual( currentUrl, originalUrl );
		wrapper.find( FormTextInput ).simulate( 'change', mockChangeEvent );
		wrapper.instance().onUpdate();
		assert.strictEqual( currentUrl, newUrl );
	} );

	// todo is this a useful test? are any of these?
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
		const wrapper = shallow(
			<EmbedDialog
				embedUrl={ originalUrl }
				onCancel={ noop }
				onUpdate={ onUpdate }
				translate={ identity }
			/>
		);

		assert.strictEqual( currentUrl, originalUrl );
		wrapper.find( FormTextInput ).simulate( 'change', mockChangeEvent );
		wrapper.instance().onCancel();
		assert.strictEqual( currentUrl, originalUrl );
	} );

	describe( 'Full DOM rendering', function() {
		useFakeDom();

		// For details, see EmbedDialog.componentWillReceiveProps
		it( "should reset state.embedUrl each time it's created", function() {
			// should fail when EmbedDialog.componentWillReceiveProps commented out, then pass when it's enabled
			// stuck on `react-modal: You must set an element...` though, figured mount.options.attachTo would fix that, but maybe not
			// maybe need to redo all this w/ jest now anyway, looks like usefakedom() no longer used? see https://github.com/Automattic/wp-calypso/pull/16119/files
			return;

			const originalUrl = 'https://www.youtube.com/watch?v=JkOIhs2mHpc',
				newUrl = 'https://videopress.com/v/GtWYbzhZ',
				domNode = useFakeDom.getContainer();
			let wrapper;

			const render = ( url, visible ) => {
				wrapper = mount(
					<EmbedDialog
						embedUrl={ originalUrl }
						isVisible={ visible }
						onCancel={ noop }
						onUpdate={ noop }
						translate={ identity }
					/>,
					{
						attachTo: domNode,
					}
				);
			};

			// explain what's going on here, simular opening one then closing, then opening another and closing

			render( originalUrl, true );
			assert.strictEqual( wrapper.instance().state.embedUrl, originalUrl );
			render( originalUrl, false );
			assert.strictEqual( wrapper.instance().state.embedUrl, originalUrl );
			render( newUrl, true );
			assert.strictEqual( wrapper.instance().state.embedUrl, newUrl );
			render( newUrl, false );
			assert.strictEqual( wrapper.instance().state.embedUrl, newUrl);

			// unmount to clean up?
			// maybe simulate changing the url in there, to make sure that when it cancels, it gets reset? maybe that's another test?
		} );
	} );

	// todo not let or cause focus to get stolen ?
} );
