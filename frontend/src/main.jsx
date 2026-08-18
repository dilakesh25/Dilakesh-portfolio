import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowUpRight, BriefcaseBusiness, Code2, Database, Download,
  GraduationCap, Mail, MapPin, Menu, Phone, Server, Sparkles, X,
  FolderGit2, ExternalLink, ShieldCheck, Send, CheckCircle2, AlertCircle
} from "lucide-react";
import "./styles.css";
import AdminDashboard from "./AdminDashboard";

const RAW_API = import.meta.env.VITE_API_URL || "https://backend-beige-one-84.vercel.app";
const API_BASE = RAW_API.endsWith("/api") ? RAW_API : `${RAW_API.replace(/\/+$/, "")}/api`;

// Initial Fallback Skills
const defaultSkills = [
  "SAP ABAP", "S/4HANA", "CDS Views", "OData", "ALV Reports",
  "Classical Reports", "Interface Reports", "OOPS ABAP", "BDC",
  "Smartforms", "SAP Scripts", "BADIs", "User Exits",
  "Data Dictionary", "Java"
];

// Initial Fallback Competencies
const defaultCompetencies = [
  "SDLC", "Requirements Analysis", "Root Cause Analysis",
  "Software Testing & Validation", "Technical Documentation",
  "Cross-functional Collaboration", "Customer Focus",
  "Quality Assurance", "System Performance Optimization", "Agile Teamwork"
];

// Initial Fallback Projects
const defaultProjects = [
  {
    _id: "p1",
    title: "SAP S/4HANA CDS & OData Services Integration",
    description: "Designed and implemented Core Data Services (CDS) views with analytical annotations and exposed OData services for consumption by SAP Fiori enterprise frontends.",
    technologies: ["SAP ABAP", "CDS Views", "OData", "S/4HANA", "Fiori"],
    githubUrl: "https://github.com/dilakesh25",
    liveUrl: "",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80",
    featured: true
  },
  {
    _id: "p2",
    title: "Interactive ALV Grid & Performance Optimization Engine",
    description: "Built modular ALV grid reports with custom user commands, event handling, and SQL performance enhancements reducing execution time by 40%.",
    technologies: ["OOPS ABAP", "ALV Grid", "Data Dictionary", "Performance Tuning"],
    githubUrl: "https://github.com/dilakesh25",
    liveUrl: "",
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80",
    featured: true
  },
  {
    _id: "p3",
    title: "Batch Data Communication (BDC) Automation Tool",
    description: "Automated legacy master data migration using Call Transaction and Session methods with error trapping and reconciliation logs.",
    technologies: ["BDC", "SAP Scripts", "User Exits", "BADIs"],
    githubUrl: "https://github.com/dilakesh25",
    liveUrl: "",
    imageUrl: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&auto=format&fit=crop&q=80",
    featured: false
  }
];

