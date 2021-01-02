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
import { useState, useEffect, RawHTML } from '@wordpress/element';
import { Placeholder } from '@wordpress/components';

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
	const [ search, setSearch ] = useState( '' );
	const [ foundBlocks, setFoundBlocks ] = useState( [] );

	useEffect(
		() => {
			const handler = setTimeout( () => {
				if ( search.length > 5 ) {
					apiFetch( { path: `/roam-research/search_block?q=${search}` } )
						.then( setFoundBlocks )
						.catch( ( e ) => console.log( e ) );
				}
			}, 500 );

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
			{ ! attributes.uid && (
				<Placeholder label="Roam Block Embed">
					<TextControl
						label="Search Roam Block"
						placeholder="Search Roam block just as you would with (("
						value={ search }
						onChange={ setSearch }
					/>
					<div className="wp-block-artpi-roam-block-results">
						{ foundBlocks.map( ( { content, uid, title, snippet } ) => (
							<div
								key={ uid }
								onClick={ () => setAttributes( { uid: uid, content: content } ) }
							>
								<div className="wp-block-artpi-roam-block-results-title">{ title }</div>
								<div>{ snippet }</div>
							</div>
						) ) }
					</div>
					</Placeholder>
			) }
			{  attributes.content && ( <RawHTML children={ attributes.content } /> ) }
		</div>
	);
}
