<?php
/**
 * Contact form: receives the AJAX submission, stores it as a Message and emails the team.
 *
 * Public form, so it is protected with a hidden honeypot field, a minimum-time check and a per-visitor
 * rate limit rather than a nonce (nonces break on cached pages).
 *
 * @package Voigue_Core
 */

defined( 'ABSPATH' ) || exit;

const VOIGUE_CONTACT_MIN_SECONDS = 3;
const VOIGUE_CONTACT_MAX_PER_15M = 5;

/**
 * @param string $message Error shown to the visitor.
 * @param int    $status  HTTP status.
 */
function voigue_contact_fail( $message, $status = 400 ) {
	wp_send_json_error( array( 'message' => $message ), $status );
}

function voigue_handle_contact() {
	// Honeypot: real visitors never see or fill this field. Answer "success" so bots learn nothing.
	if ( ! empty( $_POST['website'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification.Missing -- public form, see file header.
		wp_send_json_success();
	}

	// phpcs:disable WordPress.Security.NonceVerification.Missing -- public form, see file header.
	$first   = isset( $_POST['first_name'] ) ? sanitize_text_field( wp_unslash( $_POST['first_name'] ) ) : '';
	$last    = isset( $_POST['last_name'] ) ? sanitize_text_field( wp_unslash( $_POST['last_name'] ) ) : '';
	$email   = isset( $_POST['email'] ) ? sanitize_email( wp_unslash( $_POST['email'] ) ) : '';
	$phone   = isset( $_POST['phone'] ) ? sanitize_text_field( wp_unslash( $_POST['phone'] ) ) : '';
	$message = isset( $_POST['message'] ) ? sanitize_textarea_field( wp_unslash( $_POST['message'] ) ) : '';
	$started = isset( $_POST['started'] ) ? absint( $_POST['started'] ) : 0;
	// phpcs:enable

	$elapsed = time() - (int) floor( $started / 1000 );
	if ( ! $started || $elapsed < VOIGUE_CONTACT_MIN_SECONDS || $elapsed > DAY_IN_SECONDS * 2 ) {
		voigue_contact_fail( 'Please wait a moment and try sending again.' );
	}

	if ( '' === $first || mb_strlen( $first ) > 80 ) {
		voigue_contact_fail( 'Please enter your first name.' );
	}
	if ( '' === $last || mb_strlen( $last ) > 80 ) {
		voigue_contact_fail( 'Please enter your last name.' );
	}
	if ( ! is_email( $email ) ) {
		voigue_contact_fail( 'Please enter a valid email address.' );
	}
	if ( mb_strlen( $phone ) > 40 ) {
		voigue_contact_fail( 'That phone number is too long.' );
	}
	if ( mb_strlen( $message ) < 10 ) {
		voigue_contact_fail( 'Please tell us a little more (at least 10 characters).' );
	}
	if ( mb_strlen( $message ) > 3000 ) {
		voigue_contact_fail( 'Your message is too long (3000 characters maximum).' );
	}

	// Rate limit by visitor, without storing their address.
	$remote = isset( $_SERVER['REMOTE_ADDR'] ) ? sanitize_text_field( wp_unslash( $_SERVER['REMOTE_ADDR'] ) ) : 'unknown';
	$key    = 'voigue_rl_' . md5( $remote . wp_salt() );
	$count  = (int) get_transient( $key );
	if ( $count >= VOIGUE_CONTACT_MAX_PER_15M ) {
		voigue_contact_fail( 'You have sent several messages in a short time. Please try again later.', 429 );
	}
	set_transient( $key, $count + 1, 15 * MINUTE_IN_SECONDS );

	$post_id = wp_insert_post(
		array(
			'post_type'   => VOIGUE_MESSAGE_TYPE,
			'post_status' => 'publish',
			'post_title'  => $first . ' ' . $last,
		),
		true
	);
	if ( is_wp_error( $post_id ) || ! $post_id ) {
		voigue_contact_fail( 'We could not save your message. Please email us directly.', 500 );
	}
	update_post_meta( $post_id, '_voigue_email', $email );
	update_post_meta( $post_id, '_voigue_phone', $phone );
	update_post_meta( $post_id, '_voigue_message', $message );

	$settings = voigue_get_settings();
	$to       = is_email( $settings['email_general'] ) ? $settings['email_general'] : get_option( 'admin_email' );
	$body     = sprintf(
		"New message from the Voigue.lk contact form\n\nName: %s %s\nEmail: %s\nPhone: %s\n\n%s\n",
		$first,
		$last,
		$email,
		$phone ? $phone : '(not given)',
		$message
	);
	wp_mail(
		$to,
		'New Voigue.lk enquiry',
		$body,
		array( 'Reply-To: ' . $first . ' ' . $last . ' <' . $email . '>' )
	);

	wp_send_json_success();
}
add_action( 'wp_ajax_nopriv_voigue_contact', 'voigue_handle_contact' );
add_action( 'wp_ajax_voigue_contact', 'voigue_handle_contact' );
