<?php
/**
 * Applications: the post type, the admin screens, status tracking and the (admin-only) CV download.
 *
 * @package Voigue_Core
 */

defined( 'ABSPATH' ) || exit;

const VOIGUE_APPLICATION_TYPE = 'voigue_application';

/**
 * @return string[] Review stages, in order.
 */
function voigue_application_statuses() {
	return array( 'New', 'Reviewing', 'Shortlisted', 'Interview', 'Rejected', 'Hired' );
}

function voigue_register_application_type() {
	register_post_type(
		VOIGUE_APPLICATION_TYPE,
		array(
			'labels'          => array(
				'name'               => 'Applications',
				'singular_name'      => 'Application',
				'edit_item'          => 'Application',
				'search_items'       => 'Search applications',
				'not_found'          => 'No applications yet',
				'not_found_in_trash' => 'No applications in the bin',
				'menu_name'          => 'Applications',
				'all_items'          => 'All applications',
			),
			'public'          => false,
			'show_ui'         => true,
			'show_in_menu'    => true,
			'show_in_rest'    => false,
			'menu_position'   => 20,
			'menu_icon'       => 'dashicons-id-alt',
			'supports'        => array( 'title' ),
			'rewrite'         => false,
			// The "Add new" screen is blocked in roles.php; keeping the permission lets WordPress build the admin menu correctly.
			'capability_type' => array( 'voigue_application', 'voigue_applications' ),
			'map_meta_cap'    => true,
		)
	);
}
add_action( 'init', 'voigue_register_application_type' );

/**
 * @param int $post_id Application ID.
 * @return string
 */
function voigue_application_status( $post_id ) {
	$status = (string) get_post_meta( $post_id, '_voigue_status', true );
	return in_array( $status, voigue_application_statuses(), true ) ? $status : 'New';
}

/**
 * Signed download link for an application's CV (only works for signed-in users who may edit applications).
 *
 * @param int $post_id Application ID.
 * @return string
 */
function voigue_cv_download_url( $post_id ) {
	return wp_nonce_url( admin_url( 'admin-post.php?action=voigue_download_cv&id=' . (int) $post_id ), 'voigue_cv_' . (int) $post_id );
}

/* ---------- Edit screen ---------- */

function voigue_application_meta_boxes() {
	add_meta_box( 'voigue_application_details', 'Application', 'voigue_render_application_box', VOIGUE_APPLICATION_TYPE, 'normal', 'high' );
	add_meta_box( 'voigue_application_status', 'Review status', 'voigue_render_application_status_box', VOIGUE_APPLICATION_TYPE, 'side', 'high' );
}
add_action( 'add_meta_boxes', 'voigue_application_meta_boxes' );

/**
 * @param WP_Post $post The application being viewed.
 */
function voigue_render_application_box( $post ) {
	$type  = (string) get_post_meta( $post->ID, '_voigue_type', true );
	$email = (string) get_post_meta( $post->ID, '_voigue_email', true );
	$file  = (string) get_post_meta( $post->ID, '_voigue_cv_file', true );
	$name  = (string) get_post_meta( $post->ID, '_voigue_cv_name', true );

	echo '<table class="form-table" role="presentation">';
	echo '<tr><th scope="row">Name</th><td>' . esc_html( $post->post_title ) . '</td></tr>';
	echo '<tr><th scope="row">Email</th><td><a href="mailto:' . esc_attr( $email ) . '">' . esc_html( $email ) . '</a></td></tr>';
	if ( 'general' === $type ) {
		echo '<tr><th scope="row">Type</th><td>General CV</td></tr>';
		echo '<tr><th scope="row">Interested in</th><td>' . esc_html( (string) get_post_meta( $post->ID, '_voigue_role_interest', true ) ) . '</td></tr>';
		echo '<tr><th scope="row">Preferred setup</th><td>' . esc_html( (string) get_post_meta( $post->ID, '_voigue_preferred_setup', true ) ) . '</td></tr>';
	} else {
		echo '<tr><th scope="row">Applied for</th><td>' . esc_html( (string) get_post_meta( $post->ID, '_voigue_job_title', true ) ) . '</td></tr>';
	}
	echo '<tr><th scope="row">Received</th><td>' . esc_html( get_the_date( 'j F Y, g:i a', $post ) ) . '</td></tr>';
	echo '<tr><th scope="row">Message</th><td style="white-space: pre-line;">' . esc_html( (string) get_post_meta( $post->ID, '_voigue_message', true ) ) . '</td></tr>';
	echo '<tr><th scope="row">CV</th><td>';
	if ( $file && is_file( voigue_private_dir() . '/cvs/' . basename( $file ) ) ) {
		echo '<a class="button button-primary" href="' . esc_url( voigue_cv_download_url( $post->ID ) ) . '">Download CV</a> <span class="description">' . esc_html( $name ) . ' (' . esc_html( size_format( (int) get_post_meta( $post->ID, '_voigue_cv_size', true ) ) ) . ')</span>';
	} else {
		echo '<span class="description">The CV file is not available.</span>';
	}
	echo '</td></tr></table>';
}

