<?php
/**
 * Home: "The Voigue Experience" (three columns).
 *
 * @package Voigue_Theme
 */

defined( 'ABSPATH' ) || exit;

$voigue_pillars = array(
	array(
		'title' => 'People & Culture',
		'slot'  => 'home_exp_culture',
		'label' => 'Culture photo',
		'body'  => "Everything that makes Voigue feel like Voigue comes back to the culture we've built from the ground up. Celebrations, outings, team moments and plenty happening outside the work are all part of the experience.",
	),
	array(
		'title' => 'Trust & Ownership',
		'slot'  => 'home_exp_trust',
		'label' => 'Team photo',
		'body'  => "You're given the responsibility to own your work without someone constantly looking over your shoulder. The trust is there from the start.",
	),
	array(
		'title' => 'Growth & Progression',
		'slot'  => 'home_exp_growth',
		'label' => 'Team photo',
		'body'  => 'International exposure, new responsibilities and opportunities to step into bigger roles give you plenty of room to move forward in your career at Voigue.',
	),
);
$voigue_life = get_page_by_path( 'life-at-voigue' );
?>
<section class="bg-paper py-20 lg:py-28">
	<div class="container-x">
		<div class="reveal text-center">
			<p class="text-[11px] font-semibold uppercase tracking-[0.32em] text-muted">What You&rsquo;re Stepping Into</p>
			<h2 class="mt-4 text-4xl font-semibold tracking-tight text-ink sm:text-5xl lg:text-6xl">The Voigue Experience</h2>
		</div>
		<div class="mt-14 grid gap-10 md:grid-cols-3">
			<?php foreach ( $voigue_pillars as $voigue_index => $voigue_pillar ) : ?>
				<article class="reveal" style="--delay: <?php echo esc_attr( (string) ( $voigue_index * 0.1 ) ); ?>s">
					<?php voigue_photo( $voigue_pillar['slot'], 'aspect-[4/3] w-full rounded-2xl', $voigue_pillar['label'], $voigue_pillar['title'] ); ?>
					<h3 class="mt-6 text-xl font-semibold text-ink"><?php echo esc_html( $voigue_pillar['title'] ); ?></h3>
					<p class="mt-3 leading-7 text-muted"><?php echo esc_html( $voigue_pillar['body'] ); ?></p>
				</article>
			<?php endforeach; ?>
		</div>
		<div class="mt-14 text-center">
			<a href="<?php echo esc_url( $voigue_life ? get_permalink( $voigue_life ) : home_url( '/life-at-voigue/' ) ); ?>" class="btn btn-dark">See Life at Voigue <?php echo voigue_icon( 'arrow-right', 'h-4 w-4' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- static SVG markup. ?></a>
		</div>
	</div>
</section>
