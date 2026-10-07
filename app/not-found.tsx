import { ArrowLink, ButtonLink, Container } from "@/components/ui/primitives";

export default function NotFound() {
  return (
    <section className="py-24 sm:py-32">
      <Container>
        <p className="t-label">
          <span className="text-accent-ink">Error 404</span> — Sheet not found
        </p>
        <h1 className="t-h1 mt-6 max-w-[16ch] text-ink">This page isn’t in the set.</h1>
        <p className="t-lead mt-6 max-w-[48ch]">The link may be out of date, or the page may have moved.</p>
        <div className="mt-10 flex flex-wrap items-center gap-6">
          <ButtonLink href="/">Back to home</ButtonLink>
          <ArrowLink href="/projects">Browse all work</ArrowLink>
        </div>
      </Container>
    </section>
  );
}
