/**
 * The Terms & Conditions and Privacy Policy. Generic starting text for an
 * Indian education services company: have it reviewed by a lawyer before
 * relying on it, and update `updated` whenever the wording changes.
 */

import { CONTACT, OFFICE } from './site'

export interface LegalSection {
  heading: string
  /** Paragraphs, in order. */
  body?: readonly string[]
  /** A bulleted list after the paragraphs. */
  list?: readonly string[]
  /** A closing paragraph after the list. */
  after?: string
}

export interface LegalDocument {
  title: string
  updated: string
  intro: readonly string[]
  sections: readonly LegalSection[]
}

const COMPANY = 'EduGlobal Innovation Private Limited'
const SITE = 'eduglobalinnovation.com'

export const TERMS: LegalDocument = {
  title: 'Terms & Conditions',
  updated: '30 September 2026',
  intro: [
    `These Terms & Conditions govern your use of ${SITE} (the "Website") and any enquiry you make through it. The Website is operated by ${COMPANY} ("EduGlobal", "we", "us" or "our"), a company registered in India with its office in Hyderabad, Telangana.`,
    'By using the Website you agree to these terms. If you do not agree, please do not use the Website.',
  ],
  sections: [
    {
      heading: 'About our services',
      body: [
        'EduGlobal works with schools and educational institutions. Our services include curriculum and content licensing, admissions and enrolment growth programmes, franchise partnerships, campus and operations advisory, teacher training, and ongoing support.',
        'The Website describes these services for general information. It is not an offer to provide any service. Every engagement is governed by a separate written agreement between EduGlobal and the institution, and where that agreement differs from anything on the Website, the agreement prevails.',
      ],
    },
    {
      heading: 'Using the Website',
      body: ['You agree to use the Website lawfully and not to:'],
      list: [
        'submit false, misleading or someone else’s information through our forms;',
        'attempt to gain unauthorised access to the Website, its servers or any connected system;',
        'interfere with the Website’s operation, including by introducing viruses or other harmful code;',
        'copy, scrape or reproduce the Website’s content for commercial purposes without our written permission.',
      ],
    },
    {
      heading: 'Enquiries and communication',
      body: [
        'When you submit an enquiry, you confirm that the information you provide is accurate and that you are authorised to share it, including on behalf of your institution.',
        'Submitting an enquiry does not create a contract or oblige either party to proceed. We may contact you by email or phone about your enquiry and our related services. How we handle your information is explained in our Privacy Policy.',
      ],
    },
    {
      heading: 'Figures, results and examples',
      body: [
        'Statistics, projections, case examples and calculator outputs on the Website — such as enrolment uplift, retention rates or seat-fill estimates — illustrate typical outcomes across our partner network. They are not a guarantee of results for any individual institution, which depend on many factors outside our control.',
      ],
    },
    {
      heading: 'Intellectual property',
      body: [
        'All content on the Website, including text, graphics, logos, the EduGlobal name and brand, curriculum descriptions and page design, belongs to EduGlobal or its licensors and is protected by Indian and international intellectual property laws.',
        'You may view and print pages for your own reference when considering our services. Any other use needs our prior written consent. Photographs from third-party libraries remain the property of their owners and are used under their licences.',
      ],
    },
    {
      heading: 'Third-party links and content',
      body: [
        'The Website may link to, or load content such as images from, websites we do not control. We are not responsible for their content, availability or privacy practices, and a link does not mean we endorse them.',
      ],
    },
    {
      heading: 'Accuracy and availability',
      body: [
        'We take care to keep the Website accurate and up to date, but it is provided on an "as is" and "as available" basis. We do not guarantee that it will always be complete, current, uninterrupted or free of errors, and we may change, suspend or withdraw any part of it at any time.',
      ],
    },
    {
      heading: 'Limitation of liability',
      body: [
        'To the extent permitted by law, EduGlobal is not liable for any indirect, incidental or consequential loss, or for loss of profit, revenue, data or goodwill, arising from your use of the Website or reliance on its content.',
        'Nothing in these terms limits any liability that cannot be limited under applicable law. Liability relating to our services is governed by the agreement for those services.',
      ],
    },
    {
      heading: 'Indemnity',
      body: [
        'You agree to indemnify EduGlobal against claims, losses and costs arising from your breach of these terms or your misuse of the Website.',
      ],
    },
    {
      heading: 'Changes to these terms',
      body: [
        'We may update these terms from time to time. The updated version takes effect when it is published on this page, with the date above. Continuing to use the Website after a change means you accept the updated terms.',
      ],
    },
    {
      heading: 'Governing law and jurisdiction',
      body: [
        'These terms are governed by the laws of India. The courts at Hyderabad, Telangana have exclusive jurisdiction over any dispute arising from them or from your use of the Website.',
      ],
    },
    {
      heading: 'Contact us',
      body: [
        `Questions about these terms can be sent to ${CONTACT.email} or ${COMPANY}, ${OFFICE.address}. Phone: ${CONTACT.phone}.`,
      ],
    },
  ],
}

