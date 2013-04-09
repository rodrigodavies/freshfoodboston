<?php
/**
 * The base configurations of the WordPress.
 *
 * This file has the following configurations: MySQL settings, Table Prefix,
 * Secret Keys, WordPress Language, and ABSPATH. You can find more information
 * by visiting {@link http://codex.wordpress.org/Editing_wp-config.php Editing
 * wp-config.php} Codex page. You can get the MySQL settings from your web host.
 *
 * This file is used by the wp-config.php creation script during the
 * installation. You don't have to use the web site, you can just copy this file
 * to "wp-config.php" and fill in the values.
 *
 * @package WordPress
 */

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define('DB_NAME', 'k19rodr_ffff');

/** MySQL database username */
define('DB_USER', 'k19rodr_ffff');

/** MySQL database password */
define('DB_PASSWORD', '2Sde7360Pk');

/** MySQL hostname */
define('DB_HOST', 'localhost');

/** Database Charset to use in creating database tables. */
define('DB_CHARSET', 'utf8');

/** The Database Collate type. Don't change this if in doubt. */
define('DB_COLLATE', '');

/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define('AUTH_KEY',         'pm4kmrq88mswjlbrl1x95gc9vdpf9kwajyx69izjx5mopzkrnnpracapf5ulfpof');
define('SECURE_AUTH_KEY',  'ylwr40in0y18vdiygrgvrszzra0rrq58ijqvxdutg2xsevnkngt4mpc9a8dfdfm7');
define('LOGGED_IN_KEY',    'roczndizhbotljvecobblc6togbrdxat3rqzxtxbbpcjpom5nazjwrattjsg9r8k');
define('NONCE_KEY',        'avv846fi7xney5yqz4bsnnt1jnac98zmuh77cfrtohegihtxrjzfrqtlddjmzxke');
define('AUTH_SALT',        'xkhwbnp1hpcdntpkfqxr44twonhrt9hoapvneenigtdracm9nkimztv5smcyqkqc');
define('SECURE_AUTH_SALT', 'r41p6j9eawl5ofpp7apcg6idgdv7xoj0m14tsejwlxij3psk45dxous5krcjqhzd');
define('LOGGED_IN_SALT',   'qrtubbov6ydao2spguznujl7jtfugp8ruri2hyslmo33jojf9jamdovkswjaun3m');
define('NONCE_SALT',       'rfpr47wccomhzubbfqehuexbjwdafpbjfhkpubumghfjrmlbkp2jsmqsanadqg6x');

/**#@-*/

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each a unique
 * prefix. Only numbers, letters, and underscores please!
 */
$table_prefix  = 'wp_';

/**
 * WordPress Localized Language, defaults to English.
 *
 * Change this to localize WordPress.  A corresponding MO file for the chosen
 * language must be installed to wp-content/languages. For example, install
 * de_DE.mo to wp-content/languages and set WPLANG to 'de_DE' to enable German
 * language support.
 */
define ('WPLANG', '');

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 */
define('WP_DEBUG', false);

/* That's all, stop editing! Happy blogging. */

/** Absolute path to the WordPress directory. */
if ( !defined('ABSPATH') )
	define('ABSPATH', dirname(__FILE__) . '/');

/** Sets up WordPress vars and included files. */
require_once(ABSPATH . 'wp-settings.php');
