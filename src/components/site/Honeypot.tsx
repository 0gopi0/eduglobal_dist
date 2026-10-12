import type { ChangeEvent } from 'react'

/**
 * Spam trap: a field people never see or tab into, so any value means a bot.
 * Kept off-screen rather than `display:none`, which some bots skip.
 */
export function Honeypot({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label>
        Leave this field empty
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={value}
          onChange={(event: ChangeEvent<HTMLInputElement>) => onChange(event.target.value)}
        />
      </label>
    </div>
  )
}
