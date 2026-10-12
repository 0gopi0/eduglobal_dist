# Enquiry email setup (Hostinger)

Both site forms — the homepage **Get a callback** card and the **Contact** page
form — POST JSON to `/contact.php`, a small dependency-free PHP script that
sends one email per enquiry through Hostinger SMTP.

## Why a PHP file and not "just the frontend"

- Browsers cannot open SMTP connections; only a server can.
- Everything in the built JS — including any `VITE_*` variable — is downloaded
  by every visitor. An SMTP password placed there is public.

So the password lives in a PHP config file on the server, and the browser only
ever talks to `/contact.php`. Hostinger's shared/business plans run PHP, so no
Node server is needed.

## Files

| File | In git? | Purpose |
| --- | --- | --- |
| `public/contact.php` | yes | The relay. Vite copies it to `dist/contact.php` on build. |
| `server/config.mail.example.php` | yes | Template with placeholder values. |
| `eduglobal-mail.config.php` / `config.mail.php` | **never** (gitignored) | Real SMTP credentials, created on the server only. |
| `.htaccess` / `public/.htaccess` | yes | Keeps `/contact.php` out of the SPA rewrite and denies direct access to config files. |

## One-time setup

1. **Create the sending mailbox.** hPanel → *Emails* → your domain →
   *Create email account*, e.g. `enquiries@eduglobalinnovations.com`, with a
   strong password. (Any existing mailbox on the domain also works.)
2. **Confirm SMTP details.** hPanel → *Emails* → *Connect apps & devices*:
   host `smtp.hostinger.com`, port `587` (STARTTLS) or `465` (SSL), username =
   the full email address.
3. **Create the config file on the server** (hPanel → *Files* → *File Manager*):
   - Preferred: in the folder **one level above** the folder the site is served
     from (i.e. the parent of `dist/` / `public_html/`), create
     `eduglobal-mail.config.php`. Files there cannot be reached from the web.
   - If you can't write there, create `config.mail.php` in the same folder as
     `contact.php`. The `.htaccess` rule denies direct requests to it.
   - Paste the contents of `server/config.mail.example.php` and set
     `username`, `password`, `from` (same mailbox) and `to`.
4. **Recipient inbox.** Enquiries go to the `to` address in that config file
   (the template uses `support@eduglobalinnovations.com`). Change it only there
   — the relay never takes the recipient from the browser.
5. **Deploy** as usual: `npm run build`, upload `dist/` (it now contains
   `contact.php` and `.htaccess`). Re-uploading `dist/` does not touch the
   config file as long as it lives outside `dist/` or you don't delete it.

## Testing

Testing happens on the live Hostinger site, **not** on `localhost:5173`: Vite
does not run PHP, so in dev the form shows the friendly error. (To test from
dev against a deployed relay, set `VITE_ENQUIRY_URL=https://<site>/contact.php`
in `.env.local` — a URL only, never credentials.)

1. Open the homepage, submit the *Get a callback* form → "Request received."
   should appear and an email arrive at the `to` inbox (check spam the first
   time). Repeat on the Contact page.
2. From a terminal:
   ```sh
   curl -i -X POST https://eduglobalinnovations.com/contact.php \
     -H 'Content-Type: application/json' \
     -d '{"form":"contact","name":"Test","phone":"+91 98490 00000","email":"you@example.com","school":"Test School","message":"Testing the relay","website":""}'
   ```
   Expect `200 {"ok":true}`. Missing fields → `422`, GET → `405`, more than 5
   sends from one IP in 10 minutes → `429`.
3. Confirm the config is not public:
   `curl -i https://eduglobalinnovations.com/config.mail.php` → `403`.
4. If sending fails (`502`), check hPanel → *Advanced* → *PHP error logs* — the
   relay logs the failing SMTP step there (never the password). Common causes:
   wrong password, `from` not equal to the mailbox, or port/`secure` mismatch
   (587 ↔ `tls`, 465 ↔ `ssl`). As a last resort set `'transport' => 'mail'` to
   use PHP `mail()`.

## Never

- Never commit the real config file or paste the SMTP password into any file
  under `src/`, `public/`, `.env*`, or a `VITE_*` variable.
- Never let the recipient address come from the form/request.
- Never turn on `display_errors` for this script on the live site.
- If the password is ever exposed, change it in hPanel immediately and update
  the server config file.
