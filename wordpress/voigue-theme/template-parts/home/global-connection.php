<?php
/**
 * Home: "Linking Lankan talent..." with the world-map globe.
 *
 * @package Voigue_Theme
 */

defined( 'ABSPATH' ) || exit;

$voigue_about = get_page_by_path( 'about-us' );
?>
<section class="relative overflow-hidden bg-white py-20 lg:py-28">
	<div class="container-x grid items-center gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
		<div class="reveal" data-reveal="left">
			<h2 class="text-4xl font-semibold leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-6xl">Linking <span class="text-brand-violet">Lankan</span> talent with businesses across Australia and beyond.</h2>
			<p class="mt-8 text-lg leading-8 text-muted">The idea is pretty simple. Great talent is in Sri Lanka, great businesses are out there, and we help bring the two together. Being Australian-based means the roles we create put you directly into teams working with businesses across Australia and beyond, giving you international exposure from day one.</p>
			<a href="<?php echo esc_url( $voigue_about ? get_permalink( $voigue_about ) : home_url( '/about-us/' ) ); ?>" class="btn btn-primary mt-8">About Voigue <?php echo voigue_icon( 'arrow-right', 'h-4 w-4' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- static SVG markup. ?></a>
		</div>
		<div class="reveal" data-reveal="right" style="--delay: 0.1s">
			<?php get_template_part( 'template-parts/globe' ); ?>
		</div>
	</div>
</section>
