// ─────────────────────────────────────────────────────────────────────────────
//  GeneDiff — App.jsx
//  Single React file. All components, all logic, all styles live here.
//  Served by Java's StaticFileHandler as a plain .jsx file loaded via
//  an index.html that pulls in React + Babel from CDN (no build step needed).
// ─────────────────────────────────────────────────────────────────────────────

// ── CSS injected at runtime so we need only this one file ────────────────────
const CSS = `
:root {
  --bg:          #dce9f5;
  --bg-panel:    #BCD2EE;
  --bg-card:     #eaf2fa;
  --bg-hover:    #ccddf0;
  --border:      #9B7EDE;
  --border-hi:   #832161;
  --text:        #52050A;
  --text-dim:    #832161;
  --text-muted:  #9B7EDE;
  --accent:      #832161;
  --accent-dim:  #6a1a4f;
  --green:       #1a9e82;
  --red:         #99173a;
  --yellow:      #b07010;
  --purple:      #6a44b8;
  --match:       #1a9e82;
  --mutated:     #99173a;
  --missing:     #b07010;
  --extra:       #6a44b8;
  --font:        Arial, Helvetica, sans-serif;
  --radius:      6px;
  --radius-lg:   12px;
}
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: var(--font); background: var(--bg); color: var(--text); min-height: 100vh; overflow-x: hidden; }

/* HEADER */
.app-header { background: var(--bg-panel); border-bottom: 1px solid var(--border); padding: 0 2rem; height: 60px; display: flex; align-items: center; position: sticky; top: 0; z-index: 100; }
.header-inner { display: flex; align-items: center; justify-content: space-between; width: 100%; max-width: 1600px; margin: 0 auto; }
.logo { display: flex; align-items: center; gap: 0.75rem; }
.logo-helix { font-size: 1.8rem; color: var(--accent); line-height: 1; animation: pulse 3s ease-in-out infinite; }
@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
.logo-title { display: block; font-weight: 800; font-size: 1.3rem; color: var(--accent); letter-spacing: 0.05em; line-height: 1.2; }
.logo-sub { display: block; font-size: 0.62rem; color: var(--text-dim); letter-spacing: 0.12em; text-transform: uppercase; }
.header-nav { display: flex; align-items: center; gap: 0.75rem; }
.nav-tag { font-size: 0.65rem; color: var(--text-dim); letter-spacing: 0.1em; text-transform: uppercase; }
.nav-sep { color: var(--border); }

/* LAYOUT */
.app-main { display: grid; grid-template-columns: 420px 1fr; min-height: calc(100vh - 60px); max-width: 1600px; margin: 0 auto; }
.panel { padding: 2rem 1.75rem; overflow-y: auto; }
.panel-input { background: var(--bg-panel); border-right: 1px solid var(--border); position: sticky; top: 60px; height: calc(100vh - 60px); }
.panel-results { background: var(--bg); }
.panel-title { font-weight: 700; font-size: 1rem; color: var(--accent); letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 1.5rem; padding-bottom: 0.75rem; border-bottom: 1px solid var(--border); }

/* FORM */
.form-group { margin-bottom: 1.2rem; }
.form-label { display: flex; align-items: center; gap: 0.5rem; font-size: 0.72rem; color: var(--text-dim); letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 0.4rem; }
.label-badge { font-size: 0.6rem; padding: 1px 6px; border-radius: 20px; background: rgba(26,158,130,0.12); color: var(--green); border: 1px solid rgba(26,158,130,0.3); }
.label-badge.patient { background: rgba(131,33,97,0.12); color: var(--accent); border-color: rgba(131,33,97,0.3); }
.form-input, .form-select, .form-textarea { width: 100%; background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius); color: var(--text); font-family: var(--font); font-size: 0.82rem; padding: 0.6rem 0.8rem; outline: none; transition: border-color 0.2s; }
.form-input:focus, .form-select:focus, .form-textarea:focus { border-color: var(--accent-dim); }
.form-select option { background: var(--bg-card); }
.seq-textarea { font-size: 0.72rem; letter-spacing: 0.08em; line-height: 1.8; resize: vertical; }
.ref-seq { color: var(--green); }
.patient-seq { color: var(--accent); }
.select-info { font-size: 0.68rem; color: var(--text-dim); margin-top: 0.35rem; padding: 0.4rem 0.6rem; background: var(--bg); border-radius: var(--radius); border: 1px solid var(--border); }

/* DIVIDER + PRESETS */
.divider-or { display: flex; align-items: center; gap: 0.75rem; margin: 1rem 0; color: var(--text-muted); font-size: 0.62rem; letter-spacing: 0.15em; }
.divider-or::before, .divider-or::after { content:''; flex:1; height:1px; background: var(--border); }
.preset-bar { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem; flex-wrap: wrap; }
.preset-label { font-size: 0.65rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.08em; }
.preset-btn { font-family: var(--font); font-size: 0.65rem; padding: 0.3rem 0.7rem; border-radius: var(--radius); border: 1px solid var(--border); cursor: pointer; background: transparent; transition: all 0.15s; }
.preset-btn.healthy { color: var(--green); border-color: rgba(26,158,130,0.4); }

.preset-btn.mutant { color: var(--red); border-color: rgba(153,23,58,0.4); }

.preset-btn.partial { color: var(--yellow); border-color: rgba(176,112,16,0.4); }


/* ANALYZE BUTTON */
.analyze-btn { width: 100%; display: flex; align-items: center; justify-content: center; gap: 0.75rem; padding: 0.85rem 1rem; background: linear-gradient(135deg, #832161, #9B7EDE); color: #fff; border: 1px solid var(--border-hi); border-radius: var(--radius-lg); font-family: var(--font); font-size: 0.95rem; font-weight: 700; letter-spacing: 0.05em; cursor: pointer; transition: all 0.2s; margin-bottom: 1.2rem; }


.btn-icon { font-size: 1.1rem; }

/* EMPTY STATE */
.empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 60vh; text-align: center; gap: 1rem; }
.empty-helix { font-size: 4rem; opacity: 0.3; animation: float 4s ease-in-out infinite; }
@keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
.empty-state h3 { color: var(--text-dim); font-size: 1.2rem; }
.empty-state p { color: var(--text-muted); font-size: 0.78rem; max-width: 300px; line-height: 1.7; }
.empty-state em { color: var(--accent); font-style: normal; }

/* VERDICT */
.verdict-banner { display: flex; align-items: center; gap: 1.25rem; padding: 1.25rem 1.5rem; border-radius: var(--radius-lg); margin-bottom: 1.25rem; border: 1px solid; animation: slideIn 0.4s ease; }
@keyframes slideIn { from{opacity:0;transform:translateY(-10px)} to{opacity:1;transform:translateY(0)} }
.verdict-banner.healthy { background: rgba(26,158,130,0.05); border-color: rgba(26,158,130,0.3); }
.verdict-banner.abnormal { background: rgba(153,23,58,0.05); border-color: rgba(153,23,58,0.3); }
.verdict-icon { width:52px; height:52px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:1.6rem; flex-shrink:0; font-weight:800; }
.verdict-banner.healthy .verdict-icon { background:rgba(26,158,130,0.15); color:var(--green); border:2px solid rgba(26,158,130,0.4); }
.verdict-banner.abnormal .verdict-icon { background:rgba(153,23,58,0.15); color:var(--red); border:2px solid rgba(153,23,58,0.4); }
.verdict-text { flex: 1; }
.verdict-status { font-size: 1.2rem; font-weight: 800; margin-bottom: 0.25rem; }
.verdict-banner.healthy .verdict-status { color: var(--green); }
.verdict-banner.abnormal .verdict-status { color: var(--red); }
.verdict-disease { font-size: 0.78rem; color: var(--text-dim); }
.verdict-similarity { font-size: 1.4rem; font-weight: 700; }
.verdict-banner.healthy .verdict-similarity { color: var(--green); }
.verdict-banner.abnormal .verdict-similarity { color: var(--red); }

/* STATS */
.stats-row { display: grid; grid-template-columns: repeat(5,1fr); gap: 0.6rem; margin-bottom: 1.25rem; }
.stat-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius); padding: 0.7rem; text-align: center; transition: transform 0.15s; }

.stat-num { display: block; font-size: 1.4rem; font-weight: 700; margin-bottom: 0.15rem; }
.stat-lbl { display: block; font-size: 0.58rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--text-dim); }
.stat-card.match { border-top: 2px solid var(--match); } .stat-card.match .stat-num { color: var(--match); }
.stat-card.mutated { border-top: 2px solid var(--mutated); } .stat-card.mutated .stat-num { color: var(--mutated); }
.stat-card.missing { border-top: 2px solid var(--missing); } .stat-card.missing .stat-num { color: var(--missing); }
.stat-card.extra { border-top: 2px solid var(--extra); } .stat-card.extra .stat-num { color: var(--extra); }
.stat-card.edit { border-top: 2px solid var(--accent); } .stat-card.edit .stat-num { color: var(--accent); }

/* TABS */
.tab-bar { display: flex; margin-bottom: 1.25rem; border-bottom: 1px solid var(--border); }
.tab-btn { font-family: var(--font); font-size: 0.72rem; letter-spacing: 0.05em; padding: 0.6rem 1.2rem; background: transparent; color: var(--text-dim); border: none; border-bottom: 2px solid transparent; cursor: pointer; transition: all 0.2s; }

.tab-btn.active { color: var(--accent); border-bottom-color: var(--accent); }

/* SEQUENCE VIEW */
.seq-legend { display: flex; gap: 1.2rem; margin-bottom: 1rem; flex-wrap: wrap; }
.leg { display: flex; align-items: center; gap: 0.35rem; font-size: 0.65rem; letter-spacing: 0.06em; }
.leg.match{color:var(--match)} .leg.mutated{color:var(--mutated)} .leg.missing{color:var(--missing)} .leg.extra{color:var(--extra)}
.seq-tracks { margin-bottom: 1.5rem; }
.track-label { font-size: 0.65rem; color: var(--text-dim); letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 0.3rem; margin-top: 0.6rem; }
.seq-track { display: flex; flex-wrap: wrap; gap: 2px; padding: 0.5rem; background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius); min-height: 36px; }
.base-cell { width:22px; height:24px; display:flex; align-items:center; justify-content:center; font-family:var(--font); font-size:0.7rem; font-weight:700; border-radius:3px; cursor:default; transition:transform 0.1s; }

.base-cell.MATCH   { background:rgba(26,158,130,0.12); color:var(--match); }
.base-cell.MUTATED { background:rgba(153,23,58,0.18); color:var(--mutated); border:1px solid rgba(153,23,58,0.5); }
.base-cell.MISSING { background:rgba(176,112,16,0.15); color:var(--missing); border:1px dashed rgba(176,112,16,0.5); }
.base-cell.EXTRA   { background:rgba(106,68,184,0.15); color:var(--extra); border:1px dashed rgba(106,68,184,0.5); }

/* ANOMALY LIST */
.section-heading { font-size: 0.9rem; font-weight: 700; color: var(--text); margin-bottom: 0.75rem; }
.anomaly-list { display: flex; flex-direction: column; gap: 0.4rem; max-height: 260px; overflow-y: auto; }
.anomaly-item { display: flex; align-items: center; gap: 0.75rem; padding: 0.5rem 0.75rem; background: var(--bg-card); border-radius: var(--radius); border: 1px solid var(--border); font-size: 0.72rem; }
.anom-pos { font-size: 0.6rem; color: var(--text-muted); min-width: 60px; }
.anom-type { font-size: 0.6rem; letter-spacing: 0.08em; text-transform: uppercase; padding: 2px 6px; border-radius: 20px; min-width: 68px; text-align: center; }
.anom-type.MUTATED { background:rgba(153,23,58,0.15); color:var(--mutated); }
.anom-type.MISSING { background:rgba(176,112,16,0.12); color:var(--missing); }
.anom-type.EXTRA   { background:rgba(106,68,184,0.12); color:var(--extra); }
.anom-bases { flex: 1; color: var(--text); }
.anom-arrow { color: var(--text-muted); }
.anom-codon { font-size: 0.6rem; color: var(--text-muted); }

/* TREE VIEW */
.tree-info { font-size: 0.72rem; color: var(--text-dim); line-height: 1.7; margin-bottom: 1rem; }
.tree-panels { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.tree-panel { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-lg); overflow: hidden; }
.tree-panel-title { padding: 0.6rem 1rem; font-size: 0.7rem; letter-spacing: 0.08em; text-transform: uppercase; border-bottom: 1px solid var(--border); }
.tree-panel-title.ref { color: var(--green); }
.tree-panel-title.pat { color: var(--accent); }
.tree-canvas { padding: 1rem; overflow-x: auto; overflow-y: auto; max-height: 420px; min-height: 200px; }
.node-wrap { display: flex; flex-direction: column; align-items: center; gap: 2px; }
.tree-node-row { display: flex; gap: 4px; align-items: flex-start; flex-wrap: wrap; justify-content: center; }
.node-box { padding: 3px 6px; border-radius: 4px; font-family: var(--font); font-size: 0.65rem; font-weight: 700; text-align: center; border: 1px solid; transition: all 0.2s; cursor: default; }

.node-box.ROOT   { background:rgba(131,33,97,0.1); color:var(--accent); border-color:var(--accent-dim); min-width:70px; }
.node-box.CODON  { background:rgba(90,112,144,0.15); color:var(--text); border-color:var(--border); }
.node-box.BASE.MATCH   { background:rgba(26,158,130,0.1); color:var(--match); border-color:rgba(26,158,130,0.3); min-width:24px; }
.node-box.BASE.MUTATED { background:rgba(153,23,58,0.15); color:var(--mutated); border-color:rgba(153,23,58,0.4); min-width:24px; }
.node-box.BASE.MISSING { background:rgba(176,112,16,0.12); color:var(--missing); border-color:rgba(176,112,16,0.4); min-width:24px; }
.node-box.BASE.EXTRA   { background:rgba(106,68,184,0.12); color:var(--extra); border-color:rgba(106,68,184,0.4); min-width:24px; }
.node-box.CODON.has-diff { border-color:rgba(153,23,58,0.4); background:rgba(153,23,58,0.05); }
.tree-connector { width: 1px; height: 12px; background: var(--border); margin: 0 auto; }

/* MEDICAL REPORT */
.medical-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-lg); overflow: hidden; }
.medical-header { display: flex; justify-content: space-between; align-items: center; padding: 0.8rem 1.25rem; background: var(--bg-panel); border-bottom: 1px solid var(--border); }
.medical-patient { font-size: 0.72rem; color: var(--accent); }
.medical-timestamp { font-size: 0.65rem; color: var(--text-muted); }
.medical-disease-name { padding: 1rem 1.25rem 0; font-size: 1.3rem; font-weight: 800; color: var(--text); }
.medical-body { padding: 0.75rem 1.25rem 1.25rem; font-size: 0.78rem; color: var(--text-dim); line-height: 1.8; }
.medical-body strong { color: var(--text); }

/* LOADING */
.loading-overlay { position:fixed; inset:0; background:rgba(188,210,238,0.92); display:flex; align-items:center; justify-content:center; z-index:1000; opacity:0; pointer-events:none; transition:opacity 0.2s; }
.loading-overlay.active { opacity:1; pointer-events:all; }
.loading-box { text-align:center; display:flex; flex-direction:column; align-items:center; gap:1.5rem; }
.dna-spinner { display:flex; gap:0.4rem; font-size:1.8rem; font-weight:700; }
.dna-spinner span { animation: bounce 0.8s ease-in-out infinite; }
.dna-spinner span:nth-child(1){animation-delay:0s;color:#1a9e82}
.dna-spinner span:nth-child(2){animation-delay:0.1s;color:#832161}
.dna-spinner span:nth-child(3){animation-delay:0.2s;color:#6a44b8}
.dna-spinner span:nth-child(4){animation-delay:0.3s;color:#52050A}
@keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
.loading-text { font-size:0.75rem; color:var(--text); letter-spacing:0.15em; text-transform:uppercase; }

/* SCROLLBAR */
::-webkit-scrollbar{width:5px;height:5px}
::-webkit-scrollbar-track{background:var(--bg-card)}
::-webkit-scrollbar-thumb{background:var(--border);border-radius:3px}

/* RESPONSIVE */
@media(max-width:1100px){
  .app-main{grid-template-columns:1fr}
  .panel-input{position:static;height:auto}
  .tree-panels{grid-template-columns:1fr}
  .stats-row{grid-template-columns:repeat(3,1fr)}
}
@media(max-width:640px){
  .stats-row{grid-template-columns:repeat(2,1fr)}
  .panel{padding:1.25rem 1rem}
}
`;

