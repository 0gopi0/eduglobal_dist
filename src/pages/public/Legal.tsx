import { LegalPage } from '../../components/site/LegalPage'
import { PRIVACY, TERMS } from '../../content/legal'

export function Terms() {
  return <LegalPage doc={TERMS} other={{ to: '/privacy-policy', label: 'Privacy Policy' }} />
}

export function Privacy() {
  return (
    <LegalPage doc={PRIVACY} other={{ to: '/terms-and-conditions', label: 'Terms & Conditions' }} />
  )
}
