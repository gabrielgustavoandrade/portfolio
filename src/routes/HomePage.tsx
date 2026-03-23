import { About } from "../components/About";
import { BlogList } from "../components/BlogList";
import { Contact } from "../components/Contact";
import { Footer } from "../components/Footer";
import { Hero } from "../components/Hero";
import { WorkList } from "../components/WorkList";
import { posts } from "../data/posts";
import { openSourceProjects, projects } from "../data/projects";

export function HomePage() {
  const handleWorkClick = () => {
    document.getElementById("work")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleContactClick = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <Hero onWorkClick={handleWorkClick} onContactClick={handleContactClick} />
      <main id="main-content" role="main">
        <WorkList projects={projects} />
        <WorkList
          projects={openSourceProjects}
          id="open-source"
          title="Open Source"
          subtitle="Side projects and tools I built and published."
        />
        <BlogList posts={posts} />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
