// @ts-check
/**
 * Community Engagement Checklist content, from the CE4CSID Working Group document:
 * eight stages, forty two actions, wording taken from the source checklist.
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
    id: "identify",
    title: "Community Identification and Contextual Understanding",
    description:
      "Establish who the community is, how it is organised, and what shapes everyday life there before any engagement begins.",
    items: [
      {
        id: "identify_target",
        label: "Identify the target community",
        desc: "Name the community you intend to work with, and be able to say why that definition is the right one rather than the convenient one.",
      },
      {
        id: "identify_stakeholders",
        label: "Identify key stakeholders, marginalised populations and vulnerable groups",
        desc: "Map who holds influence, who is usually consulted, and who is usually missed out, including groups whose needs are easy to overlook.",
      },
      {
        id: "identify_mapping",
        label: "Conduct preliminary geographical mapping",
        desc: "Understand the community's location, resources, infrastructure and accessibility, including how people actually travel to reach services.",
      },
      {
        id: "identify_governance",
        label: "Identify governance structures, leadership and preferred communication channels",
        desc: "Find out who speaks for the community, and how information genuinely travels, rather than assuming a notice board or radio reaches everyone.",
      },
      {
        id: "identify_diversity",
        label:
          "Consider gender, disability, accessibility, socioeconomic diversity and cultural practices",
        desc: "Note how these shape participation, and what would need to change for the engagement to include people who are usually excluded.",
      },
    ],
  },
  {
    id: "consult",
    title: "Initial Community Consultation and Problem Identification",
    description:
      "Approach the community properly, agree how you will work together, and let the community help define the problem.",
    items: [
      {
        id: "consult_permission",
        label: "Approach community leaders and stakeholders and obtain permission to begin",
        desc: "Ask before you arrive. Document who granted permission and on what basis, so the record matches the practice.",
      },
      {
        id: "consult_indigenous",
        label:
          "Invite collaboration with Indigenous peoples and other community groups where relevant",
        desc: "Partnership, not consultation. Agree what the community gains from taking part before asking for their time.",
      },
      {
        id: "consult_concerns",
        label:
          "Consult community representatives on their preliminary CSID concerns and priorities",
        desc: "Ask open questions and record the answers in their words, not translated into your own framing too early.",
      },
      {
        id: "consult_problem",
        label: "Jointly identify a CSID problem or research priority relevant to the community",
        desc: "The priority should be recognisable to the community as theirs, not a research question with community participation attached.",
      },
    ],
  },
  {
    id: "design",
    title: "Participatory Research and Engagement Design",
    description:
      "Design the work with the community, with roles, ethics and communication agreed in advance.",
    items: [
      {
        id: "design_framework",
        label: "Develop a community engagement plan guided by a participatory framework",
        desc: "Choose an approach you can explain in plain language, and say how it shapes the decisions you will make.",
      },
      {
        id: "design_needs",
        label: "Design a participatory needs assessment with community input",
        desc: "Communities should help shape the questions, not only answer them.",
      },
      {
        id: "design_roles",
        label:
          "Define the roles and responsibilities of researchers, community representatives and partners",
        desc: "Write down who decides what, and what happens when the two sides disagree.",
      },
      {
        id: "design_ethics",
        label: "Build in consent, privacy, safeguarding and responsible data usage",
        desc: "These belong in the design, not in the ethics application after the design is finished.",
      },
      {
        id: "design_inclusion",
        label: "Establish inclusive approaches to participation and decision making",
        desc: "Say how quieter voices reach the table, and how decisions are recorded so they can be checked later.",
      },
      {
        id: "design_dissemination",
        label: "Draft a preliminary strategy for communicating findings in appropriate formats",
        desc: "Decide early how results will come back to the community, in what language and through which channel.",
      },
    ],
  },
  {
    id: "approvals",
    title: "Ethical and Institutional Approvals",
    description:
      "Secure the approvals, permits and consent procedures the work requires, and keep them current.",
    items: [
      {
        id: "approvals_ethics",
        label: "Obtain ethical approval from the relevant committees or institutions",
        desc: "Check the approved version matches what you will actually do, and amend it if the community changes the plan.",
      },
      {
        id: "approvals_permits",
        label: "Obtain additional permits, institutional authorisations or community permissions",
        desc: "Requirements vary by country and district. Build in the time rather than discovering it late.",
      },
      {
        id: "approvals_consent",
        label: "Establish procedures for documenting informed consent and managing data securely",
        desc: "Describe how consent is taken, recorded and withdrawn, and where the data is held.",
      },
    ],
  },
  {
    id: "resources",
    title: "Resource Planning and Implementation Preparation",
    description: "Get the practical things in place, funded and tested before activities begin.",
    items: [
      {
        id: "resources_workplan",
        label: "Develop a detailed work plan with activities, milestones and a realistic timeline",
        desc: "Use realistic timelines that account for community calendars, seasons and approval delays.",
      },
      {
        id: "resources_budget",
        label: "Prepare a budget covering activities, tools and accessibility requirements",
        desc: "Include transport, accessibility, translation and community time. Unfunded engagement becomes token engagement.",
      },
      {
        id: "resources_materials",
        label: "Develop accessible materials with community input",
        desc: "Participants are better judges of whether a document makes sense than the team that wrote it.",
      },
      {
        id: "resources_language",
        label: "Arrange interpretation, transcription and translation where necessary",
        desc: "Check interpreters understand the technical terms, and agree how sensitive topics will be handled.",
      },
      {
        id: "resources_logistics",
        label: "Identify venues, transport, communication tools and accessibility arrangements",
        desc: "Test the practicalities before the day. Accessible engagement is a logistics problem before it is a values problem.",
      },
      {
        id: "resources_me",
        label: "Establish a monitoring plan with indicators and feedback mechanisms",
        desc: "Agree how you will know the engagement is working, and how the community can tell you when it is not.",
      },
    ],
  },
  {
    id: "implement",
    title: "Implementation and Community Engagement",
    description: "Carry out the activities with the community, and respond to what happens.",
    items: [
      {
        id: "implement_activities",
        label: "Implement the planned activities in collaboration with community representatives",
        desc: "Run them with the community rather than for them, including the parts that feel routine.",
      },
      {
        id: "implement_needs",
        label: "Conduct the needs assessment and refine activities using its findings",
        desc: "Be willing to change the plan. Gathering findings and ignoring them damages trust.",
      },
      {
        id: "implement_voluntary",
        label:
          "Ensure participation is voluntary, inclusive, accessible and culturally appropriate",
        desc: "Check in practice, not only on paper. Watch who is in the room and who is not.",
      },
      {
        id: "implement_feedback",
        label: "Set up accessible ways to receive and respond to feedback and concerns",
        desc: "Describe how concerns are acknowledged, handled and reported back, and who is accountable.",
      },
      {
        id: "implement_document",
        label: "Document activities and address emerging challenges, risks and ethical concerns",
        desc: "Keep records good enough that someone else could continue the work.",
      },
    ],
  },
  {
    id: "monitoring",
    title: "Participatory Monitoring, Evaluation and Learning",
    description:
      "Review what happened with the community, and use what you learn to adjust the work.",
    items: [
      {
        id: "monitoring_progress",
        label:
          "Monitor participation, inclusivity, activity delivery and progress against indicators",
        desc: "Look at who has been reached and who has not, rather than only whether the activity happened.",
      },
      {
        id: "monitoring_interpret",
        label: "Involve community members in reviewing and interpreting findings",
        desc: "Community interpretation catches misunderstandings the research team would otherwise repeat.",
      },
      {
        id: "monitoring_evaluate",
        label: "Evaluate whether the engagement met community needs and achieved its objectives",
        desc: "Judge it against the objectives the community helped set, not only the ones written in the proposal.",
      },
      {
        id: "monitoring_lessons",
        label: "Document lessons learned, community feedback and recommendations",
        desc: "Record them somewhere that outlasts the project and is findable by the next team.",
      },
      {
        id: "monitoring_refine",
        label: "Use the findings to refine the engagement approach",
        desc: "Close the loop. Monitoring that changes nothing is administration.",
      },
    ],
  },
  {
    id: "disseminate",
    title: "Results Dissemination, Community Feedback and Sustainability",
    description:
      "Return the findings to the community, in their terms, and leave something that continues.",
    items: [
      {
        id: "disseminate_findings",
        label: "Disseminate research findings and outputs to the community in a timely manner",
        desc: "Timely means while it still matters to them. A report two years late is an archived file.",
      },
      {
        id: "disseminate_formats",
        label: "Use channels, languages and formats tailored to the community's preferences",
        desc: "Match how the community already shares information, rather than how the institution prefers to publish.",
      },
      {
        id: "disseminate_discuss",
        label: "Provide opportunities for the community to discuss, validate and respond",
        desc: "Dissemination is a conversation with a right of reply, not an announcement.",
      },
      {
        id: "disseminate_access",
        label: "Make resulting resources, interventions and tools accessible to the community",
        desc: "Where relevant and feasible, the outputs should be usable by the people who made the work possible.",
      },
      {
        id: "disseminate_sustain",
        label: "Identify opportunities for community ownership and continued partnerships",
        desc: "Agree what continues after the funding ends, and who carries it.",
      },
      {
        id: "disseminate_attribution",
        label: "Communicate how community contributions and feedback influenced the research",
        desc: "Say plainly what changed because of them. It is the clearest evidence that the engagement was real.",
      },
    ],
  },
];

/** Total number of checklist actions across all stages. */
export const ACTION_COUNT = STAGES.reduce((sum, stage) => sum + stage.items.length, 0);