function App() {
  const [open, setOpen] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);

  // Dynamic Portfolio States
  const [projects, setProjects] = useState(defaultProjects);
  const [technicalSkills, setTechnicalSkills] = useState(defaultSkills);
  const [competencies, setCompetencies] = useState(defaultCompetencies);
  const [experiences, setExperiences] = useState([]);

  // Contact Form State
  const [contactForm, setContactForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState({ message: "", type: "" });

  const go = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setOpen(false);
  };

  // Fetch dynamic data from Express Backend
  const loadPortfolioData = async () => {
    try {
      // 1. Fetch Projects
      const projRes = await fetch(`${API_BASE}/projects`);
      if (projRes.ok) {
        const projData = await projRes.json();
        if (projData.success && projData.data?.length > 0) {
          setProjects(projData.data);
        }
      }

      // 2. Fetch Skills
      const skillRes = await fetch(`${API_BASE}/skills`);
      if (skillRes.ok) {
        const skillData = await skillRes.json();
        if (skillData.success && skillData.data?.length > 0) {
          const tech = skillData.data.filter((s) => s.category === "technical").map((s) => s.name);
          const comp = skillData.data.filter((s) => s.category === "competency").map((s) => s.name);
          if (tech.length) setTechnicalSkills(tech);
          if (comp.length) setCompetencies(comp);
        }
      }

      // 3. Fetch Experiences
      const expRes = await fetch(`${API_BASE}/experience`);
      if (expRes.ok) {
        const expData = await expRes.json();
        if (expData.success && expData.data?.length > 0) {
          setExperiences(expData.data);
        }
      }
    } catch (err) {
      console.log("Using static data fallback:", err.message);
    }
  };

  useEffect(() => {
    loadPortfolioData();
  }, []);

  // Handle Contact Message Submit
  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);
    setFormStatus({ message: "", type: "" });

    try {
      const res = await fetch(`${API_BASE}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactForm),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to send message");
      }

      setFormStatus({
        message: "Thank you! Your message has been sent successfully.",
        type: "success",
      });
      setContactForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setFormStatus({
        message: err.message || "Failed to submit message. Please try again.",
        type: "error",
      });
    } finally {
      setFormSubmitting(false);
    }
  };

  // Track Resume Download
  const handleResumeDownload = () => {
    fetch(`${API_BASE}/stats/resume-download`, { method: "POST" }).catch(() => { });
  };

  return (
    <div className="app">
      {/* Navigation */}
      <header className="nav">
        <button className="brand" onClick={() => go("home")}>
          D<span>.</span>S
        </button>
        <nav className={open ? "nav-links open" : "nav-links"}>
          {["about", "projects", "experience", "skills", "education", "contact"].map((id) => (
            <button key={id} onClick={() => go(id)}>{id}</button>
          ))}
        </nav>
        <div className="nav-right">
          <button className="nav-admin-btn" onClick={() => setShowAdmin(true)} title="Admin Dashboard">
            <ShieldCheck size={16} />
            <span>Admin</span>
          </button>
          <a className="nav-cta" href="mailto:dilakesh756@gmail.com">Let's connect <ArrowUpRight size={16} /></a>
          <button className="menu" onClick={() => setOpen(!open)} aria-label="Toggle navigation">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section id="home" className="hero section">
          <div className="hero-grid">
            <div>
              <div className="eyebrow"><span className="dot" /> Available for opportunities</div>
              <h1>Building reliable <em>SAP solutions</em> with purpose.</h1>
              <p className="hero-copy">
                I'm <strong>Dilakesh Shanmugadivel</strong>, an SAP ABAP S/4HANA Developer
                focused on developing, testing, debugging and improving enterprise applications.
              </p>
              <div className="actions">
                <button className="primary" onClick={() => go("projects")}>
                  Explore My Projects <ArrowUpRight size={18} />
                </button>
                <a
                  href="/assets/Dilakesh_Resume.pdf"
                  download="Dilakesh_Resume.pdf"
                  className="secondary"
                  onClick={handleResumeDownload}
                >
                  Download Resume <Download size={17} />
                </a>
                <button className="secondary" onClick={() => go("contact")}>
                  Get in touch <Mail size={17} />
                </button>
              </div>
              <div className="hero-meta">
                <span><MapPin size={16} /> Bengaluru, India</span>
                <span><BriefcaseBusiness size={16} /> SAP ABAP S/4HANA Developer</span>
              </div>
            </div>
            <div className="hero-profile">
              <div className="profile-ring">
                <img src="/assets/profile.jpg" alt="Dilakesh Shanmugadivel" className="profile-img" onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80" }} />
              </div>
              <div className="profile-badge">
                <Code2 size={16} />
                <span>SAP ABAP Developer</span>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="section about">
          <div className="section-label">01 / ABOUT</div>
          <div className="two-col">
            <h2>Developer mindset,<br /><em>enterprise discipline.</em></h2>
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

        {/* Projects Section (Dynamic) */}
        <section id="projects" className="projects-section">
          <div className="section-label">02 / FEATURED PROJECTS</div>
          <div className="two-col">
            <h2>Crafted with code &<br /><em>enterprise rigor.</em></h2>
            <p className="lead">
              A curated selection of SAP S/4HANA integrations, ABAP custom solutions,
              and full-stack tools.
            </p>
          </div>

          <div className="projects-grid">
            {projects.map((proj) => (
              <div key={proj._id} className="project-card">
                {proj.imageUrl && (
                  <div className="project-img-wrap">
                    <img src={proj.imageUrl} alt={proj.title} className="project-img" />
                    {proj.featured && <span className="featured-badge">Featured</span>}
                  </div>
                )}
                <div className="project-body">
                  <h3 className="project-title">{proj.title}</h3>
                  <p className="project-desc">{proj.description}</p>
                  <div className="project-tags">
                    {proj.technologies?.map((tech, i) => (
                      <span key={i} className="project-tag">{tech}</span>
                    ))}
                  </div>
                  <div className="project-actions">
                    {proj.githubUrl && (
                      <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="proj-link">
                        <FolderGit2 size={16} /> Code Repository
                      </a>
                    )}
                    {proj.liveUrl && (
                      <a href={proj.liveUrl} target="_blank" rel="noreferrer" className="proj-link">
                        <ExternalLink size={16} /> Live Preview
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Experience Section */}
        <section id="experience" className="section experience">
          <div className="section-label">03 / EXPERIENCE</div>
          {experiences.length > 0 ? (
            experiences.map((exp) => (
              <div key={exp._id} className="experience-card">
                <div className="timeline-dot" />
                <div className="exp-top">
                  <div>
                    <p className="eyebrow">{exp.startDate} — {exp.endDate}</p>
                    <h2>{exp.role}</h2>
                    <h3>{exp.company} · {exp.location || "Bengaluru, India"}</h3>
                  </div>
                  <span className="role-icon"><Server size={25} /></span>
                </div>
                {exp.bullets && exp.bullets.length > 0 && (
                  <ul>
                    {exp.bullets.map((b, i) => <li key={i}>{b}</li>)}
                  </ul>
                )}
                {exp.technologies && exp.technologies.length > 0 && (
                  <div className="tag-row">
                    {exp.technologies.map((t, i) => <span key={i}>{t}</span>)}
                  </div>
                )}
              </div>
            ))
          ) : (
            <>
              <div className="experience-card">
                <div className="timeline-dot" />
                <div className="exp-top">
                  <div>
                    <p className="eyebrow">JAN 2026 — PRESENT</p>
                    <h2>SAP ABAP Junior Developer</h2>
                    <h3>Accenture · Bengaluru, India</h3>
                  </div>
                  <span className="role-icon"><Server size={25} /></span>
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
                <div className="training-icon"><Sparkles size={21} /></div>
                <div>
                  <p className="eyebrow">AUG 2025 — DEC 2025</p>
                  <h3>SAP ABAP Development on S/4HANA Training</h3>
                  <p>Accenture · Remote</p>
                  <div className="tag-row">
                    {["ALV Reports", "BDC Programs", "CDS Views", "OData Services", "Enhancements"].map(x => <span key={x}>{x}</span>)}
                  </div>
                </div>
              </div>
            </>
          )}
        </section>

        {/* Skills Section */}
        <section id="skills" className="section skills">
          <div className="section-label">04 / SKILLS</div>
          <div className="two-col skills-head">
            <h2>Tools I use to<br /><em>solve problems.</em></h2>
            <p>My technical toolkit combines SAP development capabilities with software engineering and quality practices.</p>
          </div>
          <div className="skill-grid">
            {technicalSkills.map((skill, i) => (
              <div className="skill" key={skill}>
                <span>{String(i + 1).padStart(2, "0")}</span>{skill}
              </div>
            ))}
          </div>
          <h3 className="subhead">Core competencies</h3>
          <div className="competencies">
            {competencies.map(x => <span key={x}>{x}</span>)}
          </div>
        </section>

        {/* Education Section */}
        <section id="education" className="section education">
          <div className="section-label">05 / EDUCATION</div>
          <div className="education-card">
            <div className="edu-icon"><GraduationCap size={30} /></div>
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

        {/* Contact Section with Interactive Message Submission */}
        <section id="contact" className="section contact">
          <div className="contact-box">
            <div>
              <div className="section-label">06 / CONTACT</div>
              <h2>Let's build something<br /><em>meaningful.</em></h2>
              <p>Have an opportunity, project or simply want to connect? Send a direct message or reach out via email/phone.</p>

              <div className="contact-links">
                <a href="mailto:dilakesh756@gmail.com"><Mail size={19} /><span>dilakesh756@gmail.com</span><ArrowUpRight /></a>
                <a href="tel:+917010452001"><Phone size={19} /><span>+91 7010452001</span><ArrowUpRight /></a>
                <div><MapPin size={19} /><span>Bengaluru, India</span></div>
              </div>
            </div>

            <form className="contact-form" onSubmit={handleContactSubmit}>
              {formStatus.message && (
                <div className={`form-status-msg ${formStatus.type}`}>
                  {formStatus.message}
                </div>
              )}
              <input
                type="text"
                required
                placeholder="Your Name"
                value={contactForm.name}
                onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
              />
              <input
                type="email"
                required
                placeholder="Your Email Address"
                value={contactForm.email}
                onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
              />
              <input
                type="text"
                placeholder="Subject (Optional)"
                value={contactForm.subject}
                onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
              />
              <textarea
                required
                rows={4}
                placeholder="How can I help you? Write your message here..."
                value={contactForm.message}
                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
              />
              <button type="submit" className="contact-btn" disabled={formSubmitting}>
                {formSubmitting ? "Sending..." : "Send Message"} <Send size={16} />
              </button>
            </form>
          </div>
        </section>
      </main>

      <footer>
        <span>© 2026 Dilakesh Shanmugadivel</span>
        <button className="footer-admin-link" onClick={() => setShowAdmin(true)}>
          <ShieldCheck size={14} /> Admin Portal
        </button>
        <span>Designed & built with React & Express</span>
      </footer>

      {/* Admin Dashboard Modal */}
      {showAdmin && (
        <AdminDashboard
          onClose={() => setShowAdmin(false)}
          onDataUpdated={loadPortfolioData}
        />
      )}
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
