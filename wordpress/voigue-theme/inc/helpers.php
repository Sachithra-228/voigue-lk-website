<?php
/**
 * Small helpers used by the templates.
 *
 * @package Voigue_Theme
 */

defined( 'ABSPATH' ) || exit;

/**
 * Starting values for the contact details. They match the plugin's defaults, so the theme also works if the plugin is switched off.
 *
 * @return array<string,string>
 */
function voigue_theme_defaults() {
	return array(
		'brand_line'       => 'Bridging people and possibilities across borders.',
		'website'          => 'www.voigue.com',
		'email_general'    => 'hello@voigue.com',
		'email_careers'    => 'careers@voigue.com',
		'phone_lk'         => '011 711 0170',
		'phone_au'         => '1300 095 588',
		'address_au'       => 'Ground floor, 470 St Kilda Road, Melbourne, VIC 3004, Australia',
		'address_lk'       => 'No. 736 (4th floor), Bank Building, Dr Danister De Silva Mw, Orion City, Colombo 09',
		'social_linkedin'  => 'https://www.linkedin.com/company/voigue/',
		'social_instagram' => 'https://www.instagram.com/voigue365?igsi=dDN4NGdtZm5semQ0',
		'social_facebook'  => 'https://www.facebook.com/share/14nRE1USJ8Q/?mibextid=wwXIfr',
		'social_tiktok'    => 'https://www.tiktok.com/@voigueptyltd?_r=1&_t=ZS-99TKd3EV1eB',
		'life_youtube'     => '',
		'map_lk'           => 'Orion City, Dr Danister De Silva Mawatha, Colombo 09, Sri Lanka',
		'map_au'           => '470 St Kilda Road, Melbourne, VIC 3004, Australia',
	);
}

/**
 * One setting from Voigue > Site settings (or its default).
 *
 * @param string $key Setting key.
 * @return string
 */
function voigue_setting( $key ) {
	static $settings = null;
	if ( null === $settings ) {
		$saved    = get_option( 'voigue_settings', array() );
		$settings = array_merge( voigue_theme_defaults(), is_array( $saved ) ? $saved : array() );
	}
	return isset( $settings[ $key ] ) && is_string( $settings[ $key ] ) ? $settings[ $key ] : '';
}

/**
 * URL of a photo or video chosen in Voigue > Site settings, or an empty string.
 *
 * @param string $key Media slot key.
 * @return string
 */
function voigue_media_url( $key ) {
	$saved = get_option( 'voigue_settings', array() );
	$id    = isset( $saved['media'][ $key ] ) ? absint( $saved['media'][ $key ] ) : 0;
	if ( ! $id ) {
		return '';
	}
	$url = wp_get_attachment_url( $id );
	return $url ? $url : '';
}

/**
 * Prints a photo for a media slot, or the neutral placeholder when none has been chosen yet.
 *
 * @param string $key   Media slot key.
 * @param string $class CSS classes for the wrapper (give it a size, e.g. "aspect-[4/3] w-full").
 * @param string $label Short label shown inside the placeholder.
 * @param string $alt   Alt text for a real photo.
 */
function voigue_photo( $key, $class = '', $label = '', $alt = '' ) {
	$saved = get_option( 'voigue_settings', array() );
	$id    = isset( $saved['media'][ $key ] ) ? absint( $saved['media'][ $key ] ) : 0;
	voigue_render_photo( $id, $class, $label, $alt );
}

/**
 * Prints a media-library photo by ID, or the neutral placeholder when there is none.
 *
 * @param int    $id    Attachment ID (0 for none).
 * @param string $class CSS classes for the wrapper.
 * @param string $label Short label shown inside the placeholder.
 * @param string $alt   Alt text for a real photo.
 * @param string $size  Image size to use.
 */
