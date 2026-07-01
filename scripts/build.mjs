/* ============================================================================
   EAS website generator
   ----------------------------------------------------------------------------
   Source of truth for every page on the site. Edit the data/content below and
   run `node scripts/build.mjs` to regenerate the static .html files in the repo
   root. The generated HTML is committed, so the site works with no build step —
   you only need Node if you want to change content here and rebuild.
   ============================================================================ */

import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

/* ---------------------------------------------------------------------------
   Site-wide constants — change these to rebrand quickly.
--------------------------------------------------------------------------- */
const SITE = {
  name: "EAS",
  full: "EAS — Electrical Automation Staffing",
  tagline: "Manufacturing Direct Hire",
  domain: "https://eautomatedstaffing.com",
  phone: "(800) 555-0142",
  phoneHref: "tel:+18005550142",
  email: "recruiting@eautomatedstaffing.com",
  region: "Nationwide · United States & Canada",
};

/* Contact form delivery.
   The "Request Candidates" form posts to Formspree (works on any static host).
   1. Create a free form at https://formspree.io and point it at the inbox in
      SITE.email above.
   2. Replace `your-form-id` below with the ID Formspree gives you.
   3. Run `node scripts/build.mjs` and deploy.
   Until a real ID is set, the form stays in safe "demo" mode and just shows the
   on-page confirmation — it never looks broken. See README.md. */
const FORM = {
  // e.g. "https://formspree.io/f/abcdwxyz"
  endpoint: "https://formspree.io/f/your-form-id",
};

/* Curated Unsplash CDN photos (industrial / manufacturing).
   These load directly in the visitor's browser. Swap any `src` for your own
   photo URL or a local file in assets/img/ when you have your own photography. */
const IMG = {
  heroPlant: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1920&q=70",
  controlPanel: "https://images.unsplash.com/photo-1565514020179-026b92b84bb6?auto=format&fit=crop&w=1200&q=70",
  technician: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=70",
  robotArm: "https://images.unsplash.com/photo-1565043666747-69f6646db940?auto=format&fit=crop&w=1200&q=70",
  conveyor: "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&w=1200&q=70",
  welding: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&w=1200&q=70",
  plantWide: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1600&q=70",
  engineer: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=1200&q=70",
  wiring: "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1200&q=70",
  factoryFloor: "https://images.unsplash.com/photo-1574786577042-de24e6d9b8f1?auto=format&fit=crop&w=1600&q=70",
  // Industry photos
  food: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=1200&q=70",
  dairy: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=1200&q=70",
  bakery: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=70",
  packaging: "https://images.unsplash.com/photo-1610478920392-95888b4b6053?auto=format&fit=crop&w=1200&q=70",
  beverage: "https://images.unsplash.com/photo-1556767576-cf71cb498dd4?auto=format&fit=crop&w=1200&q=70",
  coldStorage: "https://images.unsplash.com/photo-1601598851547-4302969d0614?auto=format&fit=crop&w=1200&q=70",
  plastics: "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?auto=format&fit=crop&w=1200&q=70",
  can: "https://images.unsplash.com/photo-1610478920392-95888b4b6053?auto=format&fit=crop&w=1200&q=70",
  paper: "https://images.unsplash.com/photo-1597007030739-6d2e7172ee5a?auto=format&fit=crop&w=1200&q=70",
  chemical: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=70",
};

/* ---------------------------------------------------------------------------
   Inline SVG icon set (no external icon dependency).
--------------------------------------------------------------------------- */
const I = {
  arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
  shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 4 6v6c0 5 3.5 7.5 8 9 4.5-1.5 8-4 8-9V6l-8-3Z"/><path d="m9 12 2 2 4-4"/></svg>',
  map: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-7-6.5-7-11a7 7 0 0 1 14 0c0 4.5-7 11-7 11Z"/><circle cx="12" cy="10" r="2.5"/></svg>',
  factory: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21V10l6 4V10l6 4V7l6-2v16Z"/><path d="M3 21h18"/></svg>',
  bolt: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z"/></svg>',
  chip: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="6" width="12" height="12" rx="1.5"/><path d="M9 1v3M15 1v3M9 20v3M15 20v3M1 9h3M1 15h3M20 9h3M20 15h3"/></svg>',
  gear: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3.2"/><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-2.7 1.1V21a2 2 0 1 1-4 0v-.2A1.6 1.6 0 0 0 7 19.4a1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A1.6 1.6 0 0 0 2.6 14H2.4a2 2 0 1 1 0-4h.2A1.6 1.6 0 0 0 4 7.6a1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1A1.6 1.6 0 0 0 9 3.6h.1A1.6 1.6 0 0 0 10 2.4V2.4a2 2 0 1 1 4 0v.2a1.6 1.6 0 0 0 2.7 1.1l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1A1.6 1.6 0 0 0 21.4 9h.2a2 2 0 1 1 0 4h-.2a1.6 1.6 0 0 0-1.4 2Z"/></svg>',
  wrench: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a4 4 0 0 0-5.4 5.2L3 17.8 6.2 21l6.3-6.3a4 4 0 0 0 5.2-5.4l-2.6 2.6-2.4-.5-.5-2.4 2.5-2.7Z"/></svg>',
  users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="3.2"/><path d="M3 20a6 6 0 0 1 12 0"/><path d="M16 5a3 3 0 0 1 0 6M22 20a6 6 0 0 0-4-5.7"/></svg>',
  badge: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="9" r="5"/><path d="m8.5 13.5-1 7L12 18l4.5 2.5-1-7"/></svg>',
  gauge: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 13 16 9"/><path d="M3 18a9 9 0 1 1 18 0"/><circle cx="12" cy="13" r="1.4" fill="currentColor"/></svg>',
  clipboard: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1"/><path d="M9 11h6M9 15h4"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>',
  phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z"/></svg>',
  mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
  pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-7-6.5-7-11a7 7 0 0 1 14 0c0 4.5-7 11-7 11Z"/><circle cx="12" cy="10" r="2.5"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
  building: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="16" height="18" rx="1.5"/><path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2"/></svg>',
};

/* ---------------------------------------------------------------------------
   Shared content data
--------------------------------------------------------------------------- */
const NAV = [
  { label: "Direct Hire", href: "direct-hire.html" },
  { label: "Industries", href: "industries.html" },
  { label: "Positions", href: "positions.html" },
  { label: "Success Stories", href: "success-stories.html" },
  { label: "Resources", href: "resources.html" },
  { label: "About", href: "about.html" },
];

const POSITIONS = [
  { name: "Maintenance Technicians", icon: I.wrench },
  { name: "Maintenance Supervisors", icon: I.users },
  { name: "Maintenance Managers", icon: I.badge },
  { name: "Controls Engineers", icon: I.chip },
  { name: "Automation Engineers", icon: I.gear },
  { name: "Electrical Engineers", icon: I.bolt },
  { name: "Reliability Engineers", icon: I.gauge },
  { name: "Plant Managers", icon: I.factory },
  { name: "Operations Managers", icon: I.clipboard },
  { name: "Maintenance Planners", icon: I.search },
  { name: "Instrumentation Technicians", icon: I.gauge },
  { name: "PLC Programmers", icon: I.chip },
  { name: "Automation Managers", icon: I.gear },
  { name: "Maintenance Engineers", icon: I.wrench },
];

const INDUSTRIES = [
  { slug: "food-manufacturing-recruiting", name: "Food Manufacturing", short: "Food", img: IMG.food,
    blurb: "USDA/FDA-regulated plants, high-speed lines, sanitation and uptime pressure." },
  { slug: "dairy-recruiting", name: "Dairy", short: "Dairy", img: IMG.dairy,
    blurb: "Continuous processing, CIP systems, refrigeration and 24/7 reliability demands." },
  { slug: "bakery-recruiting", name: "Bakery", short: "Bakery", img: IMG.bakery,
    blurb: "Ovens, proofers, depositors and conveyors that can't go down mid-shift." },
  { slug: "packaging-recruiting", name: "Packaging", short: "Packaging", img: IMG.packaging,
    blurb: "Fillers, cappers, case packers, palletizers and servo-driven motion control." },
  { slug: "beverage-recruiting", name: "Beverage", short: "Beverage", img: IMG.beverage,
    blurb: "High-speed bottling and canning, blow-molding and rinse-fill-seal lines." },
  { slug: "cold-storage-recruiting", name: "Cold Storage", short: "Cold Storage", img: IMG.coldStorage,
    blurb: "Ammonia refrigeration, automated storage/retrieval and food-safe environments." },
  { slug: "plastics-recruiting", name: "Plastics", short: "Plastics", img: IMG.plastics,
    blurb: "Injection molding, extrusion, robotics and tight tolerance automation." },
  { slug: "can-manufacturing-recruiting", name: "Can Manufacturing", short: "Cans", img: IMG.can,
    blurb: "Bodymakers, necker-flangers and ultra-high-speed metal forming lines." },
  { slug: "paper-manufacturing-recruiting", name: "Paper Manufacturing", short: "Paper", img: IMG.paper,
    blurb: "Paper machines, converting, drives and DCS-controlled continuous process." },
  { slug: "chemical-manufacturing-recruiting", name: "Chemical Manufacturing", short: "Chemical", img: IMG.chemical,
    blurb: "Batch and continuous process, PSM environments, instrumentation and DCS." },
];

const PROCESS = [
  { t: "Discovery", d: "We walk your floor (in person or virtually), learn your equipment, shift structure, and what “good” actually looks like for the role." },
  { t: "Technical Recruiting", d: "We tap our manufacturing network and target the passive technicians and engineers who never apply to job boards." },
  { t: "Candidate Screening", d: "Every candidate is vetted for stability, motivation, shift fit, and the practical skills the role demands." },
  { t: "Technical Interview", d: "We interview on PLCs, controls, troubleshooting and reliability — because we’ve done the work ourselves." },
  { t: "Client Interview", d: "We present a short list of qualified, interested candidates and coordinate the entire interview loop for you." },
  { t: "Offer", d: "We manage the offer, counter-offer and resignation conversation so your hire actually shows up on day one." },
  { t: "Follow-Up", d: "We check in through onboarding and the full guarantee period to make sure the placement sticks." },
];

