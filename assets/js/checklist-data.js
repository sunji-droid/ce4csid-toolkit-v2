// @ts-check
/**
 * Community Engagement Checklist content: five stages, twenty actions.
 * Kept separate from behaviour so it can be tested and reused.
 */

/**
 * @typedef {Object} ChecklistItem
 * @property {string} id
 * @property {string} label
 * @property {string} desc
 */

/**
 * @typedef {Object} Stage
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {ChecklistItem[]} items
 */

/** @type {Stage[]} */
export const STAGES = [
  {
    id: "design",
    title: "Project Design",
    description: "Lay the foundation for engagement before fieldwork or study design is finalised.",
    items: [
      { id: "design_scope", label: "Define the CSID issue and geographic scope in plain, non technical language", desc: "Write a short summary of the research question that a community member with no scientific background could understand and react to." },
      { id: "design_intent", label: "State why community engagement is needed for this specific project", desc: "Be explicit about what engagement is expected to change, inform, or improve, rather than treating it as a formality." },
      { id: "design_budget", label: "Set aside a dedicated budget and timeline for engagement activities", desc: "Engagement done at the last minute, with no funding of its own, is the most common cause of tokenistic involvement." },
      { id: "design_risks", label: "Identify risks of excluding affected communities from early design decisions", desc: "Consider reputational, ethical, and scientific risks, including blind spots the research team may not see on its own." },
    ],
  },
  {
    id: "stakeholders",
    title: "Stakeholder Identification",
    description: "Map who is affected, who represents them, and who holds influence or trust.",
    items: [
      { id: "stake_map", label: "Create a stakeholder map covering directly affected residents, local leaders, and service providers", desc: "Go beyond formal leadership structures. Include informal community networks, youth groups, and marginalised voices." },
      { id: "stake_gatekeepers", label: "Identify legitimate community gatekeepers and entry points", desc: "Confirm the correct protocol for approaching a community, including any traditional or local government authorities that expect to be consulted first." },
      { id: "stake_vulnerable", label: "Flag groups at heightened CSID risk who are often underrepresented", desc: "For example, informal settlement residents, outdoor workers, subsistence farmers, or people with limited access to health services." },
      { id: "stake_conflicts", label: "Note any existing tensions or history between the community and past research or health projects", desc: "Past negative experiences with researchers or government programmes will shape how the community responds to this project." },
    ],
  },
  {
    id: "planning",
    title: "Engagement Planning",
    description: "Decide how, when, and through which channels engagement will actually happen.",
    items: [
      { id: "plan_methods", label: "Select engagement methods appropriate to the context", desc: "Consider community meetings, household visits, radio, local language materials, or existing community structures such as health committees." },
      { id: "plan_schedule", label: "Build an engagement schedule aligned with the research timeline", desc: "Include time for community feedback to actually influence decisions, not only for announcing decisions already made." },
      { id: "plan_consent", label: "Prepare consent and information materials in the language and literacy level of the community", desc: "Materials should explain the CSID issue, what participation involves, and how data will be used and protected." },
      { id: "plan_feedbackloop", label: "Design a clear feedback loop for how community input will be recorded and acted on", desc: "Decide in advance who is responsible for reviewing community input and how decisions arising from it will be communicated back." },
    ],
  },
  {
    id: "implementation",
    title: "Implementation",
    description: "Carry out engagement activities and keep the relationship active throughout the project.",
    items: [
      { id: "impl_intro", label: "Hold an initial community introduction session before data collection begins", desc: "Use this session to explain the project, answer questions honestly, and confirm community willingness to proceed." },
      { id: "impl_training", label: "Brief all field staff on engagement protocols and cultural expectations", desc: "Everyone representing the project in the field should be able to explain the study and engagement process consistently." },
      { id: "impl_records", label: "Keep a running record of engagement activities, attendance, and issues raised", desc: "This record supports accountability and provides evidence for the evaluation stage." },
      { id: "impl_grievance", label: "Set up a simple channel for community members to raise concerns during the project", desc: "This can be as simple as a named contact person and phone number shared at every engagement activity." },
    ],
  },
  {
    id: "evaluation",
    title: "Feedback and Evaluation",
    description: "Close the loop with the community and capture lessons for future CSID work.",
    items: [
      { id: "eval_share", label: "Share findings back with the community in accessible, non technical form", desc: "Consider a short community meeting, a plain language summary, or a local radio segment ahead of, or alongside, any academic publication." },
      { id: "eval_input", label: "Collect community feedback on the engagement process itself", desc: "Ask what worked, what felt excluded, and what should be done differently next time." },
      { id: "eval_lessons", label: "Document lessons learned for future CSID engagement work", desc: "Add these lessons to internal guidance so the next project team does not start from zero." },
      { id: "eval_continuity", label: "Agree on how the relationship with the community will continue after the project ends", desc: "Communities frequently host repeated research. Ending well protects trust for future engagement." },
    ],
  },
];

/** Total number of checklist actions across all stages. */
export const ACTION_COUNT = STAGES.reduce((sum, stage) => sum + stage.items.length, 0);
