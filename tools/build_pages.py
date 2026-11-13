#!/usr/bin/env python3
"""Assemble the CE4CSID Toolkit v2 static pages from shared parts.

Run from the repo root:  python3 tools/build_pages.py  (or npm run build:pages)
Only requires the Python standard library.
"""
import os

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.normpath(os.path.join(HERE, ".."))
BASE = "https://sunji-droid.github.io/ce4csid-toolkit-v2"
REPO = "https://github.com/sunji-droid/ce4csid-toolkit-v2"

# Official CSID Network artwork from the Identity Guidelines logo pack.
# See assets/images/LOGO-SOURCE.md. Do not recolour or redraw the globe mark.
LOGO_HEADER = '''<img class="brand-logo" src="assets/images/logo.svg" alt="" width="760" height="212">'''
LOGO_FOOTER = '''<img class="brand-logo" src="assets/images/logo-white.svg" alt="" width="760" height="212">'''

NAV = [
    ("index.html", "Home", ""),
    ("about.html", "About", ""),
    ("resources.html", "Resources", ""),
    ("downloads.html", "Downloads", ""),
    ("checklist.html", "Checklist", ""),
    ("contact.html", "Contact", "nav-cta"),
]


def head(title, desc, page):
    url = BASE + "/" + ("" if page == "index.html" else page)
    return f'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{title}</title>
<meta name="description" content="{desc}">
<link rel="canonical" href="{url}">
<meta name="theme-color" content="#044953">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{desc}">
<meta property="og:type" content="website">
<meta property="og:url" content="{url}">
<meta property="og:image" content="{BASE}/assets/images/og-image.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="assets/images/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="assets/images/apple-touch-icon.png">
<link rel="preload" href="assets/fonts/inter-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="assets/fonts/inter-tight-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
<a href="#main" class="skip-link">Skip to content</a>
'''


def header(active):
    links = []
    for page, label, extra in NAV:
        cls = (extra + " ").strip()
        cur = ' aria-current="page"' if page == active else ""
        clsattr = f' class="{cls}"' if cls else ""
        links.append(f'        <li><a href="{page}" data-page="{page}"{clsattr}{cur}>{label}</a></li>')
    links_html = "\n".join(links)
    return f'''<header class="site-header" role="banner">
  <div class="container">
    <a href="index.html" class="brand" aria-label="CSID Network, CE4CSID Community Engagement Toolkit home">
      {LOGO_HEADER}
      <span class="brand-text">CE4CSID<span>Community Engagement Toolkit</span></span>
    </a>
    <button class="nav-toggle" aria-expanded="false" aria-controls="primary-navigation" aria-label="Toggle navigation menu">
      <span></span>
    </button>
    <nav class="primary-nav" id="primary-navigation" aria-label="Primary">
      <ul>
{links_html}
      </ul>
    </nav>
  </div>
</header>
'''


FOOTER = f'''<footer class="site-footer" role="contentinfo">
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <a href="index.html" class="brand" aria-label="CSID Network, CE4CSID Community Engagement Toolkit home">
          {LOGO_FOOTER}
          <span class="brand-text">CE4CSID<span>Community Engagement Toolkit</span></span>
        </a>
        <p>Practical resources and guidance for integrating community engagement into Climate Sensitive Infectious Disease research, developed by the CE4CSID Working Group.</p>
      </div>
      <div class="footer-col">
        <h3>Toolkit</h3>
        <ul>
          <li><a href="resources.html">Toolkit Resources</a></li>
          <li><a href="downloads.html">Downloads</a></li>
          <li><a href="checklist.html">Engagement Checklist</a></li>
          <li><a href="about.html">About CE4CSID</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h3>Contact</h3>
        <ul>
          <li><a href="mailto:wg-ce4csid@csidnet.org">wg-ce4csid@csidnet.org</a></li>
          <li><a href="contact.html">Contact form</a></li>
          <li><a href="{REPO}" target="_blank" rel="noopener">Project on GitHub</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span>&copy; <span data-current-year>2026</span> CSID Network / CE4CSID Working Group.</span>
      <span>Built by Kabo Merapelo Onamile</span>
    </div>
  </div>
