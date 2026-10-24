<?php
/**
 * Home: "Recognition that reflects our standards." (awards and certifications)
 *
 * @package Voigue_Theme
 */

defined( 'ABSPATH' ) || exit;

$voigue_awards = array(
	array( 'ISO 9001 Certified', 'ISO 9001 certification, accredited', 'iso-9001-ukas.jpg', 'NQA ISO 9001 and UKAS quality management certification logos' ),
	array( 'Great Place To Work', 'Certified, May 2022 to May 2023', 'great-place-to-work-2022.jpeg', 'Great Place To Work certified May 2022 to May 2023 badge' ),
	array( 'Australian Service Excellence Awards', 'Finalist 2024', 'asea-finalist-2024.png', 'Australian Service Excellence Awards 2024 finalist badge' ),
	array( 'Best Workplace for Women', 'Great Place To Work, Sri Lanka 2022', 'best-workplace-women-2022.png', 'Great Place To Work Best Workplaces for Women Sri Lanka 2022 badge' ),
	array( 'Asia Awards', 'Outstanding Outsourcing Company and Quality Proven Brand, 2020/2021', 'asia-award.png', 'Asia Awards gold badge' ),
);
?>
<section class="bg-white py-20 lg:py-28">
	<div class="container-x">
		<div class="reveal text-center">
			<p class="text-[11px] font-semibold uppercase tracking-[0.32em] text-muted">Awards &amp; Recognition</p>
			<h2 class="mt-4 text-4xl font-semibold tracking-tight text-ink sm:text-5xl">Recognition that reflects our standards.</h2>
		</div>
		<ul class="reveal mt-14 grid grid-cols-2 gap-y-12 md:grid-cols-3 lg:grid-cols-5 lg:gap-y-0" style="--delay: 0.1s">
			<?php foreach ( $voigue_awards as $voigue_index => $voigue_award ) : ?>
				<li class="flex flex-col items-center px-4 text-center <?php echo $voigue_index > 0 ? 'lg:border-l lg:border-line' : ''; ?>">
					<div class="relative h-28 w-full">
						<img class="h-full w-full object-contain" src="<?php echo esc_url( VOIGUE_THEME_URI . '/assets/images/awards/' . $voigue_award[2] ); ?>" alt="<?php echo esc_attr( $voigue_award[3] ); ?>" loading="lazy" decoding="async" width="200" height="112">
					</div>
					<h3 class="mt-5 text-base font-semibold leading-snug text-ink"><?php echo esc_html( $voigue_award[0] ); ?></h3>
					<p class="mt-2 text-sm leading-6 text-muted"><?php echo esc_html( $voigue_award[1] ); ?></p>
				</li>
			<?php endforeach; ?>
		</ul>
	</div>
</section>