(function injectCSS() {
  const style = document.createElement("style");
  style.textContent = CSS;
  document.head.appendChild(style);
})();

const { useState, useEffect, useRef } = React;

const API_BASE = window.location.origin + "/";

function runLocalDiff(patientId, patientSeq, refSeq, diseaseId, diseases) {
  const pat = patientSeq.toUpperCase().replace(/[^ATGC]/g, "");
  const ref = refSeq.toUpperCase().replace(/[^ATGC]/g, "");
  const maxLen = Math.max(ref.length, pat.length);
  const entries = [];
  let matchCount = 0,
    mutationCount = 0,
    missingCount = 0,
    extraCount = 0,
    editDistance = 0;

  for (let i = 0; i < maxLen; i++) {
    const refBase = i < ref.length ? ref[i] : "-";
    const patBase = i < pat.length ? pat[i] : "-";
    const codonId = "C" + Math.floor(i / 3);
    const codonPos = i % 3;
    let state;
    if (refBase !== "-" && patBase !== "-") {
      state = refBase === patBase ? "MATCH" : "MUTATED";
    } else if (refBase !== "-") {
      state = "MISSING";
    } else {
      state = "EXTRA";
    }
    if (state === "MATCH") matchCount++;
    else if (state === "MUTATED") {
      mutationCount++;
      editDistance++;
    } else if (state === "MISSING") {
      missingCount++;
      editDistance++;
    } else {
      extraCount++;
      editDistance++;
    }
    entries.push({
      position: i,
      referenceBase: refBase,
      patientBase: patBase,
      state,
      codonId,
      codonPosition: codonPos,
    });
  }

  const isHealthy =
    mutationCount === 0 && missingCount === 0 && extraCount === 0;
  const similarity =
    entries.length > 0 ? (matchCount / entries.length) * 100 : 100;
  const disease = diseases.find((d) => d.id === diseaseId);

  function buildLocalTree(seq, name) {
    const children = [];
    for (let i = 0; i < seq.length; i += 3) {
      const codon = seq.substring(i, Math.min(i + 3, seq.length));
      const bases = [];
      for (let j = 0; j < codon.length; j++) {
        bases.push({
          id: "C" + Math.floor(i / 3) + "B" + j,
          value: codon[j],
          position: i + j,
          type: "BASE",
          diffState: "MATCH",
          children: [],
        });
      }
      children.push({
        id: "C" + Math.floor(i / 3),
        value: codon,
        position: i,
        type: "CODON",
        diffState: "MATCH",
        children: bases,
      });
    }
    return {
      id: "ROOT",
      value: name,
      position: 0,
      type: "ROOT",
      diffState: "MATCH",
      children,
    };
  }

  // Annotate tree nodes with diff state
  function annotateTree(node, entries, side) {
    if (node.type === "BASE") {
      const entry = entries[node.position];
      if (entry) node.diffState = entry.state;
    }
    if (node.children) {
      node.children.forEach((c) => annotateTree(c, entries, side));
      if (node.type === "CODON") {
        node.hasDiff = node.children.some(
          (c) => c.diffState && c.diffState !== "MATCH",
        );
      }
    }
  }

  const refTree = buildLocalTree(ref, diseaseId || "REF");
  const patTree = buildLocalTree(pat, patientId);
  annotateTree(refTree, entries, "ref");
  annotateTree(patTree, entries, "pat");

  return {
    patientId,
    referenceGene: diseaseId || "CUSTOM",
    isHealthy,
    detectedDisease: isHealthy
      ? "None"
      : disease
        ? disease.name
        : "Unknown Mutation",
    diseaseDescription: isHealthy
      ? "Patient sequence matches perfectly. No genetic anomalies detected."
      : disease
        ? "<strong>Gene:</strong> " +
          disease.gene +
          "<br><strong>Mutation Type:</strong> " +
          disease.mutationType
        : "Anomalies detected but no matching disease pattern found.",
    stats: {
      totalBases: entries.length,
      matchCount,
      mutationCount,
      missingCount,
      extraCount,
      editDistance,
      similarityPercent: parseFloat(similarity.toFixed(2)),
    },
    diffEntries: entries,
    referenceTree: refTree,
    patientTree: patTree,
  };
}

