import React, { useState, useEffect } from "react";
import {
  Lock, LogOut, LayoutDashboard, FolderGit2, Wrench, Briefcase, Mail,
  Plus, Trash2, Edit3, CheckCircle2, Eye, RefreshCw, X, ShieldAlert,
  ArrowUpRight, DownloadCloud, Sparkles, Check
} from "lucide-react";

const RAW_API = import.meta.env.VITE_API_URL || "https://backend-beige-one-84.vercel.app";
const API_BASE = RAW_API.endsWith("/api") ? RAW_API : `${RAW_API.replace(/\/+$/, "")}/api`;

export default function AdminDashboard({ onClose, onDataUpdated }) {
  const [token, setToken] = useState(localStorage.getItem("dilakesh_admin_token") || "");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  const [activeTab, setActiveTab] = useState("overview"); // "overview" | "projects" | "skills" | "experience" | "messages"
  const [stats, setStats] = useState(null);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [toast, setToast] = useState({ text: "", type: "" });

  // Modals state
  const [editingItem, setEditingItem] = useState(null); // { type, data }
  const [showAddModal, setShowAddModal] = useState(false);

  const showNotification = (text, type = "success") => {
    setToast({ text, type });
    setTimeout(() => setToast({ text: "", type: "" }), 3500);
  };

  // Login handler
  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError("");

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Invalid credentials");
      }

      localStorage.setItem("dilakesh_admin_token", data.token);
      setToken(data.token);
      showNotification("Welcome back, Admin!");
    } catch (err) {
      setAuthError(err.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("dilakesh_admin_token");
    setToken("");
    showNotification("Logged out successfully", "info");
  };

  // Authenticated headers helper
  const authHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  // Fetch Dashboard Stats & All Collections
  const fetchAllData = async () => {
    if (!token) return;
    setLoadingData(true);

    try {
      // 1. Stats
      const statsRes = await fetch(`${API_BASE}/dashboard/stats`, { headers: authHeaders });
      if (statsRes.status === 401) {
        handleLogout();
        return;
      }
      const statsData = await statsRes.json();
      if (statsData.success) setStats(statsData.data);

      // 2. Projects
      const projRes = await fetch(`${API_BASE}/projects`);
      const projData = await projRes.json();
      if (projData.success) setProjects(projData.data);

      // 3. Skills
      const skillRes = await fetch(`${API_BASE}/skills`);
      const skillData = await skillRes.json();
      if (skillData.success) setSkills(skillData.data);

      // 4. Experience
      const expRes = await fetch(`${API_BASE}/experience`);
      const expData = await expRes.json();
      if (expData.success) setExperiences(expData.data);

      // 5. Messages
      const msgRes = await fetch(`${API_BASE}/messages`, { headers: authHeaders });
      const msgData = await msgRes.json();
      if (msgData.success) setMessages(msgData.data);

      if (onDataUpdated) onDataUpdated();
    } catch (err) {
      console.error("Data fetch error:", err);
      showNotification("Could not sync with backend", "error");
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchAllData();
    }
  }, [token]);

  // Project CRUD Actions
  const handleSaveProject = async (formData) => {
    try {
      const isEdit = Boolean(editingItem?.data?._id);
      const url = isEdit ? `${API_BASE}/projects/${editingItem.data._id}` : `${API_BASE}/projects`;
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: authHeaders,
        body: JSON.stringify(formData),
      });
      const result = await res.json();
      if (!res.ok || !result.success) throw new Error(result.error || "Failed to save project");

      showNotification(`Project ${isEdit ? "updated" : "created"} successfully!`);
      setEditingItem(null);
      setShowAddModal(false);
      fetchAllData();
    } catch (err) {
      showNotification(err.message, "error");
    }
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    try {
      const res = await fetch(`${API_BASE}/projects/${id}`, {
        method: "DELETE",
        headers: authHeaders,
      });
      const result = await res.json();
      if (!res.ok || !result.success) throw new Error(result.error);
      showNotification("Project deleted successfully");
      fetchAllData();
    } catch (err) {
      showNotification(err.message, "error");
    }
  };

  // Skill CRUD Actions
  const handleSaveSkill = async (formData) => {
    try {
      const isEdit = Boolean(editingItem?.data?._id);
      const url = isEdit ? `${API_BASE}/skills/${editingItem.data._id}` : `${API_BASE}/skills`;
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: authHeaders,
        body: JSON.stringify(formData),
      });
      const result = await res.json();
      if (!res.ok || !result.success) throw new Error(result.error);

      showNotification(`Skill ${isEdit ? "updated" : "created"} successfully!`);
      setEditingItem(null);
      setShowAddModal(false);
      fetchAllData();
    } catch (err) {
      showNotification(err.message, "error");
    }
  };

  const handleDeleteSkill = async (id) => {
    if (!window.confirm("Delete this skill?")) return;
    try {
      const res = await fetch(`${API_BASE}/skills/${id}`, { method: "DELETE", headers: authHeaders });
      const result = await res.json();
      if (!res.ok || !result.success) throw new Error(result.error);
      showNotification("Skill deleted");
      fetchAllData();
    } catch (err) {
      showNotification(err.message, "error");
    }
  };

  // Experience CRUD Actions
  const handleSaveExperience = async (formData) => {
    try {
      const isEdit = Boolean(editingItem?.data?._id);
      const url = isEdit ? `${API_BASE}/experience/${editingItem.data._id}` : `${API_BASE}/experience`;
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: authHeaders,
        body: JSON.stringify(formData),
      });
      const result = await res.json();
      if (!res.ok || !result.success) throw new Error(result.error);

      showNotification(`Experience ${isEdit ? "updated" : "created"} successfully!`);
      setEditingItem(null);
      setShowAddModal(false);
      fetchAllData();
    } catch (err) {
      showNotification(err.message, "error");
    }
  };

  const handleDeleteExperience = async (id) => {
    if (!window.confirm("Delete this experience entry?")) return;
    try {
      const res = await fetch(`${API_BASE}/experience/${id}`, { method: "DELETE", headers: authHeaders });
      const result = await res.json();
      if (!res.ok || !result.success) throw new Error(result.error);
      showNotification("Experience deleted");
      fetchAllData();
    } catch (err) {
      showNotification(err.message, "error");
    }
  };

  // Message Actions
  const handleMarkMessageRead = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/messages/${id}/read`, { method: "PATCH", headers: authHeaders });
      const result = await res.json();
      if (result.success) {
        showNotification("Message marked as read");
        fetchAllData();
      }
    } catch (err) {
      showNotification(err.message, "error");
    }
  };

  const handleDeleteMessage = async (id) => {
    if (!window.confirm("Delete this contact message?")) return;
    try {
      const res = await fetch(`${API_BASE}/messages/${id}`, { method: "DELETE", headers: authHeaders });
      const result = await res.json();
      if (result.success) {
        showNotification("Message removed");
        fetchAllData();
      }
    } catch (err) {
      showNotification(err.message, "error");
    }
  };

  return (
    <div className="admin-overlay">
      <div className="admin-modal">
        {/* Toast Alert */}
        {toast.text && (
          <div className={`admin-toast ${toast.type}`}>
            <span>{toast.text}</span>
          </div>
        )}

        {/* Modal Top Header */}
        <div className="admin-header">
          <div className="admin-brand">
            <ShieldAlert size={22} className="admin-shield" />
            <div>
              <h3>Admin Dashboard</h3>
              <p className="admin-subtitle">Portfolio Content & Analytics Manager</p>
            </div>
          </div>
          <div className="admin-header-actions">
            {token && (
              <button className="admin-icon-btn" onClick={fetchAllData} title="Refresh Data">
                <RefreshCw size={17} className={loadingData ? "spin" : ""} />
              </button>
            )}
            {token && (
              <button className="admin-icon-btn logout" onClick={handleLogout} title="Logout">
                <LogOut size={17} />
              </button>
            )}
            <button className="admin-icon-btn close" onClick={onClose} title="Close Modal">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* IF NOT LOGGED IN: Render Login Screen */}
        {!token ? (
          <div className="admin-login-body">
            <div className="login-card">
              <div className="lock-icon-wrap">
                <Lock size={32} />
              </div>
              <h2>Admin Authentication</h2>
              <p>Sign in with your administrator credentials to manage portfolio items.</p>

              {authError && <div className="auth-error-msg">{authError}</div>}

              <form onSubmit={handleLogin} className="admin-form">
                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="dilakesh756@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <button type="submit" className="admin-btn primary" disabled={authLoading}>
                  {authLoading ? "Authenticating..." : "Sign In to Dashboard"}
                </button>
              </form>
              <div className="login-hint">
                <span>Default credentials:</span> <code>dilakesh756@gmail.com / Admin@123</code>
              </div>
            </div>
          </div>
        ) : (
          /* IF LOGGED IN: Render Dashboard Layout */
          <div className="admin-main-layout">
            {/* Sidebar Navigation */}
            <aside className="admin-sidebar">
              <nav className="admin-nav">
                <button
                  className={activeTab === "overview" ? "active" : ""}
                  onClick={() => setActiveTab("overview")}
                >
                  <LayoutDashboard size={18} />
                  <span>Overview</span>
                </button>
                <button
                  className={activeTab === "projects" ? "active" : ""}
                  onClick={() => setActiveTab("projects")}
                >
                  <FolderGit2 size={18} />
                  <span>Projects</span>
                  <span className="badge">{projects.length}</span>
                </button>
                <button
                  className={activeTab === "skills" ? "active" : ""}
                  onClick={() => setActiveTab("skills")}
                >
                  <Wrench size={18} />
                  <span>Skills</span>
                  <span className="badge">{skills.length}</span>
                </button>
                <button
                  className={activeTab === "experience" ? "active" : ""}
                  onClick={() => setActiveTab("experience")}
                >
                  <Briefcase size={18} />
                  <span>Experience</span>
                  <span className="badge">{experiences.length}</span>
                </button>
                <button
                  className={activeTab === "messages" ? "active" : ""}
                  onClick={() => setActiveTab("messages")}
                >
                  <Mail size={18} />
                  <span>Messages</span>
                  {stats?.unreadMessages > 0 && (
                    <span className="badge unread">{stats.unreadMessages}</span>
                  )}
                </button>
              </nav>
            </aside>

            {/* Content Area */}
            <section className="admin-content">
              {/* TAB 1: OVERVIEW */}
              {activeTab === "overview" && (
                <div className="admin-tab-pane">
                  <div className="pane-header">
                    <div>
                      <h2>Dashboard Overview</h2>
                      <p>Key metrics and system activity</p>
                    </div>
                  </div>

                  <div className="stats-grid">
                    <div className="stat-card">
                      <div className="stat-icon p-icon"><FolderGit2 size={24} /></div>
                      <div className="stat-info">
                        <span className="stat-val">{stats?.totalProjects ?? projects.length}</span>
                        <span className="stat-lbl">Total Projects</span>
                      </div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-icon s-icon"><Wrench size={24} /></div>
                      <div className="stat-info">
                        <span className="stat-val">{stats?.totalSkills ?? skills.length}</span>
                        <span className="stat-lbl">Skills Listed</span>
                      </div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-icon e-icon"><Briefcase size={24} /></div>
                      <div className="stat-info">
                        <span className="stat-val">{stats?.totalExperiences ?? experiences.length}</span>
                        <span className="stat-lbl">Experiences</span>
                      </div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-icon m-icon"><Mail size={24} /></div>
                      <div className="stat-info">
                        <span className="stat-val">{stats?.totalMessages ?? messages.length}</span>
                        <span className="stat-lbl">Inquiries ({stats?.unreadMessages ?? 0} new)</span>
                      </div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-icon d-icon"><DownloadCloud size={24} /></div>
                      <div className="stat-info">
                        <span className="stat-val">{stats?.resumeDownloads ?? 0}</span>
                        <span className="stat-lbl">Resume Downloads</span>
                      </div>
                    </div>
                  </div>

                  <div className="overview-recent">
                    <h3>Recent Contact Inquiries</h3>
                    {messages.length === 0 ? (
                      <p className="empty-txt">No inquiries received yet.</p>
                    ) : (
                      <div className="recent-msg-list">
                        {messages.slice(0, 4).map((msg) => (
                          <div key={msg._id} className={`recent-msg-item ${!msg.read ? "unread" : ""}`}>
                            <div className="msg-meta">
                              <strong>{msg.name}</strong> ({msg.email})
                              <span>{new Date(msg.createdAt).toLocaleDateString()}</span>
                            </div>
                            <p className="msg-preview">{msg.message}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: PROJECTS CRUD */}
              {activeTab === "projects" && (
                <div className="admin-tab-pane">
                  <div className="pane-header">
                    <div>
                      <h2>Projects Management</h2>
                      <p>Add, modify, and publish portfolio showcase projects</p>
                    </div>
                    <button
                      className="admin-btn primary add-btn"
                      onClick={() => {
                        setEditingItem({ type: "project", data: {} });
                        setShowAddModal(true);
                      }}
                    >
                      <Plus size={16} /> Add Project
                    </button>
                  </div>

                  <div className="admin-table-container">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Title</th>
                          <th>Technologies</th>
                          <th>Featured</th>
                          <th>Links</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {projects.map((proj) => (
                          <tr key={proj._id}>
                            <td className="fw-600">{proj.title}</td>
                            <td>
                              <div className="table-tags">
                                {proj.technologies?.map((t, i) => (
                                  <span key={i} className="mini-tag">{t}</span>
                                ))}
                              </div>
                            </td>
                            <td>
                              {proj.featured ? (
                                <span className="status-badge featured">Featured</span>
                              ) : (
                                <span className="status-badge standard">Standard</span>
                              )}
                            </td>
                            <td>
                              <div className="table-links">
                                {proj.githubUrl && (
                                  <a href={proj.githubUrl} target="_blank" rel="noreferrer" title="GitHub">
                                    <FolderGit2 size={15} />
                                  </a>
                                )}
                                {proj.liveUrl && (
                                  <a href={proj.liveUrl} target="_blank" rel="noreferrer" title="Live Preview">
                                    <ArrowUpRight size={15} />
                                  </a>
                                )}
                              </div>
                            </td>
                            <td>
                              <div className="row-actions">
                                <button
                                  className="action-btn edit"
                                  onClick={() => {
                                    setEditingItem({ type: "project", data: proj });
                                    setShowAddModal(true);
                                  }}
                                  title="Edit Project"
                                >
                                  <Edit3 size={15} />
                                </button>
                                <button
                                  className="action-btn delete"
                                  onClick={() => handleDeleteProject(proj._id)}
                                  title="Delete Project"
                                >
                                  <Trash2 size={15} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 3: SKILLS CRUD */}
              {activeTab === "skills" && (
                <div className="admin-tab-pane">
                  <div className="pane-header">
                    <div>
                      <h2>Skills & Competencies</h2>
                      <p>Manage technical tools and domain capabilities</p>
                    </div>
                    <button
                      className="admin-btn primary add-btn"
                      onClick={() => {
                        setEditingItem({ type: "skill", data: {} });
                        setShowAddModal(true);
                      }}
                    >
                      <Plus size={16} /> Add Skill
                    </button>
                  </div>

                  <div className="admin-table-container">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Skill Name</th>
                          <th>Category</th>
                          <th>Proficiency</th>
                          <th>Order</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {skills.map((sk) => (
                          <tr key={sk._id}>
                            <td className="fw-600">{sk.name}</td>
                            <td>
                              <span className={`category-pill ${sk.category}`}>
                                {sk.category}
                              </span>
                            </td>
                            <td>{sk.proficiency || "Proficient"}</td>
                            <td>{sk.order || 0}</td>
                            <td>
                              <div className="row-actions">
                                <button
                                  className="action-btn edit"
                                  onClick={() => {
                                    setEditingItem({ type: "skill", data: sk });
                                    setShowAddModal(true);
                                  }}
                                >
                                  <Edit3 size={15} />
                                </button>
                                <button
                                  className="action-btn delete"
                                  onClick={() => handleDeleteSkill(sk._id)}
                                >
                                  <Trash2 size={15} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 4: EXPERIENCE CRUD */}
              {activeTab === "experience" && (
                <div className="admin-tab-pane">
                  <div className="pane-header">
                    <div>
                      <h2>Experience & Career Journey</h2>
                      <p>Manage job history, training programs, and accomplishments</p>
                    </div>
                    <button
                      className="admin-btn primary add-btn"
                      onClick={() => {
                        setEditingItem({ type: "experience", data: {} });
                        setShowAddModal(true);
                      }}
                    >
                      <Plus size={16} /> Add Experience
                    </button>
                  </div>

                  <div className="admin-table-container">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Role</th>
                          <th>Company</th>
                          <th>Duration</th>
                          <th>Type</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {experiences.map((exp) => (
                          <tr key={exp._id}>
                            <td className="fw-600">{exp.role}</td>
                            <td>{exp.company}</td>
                            <td>
                              <span className="duration-tag">
                                {exp.startDate} — {exp.endDate || "Present"}
                              </span>
                            </td>
                            <td><span className="type-badge">{exp.type || "job"}</span></td>
                            <td>
                              <div className="row-actions">
                                <button
                                  className="action-btn edit"
                                  onClick={() => {
                                    setEditingItem({ type: "experience", data: exp });
                                    setShowAddModal(true);
                                  }}
                                >
                                  <Edit3 size={15} />
                                </button>
                                <button
                                  className="action-btn delete"
                                  onClick={() => handleDeleteExperience(exp._id)}
                                >
                                  <Trash2 size={15} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 5: MESSAGES */}
              {activeTab === "messages" && (
                <div className="admin-tab-pane">
                  <div className="pane-header">
                    <div>
                      <h2>Contact Messages</h2>
                      <p>Visitor inquiries and opportunities submitted via portfolio</p>
                    </div>
                  </div>

                  {messages.length === 0 ? (
                    <div className="empty-box">No messages found.</div>
                  ) : (
                    <div className="messages-stream">
                      {messages.map((msg) => (
                        <div key={msg._id} className={`message-card ${!msg.read ? "unread" : ""}`}>
                          <div className="msg-card-top">
                            <div>
                              <h4>{msg.name}</h4>
                              <p className="msg-email">
                                <a href={`mailto:${msg.email}`}>{msg.email}</a>
                              </p>
                            </div>
                            <div className="msg-card-actions">
                              <span className="msg-date">
                                {new Date(msg.createdAt).toLocaleString()}
                              </span>
                              {!msg.read && (
                                <button
                                  className="msg-btn mark-read"
                                  onClick={() => handleMarkMessageRead(msg._id)}
                                  title="Mark as read"
                                >
                                  <Check size={14} /> Read
                                </button>
                              )}
                              <button
                                className="msg-btn delete"
                                onClick={() => handleDeleteMessage(msg._id)}
                                title="Delete message"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                          <div className="msg-subject">
                            <strong>Subject:</strong> {msg.subject || "No subject"}
                          </div>
                          <p className="msg-body-text">{msg.message}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </section>
          </div>
        )}

        {/* MODAL: FORM FOR ADD / EDIT */}
        {showAddModal && editingItem && (
          <ItemEditorModal
            item={editingItem}
            onClose={() => {
              setShowAddModal(false);
              setEditingItem(null);
            }}
            onSaveProject={handleSaveProject}
            onSaveSkill={handleSaveSkill}
            onSaveExperience={handleSaveExperience}
          />
        )}
      </div>
    </div>
  );
}

/* Modal Form for Projects, Skills, Experience */
function ItemEditorModal({ item, onClose, onSaveProject, onSaveSkill, onSaveExperience }) {
  const { type, data } = item;
  const isEdit = Boolean(data?._id);

  // Form states
  const [formData, setFormData] = useState({
    // Project fields
    title: data?.title || "",
    description: data?.description || "",
    technologies: Array.isArray(data?.technologies) ? data.technologies.join(", ") : "",
    githubUrl: data?.githubUrl || "",
    liveUrl: data?.liveUrl || "",
    imageUrl: data?.imageUrl || "",
    featured: data?.featured || false,
    order: data?.order || 0,

    // Skill fields
    name: data?.name || "",
    category: data?.category || "technical",
    proficiency: data?.proficiency || "Advanced",

    // Experience fields
    company: data?.company || "",
    role: data?.role || "",
    startDate: data?.startDate || "",
    endDate: data?.endDate || "PRESENT",
    location: data?.location || "Bengaluru, India",
    type: data?.type || "job",
    bullets: Array.isArray(data?.bullets) ? data.bullets.join("\n") : "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (type === "project") onSaveProject(formData);
    if (type === "skill") onSaveSkill(formData);
    if (type === "experience") onSaveExperience(formData);
  };

  return (
    <div className="editor-overlay">
      <div className="editor-card">
        <div className="editor-header">
          <h3>
            {isEdit ? "Edit" : "Add New"}{" "}
            {type === "project" ? "Project" : type === "skill" ? "Skill" : "Experience"}
          </h3>
          <button className="close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="editor-form">
          {/* PROJECT FIELDS */}
          {type === "project" && (
            <>
              <div className="form-group">
                <label>Project Title *</label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. S/4HANA Migration Hub"
                />
              </div>
              <div className="form-group">
                <label>Description *</label>
                <textarea
                  name="description"
                  required
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Overview of business problem solved & architecture"
                />
              </div>
              <div className="form-group">
                <label>Technologies (comma separated)</label>
                <input
                  type="text"
                  name="technologies"
                  value={formData.technologies}
                  onChange={handleChange}
                  placeholder="SAP ABAP, CDS Views, OData, React"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>GitHub Repository URL</label>
                  <input
                    type="url"
                    name="githubUrl"
                    value={formData.githubUrl}
                    onChange={handleChange}
                    placeholder="https://github.com/..."
                  />
                </div>
                <div className="form-group">
                  <label>Live URL / Demo</label>
                  <input
                    type="url"
                    name="liveUrl"
                    value={formData.liveUrl}
                    onChange={handleChange}
                    placeholder="https://..."
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Cover Image URL</label>
                  <input
                    type="text"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>
                <div className="form-group">
                  <label>Display Order</label>
                  <input
                    type="number"
                    name="order"
                    value={formData.order}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="form-check">
                <input
                  type="checkbox"
                  id="feat-check"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                />
                <label htmlFor="feat-check">Highlight as Featured Project</label>
              </div>
            </>
          )}

          {/* SKILL FIELDS */}
          {type === "skill" && (
            <>
              <div className="form-group">
                <label>Skill Name *</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. CDS Views, ALV Reports"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <select name="category" value={formData.category} onChange={handleChange}>
                    <option value="technical">Technical Skill</option>
                    <option value="competency">Core Competency</option>
                    <option value="tools">Tools & Platforms</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Proficiency</label>
                  <input
                    type="text"
                    name="proficiency"
                    value={formData.proficiency}
                    onChange={handleChange}
                    placeholder="Advanced / Proficient"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Display Order</label>
                <input
                  type="number"
                  name="order"
                  value={formData.order}
                  onChange={handleChange}
                />
              </div>
            </>
          )}

          {/* EXPERIENCE FIELDS */}
          {type === "experience" && (
            <>
              <div className="form-row">
                <div className="form-group">
                  <label>Role / Designation *</label>
                  <input
                    type="text"
                    name="role"
                    required
                    value={formData.role}
                    onChange={handleChange}
                    placeholder="SAP ABAP Junior Developer"
                  />
                </div>
                <div className="form-group">
                  <label>Company / Organization *</label>
                  <input
                    type="text"
                    name="company"
                    required
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="Accenture"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Start Date *</label>
                  <input
                    type="text"
                    name="startDate"
                    required
                    value={formData.startDate}
                    onChange={handleChange}
                    placeholder="JAN 2026"
                  />
                </div>
                <div className="form-group">
                  <label>End Date</label>
                  <input
                    type="text"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    placeholder="PRESENT"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Bengaluru, India"
                  />
                </div>
                <div className="form-group">
                  <label>Type</label>
                  <select name="type" value={formData.type} onChange={handleChange}>
                    <option value="job">Full-time Job</option>
                    <option value="training">Training</option>
                    <option value="internship">Internship</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Key Responsibilities (One bullet per line)</label>
                <textarea
                  name="bullets"
                  rows={4}
                  value={formData.bullets}
                  onChange={handleChange}
                  placeholder="Designed and developed ALV reports...&#10;Analyzed SAP logs..."
                />
              </div>
            </>
          )}

          <div className="editor-actions">
            <button type="button" className="admin-btn secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="admin-btn primary">
              {isEdit ? "Update Changes" : "Save Item"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
