<?php
/**
 * Plugin Name:       Voigue Core
 * Description:       Vacancies, applications, site settings and admin tools for the Voigue.lk website. Keep this plugin active: it holds the site's data, so switching the theme never loses it.
 * Version:           0.4.0
 * Requires at least: 6.2
 * Requires PHP:      8.0
 * Author:            Voigue
 * License:           GPL-2.0-or-later
 * Text Domain:       voigue
 *
 * @package Voigue_Core
 */

defined( 'ABSPATH' ) || exit;

define( 'VOIGUE_CORE_VERSION', '0.4.0' );
define( 'VOIGUE_CORE_FILE', __FILE__ );
define( 'VOIGUE_CORE_DIR', plugin_dir_path( __FILE__ ) );
define( 'VOIGUE_CORE_URL', plugin_dir_url( __FILE__ ) );

require_once VOIGUE_CORE_DIR . 'includes/defaults.php';
require_once VOIGUE_CORE_DIR . 'includes/post-types.php';
require_once VOIGUE_CORE_DIR . 'includes/content-types.php';
require_once VOIGUE_CORE_DIR . 'includes/settings.php';
require_once VOIGUE_CORE_DIR . 'includes/contact.php';
require_once VOIGUE_CORE_DIR . 'includes/storage.php';
require_once VOIGUE_CORE_DIR . 'includes/applications.php';
require_once VOIGUE_CORE_DIR . 'includes/apply.php';
require_once VOIGUE_CORE_DIR . 'includes/roles.php';
require_once VOIGUE_CORE_DIR . 'includes/dashboard.php';
require_once VOIGUE_CORE_DIR . 'includes/demo-content.php';
require_once VOIGUE_CORE_DIR . 'includes/health-check.php';

/**
 * On activation: register the post types first so their URLs work straight away.
 */
function voigue_core_activate() {
	voigue_register_post_types();
	voigue_register_content_types();
	voigue_register_application_type();
	voigue_private_dir();
	flush_rewrite_rules();
}
register_activation_hook( __FILE__, 'voigue_core_activate' );

function voigue_core_deactivate() {
	flush_rewrite_rules();
}
register_deactivation_hook( __FILE__, 'voigue_core_deactivate' );