</footer>
'''


def page(name, title, desc, body, scripts=("main.js",)):
    html = head(title, desc, name) + header(name) + '\n<main id="main">\n' + body + "\n</main>\n\n" + FOOTER + "\n"
    for s in scripts:
        html += f'<script type="module" src="assets/js/{s}"></script>\n'
    html += "</body>\n</html>\n"
    with open(os.path.join(ROOT, name), "w") as f:
        f.write(html)
    print("wrote", name)


# ---------------------------------------------------------------- INDEX
index_body = '''
<section class="hero texture-topo">
  <div class="hero-blob hero-blob-lime" aria-hidden="true"></div>
  <div class="hero-blob hero-blob-blue" aria-hidden="true"></div>
  <div class="container">
    <span class="eyebrow">CE4CSID Working Group</span>
    <h1>Community engagement, built into CSID research <em>from the start</em>.</h1>
    <p class="hero-lede">Climate Sensitive Infectious Disease research is often run at a high scientific level, without the communities who face its direct impact. This toolkit gives researchers resources and guidance for including communities from project design through to evaluation. All resources are free to use.</p>
    <div class="hero-actions">
      <a href="resources.html" class="btn btn-primary">Browse the toolkit resources</a>
      <a href="checklist.html" class="btn btn-secondary">Open the engagement checklist</a>
    </div>
    <div class="hero-stats">
      <div class="reveal">
        <span class="stat-num">5</span>
        <span class="stat-label">Planning stages covered, design to evaluation</span>
      </div>
      <div class="reveal">
        <span class="stat-num">20</span>
        <span class="stat-label">Practical actions in the interactive checklist</span>
      </div>
      <div class="reveal">
        <span class="stat-num">8</span>
        <span class="stat-label">Downloadable resources, frameworks, and templates</span>
      </div>
    </div>
  </div>
</section>

<section class="section section-white">
  <div class="container">
    <div class="section-head center reveal">
      <span class="pill-tag">Why this exists</span>
      <h2>Research shapes communities. Communities should shape research.</h2>
      <p>Involving communities from the earliest stages of project design helps shape interventions that benefit CSID professionals and the people affected by them. This applies whether the initiative involves research, policy, or digital tools.</p>
    </div>
    <div class="grid grid-3">
      <div class="card reveal">
        <div class="card-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 2v20M2 12h20"/></svg>
        </div>
        <h3>Better science</h3>
        <p>Communities often see risks, patterns, and practical barriers that a purely scientific lens misses. Engagement closes that gap early, when it is cheapest to act on.</p>
      </div>
      <div class="card reveal">
        <div class="card-icon icon-blue">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/></svg>
        </div>
        <h3>Stronger trust</h3>
        <p>CSID research often returns to the same communities over time. Genuine engagement protects that relationship for the studies that come after this one.</p>
      </div>
      <div class="card reveal">
        <div class="card-icon icon-purple">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 12l6 6L20 6"/></svg>
        </div>
        <h3>Fewer blind spots</h3>
        <p>Interventions designed without community input tend to underperform in the field. Early engagement surfaces the constraints that matter before they cause failure.</p>
      </div>
    </div>
  </div>
</section>

<section class="section on-dark texture-topo">
  <div class="container">
    <div class="two-col">
      <div class="reveal">
        <span class="pill-tag">How the toolkit is organised</span>
        <h2>Six parts. Sixteen chapters. One interactive checklist.</h2>
        <p style="margin-top:14px;">The toolkit is organised into six parts and sixteen chapters, from foundations and co-design through to policy, learning, and practical lessons. The interactive Community Engagement Checklist sits alongside the chapters, and the resource library links the current downloadable files.</p>
        <div class="hero-actions" style="margin-top:30px;">
          <a href="resources.html#toolkit-outline" class="btn btn-lime">See toolkit structure</a>
          <a href="about.html" class="btn btn-secondary">Read about CE4CSID</a>
        </div>
      </div>
      <div class="card reveal">
        <h3>In this toolkit</h3>
        <ul class="numbered-steps" style="margin-top:14px;">
          <li><div><h4>Foundations of Community Engagement</h4><p>Introduce the toolkit, understand communities and their contexts, and agree principles for meaningful engagement.</p></div></li>
          <li><div><h4>Planning and Co-Design</h4><p>Build engagement into project design, communicate participatively, and choose methods, activities, and tools.</p></div></li>
          <li><div><h4>Responsible and Inclusive Engagement</h4><p>Cover ethics and inclusion, environmental considerations, and responsible data management and use.</p></div></li>
          <li><div><h4>Communication and Knowledge Translation</h4><p>Communicate CSID data and evidence, address risk and trust, and share findings with community feedback.</p></div></li>
          <li><div><h4>Policy Engagement, Monitoring and Sustainability</h4><p>Move from research to policy and practice, and monitor, evaluate, learn, and sustain engagement.</p></div></li>
          <li><div><h4>Practical Application and Lessons Learned</h4><p>Use the implementation checklist and capture piloting experiences and lessons learned.</p></div></li>
        </ul>
      </div>
    </div>
  </div>