const TESTIMONIALS = [
  { q: "EAS sent us three maintenance techs who could actually read a ladder logic program. Our agency before them sent resumes; EAS sent technicians.", n: "Plant Manager", r: "Food Manufacturing · Midwest", a: "PM" },
  { q: "They understood the difference between a controls engineer who can talk about PLCs and one who can stand at the panel and fix it at 2 a.m. That changed our hiring.", n: "Maintenance Manager", r: "Packaging · Southeast", a: "MM" },
  { q: "We had a reliability engineer seat open for eight months. EAS filled it in five weeks with someone who was never going to answer a job posting.", n: "Director of Operations", r: "Beverage · Northeast", a: "DO" },
  { q: "What stood out was the technical screening. They asked our candidates the questions we would have asked. No wasted interviews.", n: "Engineering Manager", r: "Plastics · Texas", a: "EM" },
  { q: "As a candidate, it was the first time a recruiter actually understood my background in automation. They placed me in a role I’m still in three years later.", n: "Controls Engineer", r: "Placed Candidate", a: "CE" },
  { q: "Direct hire only, manufacturing only. They don’t pretend to do everything, and that focus is exactly why they’re good at it.", n: "VP of Manufacturing", r: "Cold Storage · West", a: "VP" },
];

const STATS = [
  { num: "6-Mo", label: "Placement Guarantee", sub: "We stand behind every hire" },
  { num: "100%", label: "Manufacturing Focus", sub: "Maintenance & automation only" },
  { num: "Nationwide", label: "Search Reach", sub: "U.S. & Canada coverage" },
  { num: "Direct Hire", label: "Only", sub: "No temp, no staff aug" },
];

const ARTICLES = [
  { slug: "how-to-hire-maintenance-technicians", cat: "Hiring Guide", title: "How to Hire Maintenance Technicians Who Actually Stay",
    excerpt: "The real reasons your maintenance reqs sit open for months — and a practical playbook for sourcing, screening and closing technicians in a tight market." },
  { slug: "why-plc-technicians-are-hard-to-find", cat: "Market Insight", title: "Why Good PLC Technicians Are So Hard to Find",
    excerpt: "Supply, retirements, and the skills gap between “talks about PLCs” and “can diagnose one.” What’s driving the shortage and how to compete for the few who can." },
  { slug: "maintenance-manager-interview-questions", cat: "Interview Kit", title: "20 Maintenance Manager Interview Questions That Reveal the Real Ones",
    excerpt: "Go beyond the resume. Technical, leadership and reliability questions that separate maintenance managers who manage from those who only supervise." },
  { slug: "red-flags-hiring-controls-engineers", cat: "Hiring Guide", title: "Red Flags When Hiring Controls Engineers",
    excerpt: "Buzzword fluency isn’t competence. The warning signs we screen for so you don’t discover them three months into a struggling automation project." },
  { slug: "what-makes-a-great-maintenance-supervisor", cat: "Leadership", title: "What Makes a Great Maintenance Supervisor",
    excerpt: "The bridge between the floor and the front office. The traits that predict a supervisor who reduces downtime instead of just reacting to it." },
  { slug: "direct-hire-vs-staffing-agency", cat: "Market Insight", title: "Direct Hire vs. a Generic Staffing Agency for Manufacturing Roles",
    excerpt: "Why specialist direct-hire search outperforms volume staffing for hard-to-fill maintenance, controls and engineering seats." },
];

/* Full article bodies, keyed by slug. Written in the EAS voice — expand or edit
   freely. Uses the .prose styles (p / h3 / ul / li). */
