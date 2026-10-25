<?php
/**
 * The "Talent Acquisition" role: can run vacancies, applications, messages, employee voices and the gallery,
 * and nothing else (no pages, posts, theme, plugins, users or settings).
 *
 * Each Voigue content type has its own permissions (see the capability_type of each post type), so giving the
 * Talent Acquisition team access to them never gives access to the rest of the website.
 *
 * @package Voigue_Core
 */

defined( 'ABSPATH' ) || exit;

const VOIGUE_TA_ROLE = 'voigue_ta';

/**
 * Post types the Talent Acquisition team manages.
 *
 * @return string[]
 */
function voigue_managed_post_types() {
	return array( VOIGUE_JOB_TYPE, VOIGUE_VOICE_TYPE, VOIGUE_MOMENT_TYPE, VOIGUE_MESSAGE_TYPE, VOIGUE_APPLICATION_TYPE );
}

/**
 * Every permission those post types use (generated from the types themselves, so it can never drift out of date).
 *
 * @return string[]
 */
function voigue_content_caps() {
	$caps = array();
	foreach ( voigue_managed_post_types() as $type ) {
		$object = get_post_type_object( $type );
		if ( ! $object ) {
			continue;
		}
		foreach ( (array) $object->cap as $key => $cap ) {
			if ( in_array( $key, array( 'edit_post', 'read_post', 'delete_post' ), true ) || 'do_not_allow' === $cap ) {
				continue;
			}
			$caps[ $cap ] = true;
		}
	}
	return array_keys( $caps );
}

/**
 * Creates or refreshes the role, and gives administrators the same permissions. Runs once per plugin version.
 */
function voigue_sync_roles() {
	if ( VOIGUE_CORE_VERSION === get_option( 'voigue_roles_version' ) ) {
		return;
	}
	$caps = voigue_content_caps();

	$admin = get_role( 'administrator' );
	if ( $admin ) {
		foreach ( $caps as $cap ) {
			$admin->add_cap( $cap );
		}
	}

	$grants = array(
		'read'         => true,
		'upload_files' => true,
	);
	foreach ( $caps as $cap ) {
		$grants[ $cap ] = true;
	}
	remove_role( VOIGUE_TA_ROLE );
	add_role( VOIGUE_TA_ROLE, 'Talent Acquisition', $grants );

	update_option( 'voigue_roles_version', VOIGUE_CORE_VERSION );
}
add_action( 'init', 'voigue_sync_roles', 20 );

/**
 * @param WP_User|null $user User to test (defaults to the signed-in user).
 * @return bool Whether the user is a Talent Acquisition team member and not an administrator.
 */
function voigue_is_ta_user( $user = null ) {
	$user = $user ? $user : wp_get_current_user();
	return $user && $user->exists() && in_array( VOIGUE_TA_ROLE, (array) $user->roles, true ) && ! user_can( $user, 'manage_options' );
}

/**
 * After signing in, the Talent Acquisition team lands on the applications, which is what they open the site for.
 *
 * @param string           $redirect_to           Where WordPress would send the user.
 * @param string           $requested_redirect_to Where the user asked to go.
 * @param WP_User|WP_Error $user                  The signed-in user.
 * @return string
 */
function voigue_ta_login_redirect( $redirect_to, $requested_redirect_to, $user ) {
	if ( $user instanceof WP_User && voigue_is_ta_user( $user ) ) {
		$asked_for_nothing = '' === $requested_redirect_to || untrailingslashit( $requested_redirect_to ) === untrailingslashit( admin_url() );
		if ( $asked_for_nothing ) {
			return admin_url( 'edit.php?post_type=' . VOIGUE_APPLICATION_TYPE );
		}
	}
	return $redirect_to;
}
add_filter( 'login_redirect', 'voigue_ta_login_redirect', 10, 3 );

/**
 * The Talent Acquisition team has nothing to edit on the public site, so skip the toolbar there.
 *
 * @param bool $show Whether WordPress would show the toolbar.
 * @return bool
 */
function voigue_ta_hide_admin_bar( $show ) {
	return voigue_is_ta_user() ? false : $show;
}
add_filter( 'show_admin_bar', 'voigue_ta_hide_admin_bar' );

/**
 * Applications and messages are created only by the website's forms. Their "Add new" screen is switched off
 * (and hidden) rather than removed, because WordPress needs the menu entry to decide who may open the list.
 */
function voigue_block_manual_creation() {
	$type = isset( $_GET['post_type'] ) ? sanitize_key( wp_unslash( $_GET['post_type'] ) ) : ''; // phpcs:ignore WordPress.Security.NonceVerification.Recommended -- read-only check.
	if ( in_array( $type, array( VOIGUE_APPLICATION_TYPE, VOIGUE_MESSAGE_TYPE ), true ) ) {
		wp_die(
			esc_html( 'This entry is created automatically when someone submits the form on the website, so it cannot be added by hand.' ),
			esc_html( 'Not available' ),
			array(
				'response'  => 403,
				'back_link' => true,
			)
		);
	}
}
add_action( 'load-post-new.php', 'voigue_block_manual_creation' );

function voigue_hide_manual_creation_links() {
	echo '<style>
		#adminmenu li:has(> a[href="post-new.php?post_type=' . esc_attr( VOIGUE_APPLICATION_TYPE ) . '"]),
		#adminmenu li:has(> a[href="post-new.php?post_type=' . esc_attr( VOIGUE_MESSAGE_TYPE ) . '"]),
		body.post-type-' . esc_attr( VOIGUE_APPLICATION_TYPE ) . ' .page-title-action,
		body.post-type-' . esc_attr( VOIGUE_MESSAGE_TYPE ) . ' .page-title-action { display: none !important; }
	</style>';
}
add_action( 'admin_head', 'voigue_hide_manual_creation_links' );
