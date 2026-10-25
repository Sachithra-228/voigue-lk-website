<?php
/**
 * Careers: the Apply / Send-your-CV window. One window serves both forms; main.js switches the wording and fields.
 *
 * @package Voigue_Theme
 */

defined( 'ABSPATH' ) || exit;
?>
<div id="cv-modal" class="cv-modal" hidden>
	<div class="cv-modal-backdrop" data-cv-close aria-hidden="true"></div>
	<div class="cv-modal-dialog" role="dialog" aria-modal="true" aria-labelledby="cv-modal-title" tabindex="-1">
		<button type="button" class="cv-modal-x focus-ring" data-cv-close aria-label="Close"><?php echo voigue_icon( 'x', 'h-5 w-5' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- static SVG markup. ?></button>

		<div data-cv-form-view>
			<h2 id="cv-modal-title" class="pr-10 text-2xl font-semibold text-ink" data-cv-title>Apply for this role</h2>
			<p class="mt-2 text-sm leading-6 text-muted" data-cv-desc>Tell us a bit about yourself and why you&rsquo;d be a great fit.</p>
			<p class="mt-4 rounded-xl bg-lilac px-4 py-2.5 text-sm font-medium text-brand-violet" data-cv-job hidden></p>

			<form class="mt-6 grid gap-5" data-cv-form enctype="multipart/form-data" novalidate>
				<input type="hidden" name="action" value="voigue_apply">
				<input type="hidden" name="type" value="role" data-cv-type>
				<input type="hidden" name="job_id" value="" data-cv-job-id>
				<input type="hidden" name="started" value="" data-cv-started>

				<label class="form-label">Full name
					<input type="text" name="name" autocomplete="name" placeholder="Your full name" required maxlength="120" class="form-input">
				</label>
				<label class="form-label">Email address
					<input type="email" name="email" autocomplete="email" placeholder="you@example.com" required maxlength="120" class="form-input">
				</label>

				<div class="grid gap-5" data-cv-general-only hidden>
					<label class="form-label">Type of role / interests
						<input type="text" name="role_interest" placeholder="e.g. Graphic design, customer success, software" maxlength="200" class="form-input">
					</label>
					<fieldset class="grid gap-2">
						<legend class="text-sm font-semibold text-ink">Preferred setup</legend>
						<div class="flex flex-wrap gap-2">
							<?php foreach ( array( 'Remote', 'Hybrid', 'On-site' ) as $voigue_option ) : ?>
								<label class="cursor-pointer">
									<input type="radio" name="preferred_setup" value="<?php echo esc_attr( $voigue_option ); ?>" class="peer sr-only">
									<span class="inline-flex min-h-10 items-center rounded-full border border-line px-5 text-sm font-medium text-ink transition peer-checked:border-brand-violet peer-checked:bg-brand-violet peer-checked:text-white peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand-teal"><?php echo esc_html( $voigue_option ); ?></span>
								</label>
							<?php endforeach; ?>
						</div>
					</fieldset>
				</div>

				<label class="form-label"><span data-cv-message-label>Tell us a bit about yourself and how your skills and mindset can add to our culture</span>
					<textarea name="message" rows="4" placeholder="Write your message here..." maxlength="4000" class="form-input resize-y" data-cv-message></textarea>
				</label>

				<div class="grid gap-1.5">
					<span class="text-sm font-semibold text-ink">Upload your CV</span>
					<label class="cv-dropzone focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-brand-teal" data-cv-dropzone>
						<input type="file" name="cv" accept=".pdf,.doc,.docx" class="sr-only" data-cv-file required>
						<span class="cv-dropzone-empty flex flex-col items-center gap-1 text-center text-sm" data-cv-empty>
							<?php echo voigue_icon( 'upload', 'h-6 w-6 text-brand-violet' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- static SVG markup. ?>
							<span class="font-semibold text-ink">Choose a file <span class="font-normal text-muted">or drag and drop</span></span>
							<span class="text-xs text-muted">PDF, DOC or DOCX (max 4 MB)</span>
						</span>
						<span class="hidden items-center gap-3 text-sm" data-cv-chosen>
							<?php echo voigue_icon( 'file-text', 'h-5 w-5 shrink-0 text-brand-violet' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- static SVG markup. ?>
							<span class="min-w-0 flex-1 truncate font-medium text-ink" data-cv-filename></span>
							<span class="text-brand-violet underline underline-offset-4">Change</span>
						</span>
					</label>
				</div>

				<?php /* Honeypot: hidden from people, tempting for bots. */ ?>
				<div aria-hidden="true" class="absolute -left-[9999px] h-0 w-0 overflow-hidden">
					<label>Website <input type="text" name="website" tabindex="-1" autocomplete="off"></label>
				</div>

				<p data-cv-error role="alert" class="hidden rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800"></p>
				<button type="submit" class="btn btn-dark w-full" data-cv-submit>Submit application</button>
			</form>
		</div>

		<div data-cv-success class="py-4 text-center" hidden role="status">
			<span class="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-lilac text-brand-violet"><?php echo voigue_icon( 'check-circle', 'h-7 w-7' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- static SVG markup. ?></span>
			<h3 class="mt-5 text-2xl font-semibold text-ink">Thanks, we&rsquo;ve got your CV.</h3>
			<p class="mx-auto mt-3 max-w-sm leading-7 text-muted" data-cv-success-text>Your application has been received. A TA agent will be in touch with you soon if you&rsquo;re shortlisted.</p>
			<div class="mt-8 grid justify-center gap-3">
				<button type="button" class="btn btn-dark" data-cv-close>Back to Careers</button>
				<button type="button" class="focus-ring text-sm font-medium text-muted underline-offset-4 hover:text-ink hover:underline" data-cv-close>Close</button>
			</div>
		</div>
	</div>
</div>
