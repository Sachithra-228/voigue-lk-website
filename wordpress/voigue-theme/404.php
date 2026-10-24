<?php
/**
 * Page not found.
 *
 * @package Voigue_Theme
 */

defined( 'ABSPATH' ) || exit;

get_header();
?>
<section class="bg-white pt-32">
	<div class="container-x py-24">
		<h1 class="text-4xl font-semibold sm:text-5xl">Page not found</h1>
		<p class="mt-4 text-muted">The page you requested does not exist or has moved.</p>
		<a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="btn btn-primary mt-8">Return Home <?php echo voigue_icon( 'arrow-right', 'h-4 w-4' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- static SVG markup. ?></a>
	</div>
</section>
<?php
get_footer();
