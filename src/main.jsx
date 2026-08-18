import React from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowUpRight, BriefcaseBusiness, Code2, Database, Download,
  GraduationCap, Mail, MapPin, Menu, Phone, Server, Sparkles, X
} from "lucide-react";
import "./styles.css";

const skills = [
  "SAP ABAP", "S/4HANA", "CDS Views", "OData", "ALV Reports",
  "Classical Reports", "Interface Reports", "OOPS ABAP", "BDC",
  "Smartforms", "SAP Scripts", "BADIs", "User Exits",
  "Data Dictionary", "Java"
];

const competencies = [
  "SDLC", "Requirements Analysis", "Root Cause Analysis",
  "Software Testing & Validation", "Technical Documentation",
  "Cross-functional Collaboration", "Customer Focus",
  "Quality Assurance", "System Performance Optimization", "Agile Teamwork"
];

function App() {
  const [open, setOpen] = React.useState(false);

  const go = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setOpen(false);
  };

  return (
    <div className="app">
      <header className="nav">
        <button className="brand" onClick={() => go("home")}>
          D<span>.</span>S
        </button>
        <nav className={open ? "nav-links open" : "nav-links"}>
          {["about","experience","skills","education","contact"].map((id) => (
            <button key={id} onClick={() => go(id)}>{id}</button>
          ))}
        </nav>
        <button className="menu" onClick={() => setOpen(!open)} aria-label="Toggle navigation">
          {open ? <X size={22}/> : <Menu size={22}/>}
        </button>
        <a className="nav-cta" href="mailto:dilakesh756@gmail.com">Let's connect <ArrowUpRight size={16}/></a>
      </header>

      <main>
        <section id="home" className="hero section">
          <div className="hero-grid">
            <div>
              <div className="eyebrow"><span className="dot"/> Available for opportunities</div>
              <h1>Building reliable <em>SAP solutions</em> with purpose.</h1>
              <p className="hero-copy">
                I'm <strong>Dilakesh Shanmugadivel</strong>, an SAP ABAP S/4HANA Developer
                focused on developing, testing, debugging and improving enterprise applications.
              </p>
              <div className="actions">
                <button className="primary" onClick={() => go("experience")}>Explore my work <ArrowUpRight size={18}/></button>
                <button className="secondary" onClick={() => go("contact")}>Get in touch <Mail size={17}/></button>
              </div>
              <div className="hero-meta">
                <span><MapPin size={16}/> Bengaluru, India</span>
                <span><BriefcaseBusiness size={16}/> SAP ABAP S/4HANA Developer</span>
              </div>
            </div>
            <div className="hero-profile">
              <div className="profile-ring">
                <img src="/assets/profile.jpg" alt="Dilakesh Shanmugadivel" className="profile-img"/>
              </div>
              <div className="profile-badge">
                <Code2 size={16}/>
                <span>SAP ABAP Developer</span>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="section about">
          <div className="section-label">01 / ABOUT</div>
          <div className="two-col">
            <h2>Developer mindset,<br/><em>enterprise discipline.</em></h2>
            <div>
              <p className="lead">
                SAP ABAP S/4HANA Developer with hands-on experience at Accenture in
                designing, developing, testing and maintaining SAP ABAP programs.
              </p>
              <p>
                Experienced across the software development lifecycle, including requirements
                analysis, coding, debugging, testing and documentation. I work closely with
                functional consultants and cross-functional teams to turn business requirements
                into practical technical solutions.
              </p>
              <div className="about-pills">
                <span>Quality focused</span><span>Customer focused</span><span>Collaborative</span>
              </div>
            </div>
          </div>
        </section>

        <section id="experience" className="section experience">
          <div className="section-label">02 / EXPERIENCE</div>
          <div className="experience-card">
            <div className="timeline-dot"/>
            <div className="exp-top">
              <div>
                <p className="eyebrow">JAN 2026 — PRESENT</p>
                <h2>SAP ABAP Junior Developer</h2>
                <h3>Accenture · Bengaluru, India</h3>
              </div>
              <span className="role-icon"><Server size={25}/></span>
            </div>
            <ul>
              <li>Designed, developed and maintained classical reports, ALV reports, interfaces and enhancements aligned with business requirements and SDLC standards.</li>
              <li>Analyzed and debugged issues using SAP logs, database tables and backend data to support system functionality and quality assurance.</li>
              <li>Collaborated with functional consultants and cross-functional teams to capture requirements and deliver technical solutions.</li>
              <li>Performed root cause analysis and identified improvements for system performance and availability.</li>
              <li>Developed and automated test cases, scenarios and usage cases for software validation in a private cloud environment.</li>
            </ul>
          </div>

          <div className="training-card">
            <div className="training-icon"><Sparkles size={21}/></div>
            <div>
              <p className="eyebrow">AUG 2025 — DEC 2025</p>
              <h3>SAP ABAP Development on S/4HANA Training</h3>
              <p>Accenture · Remote</p>
              <div className="tag-row">
                {["ALV Reports","BDC Programs","CDS Views","OData Services","Enhancements"].map(x => <span key={x}>{x}</span>)}
              </div>
            </div>
          </div>
        </section>

        <section id="skills" className="section skills">
          <div className="section-label">03 / SKILLS</div>
          <div className="two-col skills-head">
            <h2>Tools I use to<br/><em>solve problems.</em></h2>
            <p>My technical toolkit combines SAP development capabilities with software engineering and quality practices.</p>
          </div>
          <div className="skill-grid">
            {skills.map((skill, i) => <div className="skill" key={skill}><span>{String(i+1).padStart(2,"0")}</span>{skill}</div>)}
          </div>
          <h3 className="subhead">Core competencies</h3>
          <div className="competencies">
            {competencies.map(x => <span key={x}>{x}</span>)}
          </div>
        </section>

        <section id="education" className="section education">
          <div className="section-label">04 / EDUCATION</div>
          <div className="education-card">
            <div className="edu-icon"><GraduationCap size={30}/></div>
            <div>
              <p className="eyebrow">2025</p>
              <h2>Bachelor of Technology in Information Technology</h2>
              <h3>Velammal College of Engineering and Technology</h3>
              <p className="muted">CGPA <strong>7.8</strong></p>
            </div>
          </div>
          <div className="education-secondary">
            <div><span>12th Grade · CBSE</span><strong>79.4%</strong></div>
            <p>Velammal Bodhi Campus, Madurai</p>
          </div>
        </section>

        <section id="contact" className="section contact">
          <div className="contact-box">
            <div>
              <div className="section-label">05 / CONTACT</div>
              <h2>Let's build something<br/><em>meaningful.</em></h2>
              <p>Have an opportunity, project or simply want to connect? Reach out directly.</p>
            </div>
            <div className="contact-links">
              <a href="mailto:dilakesh756@gmail.com"><Mail size={19}/><span>dilakesh756@gmail.com</span><ArrowUpRight/></a>
              <a href="tel:+917010452001"><Phone size={19}/><span>+91 7010452001</span><ArrowUpRight/></a>
              <div><MapPin size={19}/><span>Bengaluru, India</span></div>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <span>© 2026 Dilakesh Shanmugadivel</span>
        <span>Designed & built with React</span>
      </footer>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
