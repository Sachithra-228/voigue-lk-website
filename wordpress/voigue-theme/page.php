<?php
/**
 * Default page template.
 *
 * @package Voigue_Theme
 */

defined( 'ABSPATH' ) || exit;

get_header();
?>
<section class="bg-white pt-32">
	<div class="container-x max-w-3xl py-16">
		<?php
		while ( have_posts() ) :
			the_post();
			?>
			<h1 class="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl"><?php the_title(); ?></h1>
			<div class="prose-content mt-8 text-lg leading-8 text-muted"><?php the_content(); ?></div>
		<?php endwhile; ?>
	</div>
</section>
<?php
get_footer();
