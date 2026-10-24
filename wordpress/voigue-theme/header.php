<?php
/**
 * Site header: logo, main menu and the phone menu.
 *
 * @package Voigue_Theme
 */

defined( 'ABSPATH' ) || exit;

$voigue_logo_dir = VOIGUE_THEME_URI . '/assets/images/';
?>
<!doctype html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<?php wp_head(); ?>
</head>
<body <?php body_class( 'antialiased' ); ?>>
<?php wp_body_open(); ?>
<a class="skip-link" href="#main">Skip to content</a>

<header id="site-header" class="site-header <?php echo voigue_has_dark_hero() ? 'is-over-hero' : 'is-solid'; ?>">
	<nav class="container-x flex h-20 items-center justify-between" aria-label="Main navigation">
		<a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="focus-ring relative flex h-12 w-40 items-center" aria-label="Voigue home">
			<img class="logo-light h-full w-full object-contain object-left" src="<?php echo esc_url( $voigue_logo_dir . 'nav_logo_light.png' ); ?>" alt="Voigue" width="160" height="48" decoding="async">
			<img class="logo-dark h-full w-full object-contain object-left" src="<?php echo esc_url( $voigue_logo_dir . 'nav_logo_transparent.png' ); ?>" alt="" width="160" height="48" decoding="async">
		</a>

		<div class="hidden lg:block">
			<?php
			wp_nav_menu(
				array(
					'theme_location' => 'primary',
					'container'      => false,
					'menu_class'     => 'main-nav flex items-center gap-9',
					'depth'          => 1,
					'fallback_cb'    => false,
				)
			);
			?>
		</div>

		<button type="button" id="menu-toggle" class="focus-ring inline-flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white text-ink shadow-sm transition hover:border-brand-violet hover:text-brand-violet lg:hidden" aria-label="Toggle menu" aria-expanded="false" aria-controls="mobile-menu">
			<span class="menu-icon-open"><?php echo voigue_icon( 'menu', 'h-5 w-5' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- static SVG markup. ?></span>
			<span class="menu-icon-close hidden"><?php echo voigue_icon( 'x', 'h-5 w-5' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- static SVG markup. ?></span>
		</button>
	</nav>
</header>

<div id="mobile-menu" class="mobile-menu" hidden>
	<div class="container-x relative flex min-h-full flex-col justify-between py-8">
		<?php
		wp_nav_menu(
			array(
				'theme_location' => 'primary',
				'container'      => false,
				'menu_class'     => 'mobile-nav grid',
				'menu_id'        => 'mobile-nav',
				'depth'          => 1,
				'fallback_cb'    => false,
			)
		);
		?>
		<div class="mt-10 text-sm text-muted">
			<p><?php echo esc_html( voigue_setting( 'brand_line' ) ); ?></p>
			<a class="mt-3 block font-medium text-ink" href="mailto:<?php echo esc_attr( voigue_setting( 'email_careers' ) ); ?>"><?php echo esc_html( voigue_setting( 'email_careers' ) ); ?></a>
		</div>
	</div>
</div>

<main id="main" class="overflow-x-clip">
