<?php
namespace Artpi\RoamBlock;
require_once  __DIR__ . '/Parsedown.php';

add_action(
	'rest_api_init',
	function () {
		register_rest_route(
			'roam-research',
			'/upload-graph',
			array(
				'methods'             => 'POST',
				'callback'            => __NAMESPACE__ . '\roam_update_graph',
				'permission_callback' => __NAMESPACE__ . '\check_permissions',
			)
		);
		register_rest_route(
			'roam-research',
			'/search_block',
			array(
				'methods'             => 'GET',
				'callback'            => __NAMESPACE__ . '\roam_search',
				'permission_callback' => __NAMESPACE__ . '\check_permissions',
			),
		);
	}
);

function check_permissions() {
	// Only for admins for time being
	return current_user_can( 'edit_posts' );
}

function roam_update_graph( \WP_REST_Request $request ) {
	$params = $request->get_params();
	update_option( 'roam_graph_content', $params['graphContent'] );
	update_option( 'roam_graph_name', $params['graphName'] );
	update_option( 'roam_graph_update', time() );
	return array( 'ok' => true );
}

function get_children_content( $node ) {
	$md_parser = new \Parsedown();
	$ret = '';
	if ( isset( $node['string'] ) ) {
		$ret .= $md_parser->line( $node['string'] );
	}
	if ( isset( $node['children'] ) ) {
		$ret .= '<ul>';
		foreach ( $node['children'] as $child ) {
			$ret .= '<li>' . get_children_content( $child ) . '</li>';
		}
		$ret .= '</ul>';
	}
	return $ret;
}

function search_roam_graph( $node, $search, $title = '', $results = [], $parent = [] ) {
	$md_parser = new \Parsedown();
	if ( isset( $node['string'] ) && (
		stristr( $node['string'], $search ) || (
			isset( $parent['title'] ) &&
			stristr( $parent['title'], $search )
		)
	) ) {
		$results = array_merge(
			$results,
			[
				[
					'title' => $title,
					'snippet' => strip_tags( $md_parser->line( $node['string'] ) ),
					'content' => get_children_content( $node ),
					'uid' => $node['uid'],
				],
			]
		);
	}
	$nodes = array();
	if ( is_array( $node ) ) {
		$nodes = $node;
	} elseif ( isset( $node['children'] ) && is_array( $node['children'] ) ) {
		$nodes = $node['children'];
	}
	foreach ( $nodes as $child ) {
		$item_title = $title;
		if ( ! $title && $child['title'] ) {
			$item_title = $child['title'];
		}
		$results = search_roam_graph( $child, $search, $item_title, $results, $node );
	}
	return $results;
}

function roam_search( \WP_REST_Request $request ) {
	$params = $request->get_params();
	$search = $params['q'];
	$graph = json_decode( get_option( 'roam_graph_content' ), true );
	$results = search_roam_graph( $graph, $search, '', array(), array() );
	return $results;
}

function find_block_by_uid( $uid, $nodes ) {
	foreach ( $nodes as $child ) {
		if ( isset( $child['uid'] ) && $child['uid'] === $uid ) {
			return $child;
		}
		if ( !isset( $child['children'] ) || ! $child['children'] ) {
			return false;
		}
		$found = find_block_by_uid( $uid, $child['children'] );
		if ( $found ) {
			return $found;
		}
	}
	return false;
}

function render_block( $attributes, $content ) {
	$block = find_block_by_uid( $attributes['uid'], json_decode( get_option( 'roam_graph_content' ), true ) );
	if ( ! $block ) {
		return $content;
	}
	return '<div class="wp-block-artpi-roam-block">' . get_children_content( $block ) . '</div>';
}
