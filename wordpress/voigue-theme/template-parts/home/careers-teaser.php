<?php
/**
 * Home: "Like the sound of life here?" with a carousel of live vacancies.
 *
 * @package Voigue_Theme
 */

defined( 'ABSPATH' ) || exit;

$voigue_jobs = new WP_Query(
	array(
		'post_type'      => 'voigue_job',
		'post_status'    => 'publish',
		'posts_per_page' => 12,
		'orderby'        => array(
			'menu_order' => 'ASC',
			'date'       => 'DESC',
		),
		'no_found_rows'  => true,
	)
);
$voigue_open_roles = voigue_open_roles_url();
?>
<section class="bg-paper py-20 lg:py-28">
	<div class="container-x">
		<div class="reveal mx-auto max-w-2xl text-center">
			<p class="text-[11px] font-semibold uppercase tracking-[0.32em] text-muted">Careers</p>
			<h2 class="mt-4 text-4xl font-semibold tracking-tight text-ink sm:text-5xl">Like the sound of life here?</h2>
			<p class="mt-5 text-lg leading-8 text-muted">Browse our current openings and see what catches your eye. We offer remote, hybrid and onsite roles.</p>
		</div>

		<div class="mt-12">
			<?php if ( $voigue_jobs->have_posts() ) : ?>
				<div class="carousel relative" data-carousel role="region" aria-roledescription="carousel" aria-label="Current openings">
					<button type="button" class="carousel-arrow carousel-prev" data-carousel-prev aria-label="Previous"><?php echo voigue_icon( 'chevron-left', 'h-5 w-5' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- static SVG markup. ?></button>
					<div class="carousel-track flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-2" data-carousel-track>
						<?php
						while ( $voigue_jobs->have_posts() ) :
							$voigue_jobs->the_post();
							$voigue_setup    = (string) get_post_meta( get_the_ID(), '_voigue_setup', true );
							$voigue_location = (string) get_post_meta( get_the_ID(), '_voigue_location', true );
							$voigue_summary  = (string) get_post_meta( get_the_ID(), '_voigue_summary', true );
							?>
							<div class="w-[82%] shrink-0 snap-start sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]">
								<a href="<?php echo esc_url( $voigue_open_roles ); ?>" class="focus-ring group flex h-full flex-col rounded-2xl border border-line bg-white p-7 transition hover:-translate-y-1 hover:shadow-soft">
									<h3 class="text-xl font-semibold text-ink"><?php the_title(); ?></h3>
									<p class="mt-3 line-clamp-3 flex-1 leading-7 text-muted"><?php echo esc_html( $voigue_summary ); ?></p>
									<div class="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-line pt-5 text-sm text-muted">
										<span class="inline-flex items-center gap-2">
											<span class="h-2.5 w-2.5 rounded-full <?php echo esc_attr( voigue_setup_dot_class( $voigue_setup ) ); ?>" aria-hidden="true"></span>
											<?php echo esc_html( $voigue_setup ); ?>
										</span>
										<?php if ( $voigue_location ) : ?>
											<span class="inline-flex items-center gap-1.5"><?php echo voigue_icon( 'map-pin', 'h-3.5 w-3.5' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- static SVG markup. ?> <?php echo esc_html( $voigue_location ); ?></span>
										<?php endif; ?>
									</div>
								</a>
							</div>
						<?php endwhile; ?>
					</div>
					<button type="button" class="carousel-arrow carousel-next" data-carousel-next aria-label="Next"><?php echo voigue_icon( 'chevron-right', 'h-5 w-5' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- static SVG markup. ?></button>
					<div class="mt-6 flex items-center justify-center gap-2" data-carousel-dots role="group" aria-label="Carousel pagination"></div>
				</div>
				<?php wp_reset_postdata(); ?>
			<?php else : ?>
				<p class="mx-auto max-w-md rounded-2xl border border-line bg-white p-8 text-center text-muted">There are no vacancies listed right now, but we&rsquo;re always open to great people. Send us your CV from the Careers page.</p>
			<?php endif; ?>
		</div>

		<div class="mt-12 text-center">
			<a href="<?php echo esc_url( $voigue_open_roles ); ?>" class="btn btn-dark">View All Open Roles <?php echo voigue_icon( 'arrow-right', 'h-4 w-4' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- static SVG markup. ?></a>
		</div>
	</div>
</section>
