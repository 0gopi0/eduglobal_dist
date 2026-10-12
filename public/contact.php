<?php
/**
 * Enquiry mail relay for the static site (Hostinger, Apache + PHP).
 *
 * Browsers cannot speak SMTP, and anything shipped in the JS bundle is public,
 * so the two site forms POST JSON here and this script sends the email using
 * SMTP credentials that live only on the server.
 *
 * Config is loaded from (first match wins):
 *   1. ../eduglobal-mail.config.php   one level ABOVE the web root (preferred)
 *   2. ./config.mail.php              next to this file (gitignored, denied by .htaccess)
 * See server/config.mail.example.php and docs/EMAIL_SETUP.md.
 */

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

// Never leak warnings (which can include hostnames/credentials) into the response.
ini_set('display_errors', '0');
error_reporting(E_ALL);

function respond(int $status, array $body): void
{
    http_response_code($status);
    echo json_encode($body, JSON_UNESCAPED_UNICODE);
    exit;
}

function fail(int $status, string $error): void
{
    respond($status, ['ok' => false, 'error' => $error]);
}

const GENERIC_SEND_ERROR = 'We could not send your enquiry right now. Please try again shortly or call us.';

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    fail(405, 'Method not allowed.');
}

/* ------------------------------------------------------------------ config */

$config = null;
foreach ([dirname(__DIR__) . '/eduglobal-mail.config.php', __DIR__ . '/config.mail.php'] as $path) {
    if (is_file($path) && is_readable($path)) {
        $config = require $path;
        break;
    }
}
if (!is_array($config) || empty($config['to'])) {
    error_log('contact.php: mail config missing or invalid');
    fail(500, GENERIC_SEND_ERROR);
}

/* ------------------------------------------------------------------- input */

$raw = file_get_contents('php://input', false, null, 0, 20000);
$data = json_decode((string) $raw, true);
if (!is_array($data)) {
    fail(400, 'Invalid request.');
}

// Honeypot: real users never see this field. Pretend success so bots move on.
if (trim((string) ($data['website'] ?? '')) !== '') {
    respond(200, ['ok' => true]);
}

/** Trim, collapse control characters, and cap length. */
function clean($value, int $max, bool $multiline = false): string
{
    if (!is_string($value) && !is_numeric($value)) {
        return '';
    }
    $value = (string) $value;
    $value = $multiline
        ? preg_replace('/[^\P{C}\n\t]/u', '', str_replace("\r\n", "\n", $value))
        : preg_replace('/\p{C}+/u', ' ', $value);
    $value = trim((string) $value);
    return mb_substr($value, 0, $max);
}

$form = ($data['form'] ?? '') === 'hero' ? 'hero' : 'contact';

$fields = [
    'name'        => clean($data['name'] ?? '', 120),
    'phone'       => clean($data['phone'] ?? '', 40),
    'email'       => clean($data['email'] ?? '', 160),
    'school'      => clean($data['school'] ?? '', 160),
    'role'        => clean($data['role'] ?? '', 80),
    'state'       => clean($data['state'] ?? '', 80),
    'medium'      => clean($data['medium'] ?? '', 80),
    'students'    => clean($data['students'] ?? '', 80),
    'fees'        => clean($data['fees'] ?? '', 80),
    'inquiryType' => clean($data['inquiryType'] ?? '', 80),
    'location'    => clean($data['location'] ?? '', 120),
    'message'     => clean($data['message'] ?? '', 5000, true),
    'page'        => clean($data['page'] ?? '', 300),
];

$required = ['name', 'phone', 'email', 'school'];
$required = array_merge(
    $required,
    $form === 'hero' ? ['role', 'state', 'medium', 'students', 'fees'] : ['message'],
);
foreach ($required as $key) {
    if ($fields[$key] === '') {
        fail(422, 'Please fill in all required fields.');
    }
}
if (mb_strlen($fields['name']) < 2 || mb_strlen($fields['school']) < 2) {
    fail(422, 'Please fill in all required fields.');
}
if (!filter_var($fields['email'], FILTER_VALIDATE_EMAIL)) {
    fail(422, 'Please enter a valid email address.');
}
if (!preg_match('/^[0-9+()\-\s.]{6,40}$/', $fields['phone'])) {
    fail(422, 'Please enter a valid phone number.');
}

