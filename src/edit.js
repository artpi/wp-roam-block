/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';
import { InspectorControls, BlockControls } from '@wordpress/block-editor';
import { PanelBody } from '@wordpress/components';
import { FormFileUpload, Notice } from '@wordpress/components';
import apiFetch from '@wordpress/api-fetch';
import { TextControl } from '@wordpress/components';
import { useState, useEffect, RawHTML, Fragment } from '@wordpress/element';
import { Placeholder } from '@wordpress/components';
import { Toolbar, ToolbarButton, Button } from '@wordpress/components';
import { formatListBullets, heading } from '@wordpress/icons';

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

function upload( file, setGraphStatus ) {
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
		} )
		.then( () => {
			setGraphStatus( 'OK' );
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
	const [ uploadURL, setUploadURL ] = useState( '' );
	const [ foundBlocks, setFoundBlocks ] = useState( [] );
	const [ graphStatus, setGraphStatus ] = useState( 'OK' );

	function toggleSecretUrlPanel( open ) {
		if ( open ) {
			apiFetch( { path: '/roam-research/get_upload_token' } )
			.then( ( data ) => setUploadURL( data.url ) );
		}
	}

	useEffect(
		() => {
			const handler = setTimeout( () => {
				if ( search.length > 5 ) {
					apiFetch( { path: `/roam-research/search_block?q=${search}` } )
						.then( setFoundBlocks )
						.catch( ( e ) => {
							if ( e.code === 'graph_missing' ) {
								setGraphStatus( 'MISSING' );
							}
						} );
				}
			}, 500 );

			return () => {
				clearTimeout( handler );
			};
		},
		[ search ] // Only re-call effect if value or delay changes
	);

	return (
		<div { ...useBlockProps( { className: 'artpi-roam-block-children-' + attributes.childrenListView + ' artpi-roam-block-header-' + ( attributes.showHeader ? 'visible' : 'hidden' )  } ) }>
			{
				<InspectorControls initialOpen={ true }>
					<PanelBody
						title={ __( 'Your Roam Graph export', 'roam-block' ) }
						initialOpen="true"
					>
						<FormFileUpload
							isPrimary
							accept="application/json"
							onChange={ ( event ) =>
								upload( event.target.files.item( 0 ), setGraphStatus )
							}
						>
							{ __( 'Upload .json file from Roam Research export', 'roam-block' ) }
						</FormFileUpload>
					</PanelBody>
					<PanelBody
						title={ __( 'Secret Upload URL', 'roam-block' ) }
						initialOpen={ false }
						onToggle = { toggleSecretUrlPanel }
					>
						<p>{ __( 'You can use automated script to keep your graph updated. Keep this URL private - it will allow everyone to update Roam Graph on your blog.', 'roam-block' ) }</p>
						<a href="https://deliber.at/roam/roam-api"><p>{ __( 'Instructions how to set up Roam-Research-Private-API to do so for you.', 'roam-block' ) }</p></a>
						<TextControl
							label="Secret Upload URL"
							value={ uploadURL }
						/>
					</PanelBody>
				</InspectorControls>
			}
			{  attributes.content && (
				<BlockControls>
					<Toolbar label="Options">
						<ToolbarButton isActive={ attributes.childrenListView === 'list' } icon={ formatListBullets } label="Display as a list" onClick={ () => setAttributes( {  childrenListView: ( attributes.childrenListView === 'list' ) ? 'document' : 'list' } ) } />
						<ToolbarButton isActive={ !! attributes.showHeader } icon={ heading } label="Include Parent" onClick={ () => setAttributes( {  showHeader: ! attributes.showHeader } ) } />
					</Toolbar>
				</BlockControls>
			) }
			{ ! attributes.uid && (
				<Placeholder label="Roam Block Embed">
					{ graphStatus === 'MISSING' && ( <Fragment>
						<Notice isDismissible={ false } status={ "warning" }>Your Roam graph is missing. Please export it from Roam and upload here:</Notice>
						<FormFileUpload
							isPrimary
							accept="application/json"
							onChange={ ( event ) =>
								upload( event.target.files.item( 0 ), setGraphStatus )
							}
						>
							{ __( 'Upload .json file from Roam Research export', 'roam-block' ) }
						</FormFileUpload>
					</Fragment> ) }
					{ graphStatus === 'OK' && ( <Fragment>
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
					</Fragment> ) }
					</Placeholder>
			) }
			{  attributes.content && ( <RawHTML>{ attributes.content }</RawHTML> ) }
		</div>
	);
}