</section>

<section class="section section-neutral">
  <div class="container">
    <div class="section-head center reveal">
      <span class="pill-tag pill-blue">Resource library</span>
      <h2>Start with what your project needs now.</h2>
    </div>
    <div class="grid grid-4">
      <a class="card cat-card cat-lime reveal" href="resources.html?category=planning-guidance">
        <h3>Planning Guidance</h3>
        <p>Build engagement into your study from the earliest design decisions.</p>
        <span class="cat-cta">Browse category &rarr;</span>
      </a>
      <a class="card cat-card cat-blue reveal" href="resources.html?category=engagement-frameworks">
        <h3>Engagement Frameworks</h3>
        <p>Map who to engage and choose the right channels to reach them.</p>
        <span class="cat-cta">Browse category &rarr;</span>
      </a>
      <a class="card cat-card cat-purple reveal" href="resources.html?category=case-examples">
        <h3>Case Examples</h3>
        <p>See engagement practice in real CSID contexts, strengths and gaps.</p>
        <span class="cat-cta">Browse category &rarr;</span>
      </a>
      <a class="card cat-card cat-yellow reveal" href="resources.html?category=templates">
        <h3>Templates</h3>
        <p>Ready to adapt Word documents for planning and consent materials.</p>
        <span class="cat-cta">Browse category &rarr;</span>
      </a>
    </div>
  </div>
</section>

<section class="section section-white">
  <div class="container">
    <div class="checklist-shell reveal" style="max-width:840px; margin:0 auto;">
      <div class="checklist-toolbar">
        <div class="progress-block">
          <div class="progress-label">
            <span id="teaser-label">Community Engagement Checklist</span>
            <strong>Plan it properly</strong>
          </div>
          <div class="progress-track"><div class="progress-fill" id="teaser-fill"></div></div>
        </div>
        <div class="checklist-toolbar-actions">
          <a href="checklist.html" class="btn btn-lime btn-sm" id="teaser-btn">Open the checklist</a>
        </div>
      </div>
      <div style="padding:28px 30px;">
        <p style="color:var(--ink-soft);">Work through five planning stages at your own pace. Tick off actions as your team completes them, add notes against each item, and export a printable record for your project file. Progress is saved automatically on this device. You can also back it up or move it between devices.</p>
      </div>
    </div>
  </div>
</section>

<section class="section on-dark texture-topo cta-band">
  <div class="container reveal">
    <span class="pill-tag">Next steps</span>
    <h2>Plan community engagement into your next CSID project.</h2>
    <p>All resources are free to use and designed for real project timelines and budgets.</p>
    <div class="hero-actions" style="justify-content:center;">
      <a href="checklist.html" class="btn btn-lime">Open the checklist</a>
      <a href="contact.html" class="btn btn-secondary">Contact the team</a>
    </div>
  </div>
</section>

<script type="module">
import { ACTION_COUNT } from "./assets/js/checklist-data.js";
import { isRecord } from "./assets/js/util.js";
try {
  const raw = window.localStorage.getItem("ce4csid_checklist_v2");
  if (raw) {
    const saved = JSON.parse(raw);
    let done = 0;
    if (isRecord(saved) && isRecord(saved.items)) {
      for (const value of Object.values(saved.items)) {
        if (isRecord(value) && value.checked === true) done++;
      }
    }
    const total = ACTION_COUNT;
    const pct = Math.round((done / total) * 100);
    const fill = document.getElementById("teaser-fill");
    const label = document.getElementById("teaser-label");
    const btn = document.getElementById("teaser-btn");
    if (fill) fill.style.width = pct + "%";
    if (label && done) label.textContent = done + " of " + total + " actions complete on this device";
    if (btn && done) btn.textContent = "Continue the checklist";
  }
} catch { /* storage unavailable */ }
</script>
'''

page("index.html",
     "CE4CSID Community Engagement Toolkit",
     "Practical resources and guidelines for integrating community engagement into Climate Sensitive Infectious Disease research, developed by the CE4CSID Working Group.",
     index_body)

# ---------------------------------------------------------------- ABOUT
about_body = '''
<section class="hero hero-compact texture-topo">
  <div class="hero-blob hero-blob-lime" aria-hidden="true"></div>
  <div class="container">
    <span class="eyebrow">About the toolkit</span>
    <h1>Who we are, and who this toolkit is built for.</h1>
    <p class="hero-lede">The CE4CSID Working Group brings together researchers and practitioners working on Climate Sensitive Infectious Disease. Community involvement should shape a project from its earliest stages, not only its final reporting.</p>
  </div>
