<?php
/**
 * A single blog article.
 *
 * @package Voigue_Theme
 */

defined( 'ABSPATH' ) || exit;

get_header();
?>
<?php
while ( have_posts() ) :
	the_post();
	$voigue_cats = get_the_category();
	?>
	<article class="bg-white pt-32">
		<div class="container-x max-w-3xl py-16">
			<p class="text-xs font-semibold uppercase tracking-[0.28em] text-brand-violet"><?php echo esc_html( $voigue_cats ? $voigue_cats[0]->name : 'Blog' ); ?></p>
			<h1 class="mt-4 text-4xl font-semibold leading-tight tracking-tight sm:text-6xl"><?php the_title(); ?></h1>
			<p class="mt-5 text-sm text-muted"><?php echo esc_html( get_the_date() ); ?></p>
			<?php if ( has_post_thumbnail() ) : ?>
				<div class="mt-10 overflow-hidden rounded-2xl"><?php the_post_thumbnail( 'large', array( 'class' => 'h-auto w-full' ) ); ?></div>
			<?php endif; ?>
			<div class="prose-content mt-12 text-lg leading-8 text-muted"><?php the_content(); ?></div>
			<p class="mt-12"><a class="btn btn-outline" href="<?php echo esc_url( get_post_type_archive_link( 'post' ) ?: home_url( '/blog/' ) ); ?>">Back to the blog</a></p>
		</div>
	</article>
<?php endwhile; ?>
<?php
get_footer();