const ARTICLE_CONTENT = {
  "how-to-hire-maintenance-technicians": `
    <h3>Why the req sits open for months</h3>
    <p>When a maintenance technician requisition goes unfilled for 90, 120, 180 days, the instinct is to blame the market. The market is tight &mdash; but that&rsquo;s rarely the whole story. In our experience running these searches, reqs stall for reasons that are entirely fixable:</p>
    <ul>
      <li>The job posting reads like an HR template, not something a technician would answer.</li>
      <li>The search is limited to people who are actively applying &mdash; the smallest, least selective slice of the talent pool.</li>
      <li>The interview process is too slow, and good candidates take another offer before yours lands.</li>
      <li>The pay band is anchored to last year&rsquo;s market instead of this week&rsquo;s.</li>
    </ul>
    <h3>Write a posting that speaks to technicians</h3>
    <p>A skilled multi-craft technician reads twenty postings that all say &ldquo;troubleshoot and repair equipment.&rdquo; Give them something concrete. Name the equipment and the controls platform &mdash; Allen-Bradley, Siemens, the specific lines they&rsquo;d own. State the shift plainly. Be honest about overtime and on-call. Technicians screen out vague postings because vague postings usually hide a rough environment.</p>
    <h3>Go after the people who aren&rsquo;t looking</h3>
    <p>The best technicians are employed and not browsing job boards. They get recruited, not advertised to. Filling these roles consistently means building a network of passive candidates and reaching out directly &mdash; through referrals, trade communities, and recruiters who already know who the strong people are in your region. If your entire pipeline is inbound applications, you are competing for the 20% of the market that is actively job-hunting, and the strongest hands are almost never in that group.</p>
    <h3>Screen for the work, not the r&eacute;sum&eacute;</h3>
    <p>A r&eacute;sum&eacute; tells you where someone worked, not whether they can find an intermittent fault on a line that&rsquo;s down. Put a real scenario in front of them: a conveyor trips its VFD twice a shift at random &mdash; walk me through how you&rsquo;d isolate it. Listen for a methodical approach, safe practice, and the instinct to look at the data before swapping parts. That five-minute conversation tells you more than the whole r&eacute;sum&eacute;.</p>
    <h3>Move fast and make the offer easy to say yes to</h3>
    <p>In a tight market, speed is a feature. Compress the loop: a technical phone screen, one well-run on-site, and a decision. Every extra week is a week a competitor can close them first. When you do extend the offer, anticipate the counter from their current employer and be ready &mdash; the resignation conversation is where placements are won or lost.</p>
    <h3>Onboard so they stay</h3>
    <p>Hiring is only half the job; retention is the other half. Technicians leave in the first 90 days when the role isn&rsquo;t what was described, the tooling is inadequate, or no one set them up to win. Be straight about the environment in the interview, and invest in the first month. A hire that washes out at day 80 costs you the search all over again.</p>
    <h3>The EAS takeaway</h3>
    <p>Maintenance reqs don&rsquo;t stay open because good technicians don&rsquo;t exist &mdash; they stay open because the search isn&rsquo;t reaching them, screening them properly, or closing them fast. Fix those three things and the role fills. That&rsquo;s exactly the search we run, and because we&rsquo;ve done the job ourselves, we know which technicians can actually do it.</p>`,

  "why-plc-technicians-are-hard-to-find": `
    <h3>A small pool, getting smaller</h3>
    <p>There were never very many people who can stand at a panel, go online with a controller, and methodically find the fault. The role sits at the intersection of electrical skill, controls knowledge, and hands-on troubleshooting instinct &mdash; and that combination is rare by nature. Now demand for automation is rising while the supply of people who grew up with it is shrinking.</p>
    <h3>The retirement cliff is real</h3>
    <p>A large share of the technicians who learned PLCs in the &lsquo;80s and &lsquo;90s are retiring. They carry decades of plant-specific knowledge that doesn&rsquo;t transfer in a two-week handoff. As they leave, plants lose not just headcount but institutional troubleshooting memory &mdash; and the people qualified to replace them are already employed elsewhere.</p>
    <h3>&ldquo;Talks about PLCs&rdquo; vs. &ldquo;can diagnose one&rdquo;</h3>
    <p>This is the gap that costs companies the most. Plenty of candidates can discuss ladder logic, list the platforms they&rsquo;ve seen, and use the right vocabulary in an interview. Far fewer can actually go online with a running controller, read the logic, and isolate why the line stopped. A r&eacute;sum&eacute; and a smooth interview can&rsquo;t tell these two apart. Only a technical screen can &mdash; and most hiring teams aren&rsquo;t equipped to run one.</p>
    <h3>Why job boards fail for this role</h3>
    <p>The strongest controls people are not on job boards. They&rsquo;re busy, well-paid, and quietly indispensable to their current employer. Posting and praying reaches the wrong end of the market. Worse, a generic posting attracts a flood of unqualified applicants who use the right keywords, burning your team&rsquo;s time on screening that goes nowhere.</p>
    <h3>How to actually compete</h3>
    <ul>
      <li><strong>Recruit passively.</strong> Reach the people who aren&rsquo;t applying, through network and direct outreach.</li>
      <li><strong>Screen technically.</strong> Have someone who understands controls run the evaluation &mdash; real scenarios, not keyword bingo.</li>
      <li><strong>Pay for scarcity.</strong> The market clears at a number; pretending otherwise just keeps the seat empty.</li>
      <li><strong>Sell the work.</strong> Good controls people want interesting systems, modern equipment, and respect. Lead with that.</li>
      <li><strong>Develop a pipeline.</strong> Grow your own through apprenticeship while you recruit externally &mdash; the shortage isn&rsquo;t ending soon.</li>
    </ul>
    <h3>The EAS takeaway</h3>
    <p>Good PLC technicians are hard to find because they&rsquo;re rare, retiring, and rarely looking &mdash; and because most searches can&rsquo;t tell the real ones from the fluent ones. We can, because we&rsquo;ve been on the wrong end of a downed line at 2 a.m. ourselves. When we present a controls candidate, it&rsquo;s because they passed a screen built by people who&rsquo;ve done the work.</p>`,

  "maintenance-manager-interview-questions": `
    <p>A maintenance manager sets the reliability of your whole plant. Hire the wrong one and you get reactive firefighting, turnover, and rising downtime. The right questions separate managers who genuinely manage from supervisors who merely react. Here are twenty we like, grouped by what they reveal.</p>
    <h3>Technical &amp; reliability</h3>
    <ul>
      <li>Walk me through how you&rsquo;d stand up a PM program from scratch on a line with no history.</li>
      <li>How do you decide what to make preventive, predictive, or run-to-failure?</li>
      <li>What CMMS have you run, and what did you actually change with the data?</li>
      <li>Tell me about a chronic failure you eliminated &mdash; how did you find root cause?</li>
      <li>How do you measure reliability? Which metrics do you trust and which mislead?</li>
      <li>How do you handle a controls or automation problem that&rsquo;s beyond your team&rsquo;s depth?</li>
    </ul>
    <h3>Leadership &amp; people</h3>
    <ul>
      <li>How do you build a maintenance team when skilled techs are scarce?</li>
      <li>Describe coaching a technician who was technically strong but unreliable.</li>
      <li>How do you handle the night shift when you can&rsquo;t be there?</li>
      <li>What&rsquo;s your approach to cross-training and reducing single points of failure?</li>
      <li>Tell me about a time you had to let someone go &mdash; how did you handle it?</li>
    </ul>
    <h3>Business &amp; metrics</h3>
    <ul>
      <li>How do you build and defend a maintenance budget?</li>
      <li>Walk me through a capital request you justified to leadership.</li>
      <li>How do you balance production pressure against doing maintenance right?</li>
      <li>What&rsquo;s the relationship between your department and operations &mdash; partners or adversaries?</li>
    </ul>
    <h3>Behavioral &amp; situational</h3>
    <ul>
      <li>Tell me about your worst downtime event. What happened and what changed afterward?</li>
      <li>Describe a time you disagreed with the plant manager. How did it resolve?</li>
      <li>What did you inherit in your last role, and what did it look like when you left?</li>
      <li>How do you keep up with new technology &mdash; controls, predictive tools, IIoT?</li>
      <li>Why this plant, and why now?</li>
    </ul>
    <h3>How to read the answers</h3>
    <p>Strong candidates talk in specifics &mdash; numbers, named systems, before-and-after. They take ownership of failures and describe what they changed. Weaker candidates stay abstract, blame others, or describe being busy rather than driving outcomes. Listen for whether they led change or simply kept the lights on.</p>
    <h3>The EAS takeaway</h3>
    <p>The r&eacute;sum&eacute; gets a candidate in the room; questions like these tell you who they actually are. We ask them on every maintenance-leadership search &mdash; and because we&rsquo;ve run maintenance departments, we know which answers hold up on the floor and which fall apart in week one.</p>`,

  "red-flags-hiring-controls-engineers": `
    <p>A controls engineer can make or break an automation project &mdash; and the cost of the wrong hire isn&rsquo;t felt at the offer stage. It shows up three months in, on a struggling commissioning, with a line that won&rsquo;t run right. Here are the warning signs we screen for.</p>
    <h3>Buzzword fluency with no depth underneath</h3>
    <p>The candidate uses all the right terms &mdash; ladder, function block, EtherNet/IP, SCADA &mdash; but can&rsquo;t go one layer deeper when you probe. Ask <em>how</em> and <em>why</em>, not <em>what</em>. Real engineers get more specific under questioning; the fluent-but-shallow get vaguer.</p>
    <h3>Can&rsquo;t describe past projects concretely</h3>
    <p>&ldquo;I worked on the line controls&rdquo; isn&rsquo;t an answer. What was the architecture? What did <em>you</em> design versus inherit? What broke during commissioning and how did you fix it? Engineers who did the work remember the hard parts in detail. Vague ownership is a red flag.</p>
    <h3>No troubleshooting methodology</h3>
    <p>Ask how they approach a fault no one&rsquo;s seen before. You want a process: reproduce, observe the data, isolate, hypothesize, test. Beware the answer that jumps straight to swapping hardware or &ldquo;calling the vendor.&rdquo; Strong controls people think before they touch.</p>
    <h3>Can&rsquo;t read someone else&rsquo;s code</h3>
    <p>Most real work is modifying logic written by someone who&rsquo;s gone. An engineer who can only work in their own style, or who wants to rewrite everything from scratch, will be slow and risky in a brownfield plant. Ask how they approach undocumented logic they didn&rsquo;t write.</p>
    <h3>Over-reliance on vendor support</h3>
    <p>Vendor support is a tool, not a crutch. If every hard problem in their stories ends with &ldquo;so we opened a ticket,&rdquo; you&rsquo;re hiring a coordinator, not an engineer. You want someone who exhausts their own diagnosis first.</p>
    <h3>Job-hopping vs. project-based moves</h3>
    <p>Integrators and contractors move between projects &mdash; that&rsquo;s normal and not a red flag. But a pattern of leaving direct roles every 12 months, especially right after commissioning, can signal someone who designs systems they don&rsquo;t stay to support. Ask why each move happened.</p>
    <h3>Green flags, for contrast</h3>
    <ul>
      <li>Gets more specific the deeper you probe.</li>
      <li>Owns past mistakes and explains what they learned.</li>
      <li>Has a repeatable troubleshooting method.</li>
      <li>Comfortable in others&rsquo; code and in legacy environments.</li>
      <li>Talks about uptime and the operators, not just the technology.</li>
    </ul>
    <h3>The EAS takeaway</h3>
    <p>You usually can&rsquo;t spot these red flags from a r&eacute;sum&eacute;, and many hiring teams can&rsquo;t spot them in an interview either &mdash; the vocabulary is convincing. We screen controls engineers technically, by people who&rsquo;ve commissioned lines and chased the intermittent fault, so the problems surface before the offer, not after.</p>`,

  "what-makes-a-great-maintenance-supervisor": `
    <h3>The bridge role</h3>
    <p>The maintenance supervisor stands between the floor and the front office. They translate production pressure into technical priorities and technical reality back up to leadership. Get this role right and downtime drops, technicians stay, and problems get solved before they spread. Get it wrong and the whole department runs reactive.</p>
    <h3>Technical credibility comes first</h3>
    <p>A supervisor who can&rsquo;t earn the respect of their technicians will struggle no matter how good their people skills are. The best supervisors came up through the trades &mdash; they&rsquo;ve turned the wrench, found the fault, and done the dirty work. That credibility is what lets them make a call on the floor and have it stick.</p>
    <h3>Leadership the floor will follow</h3>
    <p>Technical chops alone aren&rsquo;t enough; plenty of great technicians make poor supervisors. The role demands the ability to prioritize under pressure, coach without micromanaging, hold people accountable fairly, and stay calm when a line is down and everyone is looking at them. Look for someone who develops their people instead of hoarding the hard jobs.</p>
    <h3>Proactive, not just reactive</h3>
    <p>A reactive supervisor fights whatever fire is loudest. A great one is always pulling the department toward prevention &mdash; tightening the PM program, chasing repeat failures to root cause, planning work so the next shift isn&rsquo;t scrambling. The difference shows up in the trend line on unplanned downtime over six months.</p>
    <h3>Communicates in both directions</h3>
    <p>They can explain to a plant manager, in business terms, why a line needs to come down for four hours now to avoid a two-day failure later &mdash; and they can take a vague production complaint and turn it into a clear work order for a technician. That two-way translation is the heart of the job.</p>
    <h3>How to interview for it</h3>
    <ul>
      <li>Ask about a time they turned around a struggling shift or crew.</li>
      <li>Probe how they prioritize when three things break at once.</li>
      <li>Ask how they coach a strong but difficult technician.</li>
      <li>Have them explain a technical decision to you as if you were the plant manager.</li>
      <li>Look for ownership of outcomes &mdash; downtime, PM compliance, retention &mdash; not just activity.</li>
    </ul>
    <h3>The EAS takeaway</h3>
    <p>A great maintenance supervisor is rarer than a great technician, because the job needs both the hands and the head for leadership. We&rsquo;ve held the role and built the teams beneath it, so we screen for the combination that actually predicts success &mdash; not just the strongest wrench in the room.</p>`,

  "direct-hire-vs-staffing-agency": `
    <h3>Two different models, often confused</h3>
    <p>&ldquo;Staffing&rdquo; and &ldquo;direct hire&rdquo; get used interchangeably, but they solve different problems. A volume staffing agency fills seats &mdash; often temporary or temp-to-hire &mdash; quickly and at scale. Direct-hire search finds a specific permanent employee for a hard-to-fill role. For maintenance, controls, and engineering, the difference is everything.</p>
    <h3>When volume staffing is the right tool</h3>
    <p>Staffing agencies are genuinely good at what they do: high-volume, lower-specialization roles where speed and flexibility matter more than precise fit &mdash; general labor, packaging line operators, warehouse, seasonal surges. If you need fifteen bodies for a ramp, that&rsquo;s a staffing problem.</p>
    <h3>Why hard technical roles need search</h3>
    <p>A maintenance technician who can troubleshoot your controls, or a controls engineer who can commission a line, is not a body you can swap in. These people are scarce, employed, and not applying. Finding them takes targeted recruiting into the passive market and a technical screen to confirm they can actually do the work. Volume staffing models aren&rsquo;t built for that &mdash; they&rsquo;re built for throughput, and they&rsquo;ll send you r&eacute;sum&eacute;s, not vetted technicians.</p>
    <h3>The hidden cost of the wrong fit</h3>
    <p>A bad temp on a packaging line is an inconvenience. A bad controls hire is a failed commissioning, a project that slips a quarter, and a line that won&rsquo;t run right. The cost of a mis-hire in a technical seat &mdash; lost productivity, the re-search, the team disruption &mdash; dwarfs any fee difference. Specialization isn&rsquo;t a premium; it&rsquo;s insurance.</p>
    <h3>Why specialists rank &mdash; and deliver</h3>
    <p>A firm that does only manufacturing, only direct hire, builds a network, a reputation, and a screening capability that a generalist can&rsquo;t match. They already know the strong people in your region. They speak the language that gets a passive candidate to pick up the phone. And they can tell, technically, who can do the job. That focus is why specialist search consistently outperforms general staffing on the hardest seats &mdash; and why specialist pages outrank generic ones when those same companies search for help.</p>
    <h3>What to look for in a search partner</h3>
    <ul>
      <li>Do they specialize in your kind of role, or do they do everything?</li>
      <li>Can they screen candidates technically &mdash; or just forward r&eacute;sum&eacute;s?</li>
      <li>Do they reach passive candidates, or only post and wait?</li>
      <li>Do they guarantee placements?</li>
      <li>Have the people running your search ever done the job they&rsquo;re recruiting for?</li>
    </ul>
    <h3>The EAS takeaway</h3>
    <p>For the maintenance, controls, automation, and leadership roles that keep a plant running, direct-hire search beats volume staffing &mdash; and a manufacturing specialist beats a generalist. EAS is direct hire only, manufacturing only, run by former maintenance and automation leaders. That focus is the entire point.</p>`,
};