</section>

<section class="section section-white">
  <div class="container">
    <div class="two-col">
      <div class="reveal">
        <span class="pill-tag">The working group</span>
        <h2>Practical guidance, grounded in real CSID work.</h2>
        <p style="color:var(--ink-soft); margin-top:16px;">The CE4CSID Working Group has been developing a set of practical resources and guidelines that researchers can use to plan and integrate community engagement into their CSID research programmes. Climate Sensitive Infectious Disease sits at the intersection of environmental change and health, and its impact is felt first and most directly by the communities living with that change.</p>
        <p style="color:var(--ink-soft); margin-top:16px;">Many CSID initiatives are run at a high scientific level and do not include the communities who face the direct impact of CSID. This toolkit helps close that gap with resources designed for real project timelines and budgets.</p>
      </div>
      <div class="callout callout-lime reveal">
        <strong>Summary:</strong> involving communities from the earliest stages of project design helps shape interventions that benefit CSID professionals and community members. This applies whether the initiative involves research, policy, or digital tools.
      </div>
    </div>
  </div>
</section>

<section class="section on-dark texture-topo">
  <div class="container">
    <div class="section-head center reveal">
      <span class="pill-tag">Who this toolkit is for</span>
      <h2>Built for the people planning and running CSID work.</h2>
    </div>
    <div class="grid grid-3">
      <div class="card reveal">
        <div class="card-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M9 21h6M12 3a6 6 0 0 0-4 10.5c.6.5 1 1.3 1 2.1V17h6v-1.4c0-.8.4-1.6 1-2.1A6 6 0 0 0 12 3z"/></svg>
        </div>
        <h3>Researchers</h3>
        <p>Designing and running CSID studies who want engagement built into the methodology, not bolted on afterwards.</p>
      </div>
      <div class="card reveal">
        <div class="card-icon icon-blue">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 21h18M5 21V7l7-4 7 4v14M9 9h1M14 9h1M9 13h1M14 13h1"/></svg>
        </div>
        <h3>Programme implementers</h3>
        <p>Turning research findings into interventions, tools, or services that communities are expected to adopt and trust.</p>
      </div>
      <div class="card reveal">
        <div class="card-icon icon-purple">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 4h16v12H7l-3 3V4z"/></svg>
        </div>
        <h3>Policy makers</h3>
        <p>Shaping CSID related policy who need a credible record of community perspective behind their decisions.</p>
      </div>
    </div>
  </div>
</section>

<section class="section section-neutral">
  <div class="container">
    <div class="section-head center reveal">
      <span class="pill-tag pill-blue">How to use this site</span>
      <h2>Start wherever your project is right now.</h2>
      <p>Whether you are at the earliest design stage or already in the field, the toolkit meets you where you are.</p>
    </div>
    <ol class="numbered-steps reveal" style="max-width:780px; margin:0 auto;">
      <li><div><h4>Read the Toolkit Structure</h4><p>Start with the six-part outline if you are still shaping the project, or jump to the chapter that matches your current stage.</p></div></li>
      <li><div><h4>Download what your team needs</h4><p>Every resource and template is available on the Downloads page, ready to adapt to your specific study.</p></div></li>
      <li><div><h4>Work through the Checklist</h4><p>Use the interactive checklist to track engagement actions stage by stage, with notes and a printable export for your project file.</p></div></li>
      <li><div><h4>Reach out with questions</h4><p>Contact the CE4CSID Working Group or the toolkit builder if you need guidance specific to your project context.</p></div></li>
    </ol>
    <div style="text-align:center; margin-top:44px;">
      <a href="resources.html" class="btn btn-primary">Go to Toolkit Resources</a>
    </div>
  </div>
