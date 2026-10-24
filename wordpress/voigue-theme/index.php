<?php
/**
 * Blog list. Also used for categories, tags, dates and search results.
 *
 * @package Voigue_Theme
 */

defined( 'ABSPATH' ) || exit;

get_header();

if ( is_home() ) {
	$voigue_heading = 'Ideas for building better managed global teams.';
	$voigue_eyebrow = 'Blog';
} elseif ( is_search() ) {
	/* translators: %s: search query. */
	$voigue_heading = sprintf( 'Results for "%s"', get_search_query() );
	$voigue_eyebrow = 'Search';
} else {
	$voigue_heading = wp_strip_all_tags( get_the_archive_title() );
	$voigue_eyebrow = 'Blog';
}
?>
<section class="bg-white pt-32">
	<div class="container-x py-16">
		<p class="text-xs font-semibold uppercase tracking-[0.28em] text-brand-violet"><?php echo esc_html( $voigue_eyebrow ); ?></p>
		<h1 class="mt-4 max-w-4xl text-4xl font-semibold leading-tight tracking-tight sm:text-6xl"><?php echo esc_html( $voigue_heading ); ?></h1>
		<div class="mt-8 max-w-lg"><?php get_search_form(); ?></div>

		<div class="mt-10 grid gap-4 md:grid-cols-2">
			<?php if ( have_posts() ) : ?>
				<?php
				while ( have_posts() ) :
					the_post();
					$voigue_cats = get_the_category();
					?>
					<a href="<?php the_permalink(); ?>" class="focus-ring flex flex-col rounded-2xl border border-line bg-paper p-7 transition hover:shadow-soft">
						<p class="text-sm font-semibold text-brand-violet"><?php echo esc_html( $voigue_cats ? $voigue_cats[0]->name : get_the_date() ); ?></p>
						<h2 class="mt-4 text-2xl font-semibold"><?php the_title(); ?></h2>
						<p class="mt-3 leading-7 text-muted"><?php echo esc_html( wp_trim_words( get_the_excerpt(), 28 ) ); ?></p>
					</a>
				<?php endwhile; ?>
			<?php else : ?>
				<p class="text-muted">No articles found.</p>
			<?php endif; ?>
		</div>

		<?php
		the_posts_pagination(
			array(
				'mid_size'  => 1,
				'prev_text' => 'Previous',
				'next_text' => 'Next',
			)
		);
		?>
	</div>
</section>
<?php
get_footer();
