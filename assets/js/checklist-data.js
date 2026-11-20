// @ts-check
/**
 * Community Engagement Checklist content, from the CE4CSID Working Group document:
 * eight stages, forty actions. The questions are the source wording, unchanged, because they
 * are the substance of the checklist. Each keeps a short practical note underneath.
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
        label: "Have you identified the target community?",
        desc: "Name the community you intend to work with, and be able to say why that definition is the right one rather than the convenient one.",
      },
      {
        id: "identify_stakeholders",
        label:
          "Have you identified key stakeholders, marginalised populations and vulnerable groups within the community?",
        desc: "Map who holds influence, who is usually consulted, and who is usually missed out, including groups whose needs are easy to overlook.",
      },
      {
        id: "identify_mapping",
        label:
          "Have you conducted preliminary geographical mapping to understand the community's location, resources, infrastructure and accessibility?",
        desc: "Understand the community's location, resources, infrastructure and accessibility, including how people actually travel to reach services.",
      },
      {
        id: "identify_governance",
        label:
          "Have you identified the community's governance structures, leadership arrangements and preferred communication channels?",
        desc: "Find out who speaks for the community, and how information genuinely travels, rather than assuming a notice board or radio reaches everyone.",
      },
      {
        id: "identify_diversity",
        label:
          "Have you considered gender, disability, accessibility, socioeconomic diversity, cultural practices and environmental sensitivities?",
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
        label:
          "Have you approached relevant community leaders and stakeholders and obtained appropriate permission to initiate engagement?",
        desc: "Ask before you arrive. Document who granted permission and on what basis, so the record matches the practice.",
      },
      {
        id: "consult_indigenous",
        label:
          "Have you invited collaboration and partnerships with Indigenous peoples, where relevant, and other community groups?",
        desc: "Partnership, not consultation. Agree what the community gains from taking part before asking for their time.",
      },
      {
        id: "consult_concerns",
        label:
          "Have you consulted community representatives to understand their preliminary CSID concerns and priorities?",
        desc: "Ask open questions and record the answers in their words, not translated into your own framing too early.",
      },
      {
        id: "consult_problem",
        label:
          "Have you jointly identified a CSID problem or research priority relevant to the target community?",
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
        label:
          "Have you developed a community engagement plan guided by an appropriate participatory research framework?",
        desc: "Choose an approach you can explain in plain language, and say how it shapes the decisions you will make.",
      },
      {
        id: "design_needs",
        label: "Have you designed a participatory needs assessment with community input?",
        desc: "Communities should help shape the questions, not only answer them.",
      },
      {
        id: "design_roles",
        label:
          "Have you clearly defined the roles and responsibilities of researchers, community representatives and partners?",
        desc: "Write down who decides what, and what happens when the two sides disagree.",
      },
      {
        id: "design_ethics",
        label:
          "Have you incorporated ethical considerations, including informed consent, privacy, safeguarding and responsible data usage, into the research and engagement design?",
        desc: "These belong in the design, not in the ethics application after the design is finished.",
      },
      {
        id: "design_inclusion",
        label:
          "Have you established inclusive approaches to community participation and decision making?",
        desc: "Say how quieter voices reach the table, and how decisions are recorded so they can be checked later.",
      },
      {
        id: "design_dissemination",
        label:
          "Have you developed a preliminary strategy for communicating and disseminating research findings in formats appropriate to the community?",
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
        label:
          "Have you obtained ethical approval from the relevant research ethics committees or institutions?",
        desc: "Check the approved version matches what you will actually do, and amend it if the community changes the plan.",
      },
      {
        id: "approvals_permits",
        label:
          "Have you obtained any additional research permits, institutional authorisations or community permissions required for the proposed activities?",
        desc: "Requirements vary by country and district. Build in the time rather than discovering it late.",
      },
      {
        id: "approvals_consent",
        label:
          "Have you established procedures for obtaining and documenting informed consent, protecting participants and securely managing data?",
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
        label:
          "Have you developed a detailed work plan with activities, milestones and a realistic timeline?",
        desc: "Use realistic timelines that account for community calendars, seasons and approval delays.",
      },
      {
        id: "resources_budget",
        label:
          "Have you prepared a budget covering community engagement activities, tools, accessibility requirements and other necessary resources?",
        desc: "Include transport, accessibility, translation and community time. Unfunded engagement becomes token engagement.",
      },
      {
        id: "resources_materials",
        label:
          "Have you developed culturally appropriate and accessible communication and engagement materials with community input?",
        desc: "Participants are better judges of whether a document makes sense than the team that wrote it.",
      },
      {
        id: "resources_language",
        label:
          "Where necessary, have you arranged for interpretation, transcription and translation?",
        desc: "Check interpreters understand the technical terms, and agree how sensitive topics will be handled.",
      },
      {
        id: "resources_logistics",
        label:
          "Have you identified suitable venues, transportation arrangements, communication tools and other accessibility requirements?",
        desc: "Test the practicalities before the day. Accessible engagement is a logistics problem before it is a values problem.",
      },
      {
        id: "resources_me",
        label:
          "Have you established a monitoring and evaluation plan with appropriate indicators and community feedback mechanisms?",
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
        label:
          "Have you implemented the planned engagement activities in collaboration with community representatives?",
        desc: "Run them with the community rather than for them, including the parts that feel routine.",
      },
      {
        id: "implement_needs",
        label:
          "Have you conducted the approved participatory needs assessment and used its findings to refine activities where necessary?",
        desc: "Be willing to change the plan. Gathering findings and ignoring them damages trust.",
      },
      {
        id: "implement_voluntary",
        label:
          "Have you ensured that participation is voluntary, inclusive, accessible and culturally appropriate?",
        desc: "Check in practice, not only on paper. Watch who is in the room and who is not.",
      },
      {
        id: "implement_feedback",
        label:
          "Have you established accessible mechanisms for receiving and responding to community feedback, questions and concerns?",
        desc: "Describe how concerns are acknowledged, handled and reported back, and who is accountable.",
      },
      {
        id: "implement_document",
        label:
          "Have you documented engagement activities and addressed emerging challenges, risks and ethical concerns?",
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
          "Have you monitored participation, inclusivity, activity delivery and progress against planned indicators?",
        desc: "Look at who has been reached and who has not, rather than only whether the activity happened.",
      },
      {
        id: "monitoring_interpret",
        label:
          "Have you involved community members in reviewing and interpreting relevant findings?",
        desc: "Community interpretation catches misunderstandings the research team would otherwise repeat.",
      },
      {
        id: "monitoring_evaluate",
        label:
          "Have you evaluated whether engagement activities addressed community needs and achieved their intended objectives?",
        desc: "Judge it against the objectives the community helped set, not only the ones written in the proposal.",
      },
      {
        id: "monitoring_lessons",
        label:
          "Have you documented lessons learned, community feedback and recommendations for improvement?",
        desc: "Record them somewhere that outlasts the project and is findable by the next team.",
      },
      {
        id: "monitoring_refine",
        label:
          "Have you used monitoring and evaluation findings to refine the engagement approach?",
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
        label:
          "Have you disseminated research findings and relevant outputs to the participating community in a timely manner?",
        desc: "Timely means while it still matters to them. A report two years late is an archived file.",
      },
      {
        id: "disseminate_formats",
        label:
          "Have you used communication channels, languages and formats tailored to the community's needs and preferences?",
        desc: "Match how the community already shares information, rather than how the institution prefers to publish.",
      },
      {
        id: "disseminate_discuss",
        label:
          "Have you provided opportunities for community members to discuss, validate and respond to the findings?",
        desc: "Dissemination is a conversation with a right of reply, not an announcement.",
      },
      {
        id: "disseminate_access",
        label:
          "Have you made resulting resources, interventions or digital tools accessible to the community, where relevant and feasible?",
        desc: "Where relevant and feasible, the outputs should be usable by the people who made the work possible.",
      },
      {
        id: "disseminate_sustain",
        label:
          "Have you identified opportunities for community ownership, continued partnerships and sustainable uptake of research findings?",
        desc: "Agree what continues after the funding ends, and who carries it.",
      },
      {
        id: "disseminate_attribution",
        label:
          "Have you communicated how community contributions and feedback influenced the research and its outcomes?",
        desc: "Say plainly what changed because of them. It is the clearest evidence that the engagement was real.",
      },
    ],
  },
];

/** Total number of checklist actions across all stages. */
export const ACTION_COUNT = STAGES.reduce((sum, stage) => sum + stage.items.length, 0);
