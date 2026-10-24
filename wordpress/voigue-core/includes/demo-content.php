<?php
/**
 * Optional demo content (vacancies, voices, gallery), so the site can be previewed before real content is added.
 *
 * @package Voigue_Core
 */

defined( 'ABSPATH' ) || exit;

/**
 * @return array<int,array<string,mixed>>
 */
function voigue_demo_jobs() {
	return array(
		array(
			'title'        => 'Social Media Executive',
			'summary'      => 'Create and manage engaging content that helps grow our brand across social platforms.',
			'setup'        => 'Remote',
			'location'     => 'Sri Lanka',
			'description'  => "As a Social Media Executive at Voigue, you'll be responsible for creating engaging content, supporting campaigns and helping grow our brand across multiple platforms. You'll work closely with the marketing team to ensure our message connects with our audience and reflects who we are.",
			'duties'       => "Plan, create and schedule content across social media platforms\nSupport brand and campaign initiatives\nMonitor performance and report on engagement\nStay on top of trends and bring fresh ideas to the team",
			'requirements' => "Previous experience in social media or content creation\nA good eye for design, tone and detail\nStrong written English\nA proactive, creative mindset",
		),
		array(
			'title'        => 'Client Success Manager',
			'summary'      => 'Be the main point of contact for our clients, supporting day-to-day operations and long-term partnerships.',
			'setup'        => 'Hybrid',
			'location'     => 'Colombo, Sri Lanka',
			'description'  => 'You will be the main point of contact for our Australian clients, making sure the people we place are supported and the partnership keeps growing. This is a hybrid role split between home and our Colombo office.',
			'duties'       => "Own day-to-day communication with assigned clients\nIdentify and resolve issues before they grow\nRun regular check-ins with clients and placed talent\nWork with recruitment to plan upcoming needs",
			'requirements' => "Experience in account management, customer success or a similar role\nConfident communicator, comfortable with international clients\nOrganised, calm under pressure and genuinely people-focused",
		),
		array(
			'title'        => 'Talent Acquisition Executive',
			'summary'      => 'Source, screen and shortlist talent to help us find the right fit for our clients.',
			'setup'        => 'On-site',
			'location'     => 'Colombo, Sri Lanka',
			'description'  => 'Join our Talent Acquisition team and help match great people with the businesses that need them. You will handle the journey from first call to shortlisted profile, working side by side with the team in our Colombo office.',
			'duties'       => "Source and screen candidates for client roles\nRun initial screening calls and internal interviews\nPrepare and present shortlists to clients\nKeep candidates informed and supported throughout",
			'requirements' => "Recruitment or HR experience is an advantage\nExcellent interpersonal and communication skills\nGood judgement when assessing skills and fit",
		),
		array(
			'title'        => 'Graphic Designer',
			'summary'      => 'Bring ideas to life through clean, on-brand design across digital and print.',
			'setup'        => 'Remote',
			'location'     => 'Sri Lanka',
			'description'  => 'Create design that looks and feels like Voigue, from social content and campaign assets to documents and presentations. You will work with a close team of marketers and video creators.',
			'duties'       => "Design assets for digital, social and print\nMaintain brand consistency across all materials\nCollaborate with marketing and video teams",
			'requirements' => "Portfolio demonstrating strong visual design\nProficiency in Adobe Creative Suite or Figma\nAttention to detail and a love of typography",
		),
		array(
			'title'        => 'Video Editor',
			'summary'      => 'Edit and produce video content for campaigns, social media and internal projects.',
			'setup'        => 'Hybrid',
			'location'     => 'Colombo, Sri Lanka',
			'description'  => 'Shape the stories we tell about Voigue and our clients: short-form social video, event recaps, campaign pieces and internal content.',
			'duties'       => "Edit and produce video for campaigns and social channels\nAdd motion graphics, sound and colour where needed\nManage a content pipeline with multiple deadlines",
			'requirements' => "Experience with Premiere Pro, After Effects or similar\nA strong eye for pacing and storytelling\nA portfolio of previous work",
		),
		array(
			'title'        => 'Project Coordinator',
			'summary'      => 'Support project delivery and keep workflows on track across teams.',
			'setup'        => 'On-site',
			'location'     => 'Colombo, Sri Lanka',
			'description'  => 'Keep projects moving. You will coordinate across teams, track progress and make sure nothing falls through the cracks, working in person at our Colombo office.',
			'duties'       => "Coordinate tasks, timelines and deliverables\nReport on progress and flag risks early\nSupport teams with documentation and follow-ups",
			'requirements' => "Experience coordinating projects or operations\nStrong organisation and communication\nComfortable working across several teams at once",
		),
	);
}

/**
 * @return int Number of demo vacancies created.
 */
