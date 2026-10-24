<?php
/**
 * Front-end styles and scripts.
 *
 * @package Voigue_Theme
 */

defined( 'ABSPATH' ) || exit;

function voigue_enqueue_assets() {
	$css = '/assets/css/main.css';
	$js  = '/assets/js/main.js';

	wp_enqueue_style( 'voigue-main', VOIGUE_THEME_URI . $css, array(), (string) filemtime( VOIGUE_THEME_DIR . $css ) );
	wp_enqueue_script(
		'voigue-main',
		VOIGUE_THEME_URI . $js,
		array(),
		(string) filemtime( VOIGUE_THEME_DIR . $js ),
		array(
			'strategy'  => 'defer',
			'in_footer' => true,
		)
	);

	// Address the contact form posts to (the plugin handles it).
	wp_localize_script( 'voigue-main', 'voigueTheme', array( 'ajaxUrl' => admin_url( 'admin-ajax.php' ) ) );
}
add_action( 'wp_enqueue_scripts', 'voigue_enqueue_assets' );

/**
 * Tell CSS that JavaScript is available (reveal animations only hide content when it is), and preload the main font.
 */
function voigue_head_extras() {
	echo "<script>document.documentElement.classList.add('js');</script>\n";
	printf(
		'<link rel="preload" href="%s" as="font" type="font/woff2" crossorigin>' . "\n",
		esc_url( VOIGUE_THEME_URI . '/assets/fonts/geist-latin-wght-normal.woff2' )
	);
}
add_action( 'wp_head', 'voigue_head_extras', 1 );
