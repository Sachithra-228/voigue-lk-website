<?php
/**
 * Home: full-width looping video hero. Clips and poster come from Voigue > Site settings.
 *
 * @package Voigue_Theme
 */

defined( 'ABSPATH' ) || exit;

$voigue_clips = array();
foreach ( array( 'home_hero_clip_1', 'home_hero_clip_2', 'home_hero_clip_3' ) as $voigue_key ) {
	$voigue_url = voigue_media_url( $voigue_key );
	if ( $voigue_url ) {
		$voigue_clips[] = $voigue_url;
	}
}
$voigue_poster = voigue_media_url( 'home_hero_poster' );
?>
<section class="relative flex min-h-[100svh] items-end overflow-hidden bg-brand-navy text-white">
	<div class="absolute inset-0" aria-hidden="true">
		<?php if ( $voigue_clips ) : ?>
			<?php if ( $voigue_poster ) : ?>
				<img class="absolute inset-0 h-full w-full object-cover" src="<?php echo esc_url( $voigue_poster ); ?>" alt="" decoding="async">
			<?php endif; ?>
			<video
				class="absolute inset-0 h-full w-full object-cover motion-reduce:hidden"
				src="<?php echo esc_url( $voigue_clips[0] ); ?>"
				data-hero-video
				data-clips="<?php echo esc_attr( wp_json_encode( $voigue_clips ) ); ?>"
				<?php echo $voigue_poster ? 'poster="' . esc_url( $voigue_poster ) . '"' : ''; ?>
				<?php echo 1 === count( $voigue_clips ) ? 'loop' : ''; ?>
				autoplay muted playsinline preload="auto"></video>
		<?php else : ?>
			<div class="hero-placeholder absolute inset-0"></div>
		<?php endif; ?>
	</div>
	<div class="absolute inset-0 bg-[linear-gradient(to_top,rgba(12,6,34,0.85)_0%,rgba(12,6,34,0.45)_45%,rgba(12,6,34,0.2)_100%)]"></div>

	<div class="container-x relative pb-14 pt-36 lg:pb-20">
		<div class="max-w-3xl animate-[fadeIn_700ms_ease-out]">
			<h1 class="text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">See what&rsquo;s waiting for you at Voigue.</h1>
			<p class="mt-6 max-w-xl text-lg leading-8 text-white/85 sm:text-xl">Remote? Hybrid? International exposure. Find a role that fits the way you want to work.</p>
			<div class="mt-9 flex flex-col gap-3 sm:flex-row">
				<a href="<?php echo esc_url( get_permalink( get_page_by_path( 'careers' ) ) ?: home_url( '/careers/' ) ); ?>" class="btn btn-inverted sm:min-w-44">Explore Careers</a>
				<a href="<?php echo esc_url( get_permalink( get_page_by_path( 'life-at-voigue' ) ) ?: home_url( '/life-at-voigue/' ) ); ?>" class="btn btn-outline-light sm:min-w-44">Life at Voigue</a>
			</div>
		</div>
	</div>
</section>
