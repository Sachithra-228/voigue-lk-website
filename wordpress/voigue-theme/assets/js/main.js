/* Voigue theme: header, mobile menu, scroll reveals, carousels and the hero video. No dependencies. */
( function () {
	'use strict';

	var reduceMotion = window.matchMedia( '(prefers-reduced-motion: reduce)' ).matches;

	/* ---------- Header and phone menu ---------- */
	var header = document.getElementById( 'site-header' );
	var toggle = document.getElementById( 'menu-toggle' );
	var menu = document.getElementById( 'mobile-menu' );
	var overHero = header && header.classList.contains( 'is-over-hero' );

	function menuIsOpen() {
		return menu && ! menu.hidden;
	}

	function syncHeader() {
		if ( ! header || ! overHero ) {
			return;
		}
		header.classList.toggle( 'is-solid', window.scrollY > 24 || menuIsOpen() );
	}

	function setMenu( open ) {
		if ( ! menu || ! toggle ) {
			return;
		}
		menu.hidden = ! open;
		toggle.setAttribute( 'aria-expanded', open ? 'true' : 'false' );
		toggle.querySelector( '.menu-icon-open' ).classList.toggle( 'hidden', open );
		toggle.querySelector( '.menu-icon-close' ).classList.toggle( 'hidden', ! open );
		document.body.style.overflow = open ? 'hidden' : '';
		syncHeader();
	}

	if ( toggle && menu ) {
		toggle.addEventListener( 'click', function () {
			setMenu( ! menuIsOpen() );
		} );
		menu.addEventListener( 'click', function ( event ) {
			if ( event.target.closest( 'a' ) ) {
				setMenu( false );
			}
		} );
		document.addEventListener( 'keydown', function ( event ) {
			if ( event.key === 'Escape' && menuIsOpen() ) {
				setMenu( false );
				toggle.focus();
			}
		} );
	}
	window.addEventListener( 'scroll', syncHeader, { passive: true } );
	syncHeader();

	/* ---------- Scroll reveals ---------- */
	var revealTargets = document.querySelectorAll( '.reveal, [data-foundation]' );
	if ( 'IntersectionObserver' in window && ! reduceMotion ) {
		var revealObserver = new IntersectionObserver(
			function ( entries ) {
				entries.forEach( function ( entry ) {
					if ( entry.isIntersecting ) {
						entry.target.classList.add( 'is-visible' );
						revealObserver.unobserve( entry.target );
					}
				} );
			},
			{ rootMargin: '0px 0px -80px 0px', threshold: 0.15 }
		);
		revealTargets.forEach( function ( el ) {
			revealObserver.observe( el );
		} );
	} else {
		revealTargets.forEach( function ( el ) {
			el.classList.add( 'is-visible' );
		} );
	}

	/* ---------- Hero video: plays the chosen clips one after another ---------- */
	var video = document.querySelector( '[data-hero-video]' );
	if ( video ) {
		var clips = [];
		try {
			clips = JSON.parse( video.getAttribute( 'data-clips' ) || '[]' );
		} catch ( e ) {
			clips = [];
		}
		if ( reduceMotion ) {
			video.pause();
		} else if ( clips.length > 1 ) {
			var current = 0;
			video.addEventListener( 'ended', function () {
				current = ( current + 1 ) % clips.length;
				video.src = clips[ current ];
				video.play().catch( function () {} );
			} );
		}
	}

	/* ---------- Carousels ---------- */
	document.querySelectorAll( '[data-carousel]' ).forEach( function ( root ) {
		var track = root.querySelector( '[data-carousel-track]' );
		var prev = root.querySelector( '[data-carousel-prev]' );
		var next = root.querySelector( '[data-carousel-next]' );
		var dotsEl = root.querySelector( '[data-carousel-dots]' );
		var dotCount = 0;
		if ( ! track ) {
			return;
		}

		function metrics() {
			// Items hidden by a filter do not count.
			var items = Array.prototype.filter.call( track.children, function ( child ) {
				return ! child.hidden;
			} );
			var first = items[ 0 ];
			if ( ! first ) {
				return null;
			}
			var gap = parseFloat( getComputedStyle( track ).columnGap ) || 0;
			var step = first.offsetWidth + gap;
			var visible = Math.max( 1, Math.round( ( track.clientWidth + gap ) / step ) );
			return { step: step, pages: Math.max( 1, items.length - visible + 1 ) };
		}

		function currentPage( m ) {
			return Math.min( m.pages - 1, Math.round( track.scrollLeft / m.step ) );
		}

		function goTo( page ) {
			var m = metrics();
			if ( m ) {
				track.scrollTo( { left: Math.max( 0, Math.min( m.pages - 1, page ) ) * m.step, behavior: reduceMotion ? 'auto' : 'smooth' } );
			}
		}

		function update() {
			var m = metrics();
			if ( ! m ) {
				return;
			}
			var page = currentPage( m );
			if ( prev ) {
				prev.disabled = page <= 0;
			}
			if ( next ) {
				next.disabled = page >= m.pages - 1;
			}
			if ( dotsEl ) {
				if ( dotCount !== m.pages ) {
					dotsEl.innerHTML = '';
					dotCount = m.pages;
					for ( var i = 0; i < m.pages && m.pages > 1; i++ ) {
						var dot = document.createElement( 'button' );
						dot.type = 'button';
						dot.className = 'carousel-dot';
						dot.setAttribute( 'aria-label', 'Go to slide ' + ( i + 1 ) );
						dot.dataset.page = String( i );
						dotsEl.appendChild( dot );
					}
				}
				dotsEl.querySelectorAll( '.carousel-dot' ).forEach( function ( dot, index ) {
					var active = index === page;
					dot.classList.toggle( 'is-active', active );
					dot.setAttribute( 'aria-current', active ? 'true' : 'false' );
				} );
			}
		}

		if ( prev ) {
			prev.addEventListener( 'click', function () {
				var m = metrics();
				if ( m ) {
					goTo( currentPage( m ) - 1 );
				}
			} );
		}
		if ( next ) {
			next.addEventListener( 'click', function () {
				var m = metrics();
				if ( m ) {
					goTo( currentPage( m ) + 1 );
				}
			} );
		}
		if ( dotsEl ) {
			dotsEl.addEventListener( 'click', function ( event ) {
				var dot = event.target.closest( '.carousel-dot' );
				if ( dot ) {
					goTo( parseInt( dot.dataset.page, 10 ) );
				}
			} );
		}
		track.addEventListener( 'scroll', update, { passive: true } );
		window.addEventListener( 'resize', update );
		root.addEventListener( 'carousel:refresh', function () {
			track.scrollTo( { left: 0 } );
			dotCount = -1;
			update();
		} );
		update();
	} );

	/* ---------- Life around here: category filters ---------- */
	document.querySelectorAll( '[data-gallery]' ).forEach( function ( section ) {
		var chips = section.querySelectorAll( '[data-filter]' );
		var carousel = section.querySelector( '[data-carousel]' );
		var items = section.querySelectorAll( '[data-category]' );
		chips.forEach( function ( chip ) {
			chip.addEventListener( 'click', function () {
				var filter = chip.getAttribute( 'data-filter' );
				chips.forEach( function ( other ) {
					var on = other === chip;
					other.classList.toggle( 'is-active', on );
					other.setAttribute( 'aria-pressed', on ? 'true' : 'false' );
				} );
				items.forEach( function ( item ) {
					item.hidden = filter !== '' && item.getAttribute( 'data-category' ) !== filter;
				} );
				if ( carousel ) {
					carousel.dispatchEvent( new Event( 'carousel:refresh' ) );
				}
			} );
		} );
	} );

	/* ---------- Promotional video: loads YouTube only when the visitor presses play ---------- */
	document.querySelectorAll( '[data-youtube]' ).forEach( function ( box ) {
		var id = box.getAttribute( 'data-video-id' );
		var button = box.querySelector( '.youtube-play' );
		if ( ! id || ! button ) {
			return;
		}
		button.addEventListener( 'click', function () {
			var frame = document.createElement( 'iframe' );
			frame.className = 'absolute inset-0 h-full w-full';
			frame.src = 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent( id ) + '?autoplay=1&rel=0';
			frame.title = 'Voigue promotional video';
			frame.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
			frame.allowFullscreen = true;
			box.replaceChildren( frame );
		} );
	} );

	/* ---------- Contact form ---------- */
	var contactForm = document.querySelector( '[data-contact-form]' );
	if ( contactForm && window.voigueTheme ) {
		var startedField = contactForm.querySelector( '[data-started]' );
		var errorBox = contactForm.querySelector( '[data-form-error]' );
		var submitButton = contactForm.querySelector( '[data-submit]' );
		var successBox = document.querySelector( '[data-contact-success]' );
		var againButton = document.querySelector( '[data-contact-again]' );
		var fallbackError = 'Something went wrong. Please try again or email us directly.';

		var showError = function ( message ) {
			errorBox.textContent = message || fallbackError;
			errorBox.classList.remove( 'hidden' );
		};
		var markStarted = function () {
			startedField.value = String( Date.now() );
		};
		markStarted();

		contactForm.addEventListener( 'submit', function ( event ) {
			event.preventDefault();
			errorBox.classList.add( 'hidden' );
			if ( ! contactForm.checkValidity() ) {
				contactForm.reportValidity();
				return;
			}
			submitButton.disabled = true;
			submitButton.textContent = 'Sending...';
			fetch( window.voigueTheme.ajaxUrl, { method: 'POST', body: new FormData( contactForm ), credentials: 'same-origin' } )
				.then( function ( response ) {
					return response.json().catch( function () {
						return null;
					} );
				} )
				.then( function ( data ) {
					if ( data && data.success ) {
						contactForm.reset();
						contactForm.classList.add( 'hidden' );
						successBox.classList.remove( 'hidden' );
					} else {
						showError( data && data.data && data.data.message );
					}
				} )
				.catch( function () {
					showError();
				} )
				.finally( function () {
					submitButton.disabled = false;
					submitButton.textContent = 'Send message';
				} );
		} );

		if ( againButton ) {
			againButton.addEventListener( 'click', function () {
				successBox.classList.add( 'hidden' );
				contactForm.classList.remove( 'hidden' );
				markStarted();
			} );
		}
	}

	/* ---------- Careers: vacancy board (Read more expands in place) ---------- */
	var jobsList = document.querySelector( '[data-jobs]' );

	function setJob( toggle, open ) {
		var panel = document.getElementById( toggle.getAttribute( 'aria-controls' ) );
		toggle.setAttribute( 'aria-expanded', open ? 'true' : 'false' );
		toggle.querySelector( '[data-job-toggle-label]' ).textContent = open ? 'Show less' : 'Read more';
		toggle.classList.toggle( 'is-open', open );
		if ( panel ) {
			panel.classList.toggle( 'is-open', open );
			if ( panel.firstElementChild ) {
				panel.firstElementChild.inert = ! open;
			}
		}
	}

	if ( jobsList ) {
		jobsList.addEventListener( 'click', function ( event ) {
			var toggle = event.target.closest( '[data-job-toggle]' );
			if ( ! toggle ) {
				return;
			}
			var open = toggle.getAttribute( 'aria-expanded' ) !== 'true';
			jobsList.querySelectorAll( '[data-job-toggle]' ).forEach( function ( other ) {
				setJob( other, other === toggle && open );
			} );
		} );
	}

	/* ---------- Careers: Apply / Send-your-CV window ---------- */
	var cvModal = document.getElementById( 'cv-modal' );
	if ( cvModal && window.voigueTheme ) {
		var cvForm = cvModal.querySelector( '[data-cv-form]' );
		var formView = cvModal.querySelector( '[data-cv-form-view]' );
		var successView = cvModal.querySelector( '[data-cv-success]' );
		var dialog = cvModal.querySelector( '[role="dialog"]' );
		var titleEl = cvModal.querySelector( '[data-cv-title]' );
		var descEl = cvModal.querySelector( '[data-cv-desc]' );
		var jobEl = cvModal.querySelector( '[data-cv-job]' );
		var typeInput = cvModal.querySelector( '[data-cv-type]' );
		var jobIdInput = cvModal.querySelector( '[data-cv-job-id]' );
		var startedInput = cvModal.querySelector( '[data-cv-started]' );
		var generalOnly = cvModal.querySelector( '[data-cv-general-only]' );
		var messageLabel = cvModal.querySelector( '[data-cv-message-label]' );
		var messageField = cvModal.querySelector( '[data-cv-message]' );
		var fileInput = cvModal.querySelector( '[data-cv-file]' );
		var dropzone = cvModal.querySelector( '[data-cv-dropzone]' );
		var emptyEl = cvModal.querySelector( '[data-cv-empty]' );
		var chosenEl = cvModal.querySelector( '[data-cv-chosen]' );
		var fileNameEl = cvModal.querySelector( '[data-cv-filename]' );
		var errorEl = cvModal.querySelector( '[data-cv-error]' );
		var submitBtn = cvModal.querySelector( '[data-cv-submit]' );
		var successText = cvModal.querySelector( '[data-cv-success-text]' );

		var copy = {
			role: {
				title: 'Apply for this role',
				desc: "Tell us a bit about yourself and why you'd be a great fit.",
				label: 'Tell us a bit about yourself and how your skills and mindset can add to our culture',
				submit: 'Submit application',
				done: "Your application has been received. A TA agent will be in touch with you soon if you're shortlisted."
			},
			general: {
				title: 'Send us your CV',
				desc: "Tell us a bit about yourself and the kind of role you're looking for.",
				label: "Anything else you'd like us to know? (optional)",
				submit: 'Submit CV',
				done: 'Your CV has been received. If a role feels like the right fit, our team will be in touch.'
			}
		};
		var mode = 'role';
		var lastFocus = null;
		var maxBytes = 4 * 1024 * 1024;

		var showError = function ( message ) {
			errorEl.textContent = message || 'Something went wrong. Please try again or email careers@voigue.com.';
			errorEl.classList.remove( 'hidden' );
		};
		var hideError = function () {
			errorEl.classList.add( 'hidden' );
		};

		var resetFile = function () {
			fileInput.value = '';
			emptyEl.classList.remove( 'hidden' );
			chosenEl.classList.add( 'hidden' );
			chosenEl.classList.remove( 'flex' );
		};

		var fileProblem = function ( file ) {
			if ( ! file ) {
				return 'Please attach your CV.';
			}
			var ext = ( file.name.split( '.' ).pop() || '' ).toLowerCase();
			if ( [ 'pdf', 'doc', 'docx' ].indexOf( ext ) === -1 ) {
				return 'Please upload your CV as a PDF, DOC or DOCX file.';
			}
			if ( file.size > maxBytes ) {
				return 'Your CV is larger than 4 MB. Please upload a smaller file.';
			}
			return '';
		};

		var setMode = function ( nextMode, jobId, jobTitle ) {
			mode = nextMode;
			var text = copy[ mode ];
			var general = mode === 'general';
			titleEl.textContent = text.title;
			descEl.textContent = text.desc;
			messageLabel.textContent = text.label;
			submitBtn.textContent = text.submit;
			typeInput.value = mode;
			jobIdInput.value = jobId || '';
			jobEl.textContent = jobTitle || '';
			jobEl.hidden = general || ! jobTitle;
			generalOnly.hidden = ! general;
			generalOnly.querySelectorAll( 'input' ).forEach( function ( input ) {
				input.disabled = ! general;
				input.required = general;
			} );
			messageField.required = ! general;
			messageField.minLength = general ? 0 : 10;
			messageField.maxLength = general ? 2000 : 4000;
		};

		var openModal = function ( nextMode, jobId, jobTitle ) {
			lastFocus = document.activeElement;
			cvForm.reset();
			resetFile();
			hideError();
			setMode( nextMode, jobId, jobTitle );
			formView.hidden = false;
			successView.hidden = true;
			startedInput.value = String( Date.now() );
			cvModal.hidden = false;
			document.body.style.overflow = 'hidden';
			cvForm.querySelector( '[name="name"]' ).focus();
		};

		var closeModal = function () {
			cvModal.hidden = true;
			document.body.style.overflow = '';
			if ( lastFocus && lastFocus.focus ) {
				lastFocus.focus();
			}
		};

		document.addEventListener( 'click', function ( event ) {
			var opener = event.target.closest( '[data-open-cv]' );
			if ( opener ) {
				openModal( opener.getAttribute( 'data-open-cv' ), opener.getAttribute( 'data-job-id' ), opener.getAttribute( 'data-job-title' ) );
				return;
			}
			if ( event.target.closest( '[data-cv-close]' ) && ! cvModal.hidden ) {
				closeModal();
			}
		} );

		document.addEventListener( 'keydown', function ( event ) {
			if ( cvModal.hidden ) {
				return;
			}
			if ( event.key === 'Escape' ) {
				closeModal();
				return;
			}
			if ( event.key !== 'Tab' ) {
				return;
			}
			var focusable = Array.prototype.filter.call(
				dialog.querySelectorAll( 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), textarea, select' ),
				function ( el ) {
					return el.offsetParent !== null || el === fileInput;
				}
			);
			if ( ! focusable.length ) {
				return;
			}
			var first = focusable[ 0 ];
			var last = focusable[ focusable.length - 1 ];
			if ( event.shiftKey && document.activeElement === first ) {
				event.preventDefault();
				last.focus();
			} else if ( ! event.shiftKey && document.activeElement === last ) {
				event.preventDefault();
				first.focus();
			}
		} );

		var chooseFile = function ( file ) {
			var problem = fileProblem( file );
			if ( problem ) {
				resetFile();
				showError( problem );
				return;
			}
			hideError();
			fileNameEl.textContent = file.name;
			emptyEl.classList.add( 'hidden' );
			chosenEl.classList.remove( 'hidden' );
			chosenEl.classList.add( 'flex' );
		};

		fileInput.addEventListener( 'change', function () {
			if ( fileInput.files.length ) {
				chooseFile( fileInput.files[ 0 ] );
			}
		} );
		[ 'dragenter', 'dragover' ].forEach( function ( name ) {
			dropzone.addEventListener( name, function ( event ) {
				event.preventDefault();
				dropzone.classList.add( 'is-dragging' );
			} );
		} );
		[ 'dragleave', 'drop' ].forEach( function ( name ) {
			dropzone.addEventListener( name, function ( event ) {
				event.preventDefault();
				dropzone.classList.remove( 'is-dragging' );
			} );
		} );
		dropzone.addEventListener( 'drop', function ( event ) {
			if ( event.dataTransfer && event.dataTransfer.files.length ) {
				fileInput.files = event.dataTransfer.files;
				chooseFile( fileInput.files[ 0 ] );
			}
		} );

		cvForm.addEventListener( 'submit', function ( event ) {
			event.preventDefault();
			hideError();
			var problem = fileProblem( fileInput.files[ 0 ] );
			if ( ! cvForm.checkValidity() ) {
				cvForm.reportValidity();
				return;
			}
			if ( problem ) {
				showError( problem );
				return;
			}
			submitBtn.disabled = true;
			submitBtn.textContent = 'Sending...';
			fetch( window.voigueTheme.ajaxUrl, { method: 'POST', body: new FormData( cvForm ), credentials: 'same-origin' } )
				.then( function ( response ) {
					return response.json().catch( function () {
						return null;
					} );
				} )
				.then( function ( data ) {
					if ( data && data.success ) {
						successText.textContent = copy[ mode ].done;
						formView.hidden = true;
						successView.hidden = false;
						dialog.focus();
					} else {
						showError( data && data.data && data.data.message );
					}
				} )
				.catch( function () {
					showError();
				} )
				.finally( function () {
					submitBtn.disabled = false;
					submitBtn.textContent = copy[ mode ].submit;
				} );
		} );
	}
}() );