/* ---------------------------------------------------------------------------
   Layout helpers
--------------------------------------------------------------------------- */
function navMarkup(current) {
  const links = NAV.map(
    (n) => `<a href="${n.href}"${n.href === current ? ' aria-current="page"' : ""}>${n.label}</a>`
  ).join("\n          ");
  return `<header class="site-header">
    <div class="container">
      <nav class="nav" aria-label="Primary">
        <a class="brand" href="index.html" aria-label="${SITE.full} home">
          <span class="brand__mark">EAS</span>
          <span class="brand__text">
            <span class="brand__name">Electrical Automation Staffing</span>
            <span class="brand__sub">${SITE.tagline}</span>
          </span>
        </a>
        <button class="nav__toggle" aria-label="Toggle menu" aria-expanded="false" aria-controls="nav-links">${I.menu}</button>
        <div class="nav__links" id="nav-links" data-open="false">
          ${links}
          <span class="nav__cta"><a class="btn btn--primary" href="contact.html">Request Candidates ${I.arrow}</a></span>
        </div>
      </nav>
    </div>
  </header>`;
}

function footerMarkup() {
  const posCols = POSITIONS.slice(0, 7)
    .map((p) => `<a href="positions.html">${p.name}</a>`)
    .join("\n          ");
  const indCols = INDUSTRIES.slice(0, 7)
    .map((i) => `<a href="${i.slug}.html">${i.name}</a>`)
    .join("\n          ");
  return `<footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div>
          <a class="brand" href="index.html">
            <span class="brand__mark">EAS</span>
            <span class="brand__text">
              <span class="brand__name">Electrical Automation Staffing</span>
              <span class="brand__sub">${SITE.tagline}</span>
            </span>
          </a>
          <p class="footer-about">The manufacturing talent authority. Former maintenance and automation leaders recruiting the technical professionals other firms can&rsquo;t reach. Direct hire only.</p>
          <p style="margin-top:1.1rem"><a class="btn btn--primary" href="contact.html">Request Candidates ${I.arrow}</a></p>
        </div>
        <div class="footer-col">
          <h4>Positions</h4>
          ${posCols}
          <a href="positions.html"><strong>View all &rarr;</strong></a>
        </div>
        <div class="footer-col">
          <h4>Industries</h4>
          ${indCols}
          <a href="industries.html"><strong>View all &rarr;</strong></a>
        </div>
        <div class="footer-col">
          <h4>Company</h4>
          <a href="direct-hire.html">Direct Hire</a>
          <a href="about.html">About EAS</a>
          <a href="success-stories.html">Success Stories</a>
          <a href="resources.html">Resources</a>
          <a href="contact.html">Contact</a>
          <a href="${SITE.phoneHref}">${SITE.phone}</a>
        </div>
      </div>
      <div class="footer-bottom">
        <span>&copy; <span id="yr">2026</span> ${SITE.full}. All rights reserved.</span>
        <span>${SITE.region} &middot; Manufacturing Direct Hire &amp; Executive Search</span>
      </div>
    </div>
  </footer>`;
}

function page({ title, description, current, body, jsonld = "" }) {
  const ld = jsonld ? `\n  <script type="application/ld+json">${jsonld}</script>` : "";
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title}</title>
  <meta name="description" content="${description}" />
  <meta name="theme-color" content="#06121f" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="${SITE.full}" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Archivo:wght@500;600;700;800&family=Barlow+Condensed:wght@500;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="assets/css/styles.css" />${ld}
</head>
<body>
  <a class="skip-link" href="#main">Skip to content</a>
  ${navMarkup(current)}
  <main id="main">
${body}
  </main>
  ${footerMarkup()}
  <script src="assets/js/main.js" defer></script>
