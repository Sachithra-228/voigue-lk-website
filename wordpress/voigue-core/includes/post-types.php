<?php
/**
 * Vacancies ("Jobs") custom post type, its fields and admin columns.
 *
 * @package Voigue_Core
 */

defined( 'ABSPATH' ) || exit;

const VOIGUE_JOB_TYPE = 'voigue_job';

/**
 * The three work setups, in the order they appear on the site.
 *
 * @return string[]
 */
function voigue_work_setups() {
	return array( 'Remote', 'Hybrid', 'On-site' );
}

function voigue_register_post_types() {
	register_post_type(
		VOIGUE_JOB_TYPE,
		array(
			'labels'             => array(
				'name'               => 'Vacancies',
				'singular_name'      => 'Vacancy',
				'add_new'            => 'Add vacancy',
				'add_new_item'       => 'Add new vacancy',
				'edit_item'          => 'Edit vacancy',
				'new_item'           => 'New vacancy',
				'view_item'          => 'View vacancy',
				'search_items'       => 'Search vacancies',
				'not_found'          => 'No vacancies found',
				'not_found_in_trash' => 'No vacancies in the bin',
				'menu_name'          => 'Vacancies',
				'all_items'          => 'All vacancies',
			),
			// Vacancies are listed on the Careers page; they have no page of their own.
			'public'             => false,
			'publicly_queryable' => false,
			'show_ui'            => true,
			'show_in_menu'       => true,
			'show_in_rest'       => false,
			'menu_position'      => 21,
			'menu_icon'          => 'dashicons-businessperson',
			'supports'           => array( 'title', 'editor', 'page-attributes' ),
			'has_archive'        => false,
			'rewrite'            => false,
			'capability_type'    => 'post',
		)
	);
}
add_action( 'init', 'voigue_register_post_types' );

/**
 * Meta fields shown in the "Vacancy details" box.
 *
 * @return array<string,array<string,string>>
 */
function voigue_job_fields() {
	return array(
		'_voigue_summary'          => array(
			'label' => 'Short summary (shown on the listing)',
			'type'  => 'text',
			'help'  => 'One or two sentences. Keep it under 160 characters.',
		),
		'_voigue_setup'            => array(
			'label' => 'Work setup',
			'type'  => 'select',
			'help'  => '',
		),
		'_voigue_location'         => array(
			'label' => 'Location',
			'type'  => 'text',
			'help'  => 'For example: Colombo, Sri Lanka',
		),
		'_voigue_employment_type'  => array(
			'label' => 'Employment type',
			'type'  => 'text',
			'help'  => 'For example: Full-time',
		),
		'_voigue_responsibilities' => array(
			'label' => 'Key responsibilities',
			'type'  => 'textarea',
			'help'  => 'One per line.',
		),
		'_voigue_requirements'     => array(
			'label' => "What we're looking for",
			'type'  => 'textarea',
			'help'  => 'One per line.',
		),
	);
}

function voigue_add_job_meta_box() {
	add_meta_box( 'voigue_job_details', 'Vacancy details', 'voigue_render_job_meta_box', VOIGUE_JOB_TYPE, 'normal', 'high' );
}
add_action( 'add_meta_boxes', 'voigue_add_job_meta_box' );

/**
 * @param WP_Post $post The vacancy being edited.
 */
function voigue_render_job_meta_box( $post ) {
	wp_nonce_field( 'voigue_save_job', 'voigue_job_nonce' );
	echo '<p class="description">The big text editor above is the <strong>full job description</strong>, shown when a visitor presses "Read more". Set <strong>Order</strong> (right-hand side) to control the sort order: the lowest number appears first.</p>';
	echo '<table class="form-table" role="presentation">';
	foreach ( voigue_job_fields() as $key => $field ) {
		$value = get_post_meta( $post->ID, $key, true );
		echo '<tr><th scope="row"><label for="' . esc_attr( $key ) . '">' . esc_html( $field['label'] ) . '</label></th><td>';
		if ( 'select' === $field['type'] ) {
			echo '<select id="' . esc_attr( $key ) . '" name="' . esc_attr( $key ) . '">';
			foreach ( voigue_work_setups() as $option ) {
				printf( '<option value="%1$s"%2$s>%1$s</option>', esc_attr( $option ), selected( $value ?: 'Remote', $option, false ) );
			}
			echo '</select>';
		} elseif ( 'textarea' === $field['type'] ) {
			echo '<textarea id="' . esc_attr( $key ) . '" name="' . esc_attr( $key ) . '" rows="5" class="large-text">' . esc_textarea( $value ) . '</textarea>';
		} else {
			echo '<input type="text" id="' . esc_attr( $key ) . '" name="' . esc_attr( $key ) . '" value="' . esc_attr( $value ) . '" class="large-text" />';
		}
		if ( ! empty( $field['help'] ) ) {
			echo '<p class="description">' . esc_html( $field['help'] ) . '</p>';
		}
		echo '</td></tr>';
	}
	echo '</table>';
}

/**
 * @param int $post_id The vacancy being saved.
 */
function voigue_save_job_meta( $post_id ) {
	if ( ! isset( $_POST['voigue_job_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['voigue_job_nonce'] ) ), 'voigue_save_job' ) ) {
		return;
	}
	if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
		return;
	}
	if ( ! current_user_can( 'edit_post', $post_id ) ) {
		return;
	}

	foreach ( voigue_job_fields() as $key => $field ) {
		$raw = isset( $_POST[ $key ] ) ? wp_unslash( $_POST[ $key ] ) : ''; // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized -- sanitised below.
		if ( 'textarea' === $field['type'] ) {
			$value = sanitize_textarea_field( $raw );
		} elseif ( 'select' === $field['type'] ) {
			$value = in_array( $raw, voigue_work_setups(), true ) ? $raw : 'Remote';
		} else {
			$value = sanitize_text_field( $raw );
		}
		update_post_meta( $post_id, $key, $value );
	}
}
add_action( 'save_post_' . VOIGUE_JOB_TYPE, 'voigue_save_job_meta' );

/**
 * Admin list columns for vacancies.
 *
 * @param array<string,string> $columns Existing columns.
 * @return array<string,string>
 */
function voigue_job_columns( $columns ) {
	return array(
		'cb'            => $columns['cb'],
		'title'         => 'Title',
		'voigue_setup'  => 'Work setup',
		'voigue_place'  => 'Location',
		'menu_order'    => 'Order',
		'date'          => 'Date',
	);
}
add_filter( 'manage_' . VOIGUE_JOB_TYPE . '_posts_columns', 'voigue_job_columns' );

/**
 * @param string $column  Column key.
 * @param int    $post_id Vacancy ID.
 */
function voigue_job_column_content( $column, $post_id ) {
	if ( 'voigue_setup' === $column ) {
		echo esc_html( get_post_meta( $post_id, '_voigue_setup', true ) );
	} elseif ( 'voigue_place' === $column ) {
		echo esc_html( get_post_meta( $post_id, '_voigue_location', true ) );
	} elseif ( 'menu_order' === $column ) {
		echo esc_html( (string) get_post_field( 'menu_order', $post_id ) );
	}
}
add_action( 'manage_' . VOIGUE_JOB_TYPE . '_posts_custom_column', 'voigue_job_column_content', 10, 2 );