</section>
'''

page("about.html",
     "About | CE4CSID Community Engagement Toolkit",
     "Learn about the CE4CSID Working Group, the purpose of this toolkit, and who it is built for.",
     about_body)

# ---------------------------------------------------------------- RESOURCES
# ---------------------------------------------------------------- RESOURCES
# Structure from the CE4CSID Toolkit Structure Guide (six parts, sixteen chapters).
# Each chapter is a stable space for the Working Group's final content.
TOOLKIT_PARTS = [
    {
        "id": "part-1",
        "label": "Part I",
        "title": "Foundations of Community Engagement",
        "chapters": [
            {"n": 1, "title": "Introduction to the CE4CSID Toolkit", "links": [("About the toolkit", "about.html"), ("All downloads", "downloads.html")]},
            {"n": 2, "title": "Understanding Communities and Their Contexts", "links": [("Stakeholder Mapping Framework", "downloads/framework-stakeholder-mapping.pdf")]},
            {"n": 3, "title": "Principles of Meaningful Community Engagement", "links": [("Community Entry Protocol", "downloads/planning-guidance-community-entry-protocol.pdf")]},
        ],
    },
    {
        "id": "part-2",
        "label": "Part II",
        "title": "Planning and Co-Design",
        "chapters": [
            {"n": 4, "title": "Community Engagement Planning and Project Design", "links": [("Engaging Communities from Project Design", "downloads/planning-guidance-engaging-from-design.pdf"), ("Engagement Plan Template", "downloads/template-engagement-plan.docx")]},
            {"n": 5, "title": "Participatory Communication and Co-Design", "links": [("Engagement Channel Selection Framework", "downloads/framework-engagement-channel-selection.pdf")]},
            {"n": 6, "title": "Community Engagement Methods, Activities and Tools", "links": [("Engagement Channel Selection Framework", "downloads/framework-engagement-channel-selection.pdf"), ("Engagement Plan Template", "downloads/template-engagement-plan.docx")]},
        ],
    },
    {
        "id": "part-3",
        "label": "Part III",
        "title": "Responsible and Inclusive Engagement",
        "chapters": [
            {"n": 7, "title": "Ethical and Inclusive Community Engagement", "links": [("Consent and Briefing Note Template", "downloads/template-consent-briefing-note.docx"), ("Community Entry Protocol", "downloads/planning-guidance-community-entry-protocol.pdf")]},
            {"n": 8, "title": "Environmental Considerations", "links": []},
            {"n": 9, "title": "Responsible Data Management and Use", "links": [("Consent and Briefing Note Template", "downloads/template-consent-briefing-note.docx")]},
        ],
    },
    {
        "id": "part-4",
        "label": "Part IV",
        "title": "Communication and Knowledge Translation",
        "chapters": [
            {"n": 10, "title": "Communicating CSID Data and Scientific Evidence", "links": []},
            {"n": 11, "title": "Risk Communication, Misinformation and Trust", "links": [("Engagement Channel Selection Framework", "downloads/framework-engagement-channel-selection.pdf")]},
            {"n": 12, "title": "Communicating Research Findings and Facilitating Community Feedback", "links": [("Engagement Plan Template", "downloads/template-engagement-plan.docx")]},
        ],
    },
    {
        "id": "part-5",
        "label": "Part V",
        "title": "Policy Engagement, Monitoring and Sustainability",
        "chapters": [
            {"n": 13, "title": "From Research to Policy and Practice", "links": []},
            {"n": 14, "title": "Monitoring, Evaluation, Learning and Sustainability", "links": [("Implementation checklist", "checklist.html")]},
        ],
    },
    {
        "id": "part-6",
        "label": "Part VI",
        "title": "Practical Application and Lessons Learned",
        "chapters": [
            {"n": 15, "title": "CE4CSID Implementation Checklist", "links": [("Open the implementation checklist", "checklist.html")]},
            {"n": 16, "title": "Piloting the Toolkit: Experiences and Lessons Learned", "links": [("Flood response case example", "downloads/case-example-flood-response.pdf"), ("Vector control case example", "downloads/case-example-vector-control.pdf")]},
        ],
    },
]


def toolkit_link_html(label, href):
    download = " download" if href.startswith("downloads/") else ""
    return f'<a class="btn btn-ghost btn-sm chapter-link" href="{href}"{download}>{label}</a>'


outline_cards = []
parts_html = []
for part in TOOLKIT_PARTS:
    toc = "".join(
        f'<li><a href="#chapter-{ch["n"]}">{ch["n"]}. {ch["title"]}</a></li>'
        for ch in part["chapters"]
    )
    outline_cards.append(
        f'<div class="card toolkit-part-card reveal">'
        f'<span class="pill-tag">{part["label"]}</span>'
        f'<h3><a href="#{part["id"]}">{part["title"]}</a></h3>'
        f'<ol class="toolkit-toc">{toc}</ol>'
        f"</div>"
    )
    chapters_html = []
    for ch in part["chapters"]:
        links = "".join(toolkit_link_html(label, href) for label, href in ch["links"])
        links_html = f'<div class="chapter-links">{links}</div>' if links else ""
        chapters_html.append(
            f'<article class="toolkit-chapter reveal" id="chapter-{ch["n"]}" data-chapter="{ch["n"]}" aria-labelledby="chapter-{ch["n"]}-title">'
            f'<div class="chapter-head"><span class="chapter-num" aria-hidden="true">{ch["n"]}</span>'
            f'<h3 id="chapter-{ch["n"]}-title">{ch["title"]}</h3></div>'
            f'<div class="chapter-content"><p class="chapter-placeholder">This chapter will contain the final Working Group content.</p></div>'
            f"{links_html}"
            f"</article>"
        )
    parts_html.append(
        f'<section class="toolkit-part" id="{part["id"]}" aria-labelledby="{part["id"]}-title">'
        f'<div class="toolkit-part-head reveal"><span class="pill-tag">{part["label"]}</span>'
        f'<h2 id="{part["id"]}-title">{part["title"]}</h2></div>'
        f'<div class="toolkit-chapters">{"".join(chapters_html)}</div>'
        f"</section>"
    )

structure_outline = "".join(outline_cards)
structure_parts = "".join(parts_html)

resources_body = f'''
<section class="hero hero-compact texture-topo">
  <div class="hero-blob hero-blob-lime" aria-hidden="true"></div>
  <div class="container">
    <span class="eyebrow">Toolkit structure and resources</span>
    <h1>The toolkit, organised chapter by chapter.</h1>
    <p class="hero-lede">The toolkit follows the CE4CSID Working Group's six-part structure below. Each chapter has a place for final content. Current placeholder resources are linked where they fit, and the searchable resource library is below.</p>
  </div>
