<?php
/**
 * "Voigue > Health check": one page that tells the IT team whether the site is set up correctly.
 *
 * @package Voigue_Core
 */

defined( 'ABSPATH' ) || exit;

/**
 * @return array<int,array{label:string,status:string,detail:string}> status is ok, warn or bad.
 */
function voigue_health_checks() {
	$checks = array();
	$add    = static function ( $label, $status, $detail ) use ( &$checks ) {
		$checks[] = array(
			'label'  => $label,
			'status' => $status,
			'detail' => $detail,
		);
	};

	$add( 'PHP version', version_compare( PHP_VERSION, '8.0', '>=' ) ? 'ok' : 'bad', 'Running PHP ' . PHP_VERSION . '. PHP 8.0 or newer is required (8.1+ recommended).' );

	global $wp_version;
	$add( 'WordPress version', version_compare( $wp_version, '6.2', '>=' ) ? 'ok' : 'bad', 'Running WordPress ' . $wp_version . '. 6.2 or newer is required.' );

	$theme = wp_get_theme();
	$add( 'Voigue theme active', 'voigue-theme' === $theme->get_stylesheet() ? 'ok' : 'bad', 'Active theme: ' . $theme->get( 'Name' ) . '.' );

	$front_ok = 'page' === get_option( 'show_on_front' ) && (int) get_option( 'page_on_front' ) > 0;
	$add( 'Home page set', $front_ok ? 'ok' : 'warn', $front_ok ? 'A static page is used as the home page.' : 'Settings > Reading should use a static page called "Home".' );

	$menus = get_nav_menu_locations();
	$add( 'Main menu assigned', ! empty( $menus['primary'] ) ? 'ok' : 'warn', ! empty( $menus['primary'] ) ? 'A menu is assigned to the main navigation.' : 'Appearance > Menus: assign a menu to "Main menu".' );

	$add( 'Pretty web addresses', get_option( 'permalink_structure' ) ? 'ok' : 'warn', get_option( 'permalink_structure' ) ? 'Permalinks are set (' . get_option( 'permalink_structure' ) . ').' : 'Settings > Permalinks: choose "Post name".' );

	$upload_max = wp_max_upload_size();
	$add( 'File upload limit', $upload_max >= 5 * MB_IN_BYTES ? 'ok' : 'bad', 'Largest file the server accepts: ' . size_format( $upload_max ) . '. CVs can be up to 4 MB, so this must be at least 5 MB.' );

	$memory = wp_convert_hr_to_bytes( WP_MEMORY_LIMIT );
	$add( 'PHP memory', $memory >= 128 * MB_IN_BYTES ? 'ok' : 'warn', 'WordPress memory limit: ' . size_format( $memory ) . '. 128 MB or more is recommended.' );

	$add( 'HTTPS', is_ssl() ? 'ok' : 'warn', is_ssl() ? 'The site is served over HTTPS.' : 'The site is not on HTTPS. Candidates upload CVs, so HTTPS is required on the live site.' );

	$count = wp_count_posts( VOIGUE_JOB_TYPE );
	$live  = isset( $count->publish ) ? (int) $count->publish : 0;
	$add( 'Published vacancies', $live > 0 ? 'ok' : 'warn', $live . ' published. The Careers section shows a friendly message when there are none.' );

	return $checks;
}

function voigue_health_menu() {
	add_submenu_page( 'voigue', 'Health check', 'Health check', 'manage_options', 'voigue-health', 'voigue_render_health_page' );
}
add_action( 'admin_menu', 'voigue_health_menu' );

/**
 * @param string $hook Current admin page hook.
 */
function voigue_health_assets( $hook ) {
	if ( 'voigue_page_voigue-health' === $hook ) {
		wp_enqueue_style( 'voigue-admin', VOIGUE_CORE_URL . 'assets/admin.css', array(), VOIGUE_CORE_VERSION );
	}
}
add_action( 'admin_enqueue_scripts', 'voigue_health_assets' );

function voigue_handle_test_email() {
	if ( ! current_user_can( 'manage_options' ) ) {
		wp_die( 'You do not have permission to do this.', 403 );
	}
	check_admin_referer( 'voigue_test_email' );

	$user = wp_get_current_user();
	$sent = wp_mail( $user->user_email, 'Voigue website test email', "This is a test email from the Voigue website.\n\nIf you can read this, the site can send email." );
	$msg  = $sent
		? 'Test email handed to the mail system for ' . $user->user_email . '. Check the inbox and the spam folder. If nothing arrives, install an SMTP plugin.'
		: 'The test email could not be sent. Install and configure an SMTP plugin.';
	set_transient( 'voigue_notice_' . get_current_user_id(), $msg, 60 );
	wp_safe_redirect( admin_url( 'admin.php?page=voigue-health' ) );
	exit;
}
add_action( 'admin_post_voigue_test_email', 'voigue_handle_test_email' );

function voigue_render_health_page() {
	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}
	$notice_key = 'voigue_notice_' . get_current_user_id();
	$notice     = get_transient( $notice_key );
	if ( $notice ) {
		delete_transient( $notice_key );
	}
	$labels = array(
		'ok'   => 'OK',
		'warn' => 'Check',
		'bad'  => 'Fix this',
	);
	?>
	<div class="wrap voigue-health">
		<h1>Voigue health check</h1>
		<p class="description">Everything the website needs to work. Anything marked "Fix this" will stop a feature from working.</p>

		<?php if ( $notice ) : ?>
			<div class="notice notice-info is-dismissible"><p><?php echo esc_html( (string) $notice ); ?></p></div>
		<?php endif; ?>

		<table class="widefat striped" style="max-width: 900px; margin-top: 16px;">
			<thead><tr><th>Check</th><th>Status</th><th>Details</th></tr></thead>
			<tbody>
				<?php foreach ( voigue_health_checks() as $check ) : ?>
					<tr>
						<td><strong><?php echo esc_html( $check['label'] ); ?></strong></td>
						<td><span class="voigue-badge <?php echo esc_attr( $check['status'] ); ?>"><?php echo esc_html( $labels[ $check['status'] ] ); ?></span></td>
						<td><?php echo esc_html( $check['detail'] ); ?></td>
					</tr>
				<?php endforeach; ?>
			</tbody>
		</table>

		<h2 style="margin-top: 32px;">Send a test email</h2>
		<p class="description">Sends a message to your own address to confirm the server can send email (needed for application alerts).</p>
		<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>">
			<input type="hidden" name="action" value="voigue_test_email" />
			<?php wp_nonce_field( 'voigue_test_email' ); ?>
			<?php submit_button( 'Send test email', 'secondary', 'submit', false ); ?>
		</form>

		<h2 style="margin-top: 32px;">Demo content</h2>
		<p class="description">Adds six sample vacancies, five placeholder employee voices and eight gallery items so you can preview every section. Remove them before launch.</p>
		<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" style="display:flex; gap:8px;">
			<input type="hidden" name="action" value="voigue_demo" />
			<?php wp_nonce_field( 'voigue_demo' ); ?>
			<button class="button" name="voigue_demo_do" value="create">Create demo content</button>
			<button class="button" name="voigue_demo_do" value="remove">Remove demo content</button>
		</form>
	</div>
	<?php
}
