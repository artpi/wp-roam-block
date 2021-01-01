<?php
namespace Artpi\RoamBlock;

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

function traverse_roam_graph( $node, $search, $results = [] ) {
	if ( isset( $node['string'] ) && stristr( $node['string'], $search ) ) {
		$results = array_merge(
			$results,
			[
				[
					'content' => $node['string'],
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
		$results = traverse_roam_graph( $child, $search, $results );
	}
	return $results;
}

function roam_search( \WP_REST_Request $request ) {
	$params = $request->get_params();
	$search = $params['q'];
	$graph = json_decode( get_option( 'roam_graph_content' ), true );
	return traverse_roam_graph( $graph, $search, array() );
}