/* -------------------------------------------------------------- rate limit */

// Per-IP sliding window stored in small temp files: at most N sends per window.
$limit = (int) ($config['rate_limit'] ?? 5);
$window = (int) ($config['rate_window'] ?? 600);
$ip = (string) ($_SERVER['REMOTE_ADDR'] ?? 'unknown');
$throttleDir = rtrim(sys_get_temp_dir(), '/') . '/eduglobal-contact';
if (!is_dir($throttleDir)) {
    @mkdir($throttleDir, 0700, true);
}
$throttleFile = $throttleDir . '/' . hash('sha256', $ip) . '.json';
$now = time();
$hits = [];
if (is_file($throttleFile)) {
    $hits = json_decode((string) @file_get_contents($throttleFile), true) ?: [];
}
$hits = array_values(array_filter($hits, static fn ($t) => is_int($t) && $t > $now - $window));
if (count($hits) >= $limit) {
    header('Retry-After: ' . $window);
    fail(429, 'Too many enquiries from your connection. Please try again in a few minutes.');
}

/* -------------------------------------------------------------------- mail */

$labels = [
    'name'        => 'Name',
    'phone'       => 'Phone',
    'email'       => 'Email',
    'school'      => 'School / organization',
    'role'        => 'Role',
    'state'       => 'State / UT',
    'medium'      => 'Medium',
    'students'    => 'No. of students',
    'fees'        => 'Annual fees',
    'inquiryType' => 'Inquiry type',
    'location'    => 'City / region',
    'message'     => 'Message',
    'page'        => 'Page',
];
$lines = ['New enquiry from the website (' . ($form === 'hero' ? 'homepage "Get a callback" form' : 'Contact page form') . ')', ''];
foreach ($labels as $key => $label) {
    if ($fields[$key] !== '') {
        $lines[] = $key === 'message' ? "$label:\n" . $fields[$key] : "$label: " . $fields[$key];
    }
}
$lines[] = '';
$lines[] = 'Submitted: ' . gmdate('Y-m-d H:i:s') . ' UTC';
$lines[] = 'IP: ' . $ip;
$body = implode("\n", $lines) . "\n";

$subject = ($form === 'hero' ? 'Callback request' : 'Website enquiry') . ': ' . $fields['name'] . ' – ' . $fields['school'];

$sent = send_mail($config, $subject, $body, $fields['email'], $fields['name']);
if (!$sent) {
    fail(502, GENERIC_SEND_ERROR);
}

$hits[] = $now;
@file_put_contents($throttleFile, json_encode($hits), LOCK_EX);

respond(200, ['ok' => true]);

/* ================================================================ helpers */

/** Strip anything that could break out of a header line. */
function header_safe(string $value): string
{
    return trim(preg_replace('/[\r\n\0]+/', ' ', $value));
}

function encode_header(string $value): string
{
    return '=?UTF-8?B?' . base64_encode(header_safe($value)) . '?=';
}

function send_mail(array $config, string $subject, string $body, string $replyTo, string $replyName): bool
{
    $from = header_safe((string) ($config['from'] ?? $config['username'] ?? ''));
    $fromName = (string) ($config['from_name'] ?? 'Website');
    $to = header_safe((string) $config['to']);
    $host = (string) ($_SERVER['HTTP_HOST'] ?? 'localhost');
    $domain = preg_replace('/[^A-Za-z0-9.\-]/', '', substr($from, strrpos($from, '@') + 1)) ?: 'localhost';

    $headers = [
        'Date: ' . date('r'),
        'From: ' . encode_header($fromName) . " <$from>",
        "To: <$to>",
        'Reply-To: ' . encode_header($replyName) . ' <' . header_safe($replyTo) . '>',
        'Subject: ' . encode_header($subject),
        'Message-ID: <' . bin2hex(random_bytes(12)) . "@$domain>",
        'MIME-Version: 1.0',
        'Content-Type: text/plain; charset=UTF-8',
        'Content-Transfer-Encoding: base64',
        'X-Mailer: eduglobal-contact (' . header_safe($host) . ')',
    ];
    $encodedBody = rtrim(chunk_split(base64_encode($body), 76, "\r\n"));

    if (($config['transport'] ?? 'smtp') === 'mail') {
        // Fallback: PHP mail(). Subject/To are passed separately.
        $extra = array_filter($headers, static fn ($h) => !preg_match('/^(To|Subject|Date):/', $h));
        return @mail($to, encode_header($subject), $encodedBody, implode("\r\n", $extra), '-f' . $from);
    }

    try {
        smtp_send($config, $from, $to, implode("\r\n", $headers) . "\r\n\r\n" . $encodedBody);
        return true;
    } catch (Throwable $e) {
        // Server log only; the message never contains the password.
        error_log('contact.php SMTP failure: ' . $e->getMessage());
        return false;
    }
}

