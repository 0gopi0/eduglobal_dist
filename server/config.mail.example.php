<?php
/**
 * SMTP settings for public/contact.php — TEMPLATE ONLY, safe to commit.
 *
 * Copy to the server (never into git, never into VITE_* env vars) as either:
 *   - <one level above the web root>/eduglobal-mail.config.php   (preferred), or
 *   - <web root>/config.mail.php                                 (fallback; .htaccess denies direct access)
 * and fill in the real values. See docs/EMAIL_SETUP.md.
 */

return [
    // 'smtp' (recommended) or 'mail' (PHP mail() fallback; ignores host/port/username/password).
    'transport' => 'smtp',

    'host'     => 'smtp.hostinger.com',
    'port'     => 587,          // 587 = STARTTLS, 465 = implicit SSL
    'secure'   => 'tls',        // 'tls' for 587, 'ssl' for 465

    // A mailbox created in hPanel → Emails. Full address as the username.
    'username' => 'enquiries@eduglobalinnovations.com',
    'password' => 'CHANGE_ME',

    // Envelope/From address — must be the mailbox above (Hostinger rejects other senders).
    'from'      => 'enquiries@eduglobalinnovations.com',
    'from_name' => 'EduGlobal Website',

    // Inbox that receives enquiries. Set here only; never taken from the request.
    'to' => 'support@eduglobalinnovations.com',

    // Light per-IP throttle: at most `rate_limit` sends per `rate_window` seconds.
    'rate_limit'  => 5,
    'rate_window' => 600,
];
