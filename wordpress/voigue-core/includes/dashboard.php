<?php
/**
 * The admin Dashboard: a "Voigue at a glance" panel for everyone, and a clean slate for the Talent Acquisition team.
 *
 * @package Voigue_Core
 */

defined( 'ABSPATH' ) || exit;

/**
 * How many applications nobody has reviewed yet.
 *
 * @return int
 */
function voigue_count_new_applications() {
	$query = new WP_Query(
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
	return (int) $query->found_posts;
}

function voigue_register_dashboard_widget() {
	// Only people who can work with applications (administrators and the Talent Acquisition team) see the panel.
	if ( ! current_user_can( get_post_type_object( VOIGUE_APPLICATION_TYPE )->cap->edit_posts ) ) {
		return;
	}
	wp_add_dashboard_widget( 'voigue_glance', 'Voigue at a glance', 'voigue_render_dashboard_widget' );

	// The Talent Acquisition team only needs the Voigue panel, not WordPress news and site tips.
	if ( voigue_is_ta_user() ) {
		foreach ( array( 'dashboard_primary', 'dashboard_secondary', 'dashboard_quick_press', 'dashboard_site_health', 'dashboard_right_now', 'dashboard_activity', 'dashboard_php_nag' ) as $widget ) {
			remove_meta_box( $widget, 'dashboard', 'normal' );
			remove_meta_box( $widget, 'dashboard', 'side' );
		}
		remove_action( 'welcome_panel', 'wp_welcome_panel' );
	}
}
add_action( 'wp_dashboard_setup', 'voigue_register_dashboard_widget' );

function voigue_render_dashboard_widget() {
	$new      = voigue_count_new_applications();
	$vacancy  = (int) wp_count_posts( VOIGUE_JOB_TYPE )->publish;
	$messages = (int) wp_count_posts( VOIGUE_MESSAGE_TYPE )->publish;
	$recent   = get_posts(
		array(
			'post_type'      => VOIGUE_APPLICATION_TYPE,
			'post_status'    => 'publish',
			'posts_per_page' => 5,
			'orderby'        => 'date',
			'order'          => 'DESC',
		)
	);
	$tiles    = array(
		array( $new, 'New applications', 'edit.php?post_type=' . VOIGUE_APPLICATION_TYPE . '&voigue_status=New' ),
		array( $vacancy, 'Open vacancies', 'edit.php?post_type=' . VOIGUE_JOB_TYPE ),
		array( $messages, 'Messages', 'edit.php?post_type=' . VOIGUE_MESSAGE_TYPE ),
	);
	?>
	<div style="display:grid; grid-template-columns:repeat(3,1fr); gap:12px;">
		<?php foreach ( $tiles as $tile ) : ?>
			<a href="<?php echo esc_url( admin_url( $tile[2] ) ); ?>" style="display:block; padding:14px; border:1px solid #dcdcde; border-radius:8px; text-decoration:none; text-align:center;">
				<span style="display:block; font-size:28px; font-weight:600; line-height:1.1; color:#1d2327;"><?php echo esc_html( (string) $tile[0] ); ?></span>
				<span style="color:#50575e;"><?php echo esc_html( $tile[1] ); ?></span>
			</a>
		<?php endforeach; ?>
	</div>

	<h3 style="margin:18px 0 8px;">Latest applications</h3>
	<?php if ( $recent ) : ?>
		<ul style="margin:0;">
			<?php foreach ( $recent as $application ) : ?>
				<li style="display:flex; justify-content:space-between; gap:12px; padding:6px 0; border-top:1px solid #f0f0f1;">
					<span>
						<a href="<?php echo esc_url( get_edit_post_link( $application->ID ) ); ?>"><strong><?php echo esc_html( $application->post_title ); ?></strong></a><br>
						<span class="description">
							<?php echo esc_html( 'general' === get_post_meta( $application->ID, '_voigue_type', true ) ? 'General CV' : (string) get_post_meta( $application->ID, '_voigue_job_title', true ) ); ?>
						</span>
					</span>
					<span class="description"><?php echo esc_html( voigue_application_status( $application->ID ) ); ?></span>
				</li>
			<?php endforeach; ?>
		</ul>
	<?php else : ?>
		<p class="description">No applications yet.</p>
	<?php endif; ?>

	<p style="margin-top:16px; display:flex; flex-wrap:wrap; gap:8px;">
		<a class="button button-primary" href="<?php echo esc_url( admin_url( 'post-new.php?post_type=' . VOIGUE_JOB_TYPE ) ); ?>">Add a vacancy</a>
		<a class="button" href="<?php echo esc_url( admin_url( 'edit.php?post_type=' . VOIGUE_APPLICATION_TYPE ) ); ?>">Review applications</a>
		<a class="button" href="<?php echo esc_url( admin_url( 'post-new.php?post_type=' . VOIGUE_MOMENT_TYPE ) ); ?>">Add a gallery photo</a>
	</p>
	<?php
}

/**
 * Status badges on the Dashboard use the plugin's admin stylesheet.
 *
 * @param string $hook Current admin page hook.
 */
function voigue_dashboard_assets( $hook ) {
	if ( 'index.php' === $hook ) {
		wp_enqueue_style( 'voigue-admin', VOIGUE_CORE_URL . 'assets/admin.css', array(), VOIGUE_CORE_VERSION );
	}
}
add_action( 'admin_enqueue_scripts', 'voigue_dashboard_assets' );

/* ---------- Bulk status changes on the Applications list ---------- */

/**
 * @param array<string,string> $actions Existing bulk actions.
 * @return array<string,string>
 */
function voigue_application_bulk_actions( $actions ) {
	foreach ( voigue_application_statuses() as $status ) {
		$actions[ 'voigue_status_' . sanitize_key( $status ) ] = 'Mark as ' . $status;
	}
	return $actions;
}
add_filter( 'bulk_actions-edit-' . VOIGUE_APPLICATION_TYPE, 'voigue_application_bulk_actions' );

/**
 * @param string $redirect Where to go afterwards.
 * @param string $action   The chosen bulk action.
 * @param int[]  $post_ids Selected applications.
 * @return string
 */
function voigue_application_handle_bulk( $redirect, $action, $post_ids ) {
	if ( 0 !== strpos( $action, 'voigue_status_' ) ) {
		return $redirect;
	}
	$chosen = '';
	foreach ( voigue_application_statuses() as $status ) {
		if ( 'voigue_status_' . sanitize_key( $status ) === $action ) {
			$chosen = $status;
		}
	}
	if ( '' === $chosen ) {
		return $redirect;
	}
	$changed = 0;
	foreach ( $post_ids as $post_id ) {
		if ( VOIGUE_APPLICATION_TYPE === get_post_type( $post_id ) && current_user_can( 'edit_post', $post_id ) ) {
			update_post_meta( $post_id, '_voigue_status', $chosen );
			++$changed;
		}
	}
	return add_query_arg(
		array(
			'voigue_bulk_status' => rawurlencode( $chosen ),
			'voigue_bulk_count'  => $changed,
		),
		$redirect
	);
}
add_filter( 'handle_bulk_actions-edit-' . VOIGUE_APPLICATION_TYPE, 'voigue_application_handle_bulk', 10, 3 );

function voigue_application_bulk_notice() {
	if ( empty( $_GET['voigue_bulk_status'] ) || ! isset( $_GET['voigue_bulk_count'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification.Recommended -- read-only notice.
		return;
	}
	$status = sanitize_text_field( rawurldecode( wp_unslash( $_GET['voigue_bulk_status'] ) ) ); // phpcs:ignore WordPress.Security.NonceVerification.Recommended
	$count  = absint( $_GET['voigue_bulk_count'] ); // phpcs:ignore WordPress.Security.NonceVerification.Recommended
	if ( ! in_array( $status, voigue_application_statuses(), true ) ) {
		return;
	}
	printf(
		'<div class="notice notice-success is-dismissible"><p>%s</p></div>',
		esc_html( sprintf( '%1$d %2$s marked as %3$s.', $count, 1 === $count ? 'application' : 'applications', $status ) )
	);
}
add_action( 'admin_notices', 'voigue_application_bulk_notice' );
