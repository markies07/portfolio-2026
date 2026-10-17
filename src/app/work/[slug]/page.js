import { notFound } from "next/navigation";
import { PERSON, PROJECTS } from "@/lib/content";
import ProjectDetail from "@/components/ProjectDetail";

// Every project page is built ahead of time; any other slug is a 404
export const dynamicParams = false;

export function generateStaticParams() {
  return PROJECTS.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.slug === slug);
  if (!project) return {};

  const title = `${project.title} — ${PERSON.name}`;
  return {
    title,
    description: project.description,
    openGraph: { title, description: project.description, type: "article" },
  };
}

export default async function ProjectPage({ params }) {
  const { slug } = await params;
  if (!PROJECTS.some((p) => p.slug === slug)) notFound();

  return <ProjectDetail slug={slug} />;
}
