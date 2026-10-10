import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getArchitectureProjects } from "@/lib/content/loader";
import { pageMetadata } from "@/lib/seo";
import { pad } from "@/lib/utils";
import { Container } from "@/components/ui/primitives";
import { PageHeader } from "@/components/sections/page-header";
import { ArchitectureProjectList, ArchitectureProjectListEmpty } from "@/components/architecture/project-list";
import { ContactCta } from "@/components/sections/contact-cta";

export const metadata = pageMetadata({
  title: "Architectural Projects",
  description: "Architectural projects by Daniel Awofadeju — plans, sections, elevations and design concepts.",
  path: "/architecture/projects",
});

export default function ArchitectureProjectsPage() {
  const projects = getArchitectureProjects();

  return (
    <>
      <PageHeader
        eyebrow={
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/architecture" className="link hover:text-ink">
                  Architecture
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li aria-current="page" className="text-ink-2">
                Projects
              </li>
            </ol>
          </nav>
        }
        title="Architectural projects."
        lead={
          projects.length > 0
            ? `${pad(projects.length)} ${projects.length === 1 ? "project" : "projects"}. Each one opens as a full case study with its drawings.`
            : undefined
        }
      />

      <Container className="pb-16 sm:pb-20">
        {projects.length > 0 ? <ArchitectureProjectList projects={projects} /> : <ArchitectureProjectListEmpty />}

        <div className="mt-12">
          <Link href="/architecture" className="group inline-flex items-center gap-2 text-[0.9375rem] font-medium text-ink hover:text-accent-ink">
            <ArrowLeft aria-hidden className="size-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
            <span className="link">Back to Architecture</span>
          </Link>
        </div>
      </Container>

      <ContactCta title="Architecture or design opportunity?" />
    </>
  );
}