function voigue_render_photo( $id, $class = '', $label = '', $alt = '', $size = 'large' ) {
	// A photo that fills its parent ("absolute ...") is a background: it must not also be "relative".
	$is_background = false !== strpos( $class, 'absolute' );
	$position      = $is_background ? '' : 'relative ';

	if ( $id && wp_attachment_is_image( $id ) ) {
		echo '<div class="' . esc_attr( $position ) . 'overflow-hidden ' . esc_attr( $class ) . '">';
		echo wp_get_attachment_image(
			$id,
			$size,
			false,
			array(
				'class'    => 'absolute inset-0 h-full w-full object-cover',
				'alt'      => $alt,
				'loading'  => 'lazy',
				'decoding' => 'async',
			)
		);
		echo '</div>';
		return;
	}

	if ( $is_background ) {
		echo '<div class="hero-placeholder ' . esc_attr( $class ) . '" aria-hidden="true"></div>';
		return;
	}

	echo '<div class="photo-placeholder relative flex flex-col items-center justify-center gap-2 overflow-hidden ' . esc_attr( $class ) . '" aria-hidden="true">';
	echo voigue_icon( 'image', 'h-8 w-8' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- static SVG markup.
	if ( $label ) {
		echo '<span class="px-3 text-center text-xs font-medium uppercase tracking-[0.18em]">' . esc_html( $label ) . '</span>';
	}
	echo '</div>';
}

/**
 * Pulls a YouTube video ID out of a link (or accepts a bare ID). Returns an empty string if it does not look valid.
 *
 * @param string $value A YouTube link or ID.
 * @return string
 */
function voigue_youtube_id( $value ) {
	$value = trim( (string) $value );
	if ( preg_match( '#(?:youtu\.be/|youtube\.com/(?:watch\?(?:.*&)?v=|embed/|shorts/|live/))([A-Za-z0-9_-]{11})#', $value, $m ) ) {
		return $m[1];
	}
	return preg_match( '/^[A-Za-z0-9_-]{11}$/', $value ) ? $value : '';
}

/**
 * Inline SVG icons (Lucide, ISC licence). Static markup only.
 *
 * @param string $name  Icon name.
 * @param string $class CSS classes.
 * @return string
 */
function voigue_icon( $name, $class = 'h-5 w-5' ) {
	$paths = array(
		'arrow-right'   => '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
		'arrow-up'      => '<path d="m5 12 7-7 7 7"/><path d="M12 19V5"/>',
		'menu'          => '<line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/>',
		'x'             => '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
		'chevron-left'  => '<path d="m15 18-6-6 6-6"/>',
		'chevron-right' => '<path d="m9 18 6-6-6-6"/>',
		'chevron-down'  => '<path d="m6 9 6 6 6-6"/>',
		'map-pin'       => '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
		'phone'         => '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
		'globe'         => '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',
		'mail'          => '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
		'image'         => '<rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>',
		'linkedin'      => '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/>',
		'instagram'     => '<rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>',
		'facebook'      => '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>',
		'tiktok'        => '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
		'file-text'     => '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>',
		'search'        => '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
		'users'         => '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
		'lightbulb'     => '<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/>',
		'sprout'        => '<path d="M7 20h10"/><path d="M10 20c5.5-2.5.8-6.4 3-10"/><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z"/><path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z"/>',
		'heart'         => '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
		'play'          => '<polygon points="6 3 20 12 6 21 6 3" fill="currentColor"/>',
		'laptop'        => '<path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45L4 16"/>',
		'home'          => '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
		'building'      => '<path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/>',
		'sliders'       => '<line x1="21" x2="14" y1="4" y2="4"/><line x1="10" x2="3" y1="4" y2="4"/><line x1="21" x2="12" y1="12" y2="12"/><line x1="8" x2="3" y1="12" y2="12"/><line x1="21" x2="16" y1="20" y2="20"/><line x1="12" x2="3" y1="20" y2="20"/><line x1="14" x2="14" y1="2" y2="6"/><line x1="8" x2="8" y1="10" y2="14"/><line x1="16" x2="16" y1="18" y2="22"/>',
		'trending-up'   => '<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>',
		'sparkles'      => '<path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>',
		'badge-dollar-sign' => '<path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 18V6"/>',
		'shield-check'  => '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
		'party-popper'  => '<path d="M5.8 11.3 2 22l10.7-3.79"/><path d="M4 3h.01"/><path d="M22 8h.01"/><path d="M15 2h.01"/><path d="M22 20h.01"/><path d="m22 2-2.24.75a2.9 2.9 0 0 0-1.96 3.12c.1.86-.57 1.63-1.45 1.63h-.38c-.86 0-1.6.6-1.76 1.44L14 10"/><path d="m22 13-.82-.33c-.86-.34-1.82.2-1.98 1.11c-.11.7-.72 1.22-1.43 1.22H17"/><path d="m11 2 .33.82c.34.86-.2 1.82-1.11 1.98C9.52 4.9 9 5.52 9 6.23V7"/><path d="M11 13c1.93 1.93 2.83 4.17 2 5-.83.83-3.07-.07-5-2-1.93-1.93-2.83-4.17-2-5 .83-.83 3.07.07 5 2Z"/>',
		'book-open'     => '<path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/>',
		'upload'        => '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/>',
		'check-circle'  => '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/>',
	);
	if ( ! isset( $paths[ $name ] ) ) {
		return '';
	}
	return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="' . esc_attr( $class ) . '" aria-hidden="true" focusable="false">' . $paths[ $name ] . '</svg>';
}

/**
 * Whether the current page opens with a dark full-width hero (so the header starts transparent).
 *
 * @return bool
 */
function voigue_has_dark_hero() {
	return is_front_page() || is_page( array( 'about-us', 'life-at-voigue', 'careers' ) );
}

/**
 * Link to the open positions on the Careers page.
 *
 * @return string
 */
function voigue_open_roles_url() {
	$page = get_page_by_path( 'careers' );
	return ( $page ? get_permalink( $page ) : home_url( '/careers/' ) ) . '#current-openings';
}

/**
 * Colour of the small dot that shows a vacancy's work setup.
 *
 * @param string $setup Remote, Hybrid or On-site.
 * @return string Tailwind background class.
 */
function voigue_setup_dot_class( $setup ) {
	$map = array(
		'Remote'  => 'bg-brand-violet',
		'Hybrid'  => 'bg-amber-400',
		'On-site' => 'bg-sky-500',
	);
	return $map[ $setup ] ?? 'bg-line';
}
