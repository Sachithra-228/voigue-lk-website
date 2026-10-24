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
}() );