</section>

<section class="section section-white" id="toolkit-outline">
  <div class="container">
    <div class="section-head center reveal">
      <span class="pill-tag">Toolkit structure</span>
      <h2>Six parts, sixteen chapters.</h2>
      <p>Use this outline as the map for the toolkit. Final chapter content can be added into the matching space without changing the page layout or links.</p>
    </div>
    <div class="toolkit-outline-grid">
      {structure_outline}
    </div>
  </div>
</section>

<section class="section section-neutral">
  <div class="container">
    {structure_parts}
  </div>
</section>

<section class="section section-white" id="resource-library">
  <div class="container">
    <div class="section-head reveal">
      <span class="pill-tag pill-blue">Resource library</span>
      <h2>Search the current downloadable resources.</h2>
      <p>Search across the whole library, or filter by category to find what fits your project's current stage.</p>
    </div>

    <div class="resource-toolbar reveal">
      <div class="search-wrap">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
        <label class="sr-only" for="resource-search">Search toolkit resources</label>
        <input type="search" id="resource-search" class="search-input" placeholder="Search resources, e.g. consent, stakeholders, flood" autocomplete="off">
        <button type="button" id="search-clear" class="search-clear" aria-label="Clear search">&times;</button>
      </div>
      <div class="filter-row" role="group" aria-label="Filter resources by category">
        <button type="button" class="filter-pill" data-category="all" aria-pressed="true">All</button>
        <button type="button" class="filter-pill pill-lime" data-category="planning-guidance" aria-pressed="false">Planning Guidance</button>
        <button type="button" class="filter-pill pill-blue" data-category="engagement-frameworks" aria-pressed="false">Engagement Frameworks</button>
        <button type="button" class="filter-pill pill-purple" data-category="case-examples" aria-pressed="false">Case Examples</button>
        <button type="button" class="filter-pill pill-yellow" data-category="templates" aria-pressed="false">Templates</button>
      </div>
    </div>

    <p class="result-count" id="result-count" role="status" aria-live="polite"></p>
    <div id="resources-root"></div>

    <noscript>
      <div class="callout" style="margin-bottom:24px;">
        <strong>JavaScript is disabled.</strong> The interactive search and filters need JavaScript, but every file is still available on the <a href="downloads.html">Downloads page</a>.
      </div>
    </noscript>

  </div>
</section>

<section class="section on-dark texture-topo cta-band">
  <div class="container reveal">
    <span class="pill-tag">Missing something</span>
    <h2>Have toolkit content to contribute or a resource we should add?</h2>
    <p>If you are part of the CE4CSID Working Group with content ready to share, get in touch and it will be added to the matching chapter.</p>
    <a href="contact.html" class="btn btn-lime">Contact the toolkit team</a>
  </div>
</section>
'''

page("resources.html",
     "Toolkit Resources | CE4CSID Community Engagement Toolkit",
     "The CE4CSID toolkit structure: six parts and sixteen chapters, plus searchable resources, frameworks, case examples, and templates.",
     resources_body,
     scripts=("main.js", "resources.js"))

# ---------------------------------------------------------------- DOWNLOADS
downloads_body = '''
<section class="hero hero-compact texture-topo">
  <div class="hero-blob hero-blob-blue" aria-hidden="true"></div>
  <div class="container">
    <span class="eyebrow">Downloads</span>
    <h1>Every toolkit file, in one place.</h1>
    <p class="hero-lede">Download individual toolkit resources and templates, or download the complete set as a zip.</p>
  </div>