</body>
</html>
`;
}

/* Reusable section partials ------------------------------------------------ */
function trustStrip() {
  const items = [
    "Manufacturing Only",
    "Direct Hire Only",
    "Nationwide Search",
    "6-Month Placement Guarantee",
    "We&rsquo;ve Worked the Floor",
  ];
  return `<section class="trust-strip">
    <div class="container">
      <ul>${items.map((t) => `<li>${I.check}${t}</li>`).join("")}</ul>
    </div>
  </section>`;
}

function positionsSection() {
  const cells = POSITIONS.map(
    (p) => `<a class="position" href="positions.html"><span class="position__icon">${p.icon}</span><span>${p.name}</span></a>`
  ).join("\n        ");
  return `<section class="section" id="positions">
    <div class="container">
      <div class="section-head center reveal">
        <span class="eyebrow">Positions We Recruit</span>
        <h2>The hardest technical seats to fill &mdash; filled</h2>
        <p class="lead measure center">We don&rsquo;t recruit for everything. We go deep on the maintenance, controls, automation and leadership roles that keep manufacturing plants running.</p>
      </div>
      <div class="positions reveal">
        ${cells}
      </div>
    </div>
  </section>`;
}

function statsSection() {
  const cells = STATS.map(
    (s) => `<div class="stat"><div class="stat__num">${s.num}</div><div class="stat__label">${s.label}</div><div class="stat__sub">${s.sub}</div></div>`
  ).join("\n        ");
  return `<section class="section section--navy">
    <div class="container">
      <div class="stats reveal">
        ${cells}
      </div>
    </div>
  </section>`;
}

function processSection() {
  const steps = PROCESS.map(
    (s) => `<div class="step"><h3>${s.t}</h3><p>${s.d}</p></div>`
  ).join("\n        ");
  return `<section class="section section--paper" id="process">
    <div class="container">
      <div class="section-head center reveal">
        <span class="eyebrow">Our Process</span>
        <h2>A proven, technical search process</h2>
        <p class="lead measure center">Companies want to know how the work gets done. Here is exactly how we run every search &mdash; from the plant floor to follow-up.</p>
      </div>
      <div class="process process--cols reveal">
        ${steps}
      </div>
    </div>
  </section>`;
}

function testimonialsSection(limit = 3) {
  const cells = TESTIMONIALS.slice(0, limit)
    .map(
      (t) => `<figure class="quote reveal"><div class="quote__mark">&ldquo;</div><p>${t.q}</p><figcaption class="quote__by"><span class="quote__avatar">${t.a}</span><span><span class="quote__name">${t.n}</span><br><span class="quote__role">${t.r}</span></span></figcaption></figure>`
    )
    .join("\n        ");
  return `<section class="section">
    <div class="container">
      <div class="section-head center reveal">
        <span class="eyebrow">Success Stories</span>
        <h2>Trusted by the people who run the plant</h2>
        <p class="lead measure center">Nothing builds trust faster than results. Here&rsquo;s what plant managers, maintenance leaders and placed candidates say.</p>
      </div>
      <div class="grid grid-3">
        ${cells}
      </div>
      <p class="center" style="margin-top:2rem"><a class="btn btn--outline" href="success-stories.html">Read more success stories ${I.arrow}</a></p>
    </div>
  </section>`;
}

function industriesSection() {
  const tiles = INDUSTRIES.map(
    (i) => `<a class="tile reveal" href="${i.slug}.html"><img src="${i.img}" alt="${i.name} plant environment" loading="lazy" /><div class="tile__body"><h3>${i.name}</h3><span class="tile__link">${i.short} recruiting ${I.arrow}</span></div></a>`
  ).join("\n        ");
  return `<section class="section section--navy" id="industries">
    <div class="container">
      <div class="section-head center reveal">
        <span class="eyebrow on-dark">Industries We Serve</span>
        <h2>Specialists in your kind of plant</h2>
        <p class="lead measure center">Generalists rank for nothing. We build deep expertise &mdash; and dedicated search practices &mdash; by industry, so we already know your equipment before the first call.</p>
      </div>
      <div class="grid grid-3">
        ${tiles}
      </div>
    </div>
  </section>`;
}

function ctaBand() {
  return `<section class="section cta-band">
    <div class="cta-band__bg"><img src="${IMG.controlPanel}" alt="" aria-hidden="true" loading="lazy" /></div>
    <div class="container reveal">
      <span class="eyebrow on-dark" style="justify-content:center">Tell us what you need</span>
      <h2>Need a maintenance technician?<br>A PLC engineer? A maintenance manager?</h2>
      <div class="cta-roles">
        <span>Need a Maintenance Technician?</span>
        <span>Need a PLC Engineer?</span>
        <span>Need a Maintenance Manager?</span>
        <span>Need a Controls Engineer?</span>
      </div>
      <div class="hero__actions">
        <a class="btn btn--primary btn--lg" href="contact.html">Request Candidates ${I.arrow}</a>
        <a class="btn btn--ghost btn--lg" href="${SITE.phoneHref}">${I.phone} ${SITE.phone}</a>
      </div>
    </div>
  </section>`;
}

function pageHero({ crumbs, eyebrow, h1, sub }) {
  const crumbHtml = crumbs
    ? `<nav class="crumbs" aria-label="Breadcrumb">${crumbs}</nav>`
    : "";
  return `<section class="hero">
    <div class="hero__bg"><img src="${IMG.factoryFloor}" alt="" aria-hidden="true" /></div>
    <div class="hero__overlay"></div>
    <div class="container">
      <div class="hero__page">
        ${crumbHtml}
        <span class="eyebrow on-dark">${eyebrow}</span>
        <h1>${h1}</h1>
        <p class="hero__sub">${sub}</p>
      </div>
    </div>
  </section>`;
}

/* ---------------------------------------------------------------------------
   PAGE: Home
--------------------------------------------------------------------------- */
function homePage() {
  const credCards = [
    { tag: "We&rsquo;ve done the job", h: "Former Maintenance Managers", p: "We&rsquo;ve owned the maintenance budget, the PM schedule and the 2 a.m. downtime call. We know what a strong department looks like." },
    { tag: "We&rsquo;ve done the job", h: "Former PLC Technicians", p: "We&rsquo;ve stood at the panel with a laptop and a deadline. We can tell who can actually diagnose a PLC and who only talks about it." },
    { tag: "We&rsquo;ve done the job", h: "Former Controls Engineers", p: "We&rsquo;ve commissioned lines, written the logic and chased the intermittent fault. We screen for real automation skill." },
    { tag: "We&rsquo;ve done the job", h: "Former Maintenance Leaders", p: "We&rsquo;ve built and led the teams we now recruit. We understand reliability, CMMS, TPM and predictive maintenance first-hand." },
  ];
  const cards = credCards
    .map((c) => `<article class="cred-card reveal"><span class="tag">${c.tag}</span><h3>${c.h}</h3><p>${c.p}</p></article>`)
    .join("\n        ");

  const body = `<section class="hero">
    <div class="hero__bg"><img src="${IMG.heroPlant}" alt="Maintenance technician working on industrial control equipment on a manufacturing floor" /></div>
    <div class="hero__overlay"></div>
    <div class="container">
      <div class="hero__inner">
        <span class="eyebrow on-dark">Manufacturing Direct Hire &amp; Executive Search</span>
        <h1>We Recruit the Manufacturing Professionals <span class="hl">Other Recruiters Can&rsquo;t.</span></h1>
        <p class="hero__sub">EAS specializes exclusively in Maintenance, Controls, PLC, Automation, Reliability, Engineering and Plant Leadership.</p>
        <p class="hero__kicker">Former maintenance leaders. Manufacturing experts. Direct hire only.</p>
        <div class="hero__actions">
          <a class="btn btn--primary btn--lg" href="contact.html">Request Candidates ${I.arrow}</a>
          <a class="btn btn--ghost btn--lg" href="positions.html">See What We Recruit</a>
        </div>
      </div>
    </div>
  </section>
  ${trustStrip()}

  <section class="section">
    <div class="container">
      <div class="section-head center reveal">
        <span class="eyebrow">Why EAS?</span>
        <h2>Most recruiters have never touched a production line. We have.</h2>
        <p class="lead measure center">That&rsquo;s the difference. We&rsquo;ve been the maintenance technician troubleshooting a line at 2 a.m. We&rsquo;ve managed maintenance departments. We know the difference between someone who can <em>talk</em> about PLCs and someone who can actually <em>diagnose</em> one.</p>
      </div>
      <div class="grid grid-4">
        ${cards}
      </div>
      <ul class="checklist reveal" style="margin-top:2.4rem;max-width:60ch;margin-inline:auto">
        <li>${I.check}<span>We understand electrical troubleshooting, PLCs, automation, CMMS, TPM, predictive maintenance and reliability.</span></li>
        <li>${I.check}<span>We interview candidates <b>technically</b> &mdash; not just from a r&eacute;sum&eacute;.</span></li>
        <li>${I.check}<span>We recruit <b>direct hire only</b>, exclusively for manufacturing. That focus is why we&rsquo;re good at it.</span></li>
      </ul>
    </div>
  </section>

  <section class="section section--navy">
    <div class="container">
      <div class="split">
        <div class="reveal">
          <span class="eyebrow on-dark">Built around a real advantage</span>
          <h2>The McKinsey of manufacturing recruiting</h2>
          <p class="lead">We don&rsquo;t feel like a staffing company because we aren&rsquo;t one. EAS is the manufacturing talent authority &mdash; built by people who ran the maintenance and automation teams we now recruit.</p>
          <ul class="checklist" style="margin-top:1.4rem">
            <li>${I.shield}<span>We recruit <b>only</b> manufacturing.</span></li>
            <li>${I.shield}<span>We recruit <b>only</b> direct hire.</span></li>
            <li>${I.shield}<span>We understand maintenance and automation because we&rsquo;ve done it ourselves.</span></li>
            <li>${I.shield}<span>We guarantee our placements and follow a proven process.</span></li>
            <li>${I.shield}<span>We specialize in the hardest-to-fill technical roles.</span></li>
          </ul>
          <p style="margin-top:1.6rem"><a class="btn btn--primary" href="about.html">Why companies choose EAS ${I.arrow}</a></p>
        </div>
        <div class="split__media reveal">
          <img src="${IMG.engineer}" alt="Controls engineer reviewing automation systems in a manufacturing plant" loading="lazy" />
        </div>
      </div>
    </div>
  </section>

  ${positionsSection()}
  ${statsSection()}
  ${industriesSection()}
  ${processSection()}
  ${testimonialsSection(3)}

  <section class="section section--paper">
    <div class="container">
      <div class="section-head center reveal">
        <span class="eyebrow">This is manufacturing</span>
        <h2>It should feel like the floor &mdash; because that&rsquo;s where we come from</h2>
      </div>
      <div class="gallery reveal">
        <figure class="wide tall"><img src="${IMG.controlPanel}" alt="Industrial PLC control panel and wiring" loading="lazy" /></figure>
        <figure><img src="${IMG.conveyor}" alt="Packaging conveyor line" loading="lazy" /></figure>
        <figure><img src="${IMG.robotArm}" alt="Industrial robot arm on an automated line" loading="lazy" /></figure>
        <figure><img src="${IMG.technician}" alt="Maintenance technician troubleshooting equipment" loading="lazy" /></figure>
        <figure class="wide"><img src="${IMG.plantWide}" alt="Wide view of a manufacturing plant floor" loading="lazy" /></figure>
        <figure><img src="${IMG.wiring}" alt="Electrical control wiring and terminals" loading="lazy" /></figure>
      </div>
    </div>
  </section>

  ${resourcesTeaser()}
  ${ctaBand()}`;

  const jsonld = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "EmploymentAgency",
    name: SITE.full,
    description: "Manufacturing direct hire recruiting and executive search for maintenance, controls, PLC, automation, reliability, engineering and plant leadership roles.",
    url: SITE.domain,
    areaServed: ["United States", "Canada"],
    knowsAbout: ["Maintenance", "Controls Engineering", "PLC Programming", "Industrial Automation", "Reliability Engineering", "Plant Leadership"],
  });

  return page({
    title: "EAS | Manufacturing Direct Hire Recruiting — Maintenance, Controls & Automation",
    description: "EAS recruits the manufacturing professionals other recruiters can't. Direct hire only, manufacturing only — maintenance, controls, PLC, automation, reliability and plant leadership. 6-month placement guarantee.",
    current: "index.html",
    body,
    jsonld,
  });
}

function resourcesTeaser() {
  const cards = ARTICLES.slice(0, 3)
    .map(
      (a) => `<a class="card card--hover article-card reveal" href="${a.slug}.html"><span class="card__meta">${a.cat}</span><h3>${a.title}</h3><p>${a.excerpt}</p><span class="read">Read article ${I.arrow}</span></a>`
    )
    .join("\n        ");
  return `<section class="section">
    <div class="container">
      <div class="section-head center reveal">
        <span class="eyebrow">Resources</span>
        <h2>Hire smarter with the manufacturing talent authority</h2>
        <p class="lead measure center">Practical guidance from people who&rsquo;ve hired, managed and been the technical talent you&rsquo;re trying to find.</p>
      </div>
      <div class="grid grid-3">
        ${cards}
      </div>
    </div>
  </section>`;
}

/* ---------------------------------------------------------------------------
   PAGE: Direct Hire
--------------------------------------------------------------------------- */
function directHirePage() {
  const body = `${pageHero({
    crumbs: `<a href="index.html">Home</a> / <span>Direct Hire</span>`,
    eyebrow: "Our Core Service",
    h1: "Direct Hire Recruiting for Manufacturing",
    sub: "Permanent placements for the maintenance, controls, automation, reliability and leadership roles that keep your plant running. No temps. No staff augmentation. The right hire, made to last.",
  })}
  ${trustStrip()}

  <section class="section">
    <div class="container">
      <div class="split">
        <div class="reveal">
          <span class="eyebrow">What direct hire means here</span>
          <h2>We find the people who never answer a job posting</h2>
          <p class="lead">The best maintenance and automation professionals are already employed and not looking. They don&rsquo;t apply &mdash; they get recruited. Our entire model is built to reach them, vet them technically, and bring them to your team as permanent employees.</p>
          <ul class="checklist" style="margin-top:1.4rem">
            <li>${I.check}<span><b>Permanent, full-time placements</b> &mdash; your employee from day one.</span></li>
            <li>${I.check}<span><b>Passive candidate sourcing</b> through a deep manufacturing network.</span></li>
            <li>${I.check}<span><b>Technical screening</b> by recruiters who&rsquo;ve done the work.</span></li>
            <li>${I.check}<span><b>6-month placement guarantee</b> on every search.</span></li>
          </ul>
        </div>
        <div class="split__media reveal">
          <img src="${IMG.technician}" alt="Maintenance technician working on a production line" loading="lazy" />
        </div>
      </div>
    </div>
  </section>

  <section class="section section--paper">
    <div class="container">
      <div class="section-head center reveal">
        <span class="eyebrow">Why direct hire beats generic staffing</span>
        <h2>Specialists outperform generalists on the hard roles</h2>
      </div>
      <div class="grid grid-3">
        <div class="card reveal"><div class="card__icon">${I.search}</div><h3>We target, we don&rsquo;t post</h3><p>Job boards reach the 20% who are actively looking. We go after the 80% who aren&rsquo;t &mdash; the technicians and engineers already doing the job well somewhere else.</p></div>
        <div class="card reveal"><div class="card__icon">${I.chip}</div><h3>We screen technically</h3><p>We ask the questions you would ask: PLC platforms, troubleshooting approach, controls architecture, reliability methods. Resumes don&rsquo;t tell you who can actually do it.</p></div>
        <div class="card reveal"><div class="card__icon">${I.shield}</div><h3>We guarantee the fit</h3><p>Every placement is backed by a 6-month guarantee. We&rsquo;re not filling a seat &mdash; we&rsquo;re building your team, and we stand behind it.</p></div>
      </div>
    </div>
  </section>

  ${processSection()}

  <section class="section section--navy">
    <div class="container">
      <div class="section-head center reveal">
        <span class="eyebrow on-dark">Roles we place direct hire</span>
        <h2>From the floor to the front office</h2>
      </div>
      <div class="chips reveal" style="justify-content:center;max-width:60rem;margin-inline:auto">
        ${POSITIONS.map((p) => `<span class="chip">${p.name}</span>`).join("")}
      </div>
      <p class="center" style="margin-top:2rem"><a class="btn btn--primary" href="positions.html">Explore positions we recruit ${I.arrow}</a></p>
    </div>
  </section>

  ${testimonialsSection(3)}
  ${ctaBand()}`;

  return page({
    title: "Direct Hire Recruiting for Manufacturing | EAS",
    description: "EAS provides direct hire recruiting and executive search for manufacturing — maintenance, controls, PLC, automation, reliability and plant leadership. Passive candidate sourcing, technical screening, 6-month guarantee.",
    current: "direct-hire.html",
    body,
  });
}

/* ---------------------------------------------------------------------------
   PAGE: Positions
--------------------------------------------------------------------------- */
function positionsPage() {
  const cells = POSITIONS.map(
    (p) => `<div class="card card--hover reveal"><div class="card__icon">${p.icon}</div><h3>${p.name}</h3><p>Recruited and technically screened by people who have held this role on the floor.</p></div>`
  ).join("\n        ");

  const body = `${pageHero({
    crumbs: `<a href="index.html">Home</a> / <span>Positions</span>`,
    eyebrow: "Positions We Recruit",
    h1: "We recruit the technical roles that keep plants running",
    sub: "Don&rsquo;t make visitors guess. These are the maintenance, controls, automation, reliability and leadership seats we fill across North American manufacturing.",
  })}
  ${trustStrip()}

  <section class="section">
    <div class="container">
      <div class="grid grid-3">
        ${cells}
      </div>
    </div>
  </section>

  <section class="section section--paper">
    <div class="container">
      <div class="split split--reverse">
        <div class="reveal">
          <span class="eyebrow">How we screen</span>
          <h2>We interview on the work, not the keywords</h2>
          <p class="lead">Anyone can list &ldquo;PLC&rdquo; on a resume. We talk through real scenarios &mdash; a line down, an intermittent fault, a reliability problem &mdash; and listen for how a candidate actually thinks and troubleshoots.</p>
          <ul class="checklist" style="margin-top:1.4rem">
            <li>${I.check}<span>Platform fluency: Allen-Bradley, Siemens, and the controls stack you run.</span></li>
            <li>${I.check}<span>Hands-on troubleshooting and electrical diagnostics.</span></li>
            <li>${I.check}<span>Reliability methods: CMMS, TPM, RCM, predictive maintenance.</span></li>
            <li>${I.check}<span>Shift fit, stability and motivation &mdash; so the placement sticks.</span></li>
          </ul>
        </div>
        <div class="split__media reveal">
          <img src="${IMG.wiring}" alt="Technician working on industrial electrical wiring" loading="lazy" />
        </div>
      </div>
    </div>
  </section>

  ${ctaBand()}`;

  return page({
    title: "Positions We Recruit | Maintenance, Controls & Automation | EAS",
    description: "EAS recruits maintenance technicians, controls and automation engineers, PLC programmers, reliability engineers, plant managers and more for North American manufacturing. Direct hire only.",
    current: "positions.html",
    body,
  });
}

/* ---------------------------------------------------------------------------
   PAGE: Industries (overview)
--------------------------------------------------------------------------- */
function industriesPage() {
  const tiles = INDUSTRIES.map(
    (i) => `<a class="tile reveal" href="${i.slug}.html"><img src="${i.img}" alt="${i.name} manufacturing environment" loading="lazy" /><div class="tile__body"><h3>${i.name} Recruiting</h3><p>${i.blurb}</p><span class="tile__link">Explore ${i.name} ${I.arrow}</span></div></a>`
  ).join("\n        ");

  const body = `${pageHero({
    crumbs: `<a href="index.html">Home</a> / <span>Industries</span>`,
    eyebrow: "Industries We Serve",
    h1: "Dedicated search practices for every kind of plant",
    sub: "A generic page ranks for nothing. We build specialized recruiting practices by industry &mdash; so we already understand your equipment, your regulations and your uptime pressure before the first conversation.",
  })}
  ${trustStrip()}

  <section class="section">
    <div class="container">
      <div class="grid grid-3">
        ${tiles}
      </div>
    </div>
  </section>

  ${ctaBand()}`;

  return page({
    title: "Manufacturing Industries We Recruit For | EAS",
    description: "Specialized manufacturing recruiting by industry: food, dairy, bakery, packaging, beverage, cold storage, plastics, can, paper and chemical manufacturing. Maintenance, controls and automation direct hire.",
    current: "industries.html",
    body,
  });
}

/* ---------------------------------------------------------------------------
   PAGE: Industry detail (generated for each industry)
--------------------------------------------------------------------------- */
function industryDetailPage(ind) {
  const others = INDUSTRIES.filter((i) => i.slug !== ind.slug).slice(0, 6);
  const otherLinks = others
    .map((o) => `<a class="chip" href="${o.slug}.html">${o.name}</a>`)
    .join("");
  const rolePicks = POSITIONS.slice(0, 9)
    .map((p) => `<span class="chip">${p.name}</span>`)
    .join("");

  const body = `<section class="hero">
    <div class="hero__bg"><img src="${ind.img}" alt="${ind.name} manufacturing plant" /></div>
    <div class="hero__overlay"></div>
    <div class="container">
      <div class="hero__page">
        <nav class="crumbs" aria-label="Breadcrumb"><a href="index.html">Home</a> / <a href="industries.html">Industries</a> / <span>${ind.name}</span></nav>
        <span class="eyebrow on-dark">${ind.name} Recruiting</span>
        <h1>${ind.name} Maintenance &amp; Automation Recruiting</h1>
        <p class="hero__sub">${ind.blurb} EAS recruits the maintenance, controls and reliability professionals who keep ${ind.name.toLowerCase()} operations running &mdash; direct hire, nationwide.</p>
        <div class="hero__actions">
          <a class="btn btn--primary btn--lg" href="contact.html">Request ${ind.name} Candidates ${I.arrow}</a>
          <a class="btn btn--ghost btn--lg" href="positions.html">Roles We Recruit</a>
        </div>
      </div>
    </div>
  </section>
  ${trustStrip()}

  <section class="section">
    <div class="container">
      <div class="split">
        <div class="reveal prose">
          <span class="eyebrow">Why a ${ind.name} specialist</span>
          <h2>We speak your plant&rsquo;s language</h2>
          <p>Recruiting for ${ind.name.toLowerCase()} isn&rsquo;t the same as filling a generic warehouse role. The equipment, the regulatory environment and the cost of downtime are specific &mdash; and so are the people who can keep it all running.</p>
          <p>Because our recruiters have worked in manufacturing maintenance and automation, we understand what your ${ind.name.toLowerCase()} operation actually needs. We screen candidates on the systems and challenges unique to your environment, not just buzzwords on a resume.</p>
          <h3>What we recruit for ${ind.name.toLowerCase()} operations</h3>
          <ul>
            <li>Maintenance technicians and supervisors who know high-uptime environments</li>
            <li>Controls and automation engineers fluent in your PLC and line-control stack</li>
            <li>Reliability engineers and planners to drive down unplanned downtime</li>
            <li>Plant, maintenance and operations leadership to build the team</li>
          </ul>
        </div>
        <div class="reveal">
          <div class="card card--dark">
            <span class="eyebrow on-dark">At a glance</span>
            <h3 style="margin:.6rem 0 1rem;color:#fff">${ind.name} search</h3>
            <ul class="checklist">
              <li>${I.shield}<span>Direct hire only &mdash; permanent placements</span></li>
              <li>${I.map}<span>Nationwide search, U.S. &amp; Canada</span></li>
              <li>${I.chip}<span>Technically screened by former practitioners</span></li>
              <li>${I.clock}<span>6-month placement guarantee</span></li>
            </ul>
            <p style="margin-top:1.4rem"><a class="btn btn--primary btn--block" href="contact.html">Request candidates ${I.arrow}</a></p>
          </div>
        </div>
      </div>
      <div style="margin-top:2.4rem" class="reveal">
        <p class="eyebrow">Roles we commonly fill</p>
        <div class="chips" style="margin-top:.8rem">${rolePicks}</div>
      </div>
    </div>
  </section>

  ${testimonialsSection(3)}

  <section class="section section--paper">
    <div class="container">
      <div class="section-head reveal"><span class="eyebrow">More industries</span><h2>We specialize across manufacturing</h2></div>
      <div class="chips reveal">${otherLinks}<a class="chip" href="industries.html"><strong>View all &rarr;</strong></a></div>
    </div>
  </section>

  ${ctaBand()}`;

  const jsonld = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: `${ind.name} manufacturing recruiting`,
    provider: { "@type": "EmploymentAgency", name: SITE.full, url: SITE.domain },
    areaServed: ["United States", "Canada"],
    description: `Direct hire recruiting of maintenance, controls, automation and reliability professionals for ${ind.name.toLowerCase()} manufacturing operations.`,
  });

  return page({
    title: `${ind.name} Recruiting | Maintenance & Automation Direct Hire | EAS`,
    description: `Specialized ${ind.name.toLowerCase()} manufacturing recruiting. EAS places maintenance, controls, automation and reliability professionals direct hire, nationwide, with a 6-month guarantee.`,
    current: "industries.html",
    body,
    jsonld,
  });
}

/* ---------------------------------------------------------------------------
   PAGE: About
--------------------------------------------------------------------------- */
function aboutPage() {
  const body = `${pageHero({
    crumbs: `<a href="index.html">Home</a> / <span>About</span>`,
    eyebrow: "About EAS",
    h1: "We&rsquo;ve been the person you&rsquo;re trying to hire",
    sub: "EAS isn&rsquo;t a generic staffing company that happens to do manufacturing. Our background is what makes us different &mdash; and it&rsquo;s the reason companies trust us with their hardest technical roles.",
  })}
  ${trustStrip()}

  <section class="section">
    <div class="container">
      <div class="split">
        <div class="reveal">
          <span class="eyebrow">Our story</span>
          <h2>Built by maintenance and automation leaders</h2>
          <p class="lead">&ldquo;Our recruiters have worked in manufacturing. We&rsquo;ve been the maintenance technician troubleshooting a production line at 2&nbsp;a.m. We&rsquo;ve managed maintenance departments. We know the difference between someone who can talk about PLCs and someone who can actually diagnose one.&rdquo;</p>
          <p>Most recruiters have never set foot in a plant. They match keywords. We came up through the trades and engineering ranks &mdash; as PLC technicians, controls engineers, maintenance managers and reliability leaders &mdash; and we built EAS to recruit the way we always wished recruiters would.</p>
          <p>That authenticity is our entire advantage. When we call a passive candidate, they talk to us because we speak their language. When we present a candidate to you, it&rsquo;s because we&rsquo;ve technically vetted them ourselves.</p>
        </div>
        <div class="split__media reveal">
          <img src="${IMG.welding}" alt="Skilled tradesperson working in a manufacturing environment" loading="lazy" />
        </div>
      </div>
    </div>
  </section>

  <section class="section section--navy">
    <div class="container">
      <div class="section-head center reveal">
        <span class="eyebrow on-dark">Why manufacturing companies choose EAS</span>
        <h2>Credibility you can&rsquo;t fake</h2>
      </div>
      <div class="grid grid-3">
        <div class="card card--dark reveal"><div class="card__icon">${I.badge}</div><h3>Former Maintenance Manager</h3><p>We&rsquo;ve owned the department, the budget and the downtime accountability.</p></div>
        <div class="card card--dark reveal"><div class="card__icon">${I.chip}</div><h3>Former PLC Technician</h3><p>We&rsquo;ve stood at the panel and diagnosed the fault, not just read about it.</p></div>
        <div class="card card--dark reveal"><div class="card__icon">${I.gear}</div><h3>Former Controls Engineer</h3><p>We&rsquo;ve designed, commissioned and debugged real automation systems.</p></div>
        <div class="card card--dark reveal"><div class="card__icon">${I.users}</div><h3>Former Maintenance Leader</h3><p>We&rsquo;ve built and led the kinds of teams we now help you build.</p></div>
        <div class="card card--dark reveal"><div class="card__icon">${I.gauge}</div><h3>Reliability fluent</h3><p>We understand CMMS, TPM, RCM and predictive maintenance in practice.</p></div>
        <div class="card card--dark reveal"><div class="card__icon">${I.search}</div><h3>We interview technically</h3><p>Candidates are vetted on the work &mdash; not just what&rsquo;s on the r&eacute;sum&eacute;.</p></div>
      </div>
    </div>
  </section>

  ${statsSection()}

  <section class="section section--paper">
    <div class="container">
      <div class="section-head center reveal">
        <span class="eyebrow">What we believe</span>
        <h2>The McKinsey of manufacturing recruiting</h2>
        <p class="lead measure center">We&rsquo;d rather be the undisputed authority in one thing than mediocre at everything. So we recruit only manufacturing, only direct hire, and only the technical roles we understand deeply.</p>
      </div>
      <ul class="checklist reveal" style="max-width:54ch;margin-inline:auto">
        <li>${I.check}<span>We recruit <b>only</b> manufacturing.</span></li>
        <li>${I.check}<span>We recruit <b>only</b> direct hire.</span></li>
        <li>${I.check}<span>We understand maintenance and automation because we&rsquo;ve done it.</span></li>
        <li>${I.check}<span>We guarantee our placements.</span></li>
        <li>${I.check}<span>We follow a proven, technical process.</span></li>
        <li>${I.check}<span>We specialize in the hardest-to-fill roles.</span></li>
      </ul>
    </div>
  </section>

  ${ctaBand()}`;

  return page({
    title: "About EAS | The Manufacturing Talent Authority",
    description: "EAS was built by former maintenance managers, PLC technicians and controls engineers. We recruit manufacturing direct hire because we&rsquo;ve done the work ourselves — and we screen candidates technically.",
    current: "about.html",
    body,
  });
}

/* ---------------------------------------------------------------------------
   PAGE: Success Stories
--------------------------------------------------------------------------- */
function successPage() {
  const quotes = TESTIMONIALS.map(
    (t) => `<figure class="quote reveal"><div class="quote__mark">&ldquo;</div><p>${t.q}</p><figcaption class="quote__by"><span class="quote__avatar">${t.a}</span><span><span class="quote__name">${t.n}</span><br><span class="quote__role">${t.r}</span></span></figcaption></figure>`
  ).join("\n        ");

  const cases = [
    { metric: "5 weeks", t: "Reliability engineer seat open 8 months", d: "A beverage manufacturer had cycled through two agencies. We mapped the regional reliability talent pool, engaged a passive candidate, and closed the hire in five weeks." },
    { metric: "3 hires", t: "Built a controls team from scratch", d: "A growing food plant needed to stand up an automation group. We placed a controls lead and two engineers who could actually program the lines &mdash; not just spec them." },
    { metric: "0 turnover", t: "Maintenance supervisors that stayed", d: "After repeated 90-day washouts from a volume staffing firm, the client switched to EAS. Both direct-hire supervisors we placed are still in seat two years on." },
  ];
  const caseCards = cases
    .map((c) => `<div class="card reveal"><div class="stat__num" style="color:var(--amber-600);font-size:2.4rem">${c.metric}</div><h3 style="margin:.5rem 0 .5rem">${c.t}</h3><p>${c.d}</p></div>`)
    .join("\n        ");

  const body = `${pageHero({
    crumbs: `<a href="index.html">Home</a> / <span>Success Stories</span>`,
    eyebrow: "Success Stories",
    h1: "Results that build trust",
    sub: "The biggest thing a recruiting partner can offer is proof. Here&rsquo;s what plant leaders, maintenance managers, directors and placed candidates say about working with EAS.",
  })}
  ${trustStrip()}

  <section class="section">
    <div class="container">
      <div class="section-head center reveal"><span class="eyebrow">Outcomes</span><h2>What it looks like when the search is run right</h2></div>
      <div class="grid grid-3">
        ${caseCards}
      </div>
      <p class="form__note center" style="margin-top:1.4rem">Representative results based on typical EAS searches. Add your own verified case studies and metrics here as they&rsquo;re approved by clients.</p>
    </div>
  </section>

  <section class="section section--paper">
    <div class="container">
      <div class="section-head center reveal"><span class="eyebrow">In their words</span><h2>From plant managers, leaders and candidates</h2></div>
      <div class="grid grid-3">
        ${quotes}
      </div>
    </div>
  </section>

  ${statsSection()}
  ${ctaBand()}`;

  return page({
    title: "Success Stories & Testimonials | EAS Manufacturing Recruiting",
    description: "See what plant managers, maintenance leaders and placed candidates say about EAS — the manufacturing direct hire firm that recruits and screens technically.",
    current: "success-stories.html",
    body,
  });
}

/* ---------------------------------------------------------------------------
   PAGE: Resources (index)
--------------------------------------------------------------------------- */
function resourcesPage() {
  const cards = ARTICLES.map(
    (a) => `<a class="card card--hover article-card reveal" href="${a.slug}.html"><span class="card__meta">${a.cat}</span><h3>${a.title}</h3><p>${a.excerpt}</p><span class="read">Read article ${I.arrow}</span></a>`
  ).join("\n        ");

  const body = `${pageHero({
    crumbs: `<a href="index.html">Home</a> / <span>Resources</span>`,
    eyebrow: "Resources",
    h1: "Insights from the manufacturing talent authority",
    sub: "Practical hiring guidance, market insight and interview tools from people who&rsquo;ve hired, managed and been the technical talent you&rsquo;re searching for.",
  })}

  <section class="section">
    <div class="container">
      <div class="grid grid-3">
        ${cards}
      </div>
    </div>
  </section>

  ${ctaBand()}`;

  return page({
    title: "Resources | Manufacturing Hiring Insights | EAS",
    description: "Hiring guides, market insight and interview kits for manufacturing maintenance, controls and automation roles — from EAS, the manufacturing talent authority.",
    current: "resources.html",
    body,
  });
}

/* ---------------------------------------------------------------------------
   PAGE: Article detail (generated for each article)
--------------------------------------------------------------------------- */
function articlePage(art, idx) {
  const others = ARTICLES.filter((a) => a.slug !== art.slug).slice(0, 3);
  const otherCards = others
    .map((a) => `<a class="card card--hover article-card reveal" href="${a.slug}.html"><span class="card__meta">${a.cat}</span><h3>${a.title}</h3><span class="read">Read ${I.arrow}</span></a>`)
    .join("\n        ");

  const intro = art.excerpt;
  const content = ARTICLE_CONTENT[art.slug] || `<p>${intro}</p>`;
  const body = `<section class="hero">
    <div class="hero__bg"><img src="${IMG.factoryFloor}" alt="" aria-hidden="true" /></div>
    <div class="hero__overlay"></div>
    <div class="container">
      <div class="hero__page" style="max-width:720px">
        <nav class="crumbs" aria-label="Breadcrumb"><a href="index.html">Home</a> / <a href="resources.html">Resources</a> / <span>${art.cat}</span></nav>
        <span class="eyebrow on-dark">${art.cat}</span>
        <h1 style="font-size:clamp(2rem,4.2vw,3rem)">${art.title}</h1>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div style="max-width:70ch;margin-inline:auto" class="prose reveal">
        <p class="lead">${intro}</p>
        <hr class="divider" />
        ${content}
        <p style="margin-top:1.6rem"><a class="btn btn--primary" href="contact.html">Talk to a recruiter who&rsquo;s done the job ${I.arrow}</a></p>
      </div>
    </div>
  </section>

  <section class="section section--paper">
    <div class="container">
      <div class="section-head reveal"><span class="eyebrow">Keep reading</span><h2>More from the resource library</h2></div>
      <div class="grid grid-3">
        ${otherCards}
      </div>
    </div>
  </section>

  ${ctaBand()}`;

  const jsonld = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Article",
    headline: art.title,
    description: art.excerpt,
    about: art.cat,
    publisher: { "@type": "Organization", name: SITE.full, url: SITE.domain },
  });

  return page({
    title: `${art.title} | EAS Resources`,
    description: art.excerpt,
    current: "resources.html",
    body,
    jsonld,
  });
}

/* ---------------------------------------------------------------------------
   PAGE: Contact
--------------------------------------------------------------------------- */
function contactPage() {
  const roleOptions = POSITIONS.map((p) => `<option>${p.name}</option>`).join("");
  const indOptions = INDUSTRIES.map((i) => `<option>${i.name}</option>`).join("");

  const body = `${pageHero({
    crumbs: `<a href="index.html">Home</a> / <span>Contact</span>`,
    eyebrow: "Request Candidates",
    h1: "Need a maintenance technician? A PLC engineer? A maintenance manager?",
    sub: "Tell us about the role. We&rsquo;ll come back with a short list of technically screened, genuinely interested candidates &mdash; not a stack of resumes.",
  })}

  <section class="section">
    <div class="container">
      <div class="split">
        <div class="reveal">
          <form class="form" data-form action="${FORM.endpoint}" method="post" novalidate aria-label="Request candidates">
            <input type="hidden" name="_subject" value="New candidate request from eautomatedstaffing.com" />
            <input type="text" name="_gotcha" tabindex="-1" autocomplete="off" aria-hidden="true" style="position:absolute;left:-9999px;width:1px;height:1px;opacity:0" />
            <div class="form-success">Thank you &mdash; your request has been received. A recruiter who has done the job will be in touch shortly.</div>
            <div class="form-error" role="alert">Something went wrong sending your request. Please email <a href="mailto:${SITE.email}">${SITE.email}</a> or call <a href="${SITE.phoneHref}">${SITE.phone}</a>.</div>
            <div class="form__fields">
              <div class="form__row">
                <div class="field"><label for="name">Your name</label><input id="name" name="name" required autocomplete="name" /></div>
                <div class="field"><label for="company">Company</label><input id="company" name="company" required autocomplete="organization" /></div>
              </div>
              <div class="form__row">
                <div class="field"><label for="email">Work email</label><input id="email" name="email" type="email" required autocomplete="email" /></div>
                <div class="field"><label for="phone">Phone</label><input id="phone" name="phone" type="tel" autocomplete="tel" /></div>
              </div>
              <div class="form__row">
                <div class="field"><label for="role">Role you&rsquo;re hiring</label><select id="role" name="role"><option value="">Select a role&hellip;</option>${roleOptions}<option>Other</option></select></div>
                <div class="field"><label for="industry">Industry</label><select id="industry" name="industry"><option value="">Select an industry&hellip;</option>${indOptions}<option>Other</option></select></div>
              </div>
              <div class="field"><label for="details">Tell us about the role</label><textarea id="details" name="details" placeholder="Location, shift, equipment / PLC platforms, must-have skills, target start date&hellip;"></textarea></div>
              <button class="btn btn--primary btn--lg btn--block" type="submit">Request Candidates ${I.arrow}</button>
              <p class="form__note">By submitting you agree to be contacted about your hiring needs. Submissions are delivered to ${SITE.email} once the form endpoint is configured (see README).</p>
            </div>
          </form>
        </div>
        <div class="reveal">
          <div class="card card--dark">
            <span class="eyebrow on-dark">Talk to a recruiter</span>
            <h3 style="margin:.6rem 0 1.2rem;color:#fff">Direct line to the team</h3>
            <ul class="info-list">
              <li><span class="info-ic">${I.phone}</span><span><span class="lbl">Call</span><br><span class="val"><a href="${SITE.phoneHref}">${SITE.phone}</a></span></span></li>
              <li><span class="info-ic">${I.mail}</span><span><span class="lbl">Email</span><br><span class="val"><a href="mailto:${SITE.email}">${SITE.email}</a></span></span></li>
              <li><span class="info-ic">${I.map}</span><span><span class="lbl">Coverage</span><br><span class="val">${SITE.region}</span></span></li>
              <li><span class="info-ic">${I.clock}</span><span><span class="lbl">Response time</span><br><span class="val">We respond to hiring inquiries within one business day.</span></span></li>
            </ul>
            <hr style="border:0;border-top:1px solid var(--line-dark);margin:1.4rem 0" />
            <p class="eyebrow on-dark" style="margin-bottom:.7rem">Are you a candidate?</p>
            <p style="color:var(--on-dark-soft);font-size:.96rem">Looking for your next role in maintenance, controls or automation? Email us your r&eacute;sum&eacute; &mdash; you&rsquo;ll talk to a recruiter who understands the work.</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  ${statsSection()}`;

  return page({
    title: "Request Candidates | Contact EAS Manufacturing Recruiting",
    description: "Request technically screened maintenance, controls, automation and reliability candidates from EAS. Direct hire, nationwide, 6-month guarantee. Tell us about your role.",
    current: "contact.html",
    body,
  });
}

/* ---------------------------------------------------------------------------
   404
--------------------------------------------------------------------------- */
function notFoundPage() {
  const body = `<section class="hero">
    <div class="hero__bg"><img src="${IMG.factoryFloor}" alt="" aria-hidden="true" /></div>
    <div class="hero__overlay"></div>
    <div class="container">
      <div class="hero__page center" style="margin-inline:auto">
        <span class="eyebrow on-dark" style="justify-content:center">404</span>
        <h1>This line is down</h1>
        <p class="hero__sub" style="margin-inline:auto">We couldn&rsquo;t find that page. Let&rsquo;s get you back to running.</p>
        <div class="hero__actions" style="justify-content:center">
          <a class="btn btn--primary btn--lg" href="index.html">Back to home ${I.arrow}</a>
          <a class="btn btn--ghost btn--lg" href="contact.html">Request candidates</a>
        </div>
      </div>
    </div>
  </section>`;
  return page({ title: "Page not found | EAS", description: "Page not found.", current: "", body });
}

/* ---------------------------------------------------------------------------
   Extra files: sitemap, robots
--------------------------------------------------------------------------- */
function sitemap(urls) {
  const items = urls
    .map((u) => `  <url><loc>${SITE.domain}/${u}</loc></url>`)
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${items}
</urlset>
`;
}