export const PRIVACY: LegalDocument = {
  title: 'Privacy Policy',
  updated: '30 September 2026',
  intro: [
    `${COMPANY} ("EduGlobal", "we", "us" or "our") respects your privacy. This policy explains what personal information we collect through ${SITE} (the "Website"), how we use and protect it, and the choices you have.`,
    'We handle personal data in line with the Information Technology Act, 2000 and its rules, and the Digital Personal Data Protection Act, 2023, as they apply to us.',
  ],
  sections: [
    {
      heading: 'Information we collect',
      body: ['When you send us an enquiry, we collect the details you enter:'],
      list: [
        'your full name;',
        'your school or organisation name;',
        'your email address and phone number;',
        'your city or region;',
        'the type of enquiry and any requirements or context you describe.',
      ],
      after:
        'When you visit the Website, our servers and hosting provider may also record standard technical information such as your IP address, browser type, device, the pages you visit and the time of your visit. We use this to run and secure the Website.',
    },
    {
      heading: 'How we use your information',
      body: ['We use your information to:'],
      list: [
        'respond to your enquiry and discuss our services with you;',
        'prepare proposals, audits or partnership discussions you ask for;',
        'send you information related to your enquiry — you can ask us to stop at any time;',
        'keep the Website secure, prevent misuse and fix problems;',
        'meet our legal and regulatory obligations.',
      ],
      after:
        'We process your information on the basis of the consent you give when you submit an enquiry, and for other lawful purposes permitted by applicable law. We do not sell your personal information.',
    },
    {
      heading: 'Cookies',
      body: [
        'The public pages of the Website do not use advertising or analytics tracking cookies. The staff administration area uses a strictly necessary session cookie to keep authorised users signed in.',
        'If we introduce analytics or other non-essential cookies in future, we will update this policy and, where required, ask for your consent first.',
      ],
    },
    {
      heading: 'Sharing your information',
      body: ['We share personal information only where needed, with:'],
      list: [
        'service providers who host the Website or help us operate it, such as hosting, email and IT providers, under duties of confidentiality;',
        'professional advisers, such as lawyers and auditors, where necessary;',
        'government or law-enforcement authorities, where the law requires it.',
      ],
      after:
        'Images on the Website are loaded from third-party photo libraries, which receive standard technical information such as your IP address when your browser requests them.',
    },
    {
      heading: 'Data security',
      body: [
        'We use reasonable technical and organisational safeguards to protect personal information against unauthorised access, loss or misuse, including encrypted connections and restricted access to enquiry data. No method of transmission or storage is completely secure, but we work to protect your information and will act promptly if a breach occurs.',
      ],
    },
    {
      heading: 'How long we keep it',
      body: [
        'We keep enquiry information for as long as it is needed to respond to you and pursue any resulting discussions or engagement, and afterwards only as long as the law requires or for resolving disputes. We then delete or anonymise it.',
      ],
    },
    {
      heading: 'Your rights',
      body: ['Subject to applicable law, you can ask us to:'],
      list: [
        'confirm what personal information we hold about you and give you a summary of it;',
        'correct, complete or update information that is inaccurate;',
        'delete your information when it is no longer needed;',
        'withdraw your consent to further communication or processing;',
        'nominate another person to exercise these rights on your behalf.',
      ],
      after: `To make a request, email ${CONTACT.email}. We may need to verify your identity before acting on it.`,
    },
    {
      heading: 'Children’s information',
      body: [
        'The Website is intended for school leaders, administrators, investors and other adults. We do not knowingly collect personal information from children through the Website. If you believe a child has submitted information to us, please contact us and we will delete it.',
      ],
    },
    {
      heading: 'Changes to this policy',
      body: [
        'We may update this policy from time to time. The latest version is always on this page, with the date it was last updated.',
      ],
    },
    {
      heading: 'Contact and grievances',
      body: [
        `For any question, request or complaint about your personal information, contact our Grievance Officer at ${CONTACT.email}, by phone on ${CONTACT.phone}, or by post at ${COMPANY}, ${OFFICE.address}. We aim to respond within 30 days.`,
      ],
    },
  ],
}
