<?php
/**
 * Employee Voices, the "Life around here" gallery and contact Messages.
 *
 * @package Voigue_Core
 */

defined( 'ABSPATH' ) || exit;

const VOIGUE_VOICE_TYPE   = 'voigue_voice';
const VOIGUE_MOMENT_TYPE  = 'voigue_moment';
const VOIGUE_MESSAGE_TYPE = 'voigue_message';
const VOIGUE_MOMENT_TAX   = 'voigue_moment_category';

function voigue_register_content_types() {
	register_post_type(
		VOIGUE_VOICE_TYPE,
		array(
			'labels'          => array(
				'name'               => 'Employee Voices',
				'singular_name'      => 'Employee Voice',
				'add_new'            => 'Add voice',
				'add_new_item'       => 'Add employee voice',
				'edit_item'          => 'Edit employee voice',
				'search_items'       => 'Search voices',
				'not_found'          => 'No employee voices found',
				'not_found_in_trash' => 'No employee voices in the bin',
				'menu_name'          => 'Employee Voices',
				'all_items'          => 'All voices',
				'featured_image'     => 'Portrait photo',
				'set_featured_image' => 'Set portrait photo',
				'remove_featured_image' => 'Remove portrait photo',
				'use_featured_image' => 'Use as portrait photo',
			),
			'public'          => false,
			'show_ui'         => true,
			'show_in_menu'    => true,
			'show_in_rest'    => false,
			'menu_position'   => 23,
			'menu_icon'       => 'dashicons-format-quote',
			'supports'        => array( 'title', 'thumbnail', 'page-attributes' ),
			'rewrite'         => false,
			'capability_type' => 'post',
		)
	);

	register_post_type(
		VOIGUE_MOMENT_TYPE,
		array(
			'labels'          => array(
				'name'               => 'Life around here',
				'singular_name'      => 'Photo',
				'add_new'            => 'Add photo',
				'add_new_item'       => 'Add gallery photo',
				'edit_item'          => 'Edit gallery photo',
				'search_items'       => 'Search photos',
				'not_found'          => 'No photos found',
				'not_found_in_trash' => 'No photos in the bin',
				'menu_name'          => 'Life around here',
				'all_items'          => 'All photos',
				'featured_image'     => 'Photo',
				'set_featured_image' => 'Choose the photo',
				'remove_featured_image' => 'Remove photo',
				'use_featured_image' => 'Use as the photo',
			),
			'public'          => false,
			'show_ui'         => true,
			'show_in_menu'    => true,
			'show_in_rest'    => false,
			'menu_position'   => 24,
			'menu_icon'       => 'dashicons-format-gallery',
			'supports'        => array( 'title', 'thumbnail', 'page-attributes' ),
			'rewrite'         => false,
			'capability_type' => 'post',
		)
	);

	register_taxonomy(
		VOIGUE_MOMENT_TAX,
		VOIGUE_MOMENT_TYPE,
		array(
			'labels'            => array(
				'name'          => 'Categories',
				'singular_name' => 'Category',
				'add_new_item'  => 'Add category',
				'edit_item'     => 'Edit category',
			),
			'hierarchical'      => true,
			'public'            => false,
			'show_ui'           => true,
			'show_admin_column' => true,
			'show_in_rest'      => false,
			'rewrite'           => false,
		)
	);

	register_post_type(
		VOIGUE_MESSAGE_TYPE,
		array(
			'labels'          => array(
				'name'               => 'Messages',
				'singular_name'      => 'Message',
				'edit_item'          => 'Message',
				'search_items'       => 'Search messages',
				'not_found'          => 'No messages yet',
				'not_found_in_trash' => 'No messages in the bin',
				'menu_name'          => 'Messages',
				'all_items'          => 'All messages',
			),
			'public'          => false,
			'show_ui'         => true,
			'show_in_menu'    => true,
			'show_in_rest'    => false,
			'menu_position'   => 25,
			'menu_icon'       => 'dashicons-email-alt',
			'supports'        => array( 'title' ),
			'rewrite'         => false,
			'capability_type' => 'post',
			'capabilities'    => array( 'create_posts' => 'do_not_allow' ),
			'map_meta_cap'    => true,
		)
	);
}
add_action( 'init', 'voigue_register_content_types' );