/* ---------------------------------------------------------------------------
   Build
--------------------------------------------------------------------------- */
function write(name, content) {
  writeFileSync(join(ROOT, name), content);
  return name;
}

const written = [];
written.push(write("index.html", homePage()));
written.push(write("direct-hire.html", directHirePage()));
written.push(write("industries.html", industriesPage()));
written.push(write("positions.html", positionsPage()));
written.push(write("about.html", aboutPage()));
written.push(write("success-stories.html", successPage()));
written.push(write("resources.html", resourcesPage()));
written.push(write("contact.html", contactPage()));
written.push(write("404.html", notFoundPage()));

for (const ind of INDUSTRIES) {
  written.push(write(`${ind.slug}.html`, industryDetailPage(ind)));
}
for (let i = 0; i < ARTICLES.length; i++) {
  written.push(write(`${ARTICLES[i].slug}.html`, articlePage(ARTICLES[i], i)));
}

const urls = ["", ...written.filter((f) => f !== "404.html")];
write("sitemap.xml", sitemap(urls));
write("robots.txt", `User-agent: *\nAllow: /\nSitemap: ${SITE.domain}/sitemap.xml\n`);

/* Apache/.htaccess for GoDaddy cPanel (Linux) hosting: custom 404 page,
   sensible caching, and gzip compression. Ignored by non-Apache hosts. */
write(".htaccess", `# EAS static site — Apache config (GoDaddy cPanel / Linux hosting)
Options -Indexes
DirectoryIndex index.html

ErrorDocument 404 /404.html

<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css application/javascript image/svg+xml application/xml
</IfModule>

<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType text/css "access plus 7 days"
  ExpiresByType application/javascript "access plus 7 days"
  ExpiresByType image/svg+xml "access plus 30 days"
  ExpiresByType image/jpeg "access plus 30 days"
  ExpiresByType image/png "access plus 30 days"
  ExpiresByType text/html "access plus 1 hour"
</IfModule>
`);

console.log(`Built ${written.length} pages + sitemap.xml + robots.txt + .htaccess`);
written.forEach((f) => console.log("  " + f));
