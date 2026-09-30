import { GraduationCap, House, Mail, ShieldCheck, UserRound, Users } from 'lucide-react'
import { usePageTitle } from '../../components/site/hooks'
import { PairedComparison } from '../../components/site/PairedComparison'
import { PhotoBanner } from '../../components/site/PhotoBanner'
import { Timeline, type Milestone } from '../../components/site/Timeline'
import { Section, StatementHeading } from '../../components/site/ui'
import { VoicesGraph, type Voice } from '../../components/site/VoicesGraph'
import { STATS, formatStat } from '../../content/site'

/** Each traditional-model problem, paired with the ecosystem's answer to it. */
const GAP = [
  [
    'Curricula frozen in the last decade, detached from industry',
    'Industry-aligned, living curricula refreshed every academic cycle',
  ],
  [
    'Empty seats while parents search for quality elsewhere',
    'An admissions engine that positions, converts, and retains',
  ],
  [
    'Founders buried in operations instead of education',
    'A franchise-invested operating model that carries the load',
  ],
  [
    'Teachers, parents, and management speaking different languages',
    'One communication rhythm for the entire school community',
  ],
] as const

const VOICES: readonly Voice[] = [
  {
    icon: ShieldCheck,
    title: 'Administrators',
    body: 'Governance dashboards, compliance frameworks, and operational playbooks that give leadership its time back.',
  },
  {
    icon: GraduationCap,
    title: 'Teachers',
    body: 'Structured pedagogy training, modern teaching aids, and classrooms designed for inquiry, not just instruction.',
  },
  {
    icon: Users,
    title: 'Students',
    body: 'Future-ready skills, mentorship, and learning environments built around how this generation actually learns.',
  },
  {
    icon: House,
    title: 'Parents',
    body: "Transparent progress communication and a genuine seat at the table in their child's education.",
  },
]

const MILESTONES: readonly Milestone[] = [
  { year: '2019', body: 'EduGlobal Innovation founded in Hyderabad with a single partner school.' },
  { year: '2021', body: 'First franchise-invested campus opens; admissions engine formalised.' },
  { year: '2023', body: 'Network crosses 20 partner institutions across three states.' },
  { year: '2025', body: '360° Support platform unifies administrators, teachers, and parents.' },
  {
    year: '2026',
    body: 'Roadmap: 100 partner campuses and a national teacher-enablement academy.',
    planned: true,
  },
]

interface TeamMember {
  name: string
  role: string
  email: string
  /** Square photo in `public/team/`, cropped around the face. */
  photo: string
}

const TEAM: readonly TeamMember[] = [
  {
    name: 'Rajesh',
    role: 'Business Head',
    email: 'rajesh@eduglobalinnovations.com',
    photo: '/team/rajesh.jpg',
  },
  {
    name: 'Priyanka',
    role: 'Head of Product Management',
    email: 'priyanka@eduglobalinnovations.com',
    photo: '/team/priyanka.jpg',
  },
]

/** The three figures shown under the banner's lede. */
const HERO_FACTS = STATS.filter((stat) =>
  ['Partner schools', 'Partner retention', 'Learners impacted'].includes(stat.label),
).map((stat) => ({
  value: formatStat(stat.value, stat.decimals ?? 0, stat.suffix),
  label: stat.label,
}))

