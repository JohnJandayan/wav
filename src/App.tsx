import { MotionConfig } from 'framer-motion';
import { ExperienceProvider } from './hooks/Experience';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { Home } from './sections/Home';
import { About } from './sections/About';
import { Skills } from './sections/Skills';
import { Education } from './sections/Education';
import { Projects } from './sections/Projects';
import { Certificates } from './sections/Certificates';
import { Contact } from './sections/Contact';
export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <ExperienceProvider>
        <Navigation />
        <main id="main" tabIndex={-1}>
          <Home />
          <About />
          <Skills />
          <Education />
          <Projects />
          <Certificates />
          <Contact />
        </main>
        <Footer />
      </ExperienceProvider>
    </MotionConfig>
  );
}
