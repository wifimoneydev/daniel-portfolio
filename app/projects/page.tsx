import { getAllProjects, getUsedCategories, toSummary } from "@/lib/content/loader";
import { pageMetadata } from "@/lib/seo";
import { Container } from "@/components/ui/primitives";
import { PageHeader } from "@/components/sections/page-header";
import { ProjectLibrary } from "@/components/projects/project-library";
import { ContactCta } from "@/components/sections/contact-cta";

export const metadata = pageMetadata({
  title: "Work",
  description: "The complete library of projects by Daniel Awofadeju — AI, full-stack software, NLP, computer vision and architecture.",
  path: "/projects",
});

export default function ProjectsPage() {
  const projects = getAllProjects();
  const categories = getUsedCategories(projects);

  return (
    <>
      <PageHeader
        eyebrow="Work · Library"
        title="All work."
        lead="Every published project across software, AI and architecture. Flagship projects include full case studies."
      />
      <Container className="pb-24 sm:pb-32">
        {projects.length > 0 ? (
          <ProjectLibrary projects={projects.map((p) => toSummary(p, { context: "work" }))} categories={categories} />
        ) : (
          <p className="border-t border-rule pt-6 text-ink-2">Projects are being prepared for publication.</p>
        )}
      </Container>
      <ContactCta />
    </>
  );
}
