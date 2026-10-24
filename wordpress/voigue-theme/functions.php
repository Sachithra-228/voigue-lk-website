<?php
/**
 * Voigue theme bootstrap.
 *
 * @package Voigue_Theme
 */

defined( 'ABSPATH' ) || exit;

define( 'VOIGUE_THEME_VERSION', '0.2.0' );
define( 'VOIGUE_THEME_DIR', get_template_directory() );
define( 'VOIGUE_THEME_URI', get_template_directory_uri() );

require_once VOIGUE_THEME_DIR . '/inc/helpers.php';
require_once VOIGUE_THEME_DIR . '/inc/setup.php';
require_once VOIGUE_THEME_DIR . '/inc/enqueue.php';
