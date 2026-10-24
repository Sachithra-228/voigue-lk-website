<?php
/**
 * Template Name: Contact Us
 * Template Post Type: page
 *
 * Hero, message form, direct contacts, two office maps, closing call to action.
 *
 * @package Voigue_Theme
 */

defined( 'ABSPATH' ) || exit;

get_header();

$voigue_contacts = array(
	array( 'mail', 'General enquiries', voigue_setting( 'email_general' ), 'mailto:' . voigue_setting( 'email_general' ) ),
	array( 'phone', 'Sri Lanka', voigue_setting( 'phone_lk' ), 'tel:' . preg_replace( '/\s+/', '', voigue_setting( 'phone_lk' ) ) ),
	array( 'phone', 'Australia', voigue_setting( 'phone_au' ), 'tel:' . preg_replace( '/\s+/', '', voigue_setting( 'phone_au' ) ) ),
	array( 'mail', 'Careers & applications', voigue_setting( 'email_careers' ), 'mailto:' . voigue_setting( 'email_careers' ) ),
);
$voigue_offices = array(
	array( 'Sri Lanka', voigue_setting( 'address_lk' ), voigue_setting( 'map_lk' ) ),
	array( 'Australia', voigue_setting( 'address_au' ), voigue_setting( 'map_au' ) ),
);
$voigue_about = get_page_by_path( 'about-us' );
?>
<section class="bg-[linear-gradient(135deg,hsl(var(--lilac)),hsl(var(--lilac-deep)))] pb-16 pt-36 lg:pb-20 lg:pt-44">
	<div class="container-x">
		<h1 class="mx-auto max-w-3xl animate-[fadeIn_700ms_ease-out] text-center text-5xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-6xl lg:text-7xl">Got something in mind? Talk to us.</h1>
	</div>
</section>