/**
 * Minimal SMTP client: EHLO, STARTTLS (port 587) or implicit TLS (port 465),
 * AUTH LOGIN, one message. Throws RuntimeException on any unexpected reply.
 */
function smtp_send(array $config, string $from, string $to, string $message): void
{
    $host = (string) ($config['host'] ?? 'smtp.hostinger.com');
    $port = (int) ($config['port'] ?? 587);
    $secure = (string) ($config['secure'] ?? ($port === 465 ? 'ssl' : 'tls'));
    $timeout = 15;

    $context = stream_context_create(['ssl' => [
        'verify_peer' => true,
        'verify_peer_name' => true,
        'peer_name' => $host,
    ]]);
    $remote = ($secure === 'ssl' ? 'ssl://' : 'tcp://') . $host . ':' . $port;
    $socket = @stream_socket_client($remote, $errno, $errstr, $timeout, STREAM_CLIENT_CONNECT, $context);
    if (!$socket) {
        throw new RuntimeException("connect to $host:$port failed ($errno)");
    }
    stream_set_timeout($socket, $timeout);

    $read = static function () use ($socket): array {
        $text = '';
        while (($line = fgets($socket, 1024)) !== false) {
            $text .= $line;
            // Multi-line replies use "250-"; the last line uses "250 ".
            if (strlen($line) < 4 || $line[3] !== '-') {
                break;
            }
        }
        return [(int) substr($text, 0, 3), $text];
    };
    $expect = static function (array $codes, string $step) use ($read): string {
        [$code, $text] = $read();
        if (!in_array($code, $codes, true)) {
            throw new RuntimeException("$step: unexpected reply $code");
        }
        return $text;
    };
    $send = static function (string $line) use ($socket): void {
        fwrite($socket, $line . "\r\n");
    };

    try {
        $ehloName = preg_replace('/[^A-Za-z0-9.\-]/', '', (string) ($_SERVER['SERVER_NAME'] ?? 'localhost')) ?: 'localhost';

        $expect([220], 'greeting');
        $send("EHLO $ehloName");
        $expect([250], 'EHLO');

        if ($secure === 'tls') {
            $send('STARTTLS');
            $expect([220], 'STARTTLS');
            $crypto = STREAM_CRYPTO_METHOD_TLS_CLIENT;
            if (defined('STREAM_CRYPTO_METHOD_TLSv1_2_CLIENT')) {
                $crypto |= STREAM_CRYPTO_METHOD_TLSv1_2_CLIENT;
            }
            if (defined('STREAM_CRYPTO_METHOD_TLSv1_3_CLIENT')) {
                $crypto |= STREAM_CRYPTO_METHOD_TLSv1_3_CLIENT;
            }
            if (!@stream_socket_enable_crypto($socket, true, $crypto)) {
                throw new RuntimeException('TLS negotiation failed');
            }
            $send("EHLO $ehloName");
            $expect([250], 'EHLO after STARTTLS');
        }

        $send('AUTH LOGIN');
        $expect([334], 'AUTH LOGIN');
        $send(base64_encode((string) $config['username']));
        $expect([334], 'AUTH username');
        $send(base64_encode((string) $config['password']));
        $expect([235], 'AUTH password');

        $send("MAIL FROM:<$from>");
        $expect([250], 'MAIL FROM');
        $send("RCPT TO:<$to>");
        $expect([250, 251], 'RCPT TO');
        $send('DATA');
        $expect([354], 'DATA');
        // Body is base64 so no line can start with "."; headers were sanitised.
        fwrite($socket, $message . "\r\n.\r\n");
        $expect([250], 'end of DATA');
        $send('QUIT');
    } finally {
        fclose($socket);
    }
}
