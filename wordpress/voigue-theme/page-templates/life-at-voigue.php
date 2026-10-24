<?php
/**
 * Template Name: Life at Voigue
 * Template Post Type: page
 *
 * Hero video, People, What Matters Here, Life around here (gallery), promo video, Employee Voices, Careers call to action.
 *
 * @package Voigue_Theme
 */

defined( 'ABSPATH' ) || exit;

get_header();

$voigue_values = array(
	array( 'lightbulb', 'Open minds', 'Different perspectives are welcomed here, and new ideas always have room to land.' ),
	array( 'sprout', 'Inclusive by nature', 'We value diversity, treat people with respect, and make space for everyone to be heard.' ),
	array( 'heart', 'A sense of belonging', 'It is the kind of environment where people feel comfortable, supported and part of something.' ),
);
$voigue_video  = voigue_media_url( 'life_hero_video' );
$voigue_poster = voigue_media_url( 'life_hero_poster' );
?>
<section class="relative flex min-h-[80svh] items-center justify-center overflow-hidden bg-brand-navy text-center text-white">
	<div class="absolute inset-0" aria-hidden="true">
		<?php if ( $voigue_video ) : ?>
			<?php if ( $voigue_poster ) : ?>
				<img class="absolute inset-0 h-full w-full object-cover" src="<?php echo esc_url( $voigue_poster ); ?>" alt="" decoding="async">
			<?php endif; ?>
			<video class="absolute inset-0 h-full w-full object-cover motion-reduce:hidden" src="<?php echo esc_url( $voigue_video ); ?>" <?php echo $voigue_poster ? 'poster="' . esc_url( $voigue_poster ) . '"' : ''; ?> autoplay loop muted playsinline preload="auto"></video>
		<?php else : ?>
			<div class="hero-placeholder absolute inset-0"></div>
		<?php endif; ?>
	</div>
	<div class="absolute inset-0 bg-ink/35"></div>
	<div class="container-x relative pb-10 pt-32">
		<div class="mx-auto max-w-3xl animate-[fadeIn_700ms_ease-out]">
			<h1 class="text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">Come see what makes Voigue, Voigue.</h1>
			<p class="mx-auto mt-6 max-w-xl text-lg text-white/85 sm:text-xl">A look at the people, culture and everyday moments that shape life here.</p>
		</div>
	</div>
</section>

<section class="bg-white py-20 lg:py-28">
	<div class="container-x grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
		<div class="reveal" data-reveal="left">
			<p class="text-[11px] font-semibold uppercase tracking-[0.32em] text-muted">People</p>
			<h2 class="mt-4 text-4xl font-semibold leading-[1.08] tracking-tight text-ink sm:text-5xl">At our heart, there&rsquo;s our people.</h2>
			<p class="mt-6 text-lg leading-8 text-muted">We are a team of curious, open-minded people who bring different perspectives, experience, and personalities into what we do. We support each other, welcome new ideas, and create a space where everyone can be themselves and do their best work.</p>
		</div>
		<div class="reveal grid grid-cols-2 gap-4" data-reveal="right" style="--delay: 0.1s">
			<?php voigue_photo( 'life_people_team', 'col-span-2 aspect-[16/9] rounded-2xl', 'Team photo', 'The Voigue team' ); ?>
			<?php voigue_photo( 'life_people_portrait', 'aspect-square rounded-2xl', 'Employee portrait', 'A Voigue team member' ); ?>
			<?php voigue_photo( 'life_people_moment', 'aspect-square rounded-2xl', 'Culture moment', 'A moment at Voigue' ); ?>
		</div>
	</div>
</section>

