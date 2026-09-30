import { Link } from 'react-router-dom'
import type { LegalDocument } from '../../content/legal'
import { usePageTitle } from './hooks'

/** A section's anchor, from its position, e.g. `section-3`. */
const anchor = (index: number) => `section-${index + 1}`

/**
 * A legal document: a short header with the date it was last updated, then
 * numbered sections in a readable column. On wide screens an index of the
 * sections sits beside the text and stays in view while reading.
 */
export function LegalPage({
  doc,
  other,
}: {
  doc: LegalDocument
  /** The companion document, linked at the end. */
  other: { to: string; label: string }
}) {
  usePageTitle(doc.title)

  return (
    <>
      <section className="bg-mist">
        <div className="container-site pt-14 pb-10 sm:pt-20 sm:pb-12">
          <p className="type-label text-leaf">Legal</p>
          <h1 className="type-title mt-4">{doc.title}</h1>
          <p className="mt-4 text-[0.9375rem] text-muted">Last updated: {doc.updated}</p>
        </div>
      </section>

      <section className="bg-paper">
        <div className="container-site grid gap-10 py-12 sm:py-16 lg:grid-cols-12">
          <nav aria-label="Sections" className="max-lg:hidden lg:col-span-3">
            <ol className="sticky top-28 grid gap-2 text-[0.875rem]">
              {doc.sections.map((section, index) => (
                <li key={section.heading}>
                  <a
                    href={`#${anchor(index)}`}
                    className="flex gap-2 text-body transition-colors hover:text-leaf"
                  >
                    <span className="w-5 shrink-0 text-muted tabular-nums">{index + 1}.</span>
                    {section.heading}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <article className="max-w-[46rem] lg:col-span-8 lg:col-start-5">
            {doc.intro.map((paragraph) => (
              <p key={paragraph} className="mb-4 leading-relaxed">
                {paragraph}
              </p>
            ))}

            {doc.sections.map((section, index) => (
              <section key={section.heading} id={anchor(index)} className="mt-10 scroll-mt-28">
                <h2 className="text-[1.25rem] leading-tight font-bold text-ink">
                  <span className="mr-2 text-leaf tabular-nums">{index + 1}.</span>
                  {section.heading}
                </h2>
                {section.body?.map((paragraph) => (
                  <p key={paragraph} className="mt-3 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
                {section.list ? (
                  <ul className="mt-3 grid list-disc gap-1.5 pl-6 leading-relaxed marker:text-leaf">
                    {section.list.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : null}
                {section.after ? <p className="mt-3 leading-relaxed">{section.after}</p> : null}
              </section>
            ))}

            <p className="mt-12 border-t border-line pt-6 text-[0.9375rem]">
              See also our{' '}
              <Link
                to={other.to}
                className="font-semibold text-leaf underline decoration-leaf/35 underline-offset-4 hover:decoration-leaf"
              >
                {other.label}
              </Link>
              .
            </p>
          </article>
        </div>
      </section>
    </>
  )
}
