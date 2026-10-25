<?php
/**
 * Apply and general CV forms: receives the AJAX submission, stores the CV privately and alerts the Talent Acquisition team.
 *
 * Public form, so it is protected with a hidden honeypot field, a minimum-time check and a per-visitor
 * rate limit rather than a nonce (nonces break on cached pages). Uploads are checked by their real contents.
 *
 * @package Voigue_Core
 */

defined( 'ABSPATH' ) || exit;

const VOIGUE_APPLY_MAX_PER_HOUR = 5;

/**
 * @param string $message Error shown to the candidate.
 * @param int    $status  HTTP status.
 */
function voigue_apply_fail( $message, $status = 400 ) {
	wp_send_json_error( array( 'message' => $message ), $status );
}

function voigue_handle_apply() {
	// Honeypot: real visitors never see or fill this field. Answer "success" so bots learn nothing.
	if ( ! empty( $_POST['website'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification.Missing -- public form, see file header.
		wp_send_json_success();
	}

	// A file bigger than the server's post_max_size arrives as an empty request.
	if ( empty( $_POST ) && empty( $_FILES ) && ! empty( $_SERVER['CONTENT_LENGTH'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification.Missing
		voigue_apply_fail( 'Your CV is larger than 4 MB. Please upload a smaller file.', 413 );
	}

	// phpcs:disable WordPress.Security.NonceVerification.Missing -- public form, see file header.
	$type     = ( isset( $_POST['type'] ) && 'general' === $_POST['type'] ) ? 'general' : 'role';
	$name     = isset( $_POST['name'] ) ? sanitize_text_field( wp_unslash( $_POST['name'] ) ) : '';
	$email    = isset( $_POST['email'] ) ? sanitize_email( wp_unslash( $_POST['email'] ) ) : '';
	$message  = isset( $_POST['message'] ) ? sanitize_textarea_field( wp_unslash( $_POST['message'] ) ) : '';
	$interest = isset( $_POST['role_interest'] ) ? sanitize_text_field( wp_unslash( $_POST['role_interest'] ) ) : '';
	$setup    = isset( $_POST['preferred_setup'] ) ? sanitize_text_field( wp_unslash( $_POST['preferred_setup'] ) ) : '';
	$job_id   = isset( $_POST['job_id'] ) ? absint( $_POST['job_id'] ) : 0;
	$started  = isset( $_POST['started'] ) ? absint( $_POST['started'] ) : 0;
	// phpcs:enable

	$elapsed = time() - (int) floor( $started / 1000 );
	if ( ! $started || $elapsed < 3 || $elapsed > DAY_IN_SECONDS * 2 ) {
		voigue_apply_fail( 'Please wait a moment and try sending again.' );
	}

	if ( mb_strlen( $name ) < 2 || mb_strlen( $name ) > 120 ) {
		voigue_apply_fail( 'Please enter your full name.' );
	}
	if ( ! is_email( $email ) ) {
		voigue_apply_fail( 'Please enter a valid email address.' );
	}

	$job_title = '';
	if ( 'role' === $type ) {
		$job = $job_id ? get_post( $job_id ) : null;
		if ( ! $job || VOIGUE_JOB_TYPE !== $job->post_type || 'publish' !== $job->post_status ) {
			voigue_apply_fail( 'This vacancy is no longer open. Please refresh the page and try again.' );
		}
		$job_title = $job->post_title;
		if ( mb_strlen( $message ) < 10 ) {
			voigue_apply_fail( 'Tell us a little about yourself (at least 10 characters).' );
		}
		if ( mb_strlen( $message ) > 4000 ) {
			voigue_apply_fail( 'Your message is too long (4000 characters maximum).' );
		}
	} else {
		if ( mb_strlen( $interest ) < 2 || mb_strlen( $interest ) > 200 ) {
			voigue_apply_fail( 'Tell us what kind of role you are interested in.' );
		}
		if ( ! in_array( $setup, voigue_work_setups(), true ) ) {
			voigue_apply_fail( 'Please choose a preferred setup.' );
		}
		if ( mb_strlen( $message ) > 2000 ) {
			voigue_apply_fail( 'Your note is too long (2000 characters maximum).' );
		}
	}

	$cv = voigue_validate_cv( $_FILES['cv'] ?? null ); // phpcs:ignore WordPress.Security.NonceVerification.Missing, WordPress.Security.ValidatedSanitizedInput.InputNotSanitized -- validated field by field inside the function.
	if ( is_wp_error( $cv ) ) {
		voigue_apply_fail( $cv->get_error_message(), 'size' === $cv->get_error_code() ? 413 : 400 );
	}

	// Rate limit by visitor (counted only for submissions that passed every check), without storing their address.
	$remote = isset( $_SERVER['REMOTE_ADDR'] ) ? sanitize_text_field( wp_unslash( $_SERVER['REMOTE_ADDR'] ) ) : 'unknown';
	$key    = 'voigue_rl_apply_' . md5( $remote . wp_salt() );
	$count  = (int) get_transient( $key );
	if ( $count >= VOIGUE_APPLY_MAX_PER_HOUR ) {
		voigue_apply_fail( 'You have sent several applications in a short time. Please try again later.', 429 );
	}

	$stored = voigue_store_cv( $_FILES['cv']['tmp_name'], $cv['ext'] ); // phpcs:ignore WordPress.Security.NonceVerification.Missing, WordPress.Security.ValidatedSanitizedInput.InputNotSanitized -- path comes from PHP's upload handling and was verified by is_uploaded_file().
	if ( ! $stored ) {
		voigue_apply_fail( 'We could not save your CV. Please try again or email it to us directly.', 500 );
	}

	$post_id = wp_insert_post(
		array(
			'post_type'   => VOIGUE_APPLICATION_TYPE,
			'post_status' => 'publish',
			'post_title'  => $name,
		),
		true
	);
	if ( is_wp_error( $post_id ) || ! $post_id ) {
		wp_delete_file( voigue_private_dir() . '/cvs/' . $stored );
		voigue_apply_fail( 'We could not save your application. Please try again or email us directly.', 500 );
	}
	set_transient( $key, $count + 1, HOUR_IN_SECONDS );

	update_post_meta( $post_id, '_voigue_type', $type );
	update_post_meta( $post_id, '_voigue_email', $email );
	update_post_meta( $post_id, '_voigue_message', $message );
	update_post_meta( $post_id, '_voigue_status', 'New' );
	update_post_meta( $post_id, '_voigue_cv_file', $stored );
	update_post_meta( $post_id, '_voigue_cv_name', $cv['name'] );
	update_post_meta( $post_id, '_voigue_cv_mime', $cv['mime'] );
	update_post_meta( $post_id, '_voigue_cv_size', $cv['size'] );
	if ( 'role' === $type ) {
		update_post_meta( $post_id, '_voigue_job_id', $job_id );
		update_post_meta( $post_id, '_voigue_job_title', $job_title );
	} else {
		update_post_meta( $post_id, '_voigue_role_interest', $interest );
		update_post_meta( $post_id, '_voigue_preferred_setup', $setup );
	}

	voigue_notify_new_application( $post_id, $type, $name, $email, $message, $job_title, $interest, $setup );
	wp_send_json_success();
}
add_action( 'wp_ajax_nopriv_voigue_apply', 'voigue_handle_apply' );
add_action( 'wp_ajax_voigue_apply', 'voigue_handle_apply' );

/**
 * Emails the careers inbox. The CV is NOT attached (it stays in the private folder); the email links to the admin.
 *
 * @param int    $post_id   Application ID.
 * @param string $type      role or general.
 * @param string $name      Candidate name.
 * @param string $email     Candidate email.
 * @param string $message   Their message.
 * @param string $job_title Vacancy title (role applications).
 * @param string $interest  Role interest (general CVs).
 * @param string $setup     Preferred setup (general CVs).
 */
function voigue_notify_new_application( $post_id, $type, $name, $email, $message, $job_title, $interest, $setup ) {
	$settings = voigue_get_settings();
	$to       = is_email( $settings['email_careers'] ) ? $settings['email_careers'] : get_option( 'admin_email' );

	$lines = array(
		'role' === $type ? 'New application: ' . $job_title : 'New general CV submission',
		'',
		'Name: ' . $name,
		'Email: ' . $email,
	);
	if ( 'general' === $type ) {
		$lines[] = 'Interested in: ' . $interest;
		$lines[] = 'Preferred setup: ' . $setup;
	}
	$lines[] = '';
	$lines[] = $message ? $message : '(no additional note)';
	$lines[] = '';
	$lines[] = 'Review the application and download the CV here (sign in required):';
	$lines[] = admin_url( 'post.php?post=' . (int) $post_id . '&action=edit' );

	wp_mail(
		$to,
		'role' === $type ? 'New application: ' . $job_title : 'New general CV submission',
		implode( "\n", $lines ),
		array( 'Reply-To: ' . $name . ' <' . $email . '>' )
	);
}
