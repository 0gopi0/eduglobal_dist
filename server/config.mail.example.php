<?php
/**
 * SMTP settings for public/contact.php — TEMPLATE ONLY, safe to commit.
 *
 * Copy to the server (never into git, never into VITE_* env vars) as either:
 *   - <one level above the web root>/eduglobal-mail.config.php   (preferred), or
 *   - <web root>/config.mail.php                                 (fallback; .htaccess denies direct access)
 * and fill in the real values. See docs/EMAIL_SETUP_GSUITE.md.
 */

return [
    // 'smtp' (recommended) or 'mail' (PHP mail() fallback; ignores host/port/username/password).
    'transport' => 'smtp',

    // Google Workspace (GSuite) / Gmail SMTP.
    'host'     => 'smtp.gmail.com',
    'port'     => 587,          // 587 = STARTTLS, 465 = implicit SSL
    'secure'   => 'tls',        // 'tls' for 587, 'ssl' for 465

    // Full Workspace address as the username.
    // Password = 16-char Google APP PASSWORD (not the login password).
    // Create it at myaccount.google.com → Security → App passwords.
    'username' => 'praveen@eduglobalinnovations.com',
    'password' => 'CHANGE_ME_APP_PASSWORD',

    // Envelope/From address — must equal the username above, or a
    // Gmail "Send mail as" alias verified for that account.
    'from'      => 'praveen@eduglobalinnovations.com',
    'from_name' => 'EduGlobal Website',

    // Inbox that receives enquiries. Set here only; never taken from the request.
    'to' => 'support@eduglobalinnovations.com',

    // Light per-IP throttle: at most `rate_limit` sends per `rate_window` seconds.
    'rate_limit'  => 5,
    'rate_window' => 600,
];
