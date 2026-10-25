<?php
/**
 * Careers: "Take a look at what's open." The vacancy board. "Read more" expands the full description in place; Apply opens the form.
 *
 * @package Voigue_Theme
 */

defined( 'ABSPATH' ) || exit;

$voigue_jobs = new WP_Query(
	array(
		'post_type'      => 'voigue_job',
		'post_status'    => 'publish',
		'posts_per_page' => 50,
		'orderby'        => array(
			'menu_order' => 'ASC',
			'date'       => 'DESC',
		),
		'no_found_rows'  => true,
	)
);

/**
 * One list item per non-empty line of a multi-line field.
 *
 * @param string $text Newline-separated lines.
 * @return string[]
 */
$voigue_lines = static function ( $text ) {
	return array_values( array_filter( array_map( 'trim', preg_split( '/\r\n|\r|\n/', (string) $text ) ) ) );
};
?>
<section id="current-openings" class="scroll-mt-20 bg-white py-20 lg:py-28">
	<div class="container-x">
		<div class="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
			<div class="reveal max-w-2xl">
				<p class="text-[11px] font-semibold uppercase tracking-[0.32em] text-muted">Current Openings</p>
				<h2 class="mt-4 text-4xl font-semibold leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-6xl">Take a look at what&rsquo;s open.</h2>
				<p class="mt-5 text-lg leading-8 text-muted">Browse the opportunities currently available across our teams.</p>
			</div>
			<ul class="flex flex-wrap gap-x-6 gap-y-2 rounded-2xl border border-line px-5 py-3 text-sm text-muted" aria-label="Work setup key">
				<?php foreach ( array( 'Remote', 'Hybrid', 'On-site' ) as $voigue_setup ) : ?>
					<li class="inline-flex items-center gap-2"><span class="h-2.5 w-2.5 rounded-full <?php echo esc_attr( voigue_setup_dot_class( $voigue_setup ) ); ?>" aria-hidden="true"></span><?php echo esc_html( $voigue_setup ); ?></li>
				<?php endforeach; ?>
			</ul>
		</div>

		<?php if ( $voigue_jobs->have_posts() ) : ?>
			<ul class="mt-12 border-t border-line" data-jobs>
				<?php
				while ( $voigue_jobs->have_posts() ) :
					$voigue_jobs->the_post();
					$voigue_id      = get_the_ID();
					$voigue_setup   = (string) get_post_meta( $voigue_id, '_voigue_setup', true );
					$voigue_summary = (string) get_post_meta( $voigue_id, '_voigue_summary', true );
					$voigue_duties  = $voigue_lines( get_post_meta( $voigue_id, '_voigue_responsibilities', true ) );
					$voigue_needs   = $voigue_lines( get_post_meta( $voigue_id, '_voigue_requirements', true ) );
					$voigue_panel   = 'job-panel-' . $voigue_id;
					?>
					<li class="border-b border-line">
						<div class="grid gap-4 py-6 md:grid-cols-[1fr_auto] md:items-center md:gap-8">
							<div>
								<h3 class="text-xl font-semibold text-ink"><?php the_title(); ?></h3>
								<p class="mt-1.5 max-w-2xl text-sm leading-6 text-muted"><?php echo esc_html( $voigue_summary ); ?></p>
							</div>
							<div class="flex flex-wrap items-center gap-x-6 gap-y-3">
								<span class="inline-flex min-w-20 items-center gap-2 text-sm font-medium text-ink">
									<span class="h-2.5 w-2.5 rounded-full <?php echo esc_attr( voigue_setup_dot_class( $voigue_setup ) ); ?>" aria-hidden="true"></span><?php echo esc_html( $voigue_setup ); ?>
								</span>
								<button type="button" class="focus-ring inline-flex min-h-10 items-center rounded-full border border-ink/25 px-5 text-sm font-semibold text-ink transition hover:border-ink hover:bg-ink hover:text-white" data-open-cv="role" data-job-id="<?php echo esc_attr( (string) $voigue_id ); ?>" data-job-title="<?php echo esc_attr( get_the_title() ); ?>">Apply</button>
								<button type="button" class="job-toggle focus-ring inline-flex min-h-10 items-center gap-1.5 text-sm font-medium text-muted transition hover:text-ink" data-job-toggle aria-expanded="false" aria-controls="<?php echo esc_attr( $voigue_panel ); ?>">
									<span data-job-toggle-label>Read more</span>
									<?php echo voigue_icon( 'chevron-down', 'job-chevron h-4 w-4 transition-transform' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- static SVG markup. ?>
								</button>
							</div>
						</div>
						<div id="<?php echo esc_attr( $voigue_panel ); ?>" class="job-panel" role="region" aria-label="<?php echo esc_attr( get_the_title() . ' details' ); ?>">
							<div inert>
								<div class="grid gap-8 pb-8 md:grid-cols-[1.2fr_1fr] md:gap-12">
									<div class="prose-content leading-7 text-muted"><?php echo wp_kses_post( wpautop( get_the_content() ) ); ?></div>
									<div class="grid content-start gap-6">
										<?php foreach ( array( 'Key responsibilities' => $voigue_duties, "What we're looking for" => $voigue_needs ) as $voigue_heading => $voigue_items ) : ?>
											<?php if ( $voigue_items ) : ?>
												<div>
													<h4 class="text-sm font-semibold text-ink"><?php echo esc_html( $voigue_heading ); ?></h4>
													<ul class="mt-3 grid gap-2 text-sm leading-6 text-muted">
														<?php foreach ( $voigue_items as $voigue_item ) : ?>
															<li class="flex gap-3"><span class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-violet" aria-hidden="true"></span><?php echo esc_html( $voigue_item ); ?></li>
														<?php endforeach; ?>
													</ul>
												</div>
											<?php endif; ?>
										<?php endforeach; ?>
									</div>
								</div>
							</div>
						</div>
					</li>
				<?php endwhile; ?>
			</ul>
			<?php wp_reset_postdata(); ?>
		<?php else : ?>
			<p class="mt-12 rounded-2xl bg-paper p-8 text-center text-muted">There are no vacancies listed right now, but we&rsquo;re always open to great people. Send us your CV below and we&rsquo;ll keep you in mind.</p>
		<?php endif; ?>
	</div>
</section>