function voigue_create_demo_jobs() {
	$created = 0;
	foreach ( voigue_demo_jobs() as $index => $job ) {
		$post_id = wp_insert_post(
			array(
				'post_type'    => VOIGUE_JOB_TYPE,
				'post_status'  => 'publish',
				'post_title'   => $job['title'],
				'post_content' => $job['description'],
				'menu_order'   => $index,
			)
		);
		if ( is_wp_error( $post_id ) || ! $post_id ) {
			continue;
		}
		update_post_meta( $post_id, '_voigue_summary', $job['summary'] );
		update_post_meta( $post_id, '_voigue_setup', $job['setup'] );
		update_post_meta( $post_id, '_voigue_location', $job['location'] );
		update_post_meta( $post_id, '_voigue_employment_type', 'Full-time' );
		update_post_meta( $post_id, '_voigue_responsibilities', $job['duties'] );
		update_post_meta( $post_id, '_voigue_requirements', $job['requirements'] );
		update_post_meta( $post_id, '_voigue_demo', '1' );
		++$created;
	}
	return $created;
}

/**
 * Demo employee voices (clearly labelled placeholders; no real people or invented quotes).
 *
 * @return int Number created.
 */
function voigue_create_demo_voices() {
	$created = 0;
	for ( $i = 0; $i < 5; $i++ ) {
		$post_id = wp_insert_post(
			array(
				'post_type'   => VOIGUE_VOICE_TYPE,
				'post_status' => 'publish',
				'post_title'  => 'Employee name',
				'menu_order'  => $i,
			)
		);
		if ( is_wp_error( $post_id ) || ! $post_id ) {
			continue;
		}
		update_post_meta( $post_id, '_voigue_role', 'Role title' );
		update_post_meta( $post_id, '_voigue_quote', 'A short testimonial from a Voigue team member will appear here once approved copy and photos are supplied.' );
		update_post_meta( $post_id, '_voigue_demo', '1' );
		++$created;
	}
	return $created;
}

/**
 * Demo gallery items (no photos; the page shows the neutral placeholder).
 *
 * @return int Number created.
 */
function voigue_create_demo_moments() {
	$items   = array(
		array( 'Team celebration', 'Parties' ),
		array( 'Community day', 'Community' ),
		array( 'Annual event', 'Events' ),
		array( 'Year-end party', 'Parties' ),
		array( 'Giving back', 'Community' ),
		array( 'Company offsite', 'Events' ),
		array( 'Festive get-together', 'Parties' ),
		array( 'Volunteer day', 'Community' ),
	);
	$created = 0;
	foreach ( $items as $index => $item ) {
		$post_id = wp_insert_post(
			array(
				'post_type'   => VOIGUE_MOMENT_TYPE,
				'post_status' => 'publish',
				'post_title'  => $item[0],
				'menu_order'  => $index,
			)
		);
		if ( is_wp_error( $post_id ) || ! $post_id ) {
			continue;
		}
		wp_set_object_terms( $post_id, $item[1], VOIGUE_MOMENT_TAX );
		update_post_meta( $post_id, '_voigue_demo', '1' );
		++$created;
	}
	return $created;
}

/**
 * @return int Number of demo items removed (vacancies, voices and gallery items).
 */
function voigue_remove_demo_jobs() {
	$ids = get_posts(
		array(
			'post_type'      => array( VOIGUE_JOB_TYPE, VOIGUE_VOICE_TYPE, VOIGUE_MOMENT_TYPE ),
			'post_status'    => 'any',
			'posts_per_page' => -1,
			'fields'         => 'ids',
			'meta_key'       => '_voigue_demo', // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_key
			'meta_value'     => '1', // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_value
		)
	);
	foreach ( $ids as $id ) {
		wp_delete_post( (int) $id, true );
	}
	return count( $ids );
}

function voigue_handle_demo_action() {
	if ( ! current_user_can( 'manage_options' ) ) {
		wp_die( 'You do not have permission to do this.', 403 );
	}
	check_admin_referer( 'voigue_demo' );

	$do = isset( $_POST['voigue_demo_do'] ) ? sanitize_key( wp_unslash( $_POST['voigue_demo_do'] ) ) : '';
	if ( 'create' === $do ) {
		$jobs    = voigue_create_demo_jobs();
		$voices  = voigue_create_demo_voices();
		$moments = voigue_create_demo_moments();
		$msg     = sprintf( 'Created %1$d demo vacancies, %2$d employee voices and %3$d gallery items.', $jobs, $voices, $moments );
	} else {
		$count = voigue_remove_demo_jobs();
		$msg   = sprintf( 'Removed %d demo items.', $count );
	}
	set_transient( 'voigue_notice_' . get_current_user_id(), $msg, 60 );
	wp_safe_redirect( admin_url( 'admin.php?page=voigue-health' ) );
	exit;
}
add_action( 'admin_post_voigue_demo', 'voigue_handle_demo_action' );
