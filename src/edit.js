/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody } from '@wordpress/components';
import { FormFileUpload } from '@wordpress/components';
import apiFetch from '@wordpress/api-fetch';
import { TextControl } from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-block-editor/#useBlockProps
 */
import { useBlockProps } from '@wordpress/block-editor';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

function upload( file ) {
	const reader = new FileReader();
	reader.readAsText( file );
	reader.onload = function ( fileLoadedEvent ) {
		var graphContent = fileLoadedEvent.target.result;
		apiFetch( {
			path: '/roam-research/upload-graph',
			method: 'POST',
			data: {
				graphContent,
				graphName: file.name.replace( '.json', '' ),
			},
		} );
	};
}

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/developers/block-api/block-edit-save/#edit
 *
 * @return {WPElement} Element to render.
 */
export default function Edit( { attributes, setAttributes } ) {
	const [ search, setSearch ] = useState( false );
	useEffect(
		() => {
			const handler = setTimeout( () => {
				console.log( 'DEBOUNCED' );
			}, 1000 );

			return () => {
				clearTimeout( handler );
			};
		},
		[ search ] // Only re-call effect if value or delay changes
	);
	return (
		<div { ...useBlockProps() }>
			{
				<InspectorControls>
					<PanelBody
						title={ __( 'Your Roam Graph export', 'roam-block' ) }
						initialOpen="true"
					>
						<FormFileUpload
							isPrimary
							accept="application/json"
							onChange={ ( event ) =>
								upload( event.target.files.item( 0 ) )
							}
						>
							{ __( 'Upload .json file', 'roam-block' ) }
						</FormFileUpload>
					</PanelBody>
				</InspectorControls>
			}
			<div>
				{ ! attributes.uid && (
					<TextControl
						label="Search Roam Block"
						value={ search }
						onChange={ ( val ) => setSearch( val ) }
					/>
				) }
			</div>
		</div>
	);
}
