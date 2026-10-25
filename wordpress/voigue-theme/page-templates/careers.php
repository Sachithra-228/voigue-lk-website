<?php
/**
 * Template Name: Careers
 * Template Post Type: page
 *
 * Hero, Work Your Way, Why Join Voigue?, Hiring Process, Current Openings, General application.
 *
 * @package Voigue_Theme
 */

defined( 'ABSPATH' ) || exit;

get_header();

$voigue_setups = array(
	array( 'laptop', 'Remote', 'careers_remote', 'Work from wherever the role allows, while staying connected to the people you work with every day.' ),
	array( 'home', 'Hybrid', 'careers_hybrid', 'Split your time between home and the office, giving you the flexibility of both while still having regular face time with the team.' ),
	array( 'building', 'On-site', 'careers_onsite', 'Work alongside the team in person and be right in the middle of the day-to-day.' ),
);

$voigue_benefits = array(
	array( 'globe', 'A seat at the global table', "You'll work directly with international businesses, picking up how different markets operate, communicate and make decisions, experience that goes well beyond a standard local role." ),
	array( 'sliders', 'Your setup, your call', 'Remote, hybrid or onsite, depending on the role, so you can work in the way that actually suits how you get things done.' ),
	array( 'trending-up', "Growth that isn't capped", 'As you take on more, you get more responsibility, bigger opportunities and the chance to grow faster than a rigid ladder usually allows.' ),
	array( 'sparkles', 'Work that gets noticed', "Good work doesn't go unnoticed here. The effort, ideas and impact you bring are recognised." ),
	array( 'badge-dollar-sign', 'Above-industry pay', 'We believe good work should be paid properly, which is why our salaries are positioned above industry standards.' ),
	array( 'shield-check', 'Trusted from day one', "You're trusted to own your work and make decisions on it, without someone checking in every step of the way." ),
	array( 'party-popper', 'People worth showing up for', 'An open, easygoing team that celebrates the wins, big or small, with outings, events and get-togethers that people genuinely look forward to.' ),
	array( 'book-open', 'Every project teaches something', "Exposure to different industries, businesses and ways of working means you're constantly picking up new skills, just by doing the work in front of you." ),
);

