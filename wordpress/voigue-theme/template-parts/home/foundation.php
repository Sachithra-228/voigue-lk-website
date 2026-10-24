<?php
/**
 * Home: "Our Foundation". The line and the statement reveal together, sliding up from the bottom.
 *
 * @package Voigue_Theme
 */

defined( 'ABSPATH' ) || exit;
?>
<section class="bg-white">
	<div class="container-x py-24 text-center lg:py-32" data-foundation>
		<p class="text-[11px] font-semibold uppercase tracking-[0.32em] text-muted">Our Foundation</p>
		<div class="mx-auto mt-10 flex w-fit max-w-full items-stretch gap-5 text-left sm:gap-8">
			<span class="foundation-line w-0.5 bg-ink" aria-hidden="true"></span>
			<?php /* The right padding keeps the italic "Always." from being clipped by the box used for the slide-up reveal. */ ?>
			<div class="overflow-hidden py-1 pr-[0.2em]">
				<h2 class="foundation-statement text-5xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-6xl lg:text-7xl">
					People-powered<br>
					<em class="font-semibold italic">Always.</em>
				</h2>
			</div>
		</div>
		<p class="foundation-body mx-auto mt-10 max-w-xl text-base leading-8 text-muted sm:text-lg">It runs through everything we do, from the teams we build and the way we work together to how people grow and experience life at Voigue.</p>
	</div>
</section>
