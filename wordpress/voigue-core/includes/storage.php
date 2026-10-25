<?php
/**
 * Private storage for candidates' CVs.
 *
 * CVs are personal data, so they must never be reachable by a web address. Preferred location: a folder
 * ABOVE the website's public folder. If the host does not allow that, the folder lives inside the uploads
 * folder and is protected by an .htaccess rule plus unguessable file names (the Health check page tells
 * the IT team which of the two is in use, and tests that the protection really works).
 *
 * Files can only be downloaded through the admin, by a signed-in user who may edit applications.
 *
 * @package Voigue_Core
 */

defined( 'ABSPATH' ) || exit;

/**
 * Absolute path of the private folder (created on first use). Add define( 'VOIGUE_PRIVATE_DIR', '/path' ) to
 * wp-config.php to choose a location yourself.
 *
 * @return string
 */
function voigue_private_dir() {
	static $dir = null;
	if ( null !== $dir ) {
		return $dir;
	}

	if ( defined( 'VOIGUE_PRIVATE_DIR' ) && VOIGUE_PRIVATE_DIR ) {
		$base = untrailingslashit( VOIGUE_PRIVATE_DIR );
	} else {
		$outside = dirname( untrailingslashit( ABSPATH ) ) . '/voigue-private';
		if ( ( is_dir( $outside ) || @wp_mkdir_p( $outside ) ) && wp_is_writable( $outside ) ) { // phpcs:ignore WordPress.PHP.NoSilencedErrors.Discouraged -- an unwritable parent folder is an expected case; we fall back below.
			$base = $outside;
		} else {
			$uploads = wp_upload_dir();
			$base    = untrailingslashit( $uploads['basedir'] ) . '/voigue-private';
		}
	}

	wp_mkdir_p( $base . '/cvs' );

	// Belt and braces: block direct web access and directory listings wherever the folder ends up.
	$guards = array(
		'.htaccess' => "<IfModule mod_authz_core.c>\nRequire all denied\n</IfModule>\n<IfModule !mod_authz_core.c>\nOrder allow,deny\nDeny from all\n</IfModule>\n",
		'index.php' => "<?php\n// Silence is golden.\n",
	);
	foreach ( array( $base, $base . '/cvs' ) as $folder ) {
		foreach ( $guards as $name => $contents ) {
			if ( ! file_exists( $folder . '/' . $name ) ) {
				file_put_contents( $folder . '/' . $name, $contents ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_system_operations_file_put_contents
			}
		}
	}

	$dir = $base;
	return $dir;
}

/**
 * Whether the private folder is outside the website's public files ("outside") or inside uploads ("uploads").
 *
 * @return string
 */
function voigue_private_dir_mode() {
	$uploads = wp_upload_dir();
	return 0 === strpos( voigue_private_dir(), untrailingslashit( $uploads['basedir'] ) ) ? 'uploads' : 'outside';
}

/**
 * Limits for CV uploads.
 *
 * @return array{max_bytes:int,extensions:string[]}
 */
function voigue_cv_limits() {
	return array(
		'max_bytes'  => 4 * MB_IN_BYTES,
		'extensions' => array( 'pdf', 'doc', 'docx' ),
	);
}

/**
 * Checks an uploaded CV by its extension, size AND its real contents (the first bytes), not just the name the browser gave it.
 *
 * @param mixed $file One entry of $_FILES.
 * @return array{ext:string,mime:string,size:int,name:string}|WP_Error
 */
function voigue_validate_cv( $file ) {
	if ( ! is_array( $file ) || empty( $file['tmp_name'] ) || ! isset( $file['error'] ) ) {
		return new WP_Error( 'missing', 'Please attach your CV.' );
	}
	if ( UPLOAD_ERR_NO_FILE === (int) $file['error'] ) {
		return new WP_Error( 'missing', 'Please attach your CV.' );
	}
	if ( in_array( (int) $file['error'], array( UPLOAD_ERR_INI_SIZE, UPLOAD_ERR_FORM_SIZE ), true ) ) {
		return new WP_Error( 'size', 'Your CV is larger than 4 MB. Please upload a smaller file.' );
	}
	if ( UPLOAD_ERR_OK !== (int) $file['error'] || ! is_uploaded_file( $file['tmp_name'] ) ) {
		return new WP_Error( 'upload', 'Your CV could not be uploaded. Please try again.' );
	}

	$limits = voigue_cv_limits();
	$size   = (int) filesize( $file['tmp_name'] );
	if ( $size <= 0 || $size > $limits['max_bytes'] ) {
		return new WP_Error( 'size', 'Your CV is larger than 4 MB. Please upload a smaller file.' );
	}

	$name = sanitize_file_name( wp_unslash( (string) ( $file['name'] ?? 'cv' ) ) );
	$ext  = strtolower( pathinfo( $name, PATHINFO_EXTENSION ) );
	if ( ! in_array( $ext, $limits['extensions'], true ) ) {
		return new WP_Error( 'type', 'Please upload your CV as a PDF, DOC or DOCX file.' );
	}

	$handle = fopen( $file['tmp_name'], 'rb' ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_system_operations_fopen
	$head   = $handle ? (string) fread( $handle, 8 ) : ''; // phpcs:ignore WordPress.WP.AlternativeFunctions.file_system_operations_fread
	if ( $handle ) {
		fclose( $handle ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_system_operations_fclose
	}

	$is_pdf  = 0 === strpos( $head, '%PDF-' );
	$is_zip  = 0 === strpos( $head, "PK\x03\x04" );
	$is_ole  = 0 === strpos( $head, "\xD0\xCF\x11\xE0\xA1\xB1\x1A\xE1" );
	$matches = ( 'pdf' === $ext && $is_pdf ) || ( 'docx' === $ext && $is_zip ) || ( 'doc' === $ext && $is_ole );
	if ( ! $matches ) {
		return new WP_Error( 'type', 'That file does not look like a valid PDF, DOC or DOCX. Please check it and try again.' );
	}

	$mimes = array(
		'pdf'  => 'application/pdf',
		'doc'  => 'application/msword',
		'docx' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
	);
	return array(
		'ext'  => $ext,
		'mime' => $mimes[ $ext ],
		'size' => $size,
		'name' => $name,
	);
}

/**
 * Moves a validated upload into the private folder under an unguessable name.
 *
 * @param string $tmp_name Temporary upload path.
 * @param string $ext      Validated extension.
 * @return string|false Stored file name (not a path), or false on failure.
 */
function voigue_store_cv( $tmp_name, $ext ) {
	$stored = wp_generate_password( 32, false, false ) . '.' . $ext;
	$target = voigue_private_dir() . '/cvs/' . $stored;

	if ( @move_uploaded_file( $tmp_name, $target ) ) { // phpcs:ignore WordPress.PHP.NoSilencedErrors.Discouraged -- failure is handled below.
		return $stored;
	}
	// Some hosting set-ups refuse move_uploaded_file(); the upload was already verified with is_uploaded_file().
	if ( @copy( $tmp_name, $target ) ) { // phpcs:ignore WordPress.PHP.NoSilencedErrors.Discouraged
		@unlink( $tmp_name ); // phpcs:ignore WordPress.PHP.NoSilencedErrors.Discouraged, WordPress.WP.AlternativeFunctions.unlink_unlink
		return $stored;
	}
	return false;
}
