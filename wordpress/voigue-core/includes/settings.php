<?php
/**
 * "Voigue > Site settings": contact details, social links and the site's photos and videos.
 *
 * @package Voigue_Core
 */

defined( 'ABSPATH' ) || exit;

const VOIGUE_SETTINGS_OPTION = 'voigue_settings';

/**
 * Labels for the text settings, in display order.
 *
 * @return array<string,array{label:string,kind:string}>
 */
function voigue_settings_fields() {
	return array(
		'brand_line'       => array(
			'label' => 'Brand line (footer)',
			'kind'  => 'text',
		),
		'website'          => array(
			'label' => 'Website address shown in the footer',
			'kind'  => 'text',
		),
		'email_general'    => array(
			'label' => 'General enquiries email',
			'kind'  => 'email',
		),
		'email_careers'    => array(
			'label' => 'Careers and applications email',
			'kind'  => 'email',
		),
		'phone_lk'         => array(
			'label' => 'Sri Lanka phone',
			'kind'  => 'text',
		),
		'phone_au'         => array(
			'label' => 'Australia phone',
			'kind'  => 'text',
		),
		'address_lk'       => array(
			'label' => 'Sri Lanka address',
			'kind'  => 'text',
		),
		'address_au'       => array(
			'label' => 'Australia address',
			'kind'  => 'text',
		),
		'social_linkedin'  => array(
			'label' => 'LinkedIn link',
			'kind'  => 'url',
		),
		'social_instagram' => array(
			'label' => 'Instagram link',
			'kind'  => 'url',
		),
		'social_facebook'  => array(
			'label' => 'Facebook link',
			'kind'  => 'url',
		),
		'social_tiktok'    => array(
			'label' => 'TikTok link',
			'kind'  => 'url',
		),
		'map_lk'           => array(
			'label' => 'Sri Lanka map: what to search for',
			'kind'  => 'text',
		),
		'map_au'           => array(
			'label' => 'Australia map: what to search for',
			'kind'  => 'text',
		),
		'life_youtube'     => array(
			'label' => 'YouTube link for the full promotional video (Life at Voigue page)',
			'kind'  => 'text',
		),
	);
}

/**
 * Saved settings merged over the defaults.
 *
 * @return array<string,mixed>
 */
function voigue_get_settings() {
	$saved = get_option( VOIGUE_SETTINGS_OPTION, array() );
	return array_merge( voigue_default_settings(), is_array( $saved ) ? $saved : array() );
}

function voigue_register_settings() {
	register_setting(
		'voigue_settings_group',
		VOIGUE_SETTINGS_OPTION,
		array(
			'type'              => 'array',
			'sanitize_callback' => 'voigue_sanitize_settings',
			'default'           => array(),
		)
	);
}
add_action( 'admin_init', 'voigue_register_settings' );

/**
 * @param mixed $input Raw submitted settings.
 * @return array<string,mixed>
 */
function voigue_sanitize_settings( $input ) {
	$input = is_array( $input ) ? $input : array();
	$clean = array();

	foreach ( voigue_settings_fields() as $key => $field ) {
		$value = isset( $input[ $key ] ) ? (string) $input[ $key ] : '';
		if ( 'email' === $field['kind'] ) {
			$clean[ $key ] = sanitize_email( $value );
		} elseif ( 'url' === $field['kind'] ) {
			$clean[ $key ] = esc_url_raw( trim( $value ) );
		} else {
			$clean[ $key ] = sanitize_text_field( $value );
		}
	}

	// Photos and videos are stored as media-library IDs, and must match the slot's type.
	$clean['media'] = array();
	$submitted      = isset( $input['media'] ) && is_array( $input['media'] ) ? $input['media'] : array();
	foreach ( voigue_media_slots() as $key => $slot ) {
		$id = isset( $submitted[ $key ] ) ? absint( $submitted[ $key ] ) : 0;
		if ( $id && 0 === strpos( (string) get_post_mime_type( $id ), $slot['type'] . '/' ) ) {
			$clean['media'][ $key ] = $id;
		}
	}

	return $clean;
}