<section class="bg-paper py-20 lg:py-28">
	<div class="container-x">
		<div class="reveal max-w-2xl">
			<p class="text-[11px] font-semibold uppercase tracking-[0.32em] text-muted">What Matters Here</p>
			<h2 class="mt-4 text-4xl font-semibold tracking-tight text-ink sm:text-5xl">We live what matters to us.</h2>
			<p class="mt-5 text-lg leading-8 text-muted">The way we work is shaped by openness, inclusion and a genuine sense of belonging. Different perspectives are welcomed, people are respected for who they are, and the culture is built to make everyone feel part of it.</p>
		</div>
		<div class="mt-14 grid gap-6 md:grid-cols-3">
			<?php foreach ( $voigue_values as $voigue_index => $voigue_value ) : ?>
				<article class="reveal relative h-full rounded-3xl bg-white p-8 pt-12 shadow-sm" style="--delay: <?php echo esc_attr( (string) ( $voigue_index * 0.1 ) ); ?>s">
					<span class="absolute -top-7 left-8 flex h-14 w-14 items-center justify-center rounded-full bg-lilac-deep text-brand-violet"><?php echo voigue_icon( $voigue_value[0], 'h-6 w-6' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- static SVG markup. ?></span>
					<h3 class="text-xl font-semibold text-ink"><?php echo esc_html( $voigue_value[1] ); ?></h3>
					<p class="mt-3 leading-7 text-muted"><?php echo esc_html( $voigue_value[2] ); ?></p>
				</article>
			<?php endforeach; ?>
		</div>
	</div>
</section>

<?php get_template_part( 'template-parts/life/moments' ); ?>

<section class="bg-paper py-20 lg:py-28">
	<div class="container-x max-w-4xl">
		<div class="reveal text-center">
			<h2 class="text-4xl font-semibold tracking-tight text-ink sm:text-5xl">Here&rsquo;s a little more of us.</h2>
			<p class="mt-4 text-lg text-muted">A glimpse at the people, moments and energy behind Voigue.</p>
		</div>
		<?php $voigue_youtube = voigue_youtube_id( voigue_setting( 'life_youtube' ) ); ?>
		<div class="reveal relative mt-12 aspect-video w-full overflow-hidden rounded-2xl bg-ink shadow-soft" data-youtube data-video-id="<?php echo esc_attr( $voigue_youtube ); ?>" style="--delay: 0.1s">
			<button type="button" class="youtube-play focus-ring group absolute inset-0 flex items-center justify-center" <?php echo $voigue_youtube ? '' : 'disabled'; ?> aria-label="<?php echo esc_attr( $voigue_youtube ? 'Play video: Voigue promotional video' : 'Promotional video coming soon' ); ?>">
				<?php if ( $voigue_youtube ) : ?>
					<img class="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]" src="<?php echo esc_url( 'https://i.ytimg.com/vi/' . $voigue_youtube . '/hqdefault.jpg' ); ?>" alt="" loading="lazy" decoding="async">
				<?php else : ?>
					<span class="absolute inset-0 bg-[linear-gradient(135deg,hsl(278_50%_22%),hsl(262_45%_34%))]"></span>
				<?php endif; ?>
				<span class="relative inline-flex h-20 w-20 items-center justify-center rounded-full bg-white/95 text-brand-violet shadow-xl transition group-hover:scale-105"><?php echo voigue_icon( 'play', 'ml-1 h-7 w-7' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- static SVG markup. ?></span>
				<?php if ( ! $voigue_youtube ) : ?>
					<span class="absolute bottom-5 text-xs font-medium uppercase tracking-[0.2em] text-white/60">Promotional video placeholder</span>
				<?php endif; ?>
			</button>
		</div>
	</div>
</section>

<?php get_template_part( 'template-parts/life/voices' ); ?>

<section class="bg-white pb-20 lg:pb-28">
	<div class="container-x">
		<div class="reveal relative overflow-hidden rounded-[2rem] bg-lilac px-8 py-14 sm:px-14">
			<div aria-hidden="true" class="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full border border-brand-violet/20"></div>
			<div aria-hidden="true" class="pointer-events-none absolute -right-8 top-10 h-72 w-72 rounded-full border border-brand-violet/15"></div>
			<div class="relative">
				<h2 class="text-4xl font-semibold tracking-tight text-ink sm:text-5xl">Find your place at Voigue.</h2>
				<p class="mt-4 max-w-md text-lg text-muted">Take a look at our open roles and see where you could fit.</p>
				<a href="<?php echo esc_url( voigue_open_roles_url() ); ?>" class="btn btn-primary mt-8">View Open Roles <?php echo voigue_icon( 'arrow-right', 'h-4 w-4' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- static SVG markup. ?></a>
			</div>
		</div>
	</div>
</section>
<?php
get_footer();
