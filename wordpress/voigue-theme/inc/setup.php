<?php
/**
 * Theme features, menus, and the one-time setup that runs when the theme is activated.
 *
 * @package Voigue_Theme
 */

defined( 'ABSPATH' ) || exit;

function voigue_theme_setup() {
	add_theme_support( 'title-tag' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'responsive-embeds' );
	add_theme_support( 'automatic-feed-links' );
	add_theme_support(
		'html5',
		array( 'search-form', 'comment-form', 'comment-list', 'gallery', 'caption', 'style', 'script' )
	);

	register_nav_menus(
		array(
			'primary' => 'Main menu',
			'footer'  => 'Footer quick links',
		)
	);
}
add_action( 'after_setup_theme', 'voigue_theme_setup' );

/**
 * Give menu links the theme's classes and mark the current page for screen readers.
 *
 * @param array<string,string> $atts Link attributes.
 * @param WP_Post              $item Menu item.
 * @return array<string,string>
 */
function voigue_menu_link_attributes( $atts, $item ) {
	$atts['class'] = trim( ( $atts['class'] ?? '' ) . ' nav-link focus-ring' );
	if ( ! empty( $item->current ) ) {
		$atts['aria-current'] = 'page';
	}
	return $atts;
}
add_filter( 'nav_menu_link_attributes', 'voigue_menu_link_attributes', 10, 2 );

/**
 * Pages the design needs. The Careers, About, Life and Contact templates are added in later phases;
 * a page only gets its template if the template file exists.
 *
 * @return array<string,string> slug => title
 */
function voigue_required_pages() {
	return array(
		'home'           => 'Home',
		'about-us'       => 'About Us',
		'life-at-voigue' => 'Life at Voigue',
		'careers'        => 'Careers',
		'contact-us'     => 'Contact Us',
		'blog'           => 'Blog',
		'privacy-policy' => 'Privacy Policy',
		'terms-of-use'   => 'Terms of Use',
	);
}

/**
 * Starting text for the legal pages. The client replaces it with their approved wording.
 *
 * @param string $slug Page slug.
 * @return string
 */
function voigue_default_page_content( $slug ) {
	if ( in_array( $slug, array( 'privacy-policy', 'terms-of-use' ), true ) ) {
		return '<p>This page is a placeholder. Replace it with Voigue&rsquo;s approved legal text before the website goes live.</p>';
	}
	return '';
}

/**
 * Gives pages their designed template. Only fills in pages that have none, so a template chosen by hand is never overwritten.
 * Runs on activation and again whenever the theme is updated to a new version.
 */
function voigue_assign_page_templates() {
	foreach ( array_keys( voigue_required_pages() ) as $slug ) {
		$template = 'page-templates/' . $slug . '.php';
		if ( ! file_exists( VOIGUE_THEME_DIR . '/' . $template ) ) {
			continue;
		}
		$page = get_page_by_path( $slug );
		if ( $page && ! get_page_template_slug( $page ) ) {
			update_post_meta( $page->ID, '_wp_page_template', $template );
		}
	}
}

function voigue_theme_upgrade_check() {
	if ( get_option( 'voigue_theme_version' ) !== VOIGUE_THEME_VERSION ) {
		voigue_assign_page_templates();
		update_option( 'voigue_theme_version', VOIGUE_THEME_VERSION );
	}
}
add_action( 'init', 'voigue_theme_upgrade_check', 30 );

/**
 * Creates the pages, menus and reading settings the first time the theme is activated. Safe to run again:
 * it never overwrites a page or menu that already exists.
 */
function voigue_theme_activate() {
	$ids = array();
	foreach ( voigue_required_pages() as $slug => $title ) {
		$existing = get_page_by_path( $slug );
		if ( $existing ) {
			$ids[ $slug ] = (int) $existing->ID;
			// WordPress ships an unpublished "Privacy Policy" draft full of generic template text. Swap it for the placeholder and publish it so the footer link works.
			if ( 'privacy-policy' === $slug && 'draft' === $existing->post_status && (int) get_option( 'wp_page_for_privacy_policy' ) === (int) $existing->ID ) {
				wp_update_post(
					array(
						'ID'           => $existing->ID,
						'post_status'  => 'publish',
						'post_content' => voigue_default_page_content( $slug ),
					)
				);
			}
			continue;
		}
		$page_id = wp_insert_post(
			array(
				'post_type'   => 'page',
				'post_status' => 'publish',
				'post_title'   => $title,
				'post_name'    => $slug,
				'post_content' => voigue_default_page_content( $slug ),
			)
		);
		if ( is_wp_error( $page_id ) || ! $page_id ) {
			continue;
		}
		$ids[ $slug ] = (int) $page_id;
	}
	voigue_assign_page_templates();

	if ( ! empty( $ids['home'] ) && ! empty( $ids['blog'] ) ) {
		update_option( 'show_on_front', 'page' );
		update_option( 'page_on_front', $ids['home'] );
		update_option( 'page_for_posts', $ids['blog'] );
	}

	if ( ! get_option( 'permalink_structure' ) ) {
		update_option( 'permalink_structure', '/%postname%/' );
	}

	voigue_create_menu( 'Main menu', 'primary', array( 'home', 'about-us', 'life-at-voigue', 'careers', 'contact-us' ), $ids );
	voigue_create_menu( 'Footer quick links', 'footer', array( 'home', 'about-us', 'life-at-voigue', 'blog', 'careers', 'contact-us' ), $ids );

	flush_rewrite_rules();
}
add_action( 'after_switch_theme', 'voigue_theme_activate' );

/**
 * @param string             $name     Menu name.
 * @param string             $location Theme location slug.
 * @param string[]           $slugs    Page slugs, in order.
 * @param array<string,int>  $ids      Page IDs by slug.
 */
function voigue_create_menu( $name, $location, $slugs, $ids ) {
	if ( wp_get_nav_menu_object( $name ) ) {
		return;
	}
	$menu_id = wp_create_nav_menu( $name );
	if ( is_wp_error( $menu_id ) ) {
		return;
	}
	$pages = voigue_required_pages();
	foreach ( $slugs as $slug ) {
		if ( empty( $ids[ $slug ] ) ) {
			continue;
		}
		wp_update_nav_menu_item(
			$menu_id,
			0,
			array(
				'menu-item-title'     => $pages[ $slug ],
				'menu-item-object'    => 'page',
				'menu-item-object-id' => $ids[ $slug ],
				'menu-item-type'      => 'post_type',
				'menu-item-status'    => 'publish',
			)
		);
	}
	$locations              = get_theme_mod( 'nav_menu_locations', array() );
	$locations[ $location ] = $menu_id;
	set_theme_mod( 'nav_menu_locations', $locations );
}

// Lighter pages: the design does not use emoji or oEmbed scripts.
remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
remove_action( 'wp_print_styles', 'print_emoji_styles' );
remove_action( 'wp_head', 'wp_oembed_add_discovery_links' );
remove_action( 'wp_head', 'wlwmanifest_link' );
remove_action( 'wp_head', 'rsd_link' );
remove_action( 'wp_head', 'wp_generator' );