<section class="bg-white py-16 lg:py-24">
	<div class="container-x grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
		<div class="reveal" data-reveal="left">
			<p class="max-w-sm text-xl leading-9 text-muted">Send us a message and we&rsquo;ll take it from there. We&rsquo;ll make sure you get the answers you need and point you in the right direction.</p>
		</div>
		<div class="reveal" data-reveal="right" style="--delay: 0.1s">
			<form data-contact-form novalidate class="relative grid gap-5 rounded-2xl border border-line bg-white p-6 shadow-soft sm:p-8">
				<input type="hidden" name="action" value="voigue_contact">
				<input type="hidden" name="started" value="" data-started>
				<div class="grid gap-5 sm:grid-cols-2">
					<label class="form-label">First name
						<input type="text" name="first_name" autocomplete="given-name" required maxlength="80" class="form-input">
					</label>
					<label class="form-label">Last name
						<input type="text" name="last_name" autocomplete="family-name" required maxlength="80" class="form-input">
					</label>
					<label class="form-label">Email
						<input type="email" name="email" autocomplete="email" required maxlength="120" class="form-input">
					</label>
					<label class="form-label">Phone number
						<input type="tel" name="phone" autocomplete="tel" maxlength="40" class="form-input">
					</label>
				</div>
				<label class="form-label">How can we help?
					<textarea name="message" rows="5" required minlength="10" maxlength="3000" class="form-input resize-y"></textarea>
				</label>

				<?php /* Honeypot: hidden from people, tempting for bots. */ ?>
				<div aria-hidden="true" class="absolute -left-[9999px] h-0 w-0 overflow-hidden">
					<label>Website <input type="text" name="website" tabindex="-1" autocomplete="off"></label>
				</div>

				<p data-form-error role="alert" class="hidden rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800"></p>
				<button type="submit" class="btn btn-dark w-full" data-submit>Send message</button>
			</form>

			<div data-contact-success class="flex hidden flex-col items-center justify-center rounded-2xl border border-line bg-white p-10 text-center shadow-soft" role="status">
				<span class="flex h-14 w-14 items-center justify-center rounded-full bg-lilac text-brand-violet"><?php echo voigue_icon( 'check-circle', 'h-7 w-7' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- static SVG markup. ?></span>
				<h3 class="mt-5 text-2xl font-semibold text-ink">Thanks, your message is on its way.</h3>
				<p class="mt-3 max-w-sm leading-7 text-muted">We&rsquo;ve received your message and will get back to you shortly.</p>
				<button type="button" class="btn btn-outline mt-7" data-contact-again>Send another message</button>
			</div>
		</div>
	</div>
</section>

<section class="bg-paper py-16 lg:py-24">
	<div class="container-x">
		<div class="reveal">
			<p class="text-[11px] font-semibold uppercase tracking-[0.32em] text-muted">Reach Us Directly</p>
			<h2 class="mt-4 text-4xl font-semibold tracking-tight text-ink sm:text-5xl">Here when you need us.</h2>
		</div>
		<ul class="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
			<?php foreach ( $voigue_contacts as $voigue_contact ) : ?>
				<li>
					<a href="<?php echo esc_url( $voigue_contact[3] ); ?>" class="focus-ring flex h-full items-start gap-4 rounded-2xl border border-line bg-white p-5 transition hover:border-brand-violet hover:shadow-soft">
						<span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-lilac text-brand-violet"><?php echo voigue_icon( $voigue_contact[0], 'h-5 w-5' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- static SVG markup. ?></span>
						<span class="min-w-0">
							<span class="block text-[11px] font-semibold uppercase tracking-[0.18em] text-muted"><?php echo esc_html( $voigue_contact[1] ); ?></span>
							<span class="mt-1 block break-words font-semibold text-ink"><?php echo esc_html( $voigue_contact[2] ); ?></span>
						</span>
					</a>
				</li>
			<?php endforeach; ?>
		</ul>
	</div>
</section>

<section class="bg-white py-16 lg:py-24">
	<div class="container-x">
		<div class="reveal">
			<p class="text-[11px] font-semibold uppercase tracking-[0.32em] text-muted">Our Locations</p>
			<h2 class="mt-4 text-4xl font-semibold tracking-tight text-ink sm:text-5xl">Visit us in person.</h2>
		</div>
		<div class="mt-10 grid gap-8 md:grid-cols-2">
			<?php foreach ( $voigue_offices as $voigue_office ) : ?>
				<figure class="reveal">
					<div class="overflow-hidden rounded-2xl border border-line bg-paper">
						<iframe title="<?php echo esc_attr( 'Map of the ' . $voigue_office[0] . ' office' ); ?>" src="<?php echo esc_url( 'https://www.google.com/maps?q=' . rawurlencode( $voigue_office[2] ) . '&output=embed' ); ?>" class="block h-72 w-full border-0" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>
					</div>
					<figcaption class="mt-4 flex items-start gap-3 leading-7 text-muted">
						<?php echo voigue_icon( 'map-pin', 'mt-1.5 h-[18px] w-[18px] shrink-0 text-brand-violet' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- static SVG markup. ?>
						<span><strong class="font-semibold text-ink"><?php echo esc_html( $voigue_office[0] ); ?>:</strong> <?php echo esc_html( $voigue_office[1] ); ?>.</span>
					</figcaption>
				</figure>
			<?php endforeach; ?>
		</div>
	</div>
</section>

<section class="bg-paper py-20 lg:py-28">
	<div class="container-x">
		<div class="reveal mx-auto max-w-2xl text-center">
			<h2 class="mx-auto w-fit text-left text-5xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-6xl">People-powered<br><em class="font-semibold italic">Always.</em></h2>
			<p class="mt-6 text-lg leading-8 text-muted">From the way we work to the opportunities we create, people stay at the centre of it.</p>
			<a href="<?php echo esc_url( $voigue_about ? get_permalink( $voigue_about ) : home_url( '/about-us/' ) ); ?>" class="btn btn-outline mt-8">Discover Voigue <?php echo voigue_icon( 'arrow-right', 'h-4 w-4' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- static SVG markup. ?></a>
		</div>
	</div>
</section>
<?php
get_footer();
