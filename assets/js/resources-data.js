// @ts-check
/**
 * Single source of truth for toolkit resources.
 * Both resources.html and downloads.html render from this module.
 * To add a resource: drop the file in /downloads and add an entry here.
 */

/** @typedef {import("./util.js").Category} Category */
/** @typedef {import("./util.js").Resource} Resource */

/** @type {Category[]} */
export const CATEGORIES = [
  {
    id: "planning-guidance",
    title: "Planning Guidance",
    color: "lime",
    description:
      "Step by step guidance for building engagement into a CSID study from the earliest design decisions through to fieldwork and beyond.",
  },
  {
    id: "engagement-frameworks",
    title: "Engagement Frameworks",
    color: "blue",
    description:
      "Structured approaches for mapping who to engage, and choosing the right channels to reach them.",
  },
  {
    id: "case-examples",
    title: "Case Examples",
    color: "purple",
    description:
      "Illustrations of engagement practice in real CSID contexts, including what worked and what could have been stronger.",
  },
  {
    id: "templates",
    title: "Templates",
    color: "yellow",
    description:
      "Ready to adapt Word documents for planning engagement and preparing consent materials.",
  },
];

/** @type {Resource[]} */
export const RESOURCES = [
  {
    id: "community-entry-protocol",
    title: "Community Entry Protocol",
    description:
      "A step by step guide for approaching a community respectfully and correctly before any research activity begins.",
    category: "planning-guidance",
    type: "PDF",
    size: "4 KB",
    file: "downloads/planning-guidance-community-entry-protocol.pdf",
  },
  {
    id: "engaging-from-design",
    title: "Engaging Communities from Project Design",
    description:
      "Guidance for building engagement into a study's methodology, timeline, and budget from the outset.",
    category: "planning-guidance",
    type: "PDF",
    size: "4 KB",
    file: "downloads/planning-guidance-engaging-from-design.pdf",
  },
  {
    id: "stakeholder-mapping",
    title: "Stakeholder Mapping Framework",
    description:
      "A structured approach for identifying who is affected, who represents them, and who holds influence or trust.",
    category: "engagement-frameworks",
    type: "PDF",
    size: "4 KB",
    file: "downloads/framework-stakeholder-mapping.pdf",
  },
  {
    id: "channel-selection",
    title: "Engagement Channel Selection Framework",
    description:
      "A framework for choosing engagement methods and channels that fit the community context.",
    category: "engagement-frameworks",
    type: "PDF",
    size: "4 KB",
    file: "downloads/framework-engagement-channel-selection.pdf",
  },
  {
    id: "flood-response",
    title: "Community Engagement in a Flood Response CSID Study",
    description:
      "An illustrative case example of engagement practice in a flood related, waterborne disease context.",
    category: "case-examples",
    type: "PDF",
    size: "4 KB",
    file: "downloads/case-example-flood-response.pdf",
  },
  {
    id: "vector-control",
    title: "Community Engagement in a Vector Control Programme",
    description:
      "An illustrative case example of engagement practice in a vector borne disease context.",
    category: "case-examples",
    type: "PDF",
    size: "4 KB",
    file: "downloads/case-example-vector-control.pdf",
  },
  {
    id: "engagement-plan",
    title: "Engagement Plan Template",
    description:
      "A structured Word template covering stakeholders, activities, schedule, feedback loop, and budget.",
    category: "templates",
    type: "DOCX",
    size: "10 KB",
    file: "downloads/template-engagement-plan.docx",
  },
  {
    id: "consent-briefing-note",
    title: "Consent and Briefing Note Template",
    description:
      "A Word template for preparing a plain language briefing and consent note for participants.",
    category: "templates",
    type: "DOCX",
    size: "10 KB",
    file: "downloads/template-consent-briefing-note.docx",
  },
];

/** Total number of downloadable resources. */
export const RESOURCE_COUNT = RESOURCES.length;
