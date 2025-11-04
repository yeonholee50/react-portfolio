import React from 'react';
import './cv.css';

const CVViewer = () => {
  return (
    <div className="cv-viewer-container">
      <div className="cv-viewer-header">
        <h1 className="cv-viewer-title">Resume</h1>
      </div>
      <div className="cv-content">
        {/* Header */}
        <div className="cv-section cv-header">
          <h1 className="cv-name">Yeon Lee</h1>
          <div className="cv-contact">
            <div className="cv-contact-row">
              <span>+1 (678) 644-3180</span>
              <span>•</span>
              <a href="mailto:yeonholee50@gmail.com">yeonholee50@gmail.com</a>
              <span>•</span>
              <a href="https://yeonthelee.tech/" target="_blank" rel="noopener noreferrer">yeonthelee.tech</a>
            </div>
            <div className="cv-contact-row">
              <a href="https://www.linkedin.com/in/yeon-lee" target="_blank" rel="noopener noreferrer">linkedin.com/in/yeon-lee</a>
              <span>•</span>
              <a href="https://github.com/yeonholee50" target="_blank" rel="noopener noreferrer">github.com/yeonholee50</a>
            </div>
          </div>
        </div>

        {/* Objective */}
        <div className="cv-section">
          <h2 className="cv-section-title">Objective</h2>
          <p className="cv-paragraph">
            Software engineer who builds typed, deterministic services (data pipelines, messaging, observability). I'm looking to join a team where I can ship production systems that measurably improve reliability and speed—while learning from world-class engineers and raising the bar with disciplined ops.
          </p>
        </div>

        {/* Experience */}
        <div className="cv-section">
          <h2 className="cv-section-title">Experience</h2>
          
          <div className="cv-experience-item">
            <div className="cv-experience-header">
              <div>
                <h3 className="cv-experience-company">Alpha Quant</h3>
                <p className="cv-experience-role">Software Developer</p>
              </div>
              <div className="cv-experience-meta">
                <span className="cv-experience-location">Atlanta, Georgia</span>
                <span className="cv-experience-date">Jul 2025 – Present</span>
              </div>
            </div>
            <ul className="cv-bullet-list">
              <li>Contracted on weekends by a buy-side firm to design and build a <strong>proprietary, modular Go trading platform</strong> that standardizes service contracts, message-bus envelopes, and observability hooks, <strong>cutting new subsystem bring-up from ~1–2 days to &lt;30 minutes</strong> via plug-and-play templates and linted schemas.</li>
              <li>Shipped source adapters across <em>news, historical, and fundamental</em> domains and normalized outputs to canonical schemas, <strong>lifting schema-valid ingest to &gt;99.9%</strong> with drift/orphan detection, fixed-precision prices, and strict UTC/event-time gating.</li>
              <li>Implemented a bounded-concurrency worker pool with token-bucket rate limiting, session rotation, and backoff/circuit breakers, <strong>improving multi-source throughput by 3–4×</strong> while holding p99 latency targets and protecting vendor quotas.</li>
              <li>Enabled <strong>three run modes</strong>—GUI, console, and headless—with a one-command <em>trace dump</em> that stitches logs/metrics/traces; <strong>reduced MTTR from hours to minutes</strong> on ingest and streaming incidents.</li>
              <li>Delivered a real-time market analysis and risk module (breadth, momentum, regime, volatility, macro). <strong>Standardized indicator outputs and dashboards</strong> to lower decision latency and enable same-day tuning.</li>
              <li>Hardened production streaming with ordered publishing, backpressure, and graceful shutdown, plus config/secret indirection (no keys in code); <strong>achieved loss-free soak runs</strong> and reproducible replays with run IDs and schema versioning.</li>
            </ul>
          </div>

          <div className="cv-experience-item">
            <div className="cv-experience-header">
              <div>
                <h3 className="cv-experience-company">Attachments King</h3>
                <p className="cv-experience-role">Software Engineer — AI Schema</p>
              </div>
              <div className="cv-experience-meta">
                <span className="cv-experience-location">San Francisco, CA</span>
                <span className="cv-experience-date">Feb 2025 – Jul 2025</span>
              </div>
            </div>
            <ul className="cv-bullet-list">
              <li>Unified AI rule authoring behind a centralized cursor-rule router; org-wide adoption as the single pathway <strong>reduced fragmentation and simplified maintenance</strong> across teams.</li>
              <li>Replaced ad-hoc logic with a tree-based constraints engine on a graph store that encodes power/interface/mechanical limits and emits valid combos dynamically, <strong>cutting test-matrix generation from days to &lt;1 hour</strong>.</li>
              <li>Enabled same-day price updates for ~20k SKUs/week and <strong>reduced bad-data incidents by &gt;86%</strong> by standardizing PDF/CSV/HTML pipelines with drift/orphan detection and auto-publishing of clean SKUs.</li>
              <li>Eliminated manual CSR checks for 12+ vendors and <strong>improved availability freshness to p95 &lt;10 min</strong> by deploying a reusable, real-time ingestion pipeline for non-API suppliers.</li>
            </ul>
          </div>

          <div className="cv-experience-item">
            <div className="cv-experience-header">
              <div>
                <h3 className="cv-experience-company">LymphaTech</h3>
                <p className="cv-experience-role">Backend Developer</p>
              </div>
              <div className="cv-experience-meta">
                <span className="cv-experience-location">Atlanta, GA</span>
                <span className="cv-experience-date">Aug 2023 – May 2024</span>
              </div>
            </div>
            <ul className="cv-bullet-list">
              <li>Enabled reliable multi-device access with fewer synchronization conflicts and lower resource use by introducing a two-stage UI–server pattern with flag-based sync.</li>
              <li>Held contour-measurement error within <strong>≤4% of ground truth</strong> by tuning the model pipeline and integrating point-cloud contour-line generation.</li>
              <li>Improved delivery predictability across biweekly sprints by coordinating Scrum ceremonies and aligning stakeholder feedback through transparent Jira workflows.</li>
            </ul>
          </div>
        </div>

        {/* Projects */}
        <div className="cv-section">
          <h2 className="cv-section-title">Projects</h2>
          
          <div className="cv-project-item">
            <div className="cv-project-header">
              <h3 className="cv-project-name">AmpyFin (Platform: OSS foundations + proprietary systems)</h3>
              <div className="cv-project-links">
                <a href="https://github.com/AmpyFin" target="_blank" rel="noopener noreferrer">AmpyFin Org</a>
                <span> • </span>
                <a href="https://github.com/AmpyFin/ampyfin" target="_blank" rel="noopener noreferrer">OSS AmpyFin</a>
              </div>
            </div>
            <ul className="cv-bullet-list">
              <li><strong>Purpose</strong> — Plug-and-play trading platform with typed message contracts and deterministic replays; swappable ingestion, transport, configuration, and observability layers.</li>
              <li><strong>Open-source foundations</strong> — <a href="https://github.com/AmpyFin/ampy-proto" target="_blank" rel="noopener noreferrer">ampy-proto</a> (canonical Protobufs: <code>bars.v1</code>, <code>ticks.v1</code>, <code>fundamentals.v1</code>; explicit decimals; <code>event_time</code>/<code>ingest_time</code>/<code>as_of</code>), <a href="https://github.com/AmpyFin/ampy-bus" target="_blank" rel="noopener noreferrer">ampy-bus</a> (standard envelope & headers: run/universe IDs, trace, QoS; NATS JetStream & Kafka), <a href="https://github.com/AmpyFin/ampy-config" target="_blank" rel="noopener noreferrer">ampy-config</a> (typed, layered config with validation + secret indirection), <a href="https://github.com/AmpyFin/ampy-observability" target="_blank" rel="noopener noreferrer">ampy-observability</a> (uniform logs/metrics/tracing via OTLP), <a href="https://github.com/AmpyFin/yfinance-go" target="_blank" rel="noopener noreferrer">yfinance-go</a> (multi-session free-data path).</li>
              <li><strong>Provider adapters (modular)</strong> — <em>DataBento C++ client</em> (normalized bars/ticks for ensemble learning; bounded concurrency, backoff); <em>Benzinga Go client</em> (real-time earnings & news streams for event-driven signals); <em>Tiingo Go client</em> (validated fundamentals with currency/period semantics); <em>yfinance-go</em> (OSS concurrent pulls with rotating sessions to avoid rate limits).</li>
              <li><strong>Model orchestration</strong> — Ranked ensemble across specialized systems with weights adapting to performance & market regimes; strict contracts allow side-by-side replay of market data and decisions.</li>
              <li><strong>Operations</strong> — Reference Docker Compose, golden samples, and CI smoke tests for consistent bring-up, schema evolution checks, and deterministic bus replays.</li>
              <li><strong>Proprietary systems (selected)</strong> — <em>Prag</em> (volatility-aware, risk–reward optimizer), <em>Hyper</em> (growth in low-vol), <em>Riemann</em> (LLM-ranked analyst signals), <em>Euler</em> (regime/volatility forecasting), <em>Tachyon</em> (cross-venue pricing), <em>Aether</em> (macro & sentiment), <em>Sigma</em> (13F portfolio ranking), <em>Baek</em> (dynamic fine-tuning & RL), <em>Val</em> (consensus fair value).</li>
            </ul>
          </div>

          <div className="cv-project-item">
            <div className="cv-project-header">
              <h3 className="cv-project-name">yfinance-go</h3>
              <div className="cv-project-links">
                <a href="https://github.com/AmpyFin/yfinance-go" target="_blank" rel="noopener noreferrer">yfinance-go</a>
              </div>
            </div>
            <ul className="cv-bullet-list">
              <li><strong>Purpose</strong> — Free-data ingestion path that matches AmpyFin's proto/bus/config/obs contracts so users can later swap to paid providers (e.g., DataBento) without code changes.</li>
              <li><strong>Concurrency & rate limits</strong> — Multiple HTTP sessions + a bounded worker pool enable true parallel pulls (e.g., ~8 concurrent tickers) with rotating sessions to avoid rate limiting.</li>
              <li><strong>Coverage</strong> — Daily/weekly/monthly/intraday bars and quotes; standardized output to <code>ampy-proto</code>; session rotation, backoff, and circuit breakers; library + CLI (<code>yfin pull</code>).</li>
              <li><strong>Fallbacks</strong> — Modular HTML parsing for views not exposed via API endpoints; strict validation on decode to preserve deterministic replays.</li>
            </ul>
          </div>

          <div className="cv-project-item">
            <div className="cv-project-header">
              <h3 className="cv-project-name">NyxHub</h3>
              <div className="cv-project-links">
                <a href="https://github.com/yeonholee50/NyxHub" target="_blank" rel="noopener noreferrer">NyxHub</a>
              </div>
            </div>
            <ul className="cv-bullet-list">
              <li><strong>Overview</strong> — Centralized file-sharing app; secure, fast transfers over a global network with destination-by-username routing and a clean, cross-platform UI.</li>
              <li><strong>Stack</strong> — FastAPI backend (JWT auth, CORS, structured logging), MongoDB + Motor with GridFS for binary storage, dotenv-based config; ReactJS frontend.</li>
              <li><strong>Security & speed</strong> — End-to-end encryption for exchanges; in-progress C/C++ module for custom encryption/scrambling to improve throughput and protect at-rest blobs.</li>
              <li><strong>UX</strong> — Users send files directly to a recipient's handle; recipients retrieve from a dashboard with transfer status.</li>
            </ul>
          </div>
        </div>

        {/* Education */}
        <div className="cv-section">
          <h2 className="cv-section-title">Education</h2>
          <div className="cv-experience-item">
            <div className="cv-experience-header">
              <div>
                <h3 className="cv-experience-company">Georgia Institute of Technology</h3>
                <p className="cv-experience-role">B.S. in Computer Science (Threads: Intelligence; Systems & Architecture)</p>
              </div>
              <div className="cv-experience-meta">
                <span className="cv-experience-location">Atlanta, GA</span>
                <span className="cv-experience-date">Aug 2020 – May 2024</span>
              </div>
            </div>
            <ul className="cv-bullet-list">
              <li>Selected coursework: Data Structures and Algorithms, Systems and Networks, Computer Networking, Design and Analysis of Algorithms, Artificial Intelligence, Computer Vision, Automata and Complexity</li>
            </ul>
          </div>
        </div>

        {/* Skills */}
        <div className="cv-section">
          <h2 className="cv-section-title">Skills</h2>
          <div className="cv-skills">
            <p><strong>Languages:</strong> Python, Go, C/C++, Java, SQL, Bash, HTML/CSS, JavaScript</p>
            <p><strong>Infrastructure:</strong> Docker, Render, Linux, Grafana, Prometheus, OpenTelemetry, Kafka, NATS JetStream, Protobuf</p>
            <p><strong>Databases and Web:</strong> MongoDB, AWS Neptune, DuckDB, REST API, FastAPI, ReactJS, PostgreSQL</p>
            <p><strong>Tool:</strong> GitHub, Git, Linear, Jira, VS Code IDE, Cursor IDE</p>
            <p><strong>Practices:</strong> Agile Methodology, SCRUM, CI/CD, TDD, Code Review, Documentation</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CVViewer;
