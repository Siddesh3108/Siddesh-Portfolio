import { useState, useEffect, useRef } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=JetBrains+Mono:wght@300;400;500&family=Lora:ital,wght@0,400;0,500;1,400&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { background: #07090f; }

  ::-webkit-scrollbar { width: 3px; }
  ::-webkit-scrollbar-track { background: #07090f; }
  ::-webkit-scrollbar-thumb { background: #00d4ff; }

  .port-root {
    background: #07090f;
    color: #e8eaf0;
    font-family: 'Syne', sans-serif;
    line-height: 1.6;
    overflow-x: hidden;
    cursor: none;
  }

  #cursor {
    width: 10px; height: 10px;
    background: #00d4ff;
    border-radius: 50%;
    position: fixed; top: 0; left: 0;
    pointer-events: none; z-index: 9999;
    mix-blend-mode: difference;
    transition: transform 0.05s;
  }
  #cursor-ring {
    width: 36px; height: 36px;
    border: 1px solid rgba(0,212,255,0.5);
    border-radius: 50%;
    position: fixed; top: 0; left: 0;
    pointer-events: none; z-index: 9998;
    transition: width 0.2s, height 0.2s, margin 0.2s;
  }
  #cursor-ring.hovered { width: 52px; height: 52px; margin-left: -8px; margin-top: -8px; }

  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(0.7); }
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeLeft {
    from { opacity: 0; transform: translateX(24px); }
    to { opacity: 1; transform: translateX(0); }
  }

  .reveal { opacity: 0; transform: translateY(30px); transition: opacity 0.6s ease, transform 0.6s ease; }
  .reveal.visible { opacity: 1; transform: translateY(0); }

  /* NAV */
  .nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    display: flex; justify-content: space-between; align-items: center;
    padding: 20px 60px;
    background: rgba(7,9,15,0.85);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid rgba(255,255,255,0.07);
  }
  .nav-logo { font-family: 'JetBrains Mono', monospace; font-size: 13px; color: #00d4ff; letter-spacing: 0.15em; text-transform: uppercase; }
  .nav-links { display: flex; gap: 36px; list-style: none; }
  .nav-links a {
    font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #6b7280;
    text-decoration: none; letter-spacing: 0.1em; text-transform: uppercase;
    transition: color 0.2s; position: relative;
  }
  .nav-links a::after { content: ''; position: absolute; bottom: -3px; left: 0; right: 0; height: 1px; background: #00d4ff; transform: scaleX(0); transition: transform 0.2s; }
  .nav-links a:hover { color: #00d4ff; }
  .nav-links a:hover::after { transform: scaleX(1); }
  .nav-links a.active { color: #00d4ff; }
  .nav-links a.active::after { transform: scaleX(1); }

  /* HERO */
  .hero {
    min-height: 100vh; display: flex; align-items: center;
    padding: 140px 60px 80px; position: relative; overflow: hidden;
  }
  .hero-grid {
    position: absolute; inset: 0;
    background-image: linear-gradient(rgba(0,212,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.04) 1px, transparent 1px);
    background-size: 60px 60px;
    mask-image: radial-gradient(ellipse 70% 70% at 50% 50%, black, transparent);
  }
  .hero-glow { position: absolute; width: 700px; height: 700px; background: radial-gradient(circle, rgba(0,212,255,0.06) 0%, transparent 70%); top: -200px; right: -200px; pointer-events: none; }
  .hero-glow2 { position: absolute; width: 500px; height: 500px; background: radial-gradient(circle, rgba(255,107,53,0.05) 0%, transparent 70%); bottom: -100px; left: -100px; pointer-events: none; }
  .hero-content { position: relative; z-index: 2; max-width: 820px; }
  .hero-badge {
    display: inline-flex; align-items: center; gap: 8px;
    font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #00d4ff;
    letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 28px;
    border: 1px solid rgba(0,212,255,0.25); padding: 6px 14px;
    background: rgba(0,212,255,0.05);
    animation: fadeUp 0.6s ease both;
  }
  .hero-badge-dot { width: 6px; height: 6px; background: #00d4ff; border-radius: 50%; animation: pulse 2s infinite; flex-shrink: 0; }
  .hero-name {
    font-size: clamp(52px, 8vw, 96px); font-weight: 800; line-height: 0.95;
    letter-spacing: -0.03em; margin-bottom: 20px;
    animation: fadeUp 0.6s 0.1s ease both;
  }
  .hero-name span { color: #00d4ff; }
  .hero-role {
    font-family: 'Lora', serif; font-style: italic;
    font-size: clamp(18px, 2.5vw, 26px); color: #6b7280; margin-bottom: 32px;
    animation: fadeUp 0.6s 0.2s ease both;
  }
  .hero-desc {
    font-family: 'JetBrains Mono', monospace; font-size: 13px; color: #6b7280;
    max-width: 520px; line-height: 1.8; margin-bottom: 48px;
    animation: fadeUp 0.6s 0.3s ease both;
  }
  .hero-ctas { display: flex; gap: 16px; flex-wrap: wrap; animation: fadeUp 0.6s 0.4s ease both; }

  .btn-primary {
    display: inline-flex; align-items: center; gap: 8px; padding: 14px 28px;
    background: #00d4ff; color: #07090f;
    font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 500;
    letter-spacing: 0.1em; text-transform: uppercase;
    text-decoration: none; border: none; cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,212,255,0.3); }

  .btn-secondary {
    display: inline-flex; align-items: center; gap: 8px; padding: 14px 28px;
    background: transparent; color: #e8eaf0;
    font-family: 'JetBrains Mono', monospace; font-size: 12px;
    letter-spacing: 0.1em; text-transform: uppercase;
    text-decoration: none; border: 1px solid rgba(255,255,255,0.07); cursor: pointer;
    transition: border-color 0.2s, color 0.2s;
  }
  .btn-secondary:hover { border-color: #00d4ff; color: #00d4ff; }

  .btn-download {
    display: inline-flex; align-items: center; gap: 8px; padding: 14px 28px;
    background: rgba(255,107,53,0.1); color: #ff6b35;
    font-family: 'JetBrains Mono', monospace; font-size: 12px;
    letter-spacing: 0.1em; text-transform: uppercase;
    text-decoration: none; border: 1px solid rgba(255,107,53,0.35); cursor: pointer;
    transition: background 0.2s, box-shadow 0.2s, transform 0.2s;
  }
  .btn-download:hover { background: rgba(255,107,53,0.2); box-shadow: 0 8px 24px rgba(255,107,53,0.25); transform: translateY(-2px); }

  .hero-stats {
    position: absolute; right: 60px; bottom: 80px;
    display: flex; flex-direction: column; gap: 28px;
    animation: fadeLeft 0.8s 0.5s ease both;
  }
  .stat { text-align: right; }
  .stat-num { font-size: 36px; font-weight: 800; color: #00d4ff; line-height: 1; }
  .stat-label { font-family: 'JetBrains Mono', monospace; font-size: 10px; color: #6b7280; letter-spacing: 0.1em; text-transform: uppercase; margin-top: 4px; }

  /* SECTIONS */
  .section { padding: 100px 60px; }
  .section-bg { background: #0e1120; }
  .section-tag { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #00d4ff; letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 14px; display: flex; align-items: center; gap: 12px; }
  .section-tag::before { content: ''; width: 28px; height: 1px; background: #00d4ff; }
  .section-title { font-size: clamp(32px, 4vw, 52px); font-weight: 800; letter-spacing: -0.03em; line-height: 1.05; margin-bottom: 60px; }

  /* ABOUT */
  .about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: start; }
  .about-text p { font-family: 'Lora', serif; font-size: 17px; line-height: 1.85; color: rgba(232,234,240,0.8); margin-bottom: 20px; }
  .about-text p strong { color: #00d4ff; font-style: normal; font-weight: 500; }
  .skills-grid { display: flex; flex-direction: column; gap: 20px; }
  .skill-group-name { font-family: 'JetBrains Mono', monospace; font-size: 10px; color: #ff6b35; letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 10px; }
  .skill-tags { display: flex; flex-wrap: wrap; gap: 8px; }
  .skill-tag { font-family: 'JetBrains Mono', monospace; font-size: 11px; padding: 5px 12px; border: 1px solid rgba(255,255,255,0.07); color: #6b7280; background: rgba(255,255,255,0.02); transition: border-color 0.2s, color 0.2s, background 0.2s; cursor: default; }
  .skill-tag:hover { border-color: #00d4ff; color: #00d4ff; background: rgba(0,212,255,0.12); }

  /* TIMELINE */
  .timeline { position: relative; }
  .timeline::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 1px; background: rgba(255,255,255,0.07); }
  .timeline-item { padding-left: 40px; padding-bottom: 60px; position: relative; }
  .timeline-item:last-child { padding-bottom: 0; }
  .timeline-dot { position: absolute; left: -5px; top: 6px; width: 11px; height: 11px; background: #00d4ff; border-radius: 50%; box-shadow: 0 0 12px rgba(0,212,255,0.5); }
  .exp-meta { display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 8px; margin-bottom: 8px; }
  .exp-company { font-size: 13px; font-weight: 600; color: #00d4ff; font-family: 'JetBrains Mono', monospace; letter-spacing: 0.05em; }
  .exp-period { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #6b7280; padding: 3px 10px; border: 1px solid rgba(255,255,255,0.07); }
  .exp-role { font-size: 22px; font-weight: 700; letter-spacing: -0.02em; margin-bottom: 16px; }
  .exp-bullets { list-style: none; display: flex; flex-direction: column; gap: 10px; }
  .exp-bullets li { font-family: 'JetBrains Mono', monospace; font-size: 12.5px; color: rgba(232,234,240,0.7); line-height: 1.7; padding-left: 18px; position: relative; }
  .exp-bullets li::before { content: '▸'; position: absolute; left: 0; color: #ff6b35; }

  /* LINKS & OVERLAYS */
  .card-overlay-link { position: absolute; inset: 0; z-index: 10; cursor: pointer; }
  .icon-external-corner { position: absolute; top: 32px; right: 32px; color: rgba(255,255,255,0.15); transition: color 0.3s; z-index: 5; }
  .project-card:hover .icon-external-corner { color: #00d4ff; }
  
  .icon-external-cert { margin-left: auto; color: rgba(255,255,255,0.15); transition: color 0.3s; align-self: center; z-index: 5; }
  .cert-card:hover .icon-external-cert { color: #00d4ff; }

  /* PROJECTS */
  .projects-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 24px; }
  .project-card { background: #141828; border: 1px solid rgba(255,255,255,0.07); padding: 32px; position: relative; overflow: hidden; transition: border-color 0.3s, transform 0.3s; display: flex; flex-direction: column; }
  .project-card::before { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, rgba(0,212,255,0.04) 0%, transparent 60%); opacity: 0; transition: opacity 0.3s; }
  .project-card:hover { border-color: rgba(0,212,255,0.3); transform: translateY(-4px); }
  .project-card:hover::before { opacity: 1; }
  .project-num { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: rgba(255,255,255,0.07); letter-spacing: 0.1em; margin-bottom: 16px; }
  .project-name { font-size: 20px; font-weight: 700; letter-spacing: -0.02em; margin-bottom: 12px; line-height: 1.2; padding-right: 24px; }
  .project-date { font-family: 'JetBrains Mono', monospace; font-size: 10px; color: #ff6b35; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 16px; }
  .project-desc { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #6b7280; line-height: 1.7; flex: 1; }
  .project-highlights { margin-top: 20px; display: flex; flex-wrap: wrap; gap: 6px; }
  .highlight-chip { font-family: 'JetBrains Mono', monospace; font-size: 10px; padding: 3px 9px; background: rgba(0,212,255,0.12); color: #00d4ff; border: 1px solid rgba(0,212,255,0.2); letter-spacing: 0.05em; z-index: 11; position: relative; }

  /* CERTS */
  .certs-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 16px; }
  .cert-card { border: 1px solid rgba(255,255,255,0.07); padding: 24px 28px; background: #0e1120; display: flex; align-items: flex-start; gap: 16px; transition: border-color 0.2s; position: relative; }
  .cert-card:hover { border-color: rgba(0,212,255,0.3); }
  .cert-icon { width: 36px; height: 36px; flex-shrink: 0; background: rgba(0,212,255,0.12); border: 1px solid rgba(0,212,255,0.2); display: flex; align-items: center; justify-content: center; color: #00d4ff; font-size: 14px; }
  .cert-name { font-size: 13px; font-weight: 600; line-height: 1.4; margin-bottom: 4px; padding-right: 16px; }
  .cert-issuer { font-family: 'JetBrains Mono', monospace; font-size: 10px; color: #6b7280; letter-spacing: 0.05em; }

  /* CONTACT */
  .contact-section { position: relative; overflow: hidden; }
  .contact-bg { position: absolute; inset: 0; background-image: linear-gradient(rgba(0,212,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.03) 1px, transparent 1px); background-size: 40px 40px; mask-image: radial-gradient(ellipse 60% 80% at 50% 50%, black, transparent); }
  .contact-inner { position: relative; z-index: 2; max-width: 640px; margin: 0 auto; text-align: center; }
  .contact-sub { font-family: 'JetBrains Mono', monospace; font-size: 13px; color: #6b7280; line-height: 1.8; margin-bottom: 48px; }
  .contact-links { display: flex; justify-content: center; gap: 16px; flex-wrap: wrap; }
  .contact-link { display: inline-flex; align-items: center; gap: 10px; font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #e8eaf0; text-decoration: none; border: 1px solid rgba(255,255,255,0.07); padding: 14px 22px; letter-spacing: 0.08em; transition: border-color 0.2s, color 0.2s, background 0.2s; }
  .contact-link:hover { border-color: #00d4ff; color: #00d4ff; background: rgba(0,212,255,0.12); }

  footer { padding: 28px 60px; border-top: 1px solid rgba(255,255,255,0.07); display: flex; justify-content: space-between; align-items: center; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #6b7280; }

  @media (max-width: 768px) {
    .nav { padding: 16px 24px; }
    .nav-links { display: none; }
    .section { padding: 70px 24px; }
    .hero { padding: 120px 24px 80px; }
    .about-grid { grid-template-columns: 1fr; gap: 48px; }
    .hero-stats { display: none; }
    footer { flex-direction: column; gap: 8px; text-align: center; }
  }
`;

function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { el.classList.add("visible"); obs.unobserve(el); }
    }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

const RevealDiv = ({ children, className = "", style = {} }) => {
  const ref = useReveal();
  return <div ref={ref} className={`reveal ${className}`} style={style}>{children}</div>;
};

// SVG Icons
const IconMail = () => (
  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
  </svg>
);
const IconGH = () => (
  <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
  </svg>
);
const IconLI = () => (
  <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);
const IconDownload = () => (
  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
  </svg>
);
const IconPhone = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
    <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
  </svg>
);
// New icon to indicate external links
const IconExternal = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
  </svg>
);

export default function Portfolio() {
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [ringPos, setRingPos] = useState({ x: -100, y: -100 });
  const [hovered, setHovered] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const ringRef = useRef({ x: -100, y: -100 });
  const rafRef = useRef(null);

  useEffect(() => {
    const onMove = (e) => setCursorPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", onMove);
    const animate = () => {
      ringRef.current.x += (cursorPos.x - ringRef.current.x) * 0.12;
      ringRef.current.y += (cursorPos.y - ringRef.current.y) * 0.12;
      setRingPos({ x: ringRef.current.x, y: ringRef.current.y });
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => { window.removeEventListener("mousemove", onMove); cancelAnimationFrame(rafRef.current); };
  }, [cursorPos.x, cursorPos.y]);

  useEffect(() => {
    const sections = ["hero", "about", "experience", "projects", "certifications", "contact"];
    const onScroll = () => {
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 200) setActiveSection(id);
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = ["about", "experience", "projects", "certifications", "contact"];

  const skills = [
    { group: "Languages", tags: ["Python", "C++", "Java", "R", "JavaScript", "SQL"] },
    { group: "AI / ML", tags: ["TensorFlow", "scikit-learn", "YOLO", "NLP", "Deep Learning", "SpaCy", "LangChain", "LLMs"] },
    { group: "Backend & Infra", tags: ["FastAPI", "Flask", "Docker", "Redis", "Celery", "PostgreSQL", "MySQL"] },
    { group: "Cloud & Tools", tags: ["GCP", "AWS", "Azure", "Git", "JIRA", "Tableau", "Power BI"] },
    { group: "Frontend", tags: ["React.js", "Angular JS", "HTML/CSS"] },
  ];

  // Added "link" properties to Projects 
  const projects = [
    { 
      num: "01", 
      name: "Payment Collection AI Agent", 
      date: "Apr 2026", 
      desc: "AI-powered conversational agent that guides users through multi-step payment verification and collection. Engineered with LangChain for agentic reasoning and LLM task execution, backed by a clean FastAPI REST architecture.", 
      chips: ["Python", "FastAPI", "LangChain", "React", "LLMs"], 
      link: "https://github.com/Siddesh3108/Payment-Collection-AI-Agent-" 
    },
    { 
      num: "02", 
      name: "OfficeWatch: Enterprise SaaS Management", 
      date: "Feb 2026", 
      desc: "Reduced DB reads by ~80% via Redis read-through caching. Engineered async Shadow IT detection with Celery workers. Secured procurement via RBAC with custom JWT middleware. Full microservices deployment with Docker Compose.", 
      chips: ["Redis", "Celery", "JWT", "Docker", "RBAC"], 
      link: "https://github.com/Siddesh3108/office-management" 
    },
    { 
      num: "03", 
      name: "AI Timetable Generator", 
      date: "Nov 2025 · IEEE PuneCon 2025", 
      desc: "Production-ready web app for university scheduling using React.js, Flask and PostgreSQL. Achieved 175× faster execution with zero conflicts by benchmarking Google OR-Tools against Genetic Algorithms. Accepted at IEEE PuneCon 2025.", 
      chips: ["React.js", "Flask", "OR-Tools", "Docker", "IEEE Published"], 
      link: "https://github.com/Siddesh3108/Timetable-generator-" 
    },
    { 
      num: "04", 
      name: "Legal Chatbot for Instant Guidance", 
      date: "May 2025", 
      desc: "AI-driven legal assistant chatbot using Python and NLP, trained on curated legal FAQs, statutes, and case laws. Increased response relevance by 31%, improved user satisfaction to 85%, and cut information retrieval time by 35%.", 
      chips: ["Python", "NLP", "Chatbot", "85% CSAT"], 
      link: "https://github.com/Siddesh3108/Legal-Chatbot" 
    },
    { 
      num: "05", 
      name: "Sentiment Analysis — Twitter ML", 
      date: "Sep 2024", 
      desc: "ML model using Naive Bayes and Random Forest for Twitter sentiment. Pre-processed with SpaCy. Achieved 89% accuracy on 2,000 tweets with a Flask-based real-time classification UI.", 
      chips: ["scikit-learn", "SpaCy", "Flask", "89% Accuracy"], 
      link: "https://github.com/Siddesh3108/Sentiment-Analysis-of-Tweets" 
    },
    { 
      num: "06", 
      name: "Model Mental Health Website", 
      date: "Mar 2024", 
      desc: "Designed an intuitive mental health platform that elevated user satisfaction by 30%. Integrated real-time scoring cutting wait times by 10%. Enhanced score calculation accuracy by 19%.", 
      chips: ["JavaScript", "UI/UX", "30% Satisfaction↑"], 
      link: "https://github.com/Siddesh3108/Mental-Health-Awareness-Website" 
    },
  ];

  // Added missing Cert and exact Credential ID verification URLs
  const certs = [
    { name: "Generative AI with Large Language Models", issuer: "Coursera / DeepLearning.AI", link: "https://www.coursera.org/account/accomplishments/verify/EFCKYMF603LH" },
    { name: "Advanced Learning Algorithms", issuer: "Coursera / DeepLearning.AI", link: "https://www.coursera.org/account/accomplishments/verify/KS00NNUS1C1F" },
    { name: "Supervised Machine Learning: Regression and Classification", issuer: "Coursera", link: "https://www.coursera.org/account/accomplishments/verify/IFGL4MR48VMI" },
    { name: "Data Analysis and Visualization with Power BI", issuer: "Coursera / Microsoft", link: "https://www.coursera.org/account/accomplishments/verify/9BVEOFLWPWF8" },
    { name: "Cybersecurity for Everyone", issuer: "Coursera / University of Maryland", link: "https://www.coursera.org/account/accomplishments/verify/UQKCTMS9SWAM" }
  ];

  const h = { onMouseEnter: () => setHovered(true), onMouseLeave: () => setHovered(false) };

  return (
    <div className="port-root">
      <style>{styles}</style>

      {/* CUSTOM CURSOR */}
      <div id="cursor" style={{ transform: `translate(${cursorPos.x - 5}px, ${cursorPos.y - 5}px)` }} />
      <div id="cursor-ring" className={hovered ? "hovered" : ""} style={{ transform: `translate(${ringPos.x - 18}px, ${ringPos.y - 18}px)` }} />

      {/* NAV */}
      <nav className="nav">
        <div className="nav-logo">SL // Portfolio</div>
        <ul className="nav-links">
          {navLinks.map(id => (
            <li key={id}>
              <a href={`#${id}`} className={activeSection === id ? "active" : ""} {...h}>{id}</a>
            </li>
          ))}
        </ul>
      </nav>

      {/* HERO */}
      <section id="hero" className="hero">
        <div className="hero-grid" />
        <div className="hero-glow" />
        <div className="hero-glow2" />
        <div className="hero-content">
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            Available for Opportunities
          </div>
          <h1 className="hero-name">Siddesh<br /><span>Lohkare</span></h1>
          <p className="hero-role">AI/ML Engineer & Full-Stack Developer</p>
          <p className="hero-desc">
            Building intelligent systems at the intersection of machine learning,<br />
            scalable architecture, and real-world product impact.<br />
            Former AI/ML Intern @ Jio Platforms Ltd.
          </p>
          <div className="hero-ctas">
            <a href="#contact" className="btn-primary" {...h}>
              <IconMail /> Get in Touch
            </a>
            <a href="https://github.com/Siddesh3108" target="_blank" rel="noreferrer" className="btn-secondary" {...h}>
              <IconGH /> GitHub
            </a>
            <a href="https://www.linkedin.com/in/siddesh-lohkare" target="_blank" rel="noreferrer" className="btn-secondary" {...h}>
              <IconLI /> LinkedIn
            </a>
            <a
              href="/Sidddesh Lohkare Resume.pdf"
              download="Siddesh_Lohkare_Resume.pdf"
              className="btn-download"
              {...h}
            >
              <IconDownload /> Download Resume
            </a>
          </div>
        </div>
        <div className="hero-stats">
          <div className="stat"><div className="stat-num">90%</div><div className="stat-label">Detection Accuracy</div></div>
          <div className="stat"><div className="stat-num">175×</div><div className="stat-label">Faster Scheduling</div></div>
          <div className="stat"><div className="stat-num">6+</div><div className="stat-label">Production Projects</div></div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="section section-bg">
        <div className="about-grid">
          <RevealDiv className="about-text">
            <div className="section-tag">About Me</div>
            <h2 className="section-title">Engineering Intelligence<br />Into Products</h2>
            <p>I'm a <strong>Computer Engineering graduate</strong> from NMIMS University (Batch of 2026) with a strong foundation in AI/ML and full-stack development. I transform complex machine learning research into scalable, production-ready systems.</p>
            <p>At <strong>Jio Platforms</strong>, I built real-time video analytics pipelines, architected microservice platforms, and pushed the boundaries of what intelligent software can do at enterprise scale.</p>
            <p>My work sits at the intersection of <strong>AI research and system design</strong> — I care deeply about both the elegance of the algorithm and the reliability of the infrastructure beneath it.</p>
          </RevealDiv>
          <RevealDiv className="skills-grid">
            <div className="section-tag" style={{ marginBottom: 28 }}>Technical Stack</div>
            {skills.map(({ group, tags }) => (
              <div key={group}>
                <div className="skill-group-name">{group}</div>
                <div className="skill-tags">
                  {tags.map(t => <span key={t} className="skill-tag">{t}</span>)}
                </div>
              </div>
            ))}
          </RevealDiv>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section id="experience" className="section">
        <RevealDiv><div className="section-tag">Experience</div></RevealDiv>
        <RevealDiv><h2 className="section-title">Where I've<br />Created Impact</h2></RevealDiv>
        <div className="timeline">
          <RevealDiv className="timeline-item">
            <div className="timeline-dot" />
            <div className="exp-meta">
              <span className="exp-company">Jio Platforms Ltd</span>
              <span className="exp-period">Dec 2025 — Apr 2026</span>
            </div>
            <div className="exp-role">AI/ML Engineering Intern</div>
            <ul className="exp-bullets">
              <li>Built a full-stack video analytics app using YOLO object detection to track real-time office occupancy across 50 continuous video feeds with <strong style={{ color: "#00d4ff" }}>90% accuracy</strong>.</li>
              <li>Designed a low-latency background pipeline with Celery and Redis processing <strong style={{ color: "#00d4ff" }}>30 frames/second</strong> while maintaining &lt;100 ms frontend response times.</li>
              <li>Containerized the entire stack (frontend, API, ML workers) with Docker, reducing deployment setup time by <strong style={{ color: "#00d4ff" }}>25%</strong>.</li>
            </ul>
          </RevealDiv>
          <RevealDiv className="timeline-item">
            <div className="timeline-dot" style={{ background: "#ff6b35", boxShadow: "0 0 12px rgba(255,107,53,0.5)" }} />
            <div className="exp-meta">
              <span className="exp-company" style={{ color: "#ff6b35" }}>Jio Platforms Ltd</span>
              <span className="exp-period">May 2024 — June 2024</span>
            </div>
            <div className="exp-role">Data Analytics Intern</div>
            <ul className="exp-bullets">
              <li>Designed and built 4 interactive dashboards using Apache Superset, translating complex datasets into clear visual insights for the Data Science team.</li>
              <li>Optimized dashboards to cut load times by <strong style={{ color: "#ff6b35" }}>30%</strong> and ensured data integrity for stakeholder reporting.</li>
              <li>Automated data workflows, cutting manual data handling and improving overall processing efficiency by <strong style={{ color: "#ff6b35" }}>20%</strong>.</li>
            </ul>
          </RevealDiv>
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects" className="section section-bg">
        <RevealDiv><div className="section-tag">Projects</div></RevealDiv>
        <RevealDiv><h2 className="section-title">Things I've<br />Built</h2></RevealDiv>
        <div className="projects-grid">
          {projects.map(p => (
            <RevealDiv key={p.num} className="project-card">
              <a href={p.link} target="_blank" rel="noreferrer" className="card-overlay-link" aria-label={`View ${p.name}`} {...h}></a>
              <div className="icon-external-corner"><IconExternal /></div>
              <div className="project-num">{p.num} //</div>
              <div className="project-name">{p.name}</div>
              <div className="project-date">{p.date}</div>
              <div className="project-desc">{p.desc}</div>
              <div className="project-highlights">
                {p.chips.map(c => <span key={c} className="highlight-chip">{c}</span>)}
              </div>
            </RevealDiv>
          ))}
        </div>
      </section>

      {/* CERTIFICATIONS */}
      <section id="certifications" className="section">
        <RevealDiv><div className="section-tag">Certifications</div></RevealDiv>
        <RevealDiv><h2 className="section-title">Continuous<br />Learning</h2></RevealDiv>
        <div className="certs-grid">
          {certs.map(c => (
            <RevealDiv key={c.name} className="cert-card">
              <a href={c.link} target="_blank" rel="noreferrer" className="card-overlay-link" aria-label={`View ${c.name} credential`} {...h}></a>
              <div className="cert-icon">◈</div>
              <div>
                <div className="cert-name">{c.name}</div>
                <div className="cert-issuer">{c.issuer}</div>
              </div>
              <div className="icon-external-cert"><IconExternal /></div>
            </RevealDiv>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="section section-bg contact-section">
        <div className="contact-bg" />
        <RevealDiv className="contact-inner">
          <div className="section-tag" style={{ justifyContent: "center", marginBottom: 16 }}>Contact</div>
          <h2 className="section-title" style={{ marginBottom: 16 }}>Let's Build<br />Something Together</h2>
          <p className="contact-sub">Open to full-time roles, internships, and exciting collaborations<br />in AI/ML, full-stack, or data engineering.</p>
          <div className="contact-links">
            <a href="mailto:sidlohkare@gmail.com" className="contact-link" {...h}>
              <IconMail /> sidlohkare@gmail.com
            </a>
            <a href="tel:+917977389203" className="contact-link" {...h}>
              <IconPhone /> +91 79773 89203
            </a>
            <a href="https://www.linkedin.com/in/siddesh-lohkare" target="_blank" rel="noreferrer" className="contact-link" {...h}>
              <IconLI /> LinkedIn
            </a>
            <a href="https://github.com/Siddesh3108" target="_blank" rel="noreferrer" className="contact-link" {...h}>
              <IconGH /> GitHub
            </a>
          </div>
        </RevealDiv>
      </section>

      {/* FOOTER */}
      <footer>
        <span>© 2026 Siddesh Lohkare</span>
        <span style={{ color: "rgba(255,255,255,0.07)" }}>NMIMS University · Computer Engineering · Batch of 2026</span>
      </footer>
    </div>
  );
}