/**
 * Makes sure the three gallery categories exist (once).
 */
function voigue_seed_moment_terms() {
	if ( get_option( 'voigue_moment_terms_seeded' ) || ! taxonomy_exists( VOIGUE_MOMENT_TAX ) ) {
		return;
	}
	foreach ( array( 'Parties', 'Events', 'Community' ) as $name ) {
		if ( ! term_exists( $name, VOIGUE_MOMENT_TAX ) ) {
			wp_insert_term( $name, VOIGUE_MOMENT_TAX );
		}
	}
	update_option( 'voigue_moment_terms_seeded', '1' );
}
add_action( 'init', 'voigue_seed_moment_terms', 20 );

/* ---------- Employee voice fields ---------- */

/**
 * @return array<string,array<string,string>>
 */
function voigue_voice_fields() {
	return array(
		'_voigue_role'  => array(
			'label' => 'Role',
			'type'  => 'text',
			'help'  => 'For example: Talent Acquisition Executive',
		),
		'_voigue_quote' => array(
			'label' => 'Testimonial',
			'type'  => 'textarea',
			'help'  => 'Shown in quotation marks. Keep it to a few sentences.',
		),
	);
}

function voigue_add_voice_meta_box() {
	add_meta_box( 'voigue_voice_details', 'Employee details', 'voigue_render_voice_meta_box', VOIGUE_VOICE_TYPE, 'normal', 'high' );
	add_meta_box( 'voigue_message_details', 'Message', 'voigue_render_message_meta_box', VOIGUE_MESSAGE_TYPE, 'normal', 'high' );
}
add_action( 'add_meta_boxes', 'voigue_add_voice_meta_box' );

/**
 * @param WP_Post $post The employee voice being edited.
 */
function voigue_render_voice_meta_box( $post ) {
	wp_nonce_field( 'voigue_save_voice', 'voigue_voice_nonce' );
	echo '<p class="description">The <strong>title</strong> above is the employee\'s name. Choose the portrait photo on the right. Use <strong>Order</strong> to set the sequence (lowest first).</p><table class="form-table" role="presentation">';
	foreach ( voigue_voice_fields() as $key => $field ) {
		$value = get_post_meta( $post->ID, $key, true );
		echo '<tr><th scope="row"><label for="' . esc_attr( $key ) . '">' . esc_html( $field['label'] ) . '</label></th><td>';
		if ( 'textarea' === $field['type'] ) {
			echo '<textarea id="' . esc_attr( $key ) . '" name="' . esc_attr( $key ) . '" rows="5" class="large-text">' . esc_textarea( $value ) . '</textarea>';
		} else {
			echo '<input type="text" id="' . esc_attr( $key ) . '" name="' . esc_attr( $key ) . '" value="' . esc_attr( $value ) . '" class="large-text" />';
		}
		echo '<p class="description">' . esc_html( $field['help'] ) . '</p></td></tr>';
	}
	echo '</table>';
}

/**
 * @param int $post_id The employee voice being saved.
 */
