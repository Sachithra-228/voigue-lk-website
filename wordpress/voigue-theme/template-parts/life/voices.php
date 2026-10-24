<?php
/**
 * Life at Voigue: "Employee Voices" carousel. Hidden until at least one voice is published.
 *
 * @package Voigue_Theme
 */

defined( 'ABSPATH' ) || exit;

$voigue_voices = new WP_Query(
	array(
		'post_type'      => 'voigue_voice',
		'post_status'    => 'publish',
		'posts_per_page' => 20,
		'orderby'        => array(
			'menu_order' => 'ASC',
			'date'       => 'DESC',
		),
		'no_found_rows'  => true,
	)
);
if ( ! $voigue_voices->have_posts() ) {
	return;
}
?>
<section class="bg-white py-20 lg:py-28">
	<div class="container-x">
		<h2 class="reveal text-center text-4xl font-semibold tracking-tight text-ink sm:text-5xl lg:text-6xl">Employee Voices</h2>
		<div class="mt-14 md:px-6">
			<div class="carousel relative" data-carousel role="region" aria-roledescription="carousel" aria-label="Employee voices">
				<button type="button" class="carousel-arrow carousel-prev" data-carousel-prev aria-label="Previous"><?php echo voigue_icon( 'chevron-left', 'h-5 w-5' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- static SVG markup. ?></button>
				<div class="carousel-track flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-2" data-carousel-track>
					<?php
					while ( $voigue_voices->have_posts() ) :
						$voigue_voices->the_post();
						$voigue_role  = (string) get_post_meta( get_the_ID(), '_voigue_role', true );
						$voigue_quote = (string) get_post_meta( get_the_ID(), '_voigue_quote', true );
						?>
						<figure class="w-[78%] shrink-0 snap-start sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]">
							<?php voigue_render_photo( (int) get_post_thumbnail_id(), 'aspect-[4/5] w-full rounded-2xl', 'Portrait', get_the_title() ); ?>
							<figcaption class="mt-5">
								<p class="text-lg font-semibold text-ink"><?php the_title(); ?></p>
								<p class="text-sm text-muted"><?php echo esc_html( $voigue_role ); ?></p>
							</figcaption>
							<blockquote class="mt-3 leading-7 text-muted">&ldquo;<?php echo esc_html( $voigue_quote ); ?>&rdquo;</blockquote>
						</figure>
					<?php endwhile; ?>
				</div>
				<button type="button" class="carousel-arrow carousel-next" data-carousel-next aria-label="Next"><?php echo voigue_icon( 'chevron-right', 'h-5 w-5' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- static SVG markup. ?></button>
				<div class="mt-6 flex items-center justify-center gap-2" data-carousel-dots role="group" aria-label="Carousel pagination"></div>
			</div>
			<?php wp_reset_postdata(); ?>
		</div>
	</div>
</section>
