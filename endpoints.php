<?php
add_action(
	'rest_api_init',
	function () {
		register_rest_route(
			'roam-research',
			'/upload-graph',
			array(
				'methods'             => 'POST',
				'callback'            => 'roam_update_graph',
				'permission_callback' => function () {
					// Only for admins for time being
					return current_user_can( 'edit_posts' );
				},
			)
		);
	}
);

function roam_update_graph( WP_REST_Request $request ) {
	$params = $request->get_params();
	update_option( 'roam_graph_content', $params['graphContent'] );
	update_option( 'roam_graph_name', $params['graphName'] );
	return array( 'ok' => true );
}