function voigue_settings_menu() {
	add_menu_page( 'Voigue', 'Voigue', 'manage_options', 'voigue', 'voigue_render_settings_page', 'dashicons-admin-site-alt3', 22 );
	add_submenu_page( 'voigue', 'Site settings', 'Site settings', 'manage_options', 'voigue', 'voigue_render_settings_page' );
}
add_action( 'admin_menu', 'voigue_settings_menu' );

/**
 * @param string $hook Current admin page hook.
 */
function voigue_settings_assets( $hook ) {
	if ( 'toplevel_page_voigue' !== $hook ) {
		return;
	}
	wp_enqueue_media();
	wp_enqueue_style( 'voigue-admin', VOIGUE_CORE_URL . 'assets/admin.css', array(), VOIGUE_CORE_VERSION );
	wp_enqueue_script( 'voigue-admin', VOIGUE_CORE_URL . 'assets/admin.js', array(), VOIGUE_CORE_VERSION, true );
}
add_action( 'admin_enqueue_scripts', 'voigue_settings_assets' );

function voigue_render_settings_page() {
	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}
	$settings = voigue_get_settings();
	$media    = isset( $settings['media'] ) && is_array( $settings['media'] ) ? $settings['media'] : array();
	$groups   = array();
	foreach ( voigue_media_slots() as $key => $slot ) {
		$groups[ $slot['group'] ][ $key ] = $slot;
	}
	?>
	<div class="wrap voigue-settings">
		<h1>Voigue site settings</h1>
		<p class="description">Contact details appear in the footer and on the Contact page. Photos and videos replace the grey placeholders across the site as soon as you save.</p>

		<form method="post" action="options.php">
			<?php settings_fields( 'voigue_settings_group' ); ?>

			<h2>Contact details and links</h2>
			<table class="form-table" role="presentation">
				<?php foreach ( voigue_settings_fields() as $key => $field ) : ?>
					<tr>
						<th scope="row"><label for="voigue-<?php echo esc_attr( $key ); ?>"><?php echo esc_html( $field['label'] ); ?></label></th>
						<td><input type="text" class="large-text" id="voigue-<?php echo esc_attr( $key ); ?>" name="<?php echo esc_attr( VOIGUE_SETTINGS_OPTION . '[' . $key . ']' ); ?>" value="<?php echo esc_attr( (string) $settings[ $key ] ); ?>" /></td>
					</tr>
				<?php endforeach; ?>
			</table>

			<h2>Photos and videos</h2>
			<p class="description">Click <strong>Choose</strong> to pick a file from the media library or upload a new one. Videos: MP4, ideally under 20&nbsp;MB.</p>
			<?php foreach ( $groups as $group => $slots ) : ?>
				<h3><?php echo esc_html( $group ); ?></h3>
				<table class="form-table" role="presentation">
					<?php foreach ( $slots as $key => $slot ) : ?>
						<?php
						$id   = isset( $media[ $key ] ) ? absint( $media[ $key ] ) : 0;
						$name = $id ? wp_basename( (string) get_attached_file( $id ) ) : '';
						$thumb = ( $id && 'image' === $slot['type'] ) ? wp_get_attachment_image_url( $id, 'thumbnail' ) : '';
						?>
						<tr>
							<th scope="row"><?php echo esc_html( $slot['label'] ); ?></th>
							<td>
								<div class="voigue-media" data-type="<?php echo esc_attr( $slot['type'] ); ?>">
									<input type="hidden" class="voigue-media-id" name="<?php echo esc_attr( VOIGUE_SETTINGS_OPTION . '[media][' . $key . ']' ); ?>" value="<?php echo esc_attr( (string) $id ); ?>" />
									<span class="voigue-media-preview">
										<?php if ( $thumb ) : ?>
											<img src="<?php echo esc_url( $thumb ); ?>" alt="" />
										<?php endif; ?>
									</span>
									<span class="voigue-media-name"><?php echo $name ? esc_html( $name ) : 'No file chosen'; ?></span>
									<button type="button" class="button voigue-media-choose">Choose</button>
									<button type="button" class="button-link voigue-media-remove"<?php echo $id ? '' : ' hidden'; ?>>Remove</button>
								</div>
							</td>
						</tr>
					<?php endforeach; ?>
				</table>
			<?php endforeach; ?>

			<?php submit_button( 'Save changes' ); ?>
		</form>
	</div>
	<?php
}