</section>

<section class="section section-neutral" style="padding-top:8px;">
  <div class="container">

    <div class="toolbar-row reveal">
      <div class="search-wrap">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
        <label class="sr-only" for="downloads-search">Filter downloads</label>
        <input type="search" id="downloads-search" class="search-input" placeholder="Filter files by name, category, or type..." autocomplete="off">
      </div>
      <a href="downloads/ce4csid-toolkit-all-resources.zip" class="btn btn-primary" download>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 3v12m0 0l-4-4m4 4l4-4M4 21h16"/></svg>
        Download all (.zip)
      </a>
    </div>

    <p class="result-count" id="downloads-count" role="status" aria-live="polite"></p>

    <div class="table-wrap reveal">
      <table class="downloads-table">
        <thead>
          <tr>
            <th scope="col">Resource</th>
            <th scope="col">Category</th>
            <th scope="col">Type</th>
            <th scope="col">Size</th>
            <th scope="col"><span class="sr-only">Download</span></th>
          </tr>
        </thead>
        <tbody id="downloads-tbody"></tbody>
      </table>
    </div>

    <noscript>
      <div class="callout" style="margin-top:20px;">
        <strong>JavaScript is disabled.</strong> Download the complete set with the zip button above, or browse the <a href="resources.html">Resources page</a>.
      </div>
    </noscript>

    <div class="callout callout-yellow" style="margin-top:32px;">
      <strong>About this content:</strong> the documents above are placeholder versions for the initial toolkit launch and are marked as such inside each file. The CE4CSID Working Group's final material will replace them when supplied. The download links and page structure will not change.
    </div>

  </div>
</section>
'''

page("downloads.html",
     "Downloads | CE4CSID Community Engagement Toolkit",
     "Every downloadable resource and template in the CE4CSID toolkit, listed in one place with file type and size, plus a complete zip.",
     downloads_body,
     scripts=("main.js", "downloads.js"))

# ---------------------------------------------------------------- CHECKLIST
checklist_body = '''
<section class="hero hero-compact texture-topo">
  <div class="hero-blob hero-blob-lime" aria-hidden="true"></div>
  <div class="container">
    <span class="eyebrow">Interactive Tool</span>
    <h1>Community Engagement Checklist</h1>
    <p class="hero-lede">Work through five planning stages, from initial project design to feedback and evaluation. Tick off each action as your team completes it, add notes, and export a clean printable record. Progress is saved automatically on this device.</p>
  </div>
</section>

<section class="section section-neutral" style="padding-top:8px;">
  <div class="container">

    <div class="checklist-shell reveal" style="max-width:920px; margin:0 auto;">
      <div class="checklist-toolbar">
        <div class="progress-block">
          <div class="progress-label">
            <span data-progress-count>Loading checklist...</span>
            <strong data-progress-pct>0%</strong>
          </div>
          <div class="progress-track"><div class="progress-fill"></div></div>
        </div>
        <div class="checklist-toolbar-actions no-print">
          <button type="button" class="btn btn-ghost btn-sm" data-action="reset-checklist">Reset</button>
          <button type="button" class="btn btn-lime btn-sm" data-action="print-checklist">Print or export PDF</button>
        </div>
      </div>

      <div class="checklist-project">
        <label for="project-name">Project name</label>
        <input type="text" id="project-name" placeholder="e.g. Malaria early-warning study, Chobe District" autocomplete="off">
      </div>

      <div id="checklist-root"></div>

      <div class="checklist-secondary-actions no-print">
        <button type="button" class="btn btn-ghost btn-sm" data-action="expand-all">Expand all</button>
        <button type="button" class="btn btn-ghost btn-sm" data-action="collapse-all">Collapse all</button>
        <button type="button" class="btn btn-ghost btn-sm" data-action="export-json">Export backup (.json)</button>
        <button type="button" class="btn btn-ghost btn-sm" data-action="import-json">Import backup</button>
        <input type="file" id="import-file" accept="application/json,.json" hidden>
      </div>

      <div class="checklist-footer no-print">
        <span>Progress and notes are saved automatically in this browser, on this device.</span>
        <span>Use Export backup to keep a copy or move to another device.</span>
      </div>
    </div>

    <div class="callout reveal" style="max-width:920px; margin:32px auto 0;">
      <strong>How saving works:</strong> your progress is stored locally in this browser using localStorage, so it is private to this device and browser. Clearing your browser data will also clear your checklist progress. Use <em>Print or export PDF</em> for a permanent project record, or <em>Export backup</em> to save a file you can restore later or open on another device.
    </div>

  </div>
