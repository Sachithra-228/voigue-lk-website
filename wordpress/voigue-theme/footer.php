<?php
/**
 * Site footer.
 *
 * @package Voigue_Theme
 */

defined( 'ABSPATH' ) || exit;

$voigue_socials = array(
	'LinkedIn'  => array( 'social_linkedin', 'linkedin' ),
	'Instagram' => array( 'social_instagram', 'instagram' ),
	'Facebook'  => array( 'social_facebook', 'facebook' ),
	'TikTok'    => array( 'social_tiktok', 'tiktok' ),
);
$voigue_privacy = get_page_by_path( 'privacy-policy' );
$voigue_terms   = get_page_by_path( 'terms-of-use' );
?>
</main>

<footer class="site-footer px-3 pb-3 pt-10 sm:px-5 sm:pb-5">
	<div class="relative overflow-hidden rounded-[2rem] bg-[linear-gradient(135deg,hsl(278_63%_16%),hsl(266_58%_26%))] text-white">
		<?php /* Slot for the supplied Voigue wave artwork (not recreated in code). */ ?>
		<div class="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand-violet/30 blur-3xl" aria-hidden="true"></div>

		<div class="container-x relative grid gap-12 py-14 lg:grid-cols-[1.2fr_0.8fr_1fr_1.4fr_0.8fr] lg:py-16">
			<div>
				<a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="focus-ring relative block h-12 w-36" aria-label="Voigue home">
					<img class="h-full w-full object-contain object-left" src="<?php echo esc_url( VOIGUE_THEME_URI . '/assets/images/nav_logo_light.png' ); ?>" alt="Voigue" width="144" height="48" loading="lazy" decoding="async">
				</a>
				<p class="mt-5 max-w-[16rem] text-sm leading-6 text-white/70"><?php echo esc_html( voigue_setting( 'brand_line' ) ); ?></p>
				<div class="mt-6 grid gap-2 text-sm text-white/80">
					<a class="inline-flex items-center gap-2 transition hover:text-white" href="tel:<?php echo esc_attr( preg_replace( '/\s+/', '', voigue_setting( 'phone_lk' ) ) ); ?>">
						<?php echo voigue_icon( 'phone', 'h-4 w-4' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- static SVG markup. ?>
						<?php echo esc_html( voigue_setting( 'phone_lk' ) ); ?>
					</a>
					<span class="inline-flex items-center gap-2">
						<?php echo voigue_icon( 'globe', 'h-4 w-4' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- static SVG markup. ?>
						<?php echo esc_html( voigue_setting( 'website' ) ); ?>
					</span>
				</div>
			</div>

			<div>
				<p class="footer-heading">Quick Links</p>
				<?php
				wp_nav_menu(
					array(
						'theme_location' => 'footer',
						'container'      => false,
						'menu_class'     => 'footer-links mt-5 grid gap-3',
						'depth'          => 1,
						'fallback_cb'    => false,
					)
				);
				?>
			</div>

			<div>
				<p class="footer-heading">Careers</p>
				<ul class="footer-links mt-5 grid gap-3">
					<li><a href="<?php echo esc_url( voigue_open_roles_url() ); ?>">View Open Roles</a></li>
					<li class="text-sm leading-6 text-white/70">
						Send your CV to<br>
						<a class="font-medium !text-white underline-offset-4 hover:underline" href="mailto:<?php echo esc_attr( voigue_setting( 'email_careers' ) ); ?>"><?php echo esc_html( voigue_setting( 'email_careers' ) ); ?></a>
					</li>
				</ul>
			</div>

			<div>
				<p class="footer-heading">Our Locations</p>
				<address class="mt-5 grid gap-5 text-sm not-italic leading-6 text-white/70">
					<p><span class="block font-semibold text-violet-300">Australia</span><?php echo esc_html( voigue_setting( 'address_au' ) ); ?></p>
					<p><span class="block font-semibold text-violet-300">Sri Lanka</span><?php echo esc_html( voigue_setting( 'address_lk' ) ); ?></p>
				</address>
			</div>

			<div>
				<p class="footer-heading">Follow Us</p>
				<div class="mt-5 flex flex-wrap gap-3">
					<?php foreach ( $voigue_socials as $voigue_label => $voigue_social ) : ?>
						<?php $voigue_url = voigue_setting( $voigue_social[0] ); ?>
						<?php if ( $voigue_url ) : ?>
							<a href="<?php echo esc_url( $voigue_url ); ?>" target="_blank" rel="noopener noreferrer" aria-label="<?php echo esc_attr( $voigue_label ); ?>" title="<?php echo esc_attr( $voigue_label ); ?>" class="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white/80 transition hover:border-white/50 hover:bg-white/20 hover:text-white">
								<?php echo voigue_icon( $voigue_social[1], 'h-[17px] w-[17px]' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- static SVG markup. ?>
							</a>
						<?php endif; ?>
					<?php endforeach; ?>
				</div>
			</div>
		</div>

		<div class="container-x relative flex flex-col gap-3 border-t border-white/10 py-6 text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between">
			<p>&copy; <?php echo esc_html( gmdate( 'Y' ) ); ?> Voigue (Pvt) Ltd. All rights reserved.</p>
			<p class="flex items-center gap-3">
				<a class="transition hover:text-white" href="<?php echo esc_url( $voigue_privacy ? get_permalink( $voigue_privacy ) : get_privacy_policy_url() ); ?>">Privacy Policy</a>
				<span aria-hidden="true">|</span>
				<a class="transition hover:text-white" href="<?php echo esc_url( $voigue_terms ? get_permalink( $voigue_terms ) : home_url( '/terms-of-use/' ) ); ?>">Terms of Use</a>
			</p>
		</div>
	</div>
</footer>

<?php wp_footer(); ?>
</body>
</html>
