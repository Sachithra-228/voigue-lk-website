<?php
/**
 * Life at Voigue: "Life around here." gallery with category filters. Hidden until at least one photo exists.
 *
 * @package Voigue_Theme
 */

defined( 'ABSPATH' ) || exit;

$voigue_moments = new WP_Query(
	array(
		'post_type'      => 'voigue_moment',
		'post_status'    => 'publish',
		'posts_per_page' => 40,
		'orderby'        => array(
			'menu_order' => 'ASC',
			'date'       => 'DESC',
		),
		'no_found_rows'  => true,
	)
);
if ( ! $voigue_moments->have_posts() ) {
	return;
}

// Filter buttons: the categories that actually have photos, in the agreed order first.
$voigue_terms = get_terms(
	array(
		'taxonomy'   => 'voigue_moment_category',
		'hide_empty' => true,
	)
);
$voigue_order = array( 'parties' => 0, 'events' => 1, 'community' => 2 );
if ( is_array( $voigue_terms ) ) {
	usort(
		$voigue_terms,
		static function ( $a, $b ) use ( $voigue_order ) {
			return ( $voigue_order[ $a->slug ] ?? 99 ) <=> ( $voigue_order[ $b->slug ] ?? 99 );
		}
	);
} else {
	$voigue_terms = array();
}
?>
<section class="overflow-hidden bg-white py-20 lg:py-28" data-gallery>
	<div class="container-x">
		<div class="reveal max-w-3xl">
			<h2 class="text-5xl font-semibold leading-none tracking-tight text-ink sm:text-6xl lg:text-7xl">Life around here.</h2>
			<p class="mt-6 text-lg leading-8 text-muted">Parties, events, community days, plans that make it out of the group chat and plenty we probably have too many photos of by now.</p>
		</div>

		<div class="mt-12 md:px-6">
			<div class="carousel relative" data-carousel role="region" aria-roledescription="carousel" aria-label="Life around here photos">
				<button type="button" class="carousel-arrow carousel-prev" data-carousel-prev aria-label="Previous"><?php echo voigue_icon( 'chevron-left', 'h-5 w-5' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- static SVG markup. ?></button>
				<div class="carousel-track flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-2" data-carousel-track>
					<?php
					while ( $voigue_moments->have_posts() ) :
						$voigue_moments->the_post();
						$voigue_cats = get_the_terms( get_the_ID(), 'voigue_moment_category' );
						$voigue_cat  = ( is_array( $voigue_cats ) && $voigue_cats ) ? $voigue_cats[0] : null;
						?>
						<figure class="group relative w-[72%] shrink-0 snap-start overflow-hidden rounded-2xl sm:w-[calc(33.333%-16px)] lg:w-[calc(25%-18px)]" data-category="<?php echo esc_attr( $voigue_cat ? $voigue_cat->slug : '' ); ?>">
							<?php voigue_render_photo( (int) get_post_thumbnail_id(), 'aspect-[3/4] w-full transition duration-500 group-hover:scale-[1.03]', get_the_title(), get_the_title() ); ?>
							<?php if ( $voigue_cat ) : ?>
								<figcaption class="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-ink backdrop-blur"><?php echo esc_html( $voigue_cat->name ); ?></figcaption>
							<?php endif; ?>
						</figure>
					<?php endwhile; ?>
				</div>
				<button type="button" class="carousel-arrow carousel-next" data-carousel-next aria-label="Next"><?php echo voigue_icon( 'chevron-right', 'h-5 w-5' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- static SVG markup. ?></button>
				<div class="mt-6 flex items-center justify-center gap-2" data-carousel-dots role="group" aria-label="Carousel pagination"></div>
			</div>
			<?php wp_reset_postdata(); ?>
		</div>

		<?php if ( $voigue_terms ) : ?>
			<div class="mt-10 flex flex-wrap justify-center gap-3" role="group" aria-label="Filter moments">
				<button type="button" class="chip is-active" data-filter="" aria-pressed="true">All Moments</button>
				<?php foreach ( $voigue_terms as $voigue_term ) : ?>
					<button type="button" class="chip" data-filter="<?php echo esc_attr( $voigue_term->slug ); ?>" aria-pressed="false"><?php echo esc_html( $voigue_term->name ); ?></button>
				<?php endforeach; ?>
			</div>
		<?php endif; ?>

		<p class="mx-auto mt-10 max-w-md text-center text-2xl font-semibold leading-snug text-ink">This is the side of Voigue you don&rsquo;t get from the job description.</p>
	</div>
</section>