</section>
'''

page("checklist.html",
     "Community Engagement Checklist | CE4CSID Toolkit",
     "An interactive, stage based planning checklist for integrating community engagement into a CSID research project, with notes, print export, and backup.",
     checklist_body,
     scripts=("main.js", "checklist.js"))

# ---------------------------------------------------------------- CONTACT
contact_body = '''
<section class="hero hero-compact texture-topo">
  <div class="hero-blob hero-blob-lime" aria-hidden="true"></div>
  <div class="container">
    <span class="eyebrow">Get in touch</span>
    <h1>Questions, feedback, or content to contribute.</h1>
    <p class="hero-lede">Reach out about the CE4CSID Community Engagement Toolkit, or send a message using the form below.</p>
  </div>
</section>

<section class="section section-white">
  <div class="container">
    <div class="two-col">

      <div class="reveal">
        <span class="pill-tag">Send a message</span>
        <h2 style="margin-bottom:22px;">Contact form</h2>
        <form id="contact-form" class="form-grid">
          <div class="form-field">
            <label for="name">Full name</label>
            <input type="text" id="name" name="name" required autocomplete="name">
          </div>
          <div class="form-field">
            <label for="email">Email address</label>
            <input type="email" id="email" name="email" required autocomplete="email">
          </div>
          <div class="form-field">
            <label for="organisation">Organisation (optional)</label>
            <input type="text" id="organisation" name="organisation" autocomplete="organization">
          </div>
          <div class="form-field">
            <label for="reason">Reason for contact</label>
            <select id="reason" name="reason">
              <option value="General question">General question</option>
              <option value="Toolkit content to contribute">Toolkit content to contribute</option>
              <option value="Feedback on a resource">Feedback on a resource</option>
              <option value="Report a broken link or bug">Report a broken link or bug</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div class="form-field">
            <label for="message">Message</label>
            <textarea id="message" name="message" rows="6" required></textarea>
          </div>
          <div>
            <button type="submit" class="btn btn-primary">Send message</button>
            <p id="form-status" class="form-note" role="status" aria-live="polite"></p>
          </div>
        </form>
      </div>

      <div class="reveal">
        <span class="pill-tag pill-blue">Direct contact</span>
        <h2 style="margin-bottom:22px;">Toolkit contact</h2>
        <div class="card" style="margin-bottom:18px;">
          <h3 style="font-size:1.05rem;">CE4CSID Working Group</h3>
          <p style="margin-top:8px;">Toolkit content and resources are developed by the CE4CSID Working Group. Use the form or the Working Group email for feedback and content suggestions.</p>
          <p style="margin-top:8px;">Email: <a href="mailto:wg-ce4csid@csidnet.org" style="font-weight:650;">wg-ce4csid@csidnet.org</a></p>
        </div>
        <div class="card" style="margin-bottom:18px;">
          <h3 style="font-size:1.05rem;">Toolkit development and maintenance</h3>
          <p style="margin-top:8px;">Kabo Merapelo Onamile, Digital Health Developer</p>
        </div>
        <div class="callout">
          <strong>Response times:</strong> the toolkit team aims to respond within a few working days. For urgent matters, please email directly rather than using the form.
        </div>
      </div>

    </div>
  </div>
</section>
'''

page("contact.html",
     "Contact | CE4CSID Community Engagement Toolkit",
     "Contact the CE4CSID toolkit team about the Community Engagement Toolkit.",
     contact_body,
     scripts=("main.js", "contact.js"))

# ---------------------------------------------------------------- 404
notfound_body = '''
<section class="hero error-hero texture-topo">
  <div class="hero-blob hero-blob-lime" aria-hidden="true"></div>
  <div class="container">
    <div class="error-code" aria-hidden="true">404</div>
    <h1 style="max-width:none;">Page not found.</h1>
    <p class="hero-lede" style="margin-left:auto; margin-right:auto;">The page you are looking for does not exist or may have moved. Use the links below to return to the toolkit.</p>
    <div class="hero-actions" style="justify-content:center;">
      <a href="index.html" class="btn btn-primary">Back to home</a>
      <a href="resources.html" class="btn btn-secondary">Browse resources</a>
    </div>
  </div>
</section>
'''

page("404.html",
     "Page not found | CE4CSID Community Engagement Toolkit",
     "The page you are looking for does not exist.",
     notfound_body)

print("All pages generated.")