/**
 * @param WP_Post $post The application being viewed.
 */
function voigue_render_application_status_box( $post ) {
	wp_nonce_field( 'voigue_save_application', 'voigue_application_nonce' );
	$current = voigue_application_status( $post->ID );
	echo '<p><select name="voigue_status" style="width:100%">';
	foreach ( voigue_application_statuses() as $status ) {
		printf( '<option value="%1$s"%2$s>%1$s</option>', esc_attr( $status ), selected( $current, $status, false ) );
	}
	echo '</select></p><p class="description">Click <strong>Update</strong> to save the status.</p>';
}

/**
 * @param int $post_id Application being saved.
 */
function voigue_save_application( $post_id ) {
	if ( ! isset( $_POST['voigue_application_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['voigue_application_nonce'] ) ), 'voigue_save_application' ) ) {
		return;
	}
	if ( ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) || ! current_user_can( 'edit_post', $post_id ) ) {
		return;
	}
	$status = isset( $_POST['voigue_status'] ) ? sanitize_text_field( wp_unslash( $_POST['voigue_status'] ) ) : 'New';
	update_post_meta( $post_id, '_voigue_status', in_array( $status, voigue_application_statuses(), true ) ? $status : 'New' );
}
add_action( 'save_post_' . VOIGUE_APPLICATION_TYPE, 'voigue_save_application' );

/* ---------- Admin list ---------- */

/**
 * @param array<string,string> $columns Existing columns.
 * @return array<string,string>
 */
function voigue_application_columns( $columns ) {
	return array(
		'cb'               => $columns['cb'],
		'title'            => 'Name',
		'voigue_for'       => 'Applied for',
		'voigue_status'    => 'Status',
		'voigue_cv'        => 'CV',
		'date'             => 'Received',
	);
}
add_filter( 'manage_' . VOIGUE_APPLICATION_TYPE . '_posts_columns', 'voigue_application_columns' );

/**
 * @param string $column  Column key.
 * @param int    $post_id Application ID.
 */
function voigue_application_column( $column, $post_id ) {
	if ( 'voigue_for' === $column ) {
		$type = (string) get_post_meta( $post_id, '_voigue_type', true );
		if ( 'general' === $type ) {
			echo '<em>General CV</em><br>' . esc_html( (string) get_post_meta( $post_id, '_voigue_role_interest', true ) ) . ' &middot; ' . esc_html( (string) get_post_meta( $post_id, '_voigue_preferred_setup', true ) );
		} else {
			echo esc_html( (string) get_post_meta( $post_id, '_voigue_job_title', true ) );
		}
	} elseif ( 'voigue_status' === $column ) {
		$status = voigue_application_status( $post_id );
		$class  = array(
			'New'         => 'warn',
			'Reviewing'   => 'warn',
			'Shortlisted' => 'ok',
			'Interview'   => 'ok',
			'Hired'       => 'ok',
			'Rejected'    => 'bad',
		);
		echo '<span class="voigue-badge ' . esc_attr( $class[ $status ] ) . '">' . esc_html( $status ) . '</span>';
	} elseif ( 'voigue_cv' === $column ) {
		$file = (string) get_post_meta( $post_id, '_voigue_cv_file', true );
		if ( $file && current_user_can( 'edit_post', $post_id ) ) {
			echo '<a href="' . esc_url( voigue_cv_download_url( $post_id ) ) . '">Download</a>';
		} else {
			echo '&mdash;';
		}
	}
}
add_action( 'manage_' . VOIGUE_APPLICATION_TYPE . '_posts_custom_column', 'voigue_application_column', 10, 2 );

/**
 * Status filter above the list.
 *
 * @param string $post_type Current post type.
 */
function voigue_application_filter( $post_type ) {
	if ( VOIGUE_APPLICATION_TYPE !== $post_type ) {
		return;
	}
	$current = isset( $_GET['voigue_status'] ) ? sanitize_text_field( wp_unslash( $_GET['voigue_status'] ) ) : ''; // phpcs:ignore WordPress.Security.NonceVerification.Recommended -- read-only list filter.
	echo '<select name="voigue_status"><option value="">All statuses</option>';
	foreach ( voigue_application_statuses() as $status ) {
		printf( '<option value="%1$s"%2$s>%1$s</option>', esc_attr( $status ), selected( $current, $status, false ) );
	}
	echo '</select>';
}
add_action( 'restrict_manage_posts', 'voigue_application_filter' );

/**
 * @param WP_Query $query The admin list query.
 */
function voigue_application_filter_query( $query ) {
	if ( ! is_admin() || ! $query->is_main_query() || VOIGUE_APPLICATION_TYPE !== $query->get( 'post_type' ) ) {
		return;
	}
	$status = isset( $_GET['voigue_status'] ) ? sanitize_text_field( wp_unslash( $_GET['voigue_status'] ) ) : ''; // phpcs:ignore WordPress.Security.NonceVerification.Recommended -- read-only list filter.
	if ( ! in_array( $status, voigue_application_statuses(), true ) ) {
		return;
	}
	if ( 'New' === $status ) {
		// Applications saved before a status was ever chosen count as New.
		$query->set(
			'meta_query', // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_query
			array(
				'relation' => 'OR',
				array(
					'key'     => '_voigue_status',
					'value'   => 'New',
				),
				array(
					'key'     => '_voigue_status',
					'compare' => 'NOT EXISTS',
				),
			)
		);
	} else {
		$query->set(
			'meta_query', // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_query
			array(
				array(
					'key'   => '_voigue_status',
					'value' => $status,
				),
			)
		);
	}
}
add_action( 'pre_get_posts', 'voigue_application_filter_query' );

/**
 * A count bubble on the Applications menu for applications nobody has reviewed yet.
 */
function voigue_application_menu_bubble() {
	global $menu;
	$new = new WP_Query(
		array(
			'post_type'      => VOIGUE_APPLICATION_TYPE,
			'post_status'    => 'publish',
			'posts_per_page' => 1,
			'fields'         => 'ids',
			'meta_query'     => array( // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_query
				'relation' => 'OR',
				array(
					'key'   => '_voigue_status',
					'value' => 'New',
				),
				array(
					'key'     => '_voigue_status',
					'compare' => 'NOT EXISTS',
				),
			),
		)
	);
	if ( ! $new->found_posts || ! is_array( $menu ) ) {
		return;
	}
	foreach ( $menu as $key => $item ) {
		if ( isset( $item[2] ) && 'edit.php?post_type=' . VOIGUE_APPLICATION_TYPE === $item[2] ) {
			$menu[ $key ][0] .= ' <span class="awaiting-mod">' . (int) $new->found_posts . '</span>'; // phpcs:ignore WordPress.WP.GlobalVariablesOverride.Prohibited
			break;
		}
	}
}
add_action( 'admin_menu', 'voigue_application_menu_bubble', 99 );

/* ---------- CV download and clean-up ---------- */

function voigue_handle_cv_download() {
	$id = isset( $_GET['id'] ) ? absint( $_GET['id'] ) : 0;
	check_admin_referer( 'voigue_cv_' . $id );

	if ( ! $id || VOIGUE_APPLICATION_TYPE !== get_post_type( $id ) || ! current_user_can( 'edit_post', $id ) ) {
		wp_die( 'You do not have permission to download this file.', 403 );
	}

	$stored = basename( (string) get_post_meta( $id, '_voigue_cv_file', true ) );
	$path   = voigue_private_dir() . '/cvs/' . $stored;
	if ( ! $stored || ! is_file( $path ) ) {
		wp_die( 'This CV file could not be found.', 404 );
	}

	$download_name = sanitize_file_name( (string) get_post_meta( $id, '_voigue_cv_name', true ) );
	nocache_headers();
	header( 'Content-Type: ' . ( get_post_meta( $id, '_voigue_cv_mime', true ) ?: 'application/octet-stream' ) );
	header( 'Content-Disposition: attachment; filename="' . ( $download_name ?: 'cv' ) . '"' );
	header( 'Content-Length: ' . filesize( $path ) );
	header( 'X-Content-Type-Options: nosniff' );
	readfile( $path ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_system_operations_readfile
	exit;
}
add_action( 'admin_post_voigue_download_cv', 'voigue_handle_cv_download' );

/**
 * Signed-out visitors who reach a CV link are sent to the login screen and never see the file.
 */
function voigue_handle_cv_download_signed_out() {
	wp_safe_redirect( wp_login_url() );
	exit;
}
add_action( 'admin_post_nopriv_voigue_download_cv', 'voigue_handle_cv_download_signed_out' );

/**
 * Deleting an application also deletes its CV file.
 *
 * @param int $post_id Post being deleted.
 */
function voigue_delete_application_cv( $post_id ) {
	if ( VOIGUE_APPLICATION_TYPE !== get_post_type( $post_id ) ) {
		return;
	}
	$stored = basename( (string) get_post_meta( $post_id, '_voigue_cv_file', true ) );
	if ( $stored ) {
		$path = voigue_private_dir() . '/cvs/' . $stored;
		if ( is_file( $path ) ) {
			wp_delete_file( $path );
		}
	}
}
add_action( 'before_delete_post', 'voigue_delete_application_cv' );

/**
 * Status badges on the applications list use the plugin's admin stylesheet.
 */
function voigue_application_assets() {
	$screen = function_exists( 'get_current_screen' ) ? get_current_screen() : null;
	if ( $screen && VOIGUE_APPLICATION_TYPE === $screen->post_type ) {
		wp_enqueue_style( 'voigue-admin', VOIGUE_CORE_URL . 'assets/admin.css', array(), VOIGUE_CORE_VERSION );
	}
}
add_action( 'admin_enqueue_scripts', 'voigue_application_assets' );

/**
 * The review screen is for reading an application, not for editing its web address.
 */
function voigue_application_remove_slug_box() {
	remove_meta_box( 'slugdiv', VOIGUE_APPLICATION_TYPE, 'normal' );
}
add_action( 'add_meta_boxes', 'voigue_application_remove_slug_box', 20 );
