/**
 * Posts an enquiry to the PHP mail relay (`public/contact.php`), which sends it
 * with SMTP credentials held only on the server. Nothing secret belongs here:
 * this file ships to every visitor.
 *
 * The relay only runs on Hostinger. Under `vite` on :5173 the request 404s, so
 * point `VITE_ENQUIRY_URL` at a deployed copy if you need to test from dev.
 */
const ENQUIRY_URL = import.meta.env.VITE_ENQUIRY_URL || '/contact.php'

const FALLBACK_ERROR = 'We could not send your enquiry right now. Please try again shortly.'

export interface EnquiryPayload {
  form: 'hero' | 'contact'
  name: string
  phone: string
  email: string
  school: string
  role?: string
  state?: string
  medium?: string
  students?: string
  fees?: string
  inquiryType?: string
  location?: string
  message?: string
  /** Honeypot: hidden from people, so anything here came from a bot. */
  website: string
}

/** Resolves on success; throws an Error with a user-facing message otherwise. */
export async function sendEnquiry(payload: EnquiryPayload): Promise<void> {
  let response: Response
  try {
    response = await fetch(ENQUIRY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ ...payload, page: window.location.href }),
    })
  } catch {
    throw new Error('Network error. Please check your connection and try again.')
  }

  const body = (await response.json().catch(() => null)) as { ok?: boolean; error?: string } | null
  if (!response.ok || !body?.ok) {
    throw new Error(body?.error || FALLBACK_ERROR)
  }
}
