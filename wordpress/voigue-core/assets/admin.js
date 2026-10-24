/* Media picker for Voigue > Site settings. */
( function () {
	'use strict';

	document.querySelectorAll( '.voigue-media' ).forEach( function ( field ) {
		var idInput = field.querySelector( '.voigue-media-id' );
		var preview = field.querySelector( '.voigue-media-preview' );
		var nameEl = field.querySelector( '.voigue-media-name' );
		var remove = field.querySelector( '.voigue-media-remove' );
		var type = field.getAttribute( 'data-type' );
		var frame = null;

		field.querySelector( '.voigue-media-choose' ).addEventListener( 'click', function () {
			if ( ! frame ) {
				frame = wp.media( {
					title: type === 'video' ? 'Choose a video' : 'Choose a photo',
					button: { text: 'Use this file' },
					library: { type: type },
					multiple: false,
				} );
				frame.on( 'select', function () {
					var file = frame.state().get( 'selection' ).first().toJSON();
					idInput.value = file.id;
					nameEl.textContent = file.filename || file.title;
					preview.innerHTML = '';
					if ( type === 'image' ) {
						var img = document.createElement( 'img' );
						img.src = ( file.sizes && file.sizes.thumbnail ) ? file.sizes.thumbnail.url : file.url;
						img.alt = '';
						preview.appendChild( img );
					}
					remove.hidden = false;
				} );
			}
			frame.open();
		} );

		remove.addEventListener( 'click', function () {
			idInput.value = '';
			nameEl.textContent = 'No file chosen';
			preview.innerHTML = '';
			remove.hidden = true;
		} );
	} );
}() );
