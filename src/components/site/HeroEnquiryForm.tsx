import { ChevronDown, CircleCheck } from 'lucide-react'
import { useId, useState, type ChangeEvent, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '../../lib/cn'
import { sendEnquiry } from '../../lib/enquiry'
import { CONTROL } from './EnquiryForm'
import { Honeypot } from './Honeypot'
import { buttonClass } from './ui'

const ROLES = ['School Owner', 'Trustee', 'Principal', 'Vice Principal', 'Director', 'Teacher', 'Other'] as const

const STATES = [
  'Andaman and Nicobar Islands',
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chandigarh',
  'Chhattisgarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jammu and Kashmir',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Ladakh',
  'Lakshadweep',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Puducherry',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
] as const

const MEDIUMS = ['English medium', 'Other medium'] as const

const STUDENT_COUNTS = ['Less than 200', '200 to 800', 'More than 800'] as const

const ANNUAL_FEES = [
  'INR 8,000 or less',
  'INR 8,000 – 10,000',
  'INR 10,000 – 15,000',
  'INR 15,000 – 20,000',
  'INR 20,000 – 25,000',
  'INR 25,000 – 30,000',
  'INR 30,000 – 50,000',
  'INR 50,000 or more',
] as const

function emptyFields() {
  return {
    fullName: '',
    phone: '',
    email: '',
    institutionName: '',
    role: '',
    state: '',
    medium: '',
    students: '',
    annualFees: '',
  }
}

type Fields = ReturnType<typeof emptyFields>

/**
 * Compact "Request a callback" card for the homepage hero. Short fields only
 * (no message box) so it stays close to the hero copy's height. Submissions
 * go to the PHP mail relay; on failure the fields are kept so nothing is lost.
 */
export function HeroEnquiryForm({ className }: { className?: string }) {
  const [fields, setFields] = useState<Fields>(emptyFields)
  const [consent, setConsent] = useState(false)
  const [received, setReceived] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [website, setWebsite] = useState('')
  const id = useId()

  const bind = (name: keyof Fields) => ({
    id: `${id}-${name}`,
    name,
    value: fields[name],
    onChange: (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setFields((current) => ({ ...current, [name]: event.target.value })),
  })

  const select = (name: keyof Fields, placeholder: string, options: readonly string[], className?: string) => (
    <div className={className}>
      <label htmlFor={`${id}-${name}`} className="sr-only">
        {placeholder}
      </label>
      <div className="relative">
        <select
          {...bind(name)}
          required
          className={cn(CONTROL, 'h-11 w-full appearance-none truncate pr-10', !fields[name] && 'text-muted/70')}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option} value={option} className="text-ink">
              {option}
            </option>
          ))}
        </select>
        <ChevronDown
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-muted"
        />
      </div>
    </div>
  )

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (sending) return
    setSending(true)
    setError('')
    try {
      await sendEnquiry({
        form: 'hero',
        name: fields.fullName,
        phone: fields.phone,
        email: fields.email,
        school: fields.institutionName,
        role: fields.role,
        state: fields.state,
        medium: fields.medium,
        students: fields.students,
        fees: fields.annualFees,
        website,
      })
      setReceived(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div
      className={cn(
        'w-full max-w-lg rounded-3xl bg-linear-to-b from-[#f7fbff] to-sky p-5 shadow-[0_24px_60px_-24px_rgb(0_16_48/0.35)] ring-1 ring-line backdrop-blur motion-safe:animate-card-float sm:p-6 max-sm:max-w-none',
        className,
      )}
    >
      {received ? (
        <div role="status" className="py-4">
          <CircleCheck aria-hidden="true" className="h-8 w-8 text-leaf" />
          <p className="type-subheading mt-4 text-ink">Request received.</p>
          <p className="mt-2 text-[0.9375rem]">Our partnerships team will call you within 48 hours.</p>
          <button
            type="button"
            onClick={() => {
              setFields(emptyFields())
              setConsent(false)
              setReceived(false)
            }}
            className={buttonClass('secondary', 'mt-6')}
          >
            Send another request
          </button>
        </div>
      ) : (
        <>
          <h2 className="font-display text-[1.375rem] leading-tight font-bold tracking-[-0.01em] text-ink">
            Get a callback
          </h2>
          <p className="mt-1 text-[0.9375rem] text-muted">
            Tell us about your school and we&rsquo;ll ring you back.
          </p>

          {/* Two columns from sm up; `col-span-full` rows stay full width when it collapses to one. */}
          <form onSubmit={handleSubmit} className="relative mt-4 grid grid-cols-2 gap-3 max-sm:grid-cols-1">
            <Honeypot value={website} onChange={setWebsite} />
            {select('role', 'Your role at the school', ROLES, 'col-span-full')}
            <div>
              <label htmlFor={`${id}-fullName`} className="sr-only">
                Full name
              </label>
              <input
                {...bind('fullName')}
                required
                minLength={2}
                autoComplete="name"
                placeholder="Full name"
                className={cn(CONTROL, 'h-11')}
              />
            </div>
            <div>
              <label htmlFor={`${id}-phone`} className="sr-only">
                Phone number
              </label>
              <input
                {...bind('phone')}
                type="tel"
                required
                minLength={6}
                autoComplete="tel"
                placeholder="Phone number"
                className={cn(CONTROL, 'h-11')}
              />
            </div>
            <div>
              <label htmlFor={`${id}-email`} className="sr-only">
                Email
              </label>
              <input
                {...bind('email')}
                type="email"
                required
                autoComplete="email"
                placeholder="Email"
                className={cn(CONTROL, 'h-11')}
              />
            </div>
            <div>
              <label htmlFor={`${id}-institutionName`} className="sr-only">
                School / organization
              </label>
              <input
                {...bind('institutionName')}
                required
                minLength={2}
                autoComplete="organization"
                placeholder="School / organization"
                className={cn(CONTROL, 'h-11')}
              />
            </div>
            {select('state', 'State / UT', STATES)}
            {select('medium', 'Medium', MEDIUMS)}
            {select('students', 'No. of students', STUDENT_COUNTS)}
            {select('annualFees', 'Annual fees', ANNUAL_FEES)}

            <label className="col-span-full flex cursor-pointer items-start gap-2.5 text-[0.8125rem] leading-tight text-muted">
              <input
                type="checkbox"
                name="consent"
                required
                checked={consent}
                onChange={(event) => setConsent(event.target.checked)}
                className="mt-0.5 size-4 shrink-0 accent-leaf"
              />
              <span>
                I agree to be contacted by EduGlobal Innovations about partnership opportunities, including by
                WhatsApp / SMS.
              </span>
            </label>

            {error ? (
              <p role="alert" className="col-span-full text-[0.875rem] font-medium text-[#b4574b]">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={sending}
              className="col-span-full mt-1 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-azure px-5 text-[0.975rem] font-semibold whitespace-nowrap text-white shadow-[0_14px_28px_-14px_rgb(0_136_240/0.7)] transition-[background-color,box-shadow,color,transform] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-leaf hover:shadow-[0_18px_32px_-14px_rgb(0_96_192/0.7)] active:scale-[0.97] disabled:cursor-wait disabled:opacity-70 sm:px-6"
            >
              {sending ? 'Sending…' : 'Request a callback'}
            </button>
            <p className="col-span-full -mt-1 text-center text-[0.8125rem] text-muted">
              By submitting, you agree to our{' '}
              <Link to="/privacy-policy" className="font-semibold text-ink underline underline-offset-2">
                Privacy Policy
              </Link>
              . Answered within 48 hours.
            </p>
          </form>
        </>
      )}
    </div>
  )
}
