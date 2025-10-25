import { About } from "../components/About";
import { BlogList } from "../components/BlogList";
import { Contact } from "../components/Contact";
import { Footer } from "../components/Footer";
import { Hero } from "../components/Hero";
import { WorkList } from "../components/WorkList";
import { posts } from "../data/posts";
import { projects } from "../data/projects";

export function HomePage() {
  const handleWorkClick = () => {
    document.getElementById("work")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleContactClick = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <Hero onWorkClick={handleWorkClick} onContactClick={handleContactClick} />
      <WorkList projects={projects} />
      <BlogList posts={posts} />
      <About />
      <Contact />
      <Footer />
    </>
  );
}