function voigue_save_voice_meta( $post_id ) {
	if ( ! isset( $_POST['voigue_voice_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['voigue_voice_nonce'] ) ), 'voigue_save_voice' ) ) {
		return;
	}
	if ( ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) || ! current_user_can( 'edit_post', $post_id ) ) {
		return;
	}
	foreach ( voigue_voice_fields() as $key => $field ) {
		$raw = isset( $_POST[ $key ] ) ? wp_unslash( $_POST[ $key ] ) : ''; // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized -- sanitised below.
		update_post_meta( $post_id, $key, 'textarea' === $field['type'] ? sanitize_textarea_field( $raw ) : sanitize_text_field( $raw ) );
	}
}
add_action( 'save_post_' . VOIGUE_VOICE_TYPE, 'voigue_save_voice_meta' );

/* ---------- Messages (contact form submissions) ---------- */

/**
 * @param WP_Post $post The message being viewed.
 */
function voigue_render_message_meta_box( $post ) {
	$email = (string) get_post_meta( $post->ID, '_voigue_email', true );
	$phone = (string) get_post_meta( $post->ID, '_voigue_phone', true );
	echo '<table class="form-table" role="presentation">';
	echo '<tr><th scope="row">From</th><td>' . esc_html( $post->post_title ) . '</td></tr>';
	echo '<tr><th scope="row">Email</th><td><a href="mailto:' . esc_attr( $email ) . '">' . esc_html( $email ) . '</a></td></tr>';
	if ( $phone ) {
		echo '<tr><th scope="row">Phone</th><td>' . esc_html( $phone ) . '</td></tr>';
	}
	echo '<tr><th scope="row">Received</th><td>' . esc_html( get_the_date( 'j F Y, g:i a', $post ) ) . '</td></tr>';
	echo '<tr><th scope="row">Message</th><td style="white-space: pre-line;">' . esc_html( (string) get_post_meta( $post->ID, '_voigue_message', true ) ) . '</td></tr>';
	echo '</table>';
}

/* ---------- Admin list columns ---------- */

/**
 * @param array<string,string> $columns Existing columns.
 * @return array<string,string>
 */
function voigue_voice_columns( $columns ) {
	return array(
		'cb'           => $columns['cb'],
		'voigue_photo' => 'Portrait',
		'title'        => 'Name',
		'voigue_role'  => 'Role',
		'menu_order'   => 'Order',
	);
}
add_filter( 'manage_' . VOIGUE_VOICE_TYPE . '_posts_columns', 'voigue_voice_columns' );

/**
 * @param array<string,string> $columns Existing columns.
 * @return array<string,string>
 */
function voigue_moment_columns( $columns ) {
	$new = array(
		'cb'           => $columns['cb'],
		'voigue_photo' => 'Photo',
		'title'        => 'Title',
	);
	if ( isset( $columns[ 'taxonomy-' . VOIGUE_MOMENT_TAX ] ) ) {
		$new[ 'taxonomy-' . VOIGUE_MOMENT_TAX ] = 'Category';
	}
	$new['menu_order'] = 'Order';
	return $new;
}
add_filter( 'manage_' . VOIGUE_MOMENT_TYPE . '_posts_columns', 'voigue_moment_columns' );

/**
 * @param array<string,string> $columns Existing columns.
 * @return array<string,string>
 */
function voigue_message_columns( $columns ) {
	return array(
		'cb'            => $columns['cb'],
		'title'         => 'From',
		'voigue_email'  => 'Email',
		'voigue_phone'  => 'Phone',
		'date'          => 'Received',
	);
}
add_filter( 'manage_' . VOIGUE_MESSAGE_TYPE . '_posts_columns', 'voigue_message_columns' );

/**
 * @param string $column  Column key.
 * @param int    $post_id Post ID.
 */
function voigue_content_type_column( $column, $post_id ) {
	switch ( $column ) {
		case 'voigue_photo':
			echo get_the_post_thumbnail( $post_id, array( 64, 64 ), array( 'style' => 'border-radius:6px;object-fit:cover;width:64px;height:64px;' ) ) ?: '&mdash;'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- core-generated image markup.
			break;
		case 'voigue_role':
			echo esc_html( get_post_meta( $post_id, '_voigue_role', true ) );
			break;
		case 'menu_order':
			echo esc_html( (string) get_post_field( 'menu_order', $post_id ) );
			break;
		case 'voigue_email':
			$email = (string) get_post_meta( $post_id, '_voigue_email', true );
			echo '<a href="mailto:' . esc_attr( $email ) . '">' . esc_html( $email ) . '</a>';
			break;
		case 'voigue_phone':
			echo esc_html( get_post_meta( $post_id, '_voigue_phone', true ) );
			break;
	}
}
add_action( 'manage_' . VOIGUE_VOICE_TYPE . '_posts_custom_column', 'voigue_content_type_column', 10, 2 );
add_action( 'manage_' . VOIGUE_MOMENT_TYPE . '_posts_custom_column', 'voigue_content_type_column', 10, 2 );
add_action( 'manage_' . VOIGUE_MESSAGE_TYPE . '_posts_custom_column', 'voigue_content_type_column', 10, 2 );