export function About() {
  usePageTitle('About Us')

  return (
    <>
      <PhotoBanner
        eyebrow="The EduGlobal story"
        lines={['Education, rebuilt', 'from the ground up.']}
        lede={
          <>
            <strong className="font-semibold text-ink">
              EduGlobal Innovation Private Limited exists for one reason:
            </strong>{' '}
            schools should not have to choose between academic excellence and operational survival.
            We bring both, as one ecosystem.
          </>
        }
        facts={HERO_FACTS}
        action={{ to: '/contact', label: 'Partner with us' }}
        secondaryAction={{ to: '/franchise', label: 'Franchise Model' }}
        photos={['indiaLab', 'aboutListening', 'aboutReading', 'aboutSmiles']}
        backdrop="aboutEvent"
      />

      <Section id="why" tone="mist">
        <StatementHeading
          label="Why we exist"
          title="The gap we were built to close."
          lede="Every problem in the traditional school model has an answer in ours. Hover a row to see the old way crossed out."
        />
        <div className="mt-10">
          <PairedComparison
            before="The traditional model"
            after="The EduGlobal ecosystem"
            rows={GAP}
          />
        </div>
      </Section>

      <Section id="philosophy" tone="sky">
        <StatementHeading
          label="Leadership philosophy"
          title="One community. Four voices. Zero silos."
          lede="A school works when everyone inside it rows in the same direction. Our model connects all four constituencies on a single operating rhythm."
        />
        <div className="mt-10">
          <VoicesGraph voices={VOICES} />
        </div>
      </Section>

      <Section id="journey" tone="mist">
        <StatementHeading
          label="The journey"
          title="Built year by year, school by school."
          lede="From a single partner school in Hyderabad to a network across states, and the road ahead."
        />
        <div className="mt-10">
          <Timeline milestones={MILESTONES} />
        </div>
      </Section>

      <Section id="team" tone="sky" className="relative isolate overflow-hidden">
        {/* A faint dot grid that fades out towards the edges, and a soft glow
            behind the heading, so the band has some texture. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(rgb(0_96_192/0.22)_1.3px,transparent_1.3px)] [mask-image:radial-gradient(ellipse_100%_90%_at_50%_50%,black_35%,transparent)] bg-[size:22px_22px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[28rem] bg-[radial-gradient(50%_60%_at_50%_0%,rgb(255_255_255/0.85),transparent)]"
        />
        <header className="text-center">
          <p className="type-label flex items-center justify-center gap-3 text-leaf">
            <span aria-hidden="true" className="h-0.5 w-8 rounded-full bg-leaf" />
            Our team
            <span aria-hidden="true" className="h-0.5 w-8 rounded-full bg-leaf" />
          </p>
          {/* Sized like StatementHeading, so it matches the headings above. */}
          <h2 className="type-heading mt-4 text-balance lg:text-[length:min(calc((100vw-4rem)/26),2.75rem)] lg:whitespace-nowrap">
            People behind EduGlobal
          </h2>
        </header>
        {/* Fixed-width cards in a wrapping flex row, so the photos stay a
            modest size and a card left alone on the last row sits centred. */}
        <ul className="mt-10 flex flex-wrap justify-center gap-5 text-center">
          {TEAM.map((member) => (
            <li
              key={member.email}
              className="spark-border spark-border-hover relative w-full max-w-[19rem] overflow-hidden rounded-2xl bg-paper ring-1 ring-line transition-[box-shadow,translate] duration-300 [--spark-color:var(--color-leaf)] [--spark-glow:2px] hover:-translate-y-1 hover:shadow-[0_20px_40px_-26px_rgb(0_16_48/0.45)] hover:ring-leaf/35"
            >
              <img
                src={member.photo}
                alt={`${member.name}, ${member.role}`}
                width={720}
                height={720}
                loading="lazy"
                className="aspect-square w-full bg-mist-deep object-cover"
              />
              <div className="px-4 py-6">
                <h3 className="text-[1.1875rem] leading-tight font-bold text-ink">{member.name}</h3>
                <p className="mt-1 text-[0.9375rem] font-medium text-leaf">{member.role}</p>
                <a
                  href={`mailto:${member.email}`}
                  className="mt-4 flex items-center justify-center gap-2 border-t border-line pt-4 text-[0.875rem] [overflow-wrap:anywhere] text-body transition-colors hover:text-leaf"
                >
                  <Mail aria-hidden="true" className="size-4 shrink-0 text-leaf" />
                  {member.email}
                </a>
              </div>
            </li>
          ))}
          {/* The third seat, until the next profile is ready. */}
          <li className="spark-border spark-border-hover relative w-full max-w-[19rem] overflow-hidden rounded-2xl bg-paper ring-1 ring-line transition-[box-shadow,translate] duration-300 [--spark-color:var(--color-leaf)] [--spark-glow:2px] hover:-translate-y-1 hover:shadow-[0_20px_40px_-26px_rgb(0_16_48/0.45)] hover:ring-leaf/35">
            <div className="grid aspect-square w-full place-items-center bg-mist-deep text-leaf/40">
              <UserRound aria-hidden="true" className="size-20" strokeWidth={1.25} />
            </div>
            <div className="px-4 py-6">
              <h3 className="text-[1.1875rem] leading-tight font-bold text-ink">Coming soon</h3>
              <p className="mt-1 text-[0.9375rem] font-medium text-muted">
                A new member of the team will be introduced here.
              </p>
            </div>
          </li>
        </ul>
      </Section>
    </>
  )
}