$voigue_process = array(
	array( 'Initial screening', "If your CV is shortlisted, someone from our Talent Acquisition team will give you a call. It's a quick first conversation to learn a little more about you, your experience and what you're looking for." ),
	array( 'Internal interview', "If the screening goes well, we'll invite you for an interview with our team. This is where we get a better sense of your experience, how you work and whether the role feels like the right fit for both you and the client." ),
	array( 'Client review', "If you make it through the internal interview, we'll share your profile and interview details with the client so they can get to know who you are and what you could bring to their team." ),
	array( 'Final interview', "If the client wants to move forward, we'll bring you both together for the final interview. You'll get to meet the people you could be working with, ask questions and see if the fit works on both sides." ),
);
?>
<section class="relative flex min-h-[78svh] items-end overflow-hidden bg-brand-navy text-white">
	<?php voigue_photo( 'careers_hero', 'absolute inset-0', 'Hero image', 'Life at Voigue' ); ?>
	<div class="absolute inset-0 bg-[linear-gradient(90deg,rgba(12,6,34,0.85)_0%,rgba(12,6,34,0.5)_55%,rgba(12,6,34,0.15)_100%)]"></div>
	<div class="container-x relative pb-14 pt-36 lg:pb-20">
		<div class="max-w-2xl animate-[fadeIn_700ms_ease-out]">
			<h1 class="text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">There&rsquo;s a place for you here.</h1>
			<p class="mt-7 text-lg leading-8 text-white/85">Build your career your way, with roles across remote, hybrid and on-site setups. At Voigue, you&rsquo;ll get the chance to work with businesses across Australia and beyond, take on work that gives you real international exposure and grow into more as you go.</p>
			<p class="mt-4 text-base leading-7 text-white/75">Different roles come with different teams, responsibilities and ways of working, but the idea stays the same: good people should have access to good opportunities, wherever they&rsquo;re based.</p>
			<a href="#current-openings" class="btn btn-outline-light mt-9">View Open Roles <?php echo voigue_icon( 'arrow-right', 'h-4 w-4' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- static SVG markup. ?></a>
		</div>
	</div>
</section>

<section class="bg-white py-20 lg:py-28">
	<div class="container-x">
		<div class="reveal max-w-2xl">
			<p class="text-sm font-semibold text-brand-violet">Flexibility comes first</p>
			<h2 class="mt-3 text-5xl font-semibold leading-none tracking-tight text-ink sm:text-6xl lg:text-7xl">Work <span class="text-brand-violet">Your Way</span></h2>
			<p class="mt-6 text-lg leading-8 text-muted">Some roles are fully remote, some are hybrid, and others work best onsite. The setup depends on the role and the team you&rsquo;ll be working with, so you&rsquo;ll know exactly what to expect before you apply.</p>
		</div>
		<div class="mt-14 grid gap-8 md:grid-cols-3">
			<?php foreach ( $voigue_setups as $voigue_index => $voigue_setup ) : ?>
				<article class="reveal" style="--delay: <?php echo esc_attr( (string) ( $voigue_index * 0.1 ) ); ?>s">
					<?php voigue_photo( $voigue_setup[2], 'aspect-[16/10] w-full rounded-2xl', $voigue_setup[1] . ' photo', $voigue_setup[1] ); ?>
					<div class="mt-5 flex items-center gap-3">
						<span class="flex h-9 w-9 items-center justify-center rounded-full bg-lilac text-brand-violet"><?php echo voigue_icon( $voigue_setup[0], 'h-[18px] w-[18px]' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- static SVG markup. ?></span>
						<h3 class="text-xl font-semibold text-ink"><?php echo esc_html( $voigue_setup[1] ); ?></h3>
					</div>
					<p class="mt-3 leading-7 text-muted"><?php echo esc_html( $voigue_setup[3] ); ?></p>
				</article>
			<?php endforeach; ?>
		</div>
		<div class="reveal mt-12 flex items-start gap-5 rounded-2xl bg-lilac p-6 sm:items-center sm:p-8">
			<span class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-brand-violet"><?php echo voigue_icon( 'users', 'h-[22px] w-[22px]' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- static SVG markup. ?></span>
			<p class="leading-7 text-muted"><strong class="block text-lg font-semibold text-ink">Whatever the setup, you&rsquo;re still part of the culture.</strong>We make sure there are plenty of chances to connect, spend time together and actually know the people you work with.</p>
		</div>
	</div>
</section>

<section class="bg-paper py-20 lg:py-28">
	<div class="container-x">
		<div class="reveal max-w-3xl">
			<p class="text-[11px] font-semibold uppercase tracking-[0.32em] text-muted">Careers</p>
			<h2 class="mt-4 text-5xl font-semibold leading-none tracking-tight text-ink sm:text-6xl lg:text-7xl">Why Join Voigue?</h2>
			<p class="mt-6 text-xl leading-8 text-muted">We believe a good job should add something to your life.</p>
		</div>
		<div class="mt-16 grid gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
			<?php foreach ( $voigue_benefits as $voigue_index => $voigue_benefit ) : ?>
				<article class="reveal border-t-2 border-ink pt-5" style="--delay: <?php echo esc_attr( (string) ( ( $voigue_index % 4 ) * 0.08 ) ); ?>s">
					<div class="flex items-center justify-between">
						<span class="text-sm font-semibold text-brand-violet"><?php echo esc_html( str_pad( (string) ( $voigue_index + 1 ), 2, '0', STR_PAD_LEFT ) ); ?></span>
						<span class="flex h-11 w-11 items-center justify-center rounded-full bg-lilac-deep text-brand-violet"><?php echo voigue_icon( $voigue_benefit[0], 'h-5 w-5' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- static SVG markup. ?></span>
					</div>
					<h3 class="mt-5 text-xl font-semibold leading-snug text-ink"><?php echo esc_html( $voigue_benefit[1] ); ?></h3>
					<p class="mt-3 text-sm leading-7 text-muted"><?php echo esc_html( $voigue_benefit[2] ); ?></p>
				</article>
			<?php endforeach; ?>
		</div>
	</div>
</section>

<section class="bg-white py-20 lg:py-28">
	<div class="container-x">
		<div class="reveal max-w-3xl">
			<p class="text-[11px] font-semibold uppercase tracking-[0.32em] text-brand-violet">Our Hiring Process</p>
			<h2 class="mt-4 text-4xl font-semibold leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-6xl">What happens <span class="text-brand-violet">after you apply.</span></h2>
			<p class="mt-5 text-lg leading-8 text-muted">A quick look at the journey from your application to meeting the client, so you know what to expect</p>
		</div>
		<div class="mt-16 grid gap-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
			<?php foreach ( $voigue_process as $voigue_index => $voigue_step ) : ?>
				<article class="reveal" style="--delay: <?php echo esc_attr( (string) ( $voigue_index * 0.1 ) ); ?>s">
					<div class="flex items-center gap-4">
						<span class="text-5xl font-semibold leading-none text-brand-violet/70"><?php echo esc_html( str_pad( (string) ( $voigue_index + 1 ), 2, '0', STR_PAD_LEFT ) ); ?></span>
						<?php if ( $voigue_index < count( $voigue_process ) - 1 ) : ?>
							<span aria-hidden="true" class="hidden h-px flex-1 bg-brand-violet/25 lg:block"></span>
						<?php endif; ?>
					</div>
					<h3 class="mt-6 text-xl font-semibold text-ink"><?php echo esc_html( $voigue_step[0] ); ?></h3>
					<p class="mt-3 text-sm leading-7 text-muted"><?php echo esc_html( $voigue_step[1] ); ?></p>
				</article>
			<?php endforeach; ?>
		</div>
	</div>
</section>

<?php get_template_part( 'template-parts/careers/board' ); ?>

<section class="bg-white pb-20 lg:pb-28">
	<div class="container-x">
		<div class="reveal relative grid items-center gap-10 overflow-hidden rounded-[2rem] border border-line bg-paper p-8 sm:p-12 lg:grid-cols-[1.2fr_0.8fr]">
			<div>
				<p class="text-sm text-muted">Don&rsquo;t see what you&rsquo;re looking for?</p>
				<h2 class="mt-3 text-4xl font-semibold leading-[1.08] tracking-tight text-ink sm:text-5xl">We&rsquo;re always open to great people.</h2>
				<p class="mt-5 max-w-md text-lg leading-8 text-muted">Send us your cv and we&rsquo;ll keep you in mind for future opportunities.</p>
				<button type="button" class="btn btn-outline mt-8" data-open-cv="general">Send your CV <?php echo voigue_icon( 'arrow-right', 'h-4 w-4' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- static SVG markup. ?></button>
			</div>
			<div aria-hidden="true" class="hidden justify-center lg:flex">
				<span class="flex h-44 w-44 rotate-6 items-center justify-center rounded-3xl bg-white text-brand-violet shadow-soft"><?php echo voigue_icon( 'file-text', 'h-20 w-20' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- static SVG markup. ?></span>
			</div>
		</div>
	</div>
</section>

<?php get_template_part( 'template-parts/careers/modal' ); ?>
<?php
get_footer();