function TreeNode({ node, depth }) {
  if (!node) return null;
  const label =
    node.type === "ROOT"
      ? "◈ " +
        (node.value.length > 8 ? node.value.slice(0, 8) + "…" : node.value)
      : node.value || "?";
  const cls = [
    "node-box",
    node.type,
    node.type === "BASE" ? node.diffState || "MATCH" : "",
    node.hasDiff ? "has-diff" : "",
  ]
    .join(" ")
    .trim();
  const hasChildren = node.children && node.children.length > 0;
  const LIMIT = node.type === "ROOT" ? 20 : node.children.length;
  const visible = hasChildren ? node.children.slice(0, LIMIT) : [];
  const extra = hasChildren ? node.children.length - LIMIT : 0;

  return (
    <div className="node-wrap">
      <div
        className={cls}
        title={node.type + ": " + node.value + " | " + (node.diffState || "")}
      >
        {label}
      </div>
      {hasChildren && (
        <>
          <div className="tree-connector" />
          <div className="tree-node-row">
            {visible.map((child) => (
              <TreeNode key={child.id} node={child} depth={depth + 1} />
            ))}
            {extra > 0 && (
              <div className="node-box CODON" style={{ opacity: 0.5 }}>
                +{extra} more
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function SequenceView({ entries }) {
  const anomalies = entries.filter((e) => e.state !== "MATCH");
  return (
    <div>
      <h3 className="section-heading">Base-by-Base Diff</h3>
      <div className="seq-legend">
        <span className="leg match">■ Match</span>
        <span className="leg mutated">■ Mutation</span>
        <span className="leg missing">■ Missing</span>
        <span className="leg extra">■ Extra</span>
      </div>
      <div className="seq-tracks">
        <div className="track-label">Reference</div>
        <div className="seq-track">
          {entries.map((e) => (
            <div
              key={"r" + e.position}
              className={"base-cell " + e.state}
              title={"Pos " + e.position + " | " + e.state}
            >
              {e.referenceBase === "-" ? "·" : e.referenceBase}
            </div>
          ))}
        </div>
        <div className="track-label">Patient</div>
        <div className="seq-track">
          {entries.map((e) => (
            <div
              key={"p" + e.position}
              className={"base-cell " + e.state}
              title={"Pos " + e.position + " | " + e.state}
            >
              {e.patientBase === "-" ? "·" : e.patientBase}
            </div>
          ))}
        </div>
      </div>
      <h4 className="section-heading">Anomalies Detected</h4>
      <div className="anomaly-list">
        {anomalies.length === 0 ? (
          <div
            style={{
              color: "var(--match)",
              fontSize: "0.75rem",
              padding: "0.5rem",
            }}
          >
            No anomalies — perfect match!
          </div>
        ) : (
          anomalies.map((e) => (
            <div key={e.position} className="anomaly-item">
              <span className="anom-pos">Pos. {e.position}</span>
              <span className={"anom-type " + e.state}>{e.state}</span>
              <span className="anom-bases">
                <strong style={{ color: "var(--green)" }}>
                  {e.referenceBase}
                </strong>
                <span className="anom-arrow"> → </span>
                <strong style={{ color: "var(--red)" }}>{e.patientBase}</strong>
              </span>
              <span className="anom-codon">
                {e.codonId}[{e.codonPosition}]
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function TreeView({ refTree, patTree }) {
  return (
    <div>
      <h3 className="section-heading">Gene Sequence Trees</h3>
      <p className="tree-info">
        Each tree represents the gene sequence as a hierarchical structure:{" "}
        <strong>Root → Codons → Bases</strong>. Highlighted nodes show where the
        diff was detected.
      </p>
      <div className="tree-panels">
        <div className="tree-panel">
          <div className="tree-panel-title ref">Reference Tree (Healthy)</div>
          <div className="tree-canvas">
            {refTree && <TreeNode node={refTree} depth={0} />}
          </div>
        </div>
        <div className="tree-panel">
          <div className="tree-panel-title pat">Patient Tree</div>
          <div className="tree-canvas">
            {patTree && <TreeNode node={patTree} depth={0} />}
          </div>
        </div>
      </div>
    </div>
  );
}

function MedicalReport({ result }) {
  const nameColor = result.isHealthy ? "var(--green)" : "var(--red)";
  return (
    <div>
      <h3 className="section-heading">Medical Analysis Report</h3>
      <div className="medical-card">
        <div className="medical-header">
          <div className="medical-patient">Patient ID: {result.patientId}</div>
          <div className="medical-timestamp">{new Date().toLocaleString()}</div>
        </div>
        <div className="medical-disease-name" style={{ color: nameColor }}>
          {result.isHealthy
            ? "✓ No Pathological Variants Detected"
            : "⚠ " + result.detectedDisease}
        </div>
        <div
          className="medical-body"
          dangerouslySetInnerHTML={{ __html: result.diseaseDescription }}
        />
      </div>
    </div>
  );
}

function ResultsPanel({ result }) {
  const [activeTab, setActiveTab] = useState("sequence");
  if (!result) {
    return (
      <div className="empty-state">
        <div className="empty-helix">🧬</div>
        <h3>Awaiting Analysis</h3>
        <p>
          Enter a patient sequence and click <em>Run Tree Diff Analysis</em> to
          begin.
        </p>
      </div>
    );
  }
  const verdictClass = result.isHealthy ? "healthy" : "abnormal";
  const tabs = ["sequence", "tree", "medical"];
  const tabLabels = {
    sequence: "Sequence View",
    tree: "Tree View",
    medical: "Medical Report",
  };

  return (
    <div>
      {/* Verdict Banner */}
      <div className={"verdict-banner " + verdictClass}>
        <div className="verdict-icon">{result.isHealthy ? "✓" : "✗"}</div>
        <div className="verdict-text">
          <div className="verdict-status">
            {result.isHealthy ? "PATIENT HEALTHY" : "PATIENT ABNORMAL"}
          </div>
          <div className="verdict-disease">
            {result.isHealthy
              ? "No anomalies detected"
              : "⚠ " + result.detectedDisease}
          </div>
        </div>
        <div className="verdict-similarity">
          {result.stats.similarityPercent.toFixed(1)}%
        </div>
      </div>

      {/* Stats */}
      <div className="stats-row">
        <div className="stat-card match">
          <span className="stat-num">{result.stats.matchCount}</span>
          <span className="stat-lbl">Matches</span>
        </div>
        <div className="stat-card mutated">
          <span className="stat-num">{result.stats.mutationCount}</span>
          <span className="stat-lbl">Mutations</span>
        </div>
        <div className="stat-card missing">
          <span className="stat-num">{result.stats.missingCount}</span>
          <span className="stat-lbl">Missing</span>
        </div>
        <div className="stat-card extra">
          <span className="stat-num">{result.stats.extraCount}</span>
          <span className="stat-lbl">Extra</span>
        </div>
        <div className="stat-card edit">
          <span className="stat-num">{result.stats.editDistance}</span>
          <span className="stat-lbl">Edit Dist.</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="tab-bar">
        {tabs.map((t) => (
          <button
            key={t}
            className={"tab-btn" + (activeTab === t ? " active" : "")}
            onClick={() => setActiveTab(t)}
          >
            {tabLabels[t]}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "sequence" && (
        <SequenceView entries={result.diffEntries} />
      )}
      {activeTab === "tree" && (
        <TreeView refTree={result.referenceTree} patTree={result.patientTree} />
      )}
      {activeTab === "medical" && <MedicalReport result={result} />}
    </div>
  );
}

function App() {
  const [diseases, setDiseases] = useState([]);
  const [selectedDisease, setSelected] = useState("");
  const [refSeq, setRefSeq] = useState("");
  const [patientId, setPatientId] = useState("PT-2026-001");
  const [patientSeq, setPatientSeq] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    fetch(API_BASE + "api/diseases")
      .then((r) => r.json())
      .then((data) => setDiseases(data))
      .catch(() => {
        setDiseases([
          {
            id: "SICKLE_CELL",
            name: "Sickle Cell Anemia",
            gene: "HBB (Beta-Globin)",
            mutationType: "Point Substitution",
            referenceSequence:
              "ATGGTGCATCTGACTCCTGAGGAGAAGTCTGCCGTTACTGCCCTGTGGGGCAAGGTGAACGTGGATGAAGTTGGTGGTGAGGCCCTGGGCAG",
            mutantSequence:
              "ATGGTGCATCTGACTCCTGTGGAGAAGTCTGCCGTTACTGCCCTGTGGGGCAAGGTGAACGTGGATGAAGTTGGTGGTGAGGCCCTGGGCAG",
          },
          {
            id: "CYSTIC_FIBROSIS",
            name: "Cystic Fibrosis",
            gene: "CFTR",
            mutationType: "Deletion",
            referenceSequence:
              "ATCATTTTTTTAATGGAAAAGATAATGATAACAAGCTTCAGCTTTTTTTTCCTTTACTTGTATTTTTTCACGAAATATAAAGTATCATTTTTTTAATGG",
            mutantSequence:
              "ATCATTTTTTTAATGGAAAAGATAATGATAACAAGCTTCAGCTTTTTTTTCCTTTACTTGTTTTTTTCACGAAATATAAAGTATCATTTTTTTAATGG",
          },
          {
            id: "PKU",
            name: "Phenylketonuria (PKU)",
            gene: "PAH",
            mutationType: "Point Substitution",
            referenceSequence:
              "ATGGCTTCTCCCAAAGAAATACGTGGGGTCCTTGTTGGTTGGAAAGCCGTGCAGCCAGAAGATACTTTCCAACGTATGTCCCGGCGGCCAGCCTGAAGG",
            mutantSequence:
              "ATGGCTTCTCCCAAAGAAATACGTGGGGTCCTTGTTGGTTGGAAAGCCGTGCAGCCAGAAGATACTTTCCAATGTATGTCCCGGCGGCCAGCCTGAAGG",
          },
          {
            id: "HUNTINGTONS",
            name: "Huntington's Disease",
            gene: "HTT (Huntingtin)",
            mutationType: "Trinucleotide Expansion",
            referenceSequence:
              "ATGCAGCAGCAGCAGCAGCAGCAGCAGCAGCAGCAGCAGCAGCAGCAGCAGCAGCAGCAGCAGCAAGCTGGAGCCGCAGCAGCAGCAGCAGCC",
            mutantSequence:
              "ATGCAGCAGCAGCAGCAGCAGCAGCAGCAGCAGCAGCAGCAGCAGCAGCAGCAGCAGCAGCAGCAGCAGCAGCAGCAGCAGCAGCAAGCTGGAGCC",
          },
          {
            id: "THALASSEMIA",
            name: "Beta-Thalassemia",
            gene: "HBB (Beta-Globin)",
            mutationType: "Nonsense Substitution",
            referenceSequence:
              "ATGGTGCATCTGACTCCTGAGGAGAAGTCTGCCGTTACTGCCCTGTGGGGCAAGGTGAACGTGGATGAAGTTGGTGGTGAGGCCCTGGGCAGGTTGGTATCAAGGTTACAAGACAGGTTTAAGGAGACC",
            mutantSequence:
              "ATGGTGCATCTGACTCCTAAGCAGAAGTCTGCCGTTACTGCCCTGTGGGGCAAGGTGAACGTGGATGAAGTTGGTGGTGAGGCCCTGGGCAGGTTGGTATCAAGGTTACAAGACAGGTTTAAGGAGACC",
          },
        ]);
      });
  }, []);

  function onDiseaseChange(id) {
    setSelected(id);
    const d = diseases.find((x) => x.id === id);
    setRefSeq(d ? d.referenceSequence : "");
  }

  function loadPreset(type) {
    const d = diseases.find((x) => x.id === selectedDisease);
    if (!d) {
      alert("Please select a disease profile first.");
      return;
    }
    if (type === "healthy") setPatientSeq(d.referenceSequence);
    if (type === "mutant") setPatientSeq(d.mutantSequence);
    if (type === "partial")
      setPatientSeq(
        d.referenceSequence.slice(
          0,
          Math.floor(d.referenceSequence.length / 2),
        ) + d.mutantSequence.slice(Math.floor(d.mutantSequence.length / 2)),
      );
  }

  async function analyze() {
    if (!patientSeq.trim()) {
      alert("Please enter a patient sequence.");
      return;
    }
    if (!selectedDisease) {
      alert("Please select a disease profile.");
      return;
    }
    setLoading(true);
    try {
      const form = new FormData();
      form.append("patientId", patientId || "PT-001");
      form.append("patientSequence", patientSeq);
      form.append("diseaseId", selectedDisease);
      let data;
      try {
        const resp = await fetch(API_BASE + "api/analyze", {
          method: "POST",
          body: form,
        });
        data = await resp.json();
        if (data.error) throw new Error(data.error);
      } catch {
        const d = diseases.find((x) => x.id === selectedDisease);
        data = runLocalDiff(
          patientId || "PT-001",
          patientSeq,
          d ? d.referenceSequence : "",
          selectedDisease,
          diseases,
        );
      }
      if (data.referenceTree && data.patientTree && data.diffEntries) {
        annotateTreeFromEntries(data.referenceTree, data.diffEntries);
        annotateTreeFromEntries(data.patientTree, data.diffEntries);
      }
      setResult(data);
    } catch (e) {
      alert("Analysis failed: " + e.message);
    } finally {
      setLoading(false);
    }
  }

  function annotateTreeFromEntries(node, entries) {
    if (node.type === "BASE") {
      const e = entries[node.position];
      if (e) node.diffState = e.state;
    }
    if (node.children) {
      node.children.forEach((c) => annotateTreeFromEntries(c, entries));
      if (node.type === "CODON") {
        node.hasDiff = node.children.some(
          (c) => c.diffState && c.diffState !== "MATCH",
        );
      }
    }
  }

  const selectedDiseaseObj = diseases.find((d) => d.id === selectedDisease);

  return (
    <>
      {}
      <header className="app-header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-helix">⌬</span>
            <div>
              <span className="logo-title">GeneDiff</span>
              <span className="logo-sub">Genetic Tree Diff Analyzer</span>
            </div>
          </div>
          <nav className="header-nav">
            <span className="nav-tag">DSA Project</span>
            <span className="nav-sep">|</span>
            <span className="nav-tag">Tree Diffing Algorithm</span>
          </nav>
        </div>
      </header>

      {}
      <main className="app-main">
        {}
        <section className="panel panel-input">
          <h2 className="panel-title">Patient Analysis Input</h2>

          <div className="form-group">
            <label className="form-label">Patient ID</label>
            <input
              className="form-input"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              placeholder="e.g., PT-2026-001"
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Select Reference Gene (Disease Profile)
            </label>
            <select
              className="form-select"
              value={selectedDisease}
              onChange={(e) => onDiseaseChange(e.target.value)}
            >
              <option value="">— Select Disease Profile —</option>
              {diseases.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} [{d.gene}]
                </option>
              ))}
            </select>
            <div className="select-info">
              {selectedDiseaseObj ? (
                <>
                  <strong>{selectedDiseaseObj.gene}</strong> — Mutation:{" "}
                  <em>{selectedDiseaseObj.mutationType}</em>
                </>
              ) : (
                "Select a disease to load its reference sequence"
              )}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              Reference Sequence <span className="label-badge">Healthy</span>
            </label>
            <textarea
              className="form-textarea seq-textarea ref-seq"
              rows={4}
              readOnly
              value={refSeq}
              placeholder="Reference sequence will load automatically..."
            />
          </div>

          <div className="divider-or">
            <span>PATIENT INPUT</span>
          </div>

          <div className="form-group">
            <label className="form-label">
              Patient Gene Sequence{" "}
              <span className="label-badge patient">Patient</span>
            </label>
            <textarea
              className="form-textarea seq-textarea patient-seq"
              rows={4}
              value={patientSeq}
              onChange={(e) => setPatientSeq(e.target.value)}
              placeholder="Enter patient sequence (A, T, G, C only)..."
            />
          </div>

          <div className="preset-bar">
            <span className="preset-label">Quick test:</span>
            <button
              className="preset-btn healthy"
              onClick={() => loadPreset("healthy")}
            >
              ✓ Healthy
            </button>
            <button
              className="preset-btn mutant"
              onClick={() => loadPreset("mutant")}
            >
              ✗ Mutant
            </button>
            <button
              className="preset-btn partial"
              onClick={() => loadPreset("partial")}
            >
              ~ Partial
            </button>
          </div>

          <button className="analyze-btn" onClick={analyze}>
            <span className="btn-icon">⟶</span>
            <span>Run Tree Diff Analysis</span>
          </button>
        </section>

        {}
        <section className="panel panel-results">
          <ResultsPanel result={result} />
        </section>
      </main>

      {}
      <div className={"loading-overlay" + (loading ? " active" : "")}>
        <div className="loading-box">
          <div className="dna-spinner">
            <span>A</span>
            <span>T</span>
            <span>G</span>
            <span>C</span>
          </div>
          <div className="loading-text">Running Tree Diff Algorithm...</div>
        </div>
      </div>
    </>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
