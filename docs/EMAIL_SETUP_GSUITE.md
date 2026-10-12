# Enquiry email setup — Google Workspace (GSuite) SMTP

Both site forms — the homepage **Get a callback** card and the **Contact** page
form — POST JSON to `/contact.php`, a small dependency-free PHP script that
sends one email per enquiry through Gmail SMTP.

> This replaces the old Hostinger SMTP setup (`docs/EMAIL_SETUP.md`).
> Code change: `public/contact.php`, `server/config.mail.example.php`
> now default to `smtp.gmail.com:587` (STARTTLS).

## Important: your login password will NOT work

Google blocks normal account passwords on SMTP. You must use a 16-character
**App Password** (generated once, pasted into the server config). Your regular
login password stays only for logging into Gmail in the browser —
it never goes into any file.

## Step-by-step

### Step 1 — Turn on 2-Step Verification for the sending account

1. Log into Gmail as `praveen@eduglobalinnovations.com`.
2. Go to **myaccount.google.com → Security → 2-Step Verification** → turn it **On**
   (follow the phone prompt). App Passwords require this.
3. If your Workspace admin disabled 2SV or App Passwords, ask the admin to allow
   them: **Admin console → Security → Authentication → 2-step verification**
   (allow users to turn it on).

### Step 2 — Create the App Password

1. Still as `praveen@eduglobalinnovations.com`, go to
   **myaccount.google.com → Security → App passwords**
   (direct link: `myaccount.google.com/apppasswords`).
2. App name: type `EduGlobal website` → **Create**.
3. Google shows a 16-letter code like `abcd efgh ijkl mnop`.
   **Copy it now** — it is shown only once.
4. In the server config below, paste it **without spaces**: `abcdefghijklmnop`.

### Step 3 — Create the config file on the web server

The file lives on the server only — never in git, never in `src/` or `.env`.

1. Open hPanel → **Files → File Manager** → go one level **above** the folder
   the site is served from (parent of `public_html/` or `dist/`).
2. Create `eduglobal-mail.config.php` there (fallback: `config.mail.php` in the
   same folder as `contact.php` — `.htaccess` blocks direct web access to it).
3. Paste this, replacing only the `password` line with your App Password:

```php
<?php
return [
    'transport' => 'smtp',
    'host'     => 'smtp.gmail.com',
    'port'     => 587,
    'secure'   => 'tls',
    'username' => 'praveen@eduglobalinnovations.com',
    'password' => 'PASTE_16_CHAR_APP_PASSWORD_HERE',
    'from'      => 'praveen@eduglobalinnovations.com',
    'from_name' => 'EduGlobal Website',
    'to' => 'praveen@eduglobalinnovations.com',
    'rate_limit'  => 5,
    'rate_window' => 600,
];
```

4. `to` is the inbox that receives enquiries — change it only here, never from
   the browser. Point it at whichever inbox should get leads.

### Step 4 — Deploy

```sh
npm run build
```

Upload the contents of `dist/` (it contains the updated `contact.php` and
`.htaccess`). Re-uploading never touches the config file as long as it lives
outside `dist/` or you don't delete it.

### Step 5 — Test on the live site

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
   relay logs the failing SMTP step there (never the password).

## Troubleshooting

| Symptom | Cause / fix |
|---|---|
| `AUTH password: unexpected reply 535` | Wrong App Password, or pasted with spaces. Regenerate and paste without spaces. |
| `AUTH password: unexpected reply 534` / "application-specific password required" | You're using the login password instead of an App Password. Do Step 2. |
| `connect to smtp.gmail.com:587 failed` | Host blocks outbound SMTP (some shared hosts do). Try port `465` + `'secure' => 'ssl'`, or ask Hostinger support to open outbound 587/465. |
| No App passwords option in Google account | 2-Step Verification is off (Step 1), or Workspace admin disabled it. |
| Mail lands in spam | First-time sender warm-up. Add an SPF record for Google (`v=spf1 include:_spf.google.com ~all`) in hPanel → DNS. |
| Daily sending suddenly stops | Workspace SMTP cap (~2,000/day) hit — far above form volume; check for bot abuse via the `429` throttle logs. |

## Never

- Never paste the App Password (or login password) into `src/`, `public/`,
  `.env*`, a `VITE_*` variable, or git. Server config file only.
- Never let the recipient address come from the form/request.
- Never turn on `display_errors` for this script on the live site.
- If the App Password ever leaks: **myaccount.google.com → Security →
  App passwords → Revoke**, generate a new one, update the server file.
- You shared the Gmail login password in chat to set this up — consider
  changing it now at **myaccount.google.com → Security → Password**, since
  chat history is not a safe place for it.
