<?php
/**
 * Plugin Name:     Roam Research Block
 * Description:     Embed Roam Blocks or pages in WordPress, just as you would in Roam
 * Version:         0.1.0
 * Author:          Artur Piszek (artpi)
 * Author URI:      https://piszek.com
 * License:         GPL-2.0-or-later
 * License URI:     https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:     roam-block
 *
 * @package         artpi
 */

/**
 * Registers all block assets so that they can be enqueued through the block editor
 * in the corresponding context.
 *
 * @see https://developer.wordpress.org/block-editor/tutorials/block-tutorial/applying-styles-with-stylesheets/
 */
function artpi_roam_block_block_init() {
	$dir = __DIR__;

	$script_asset_path = "$dir/build/index.asset.php";
	if ( ! file_exists( $script_asset_path ) ) {
		throw new Error(
			'You need to run `npm start` or `npm run build` for the "artpi/roam-block" block first.'
		);
	}
	$index_js     = 'build/index.js';
	$script_asset = require $script_asset_path;
	wp_register_script(
		'artpi-roam-block-block-editor',
		plugins_url( $index_js, __FILE__ ),
		$script_asset['dependencies'],
		$script_asset['version']
	);
	wp_set_script_translations( 'artpi-roam-block-block-editor', 'roam-block' );

	$editor_css = 'build/index.css';
	wp_register_style(
		'artpi-roam-block-block-editor',
		plugins_url( $editor_css, __FILE__ ),
		array(),
		filemtime( "$dir/$editor_css" )
	);

	$style_css = 'build/style-index.css';
	wp_register_style(
		'artpi-roam-block-block',
		plugins_url( $style_css, __FILE__ ),
		array(),
		filemtime( "$dir/$style_css" )
	);

	register_block_type(
		'artpi/roam-block',
		array(
			'editor_script'   => 'artpi-roam-block-block-editor',
			'editor_style'    => 'artpi-roam-block-block-editor',
			'style'           => 'artpi-roam-block-block',
			'render_callback' => 'Artpi\RoamBlock\render_block',
		)
	);
	require_once __DIR__ . '/endpoints.php';
}
add_action( 'init', 'artpi_roam_block_block_init' );
