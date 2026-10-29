/**
 * Site content in one place.
 * Anything marked `example` is illustrative and is labelled as such wherever
 * it renders. Real scores only ever come from the self-assessment, computed
 * from the visitor's own answers.
 */

export const company = {
  legal: "SolvvSpace Limited",
  place: "Bedford, England",
  number: "16153942",
  year: 2026,
};

/**
 * The Regulon platform for organisations. Set NEXT_PUBLIC_APP_URL at build
 * time once it moves to its own domain (for example https://app.regulon.co.uk).
 */
const appUrl = (process.env.NEXT_PUBLIC_APP_URL || "https://regulon-prod-web.livelymoss-d0005cec.uksouth.azurecontainerapps.io").replace(/\/$/, "");
export const app = {
  url: appUrl,
  signIn: `${appUrl}/sign-in`,
};

export const navLinks = [
  { id: "story", label: "How it works" },
  { id: "platform", label: "Platform" },
  { id: "plans", label: "Plans" },
  { id: "assess", label: "Check your security" },
];

/** Every section, for the footer and mobile menu. */
export const allLinks = [
  { id: "story", label: "How it works" },
  { id: "assess", label: "Check your security" },
  { id: "platform", label: "Platform" },
  { id: "products", label: "Products" },
  { id: "plans", label: "Plans" },
  { id: "principles", label: "Principles" },
];

export const hero = {
  eyebrow: "Human risk, measured",
  headline: ["How exposed is your digital world?"],
  body: "Understand your digital security exposure, identify potential risks and take practical steps towards stronger protection.",
  primary: "Check My Security",
  secondary: "Assess My Organisation",
};

/* ------------------------------------------------------------------ */
/* Story chapters. One set of six elements travels through every       */
/* chapter: footprint node → assessment row → (score) → risk card →    */
/* checklist item.                                                     */
/* ------------------------------------------------------------------ */

export type StoryItem = {
  key: string;
  label: string;
  /** Short footprint label (chapter 1) */
  node: string;
  /** Example value for rows/cards, 0–100 */
  value: number;
  /** Checklist action (chapter 5) */
  action: string;
};

export const storyItems: StoryItem[] = [
  { key: "accounts", label: "Accounts", node: "Email & accounts", value: 62, action: "Turn on two-step verification" },
  { key: "passwords", label: "Passwords", node: "Passwords", value: 48, action: "Move to a password manager" },
  { key: "messages", label: "Messages", node: "Texts & chats", value: 71, action: "Go direct, never through the link" },
  { key: "calls", label: "Calls", node: "Phone calls", value: 66, action: "Hang up, call back on a number you know" },
  { key: "devices", label: "Devices", node: "Phones & Wi-Fi", value: 79, action: "Switch on automatic updates" },
  { key: "family", label: "Family", node: "Family & home", value: 55, action: "Agree a family check-in word" },
];

export const chapters = [
  {
    id: "footprint",
    index: "01",
    label: "Your footprint",
    title: "It starts with everything you're connected to.",
    body: "Accounts, messages, calls, devices and the people you share a home with. Each one is a way in, and most people never see the whole picture.",
  },
  {
    id: "assessment",
    index: "02",
    label: "The assessment",
    title: "We look at how each one is protected.",
    body: "A short, guided set of questions about your habits and settings. No scanning, no installs, nothing checked without your say-so.",
  },
  {
    id: "score",
    index: "03",
    label: "One score",
    title: "One score. Three scales.",
    body: "The same measure for you, your household and everyone you employ, so progress means the same thing at every level.",
  },
  {
    id: "risks",
    index: "04",
    label: "Your risks",
    title: "Then it shows you exactly where you're exposed.",
    body: "Your score breaks down by area, so you know which gaps matter most instead of worrying about everything at once.",
  },
  {
    id: "actions",
    index: "05",
    label: "What to do",
    title: "And turns it into a short list of things to fix.",
    body: "Plain steps, in order of impact. Each one you complete moves your score, and real stories make sure the habit sticks.",
  },
] as const;

/* ------------------------------------------------------------------ */
/* Self-assessment                                                     */
/* ------------------------------------------------------------------ */

export { band, orgQuestions, personalQuestions, type Option, type Question } from "./quick-check";

/* ------------------------------------------------------------------ */
/* Products and principles                                             */
/* ------------------------------------------------------------------ */

export const principles = [
  {
    title: "Every drill is disclosed.",
    body: "People opt in and know practice is coming. Trust is how the lesson lands.",
    rule: "Opt-in recorded before any practice is sent",
  },
  {
    title: "Every score is earned.",
    body: "Scores come from real answers and real results, never from guesswork or a scare tactic.",
    rule: "Calculated only from what you tell us and what you do",
  },
  {
    title: "Personal stays personal.",
    body: "An employer sees training results. Never your own messages, and never your family.",
    rule: "Organisation views show training progress only",
  },
];

/* ------------------------------------------------------------------ */
/* Training path: the self-assessment is step one                      */
/* ------------------------------------------------------------------ */

export const journey = [
  {
    n: "01",
    key: "assess",
    title: "Assess",
    body: "Every path starts with the self-assessment. It sets your baseline and decides what you learn first.",
    points: ["Ten questions for you, eight for organisations", "An indicative score and your top fixes", "Retake it any time to see progress"],
  },
  {
    n: "02",
    key: "learn",
    title: "Learn",
    body: "Short, real stories about how scams actually unfolded, matched to your weakest areas.",
    points: ["Minutes, not hours", "Tailored to your assessment", "Written for every age in a household"],
  },
  {
    n: "03",
    key: "practise",
    title: "Practise",
    body: "Disclosed drills in the channels scams really use. Everyone opts in before anything is sent.",
    points: ["Email, text and call scenarios", "An instant explanation, never a telling-off", "Follow-up stories for anything missed"],
  },
  {
    n: "04",
    key: "certify",
    title: "Certify",
    body: "Finish a training path and earn a Regulon certificate, with your score to show for it.",
    points: ["Personal and staff certificates", "Shareable, with your score and date", "Evidence for Cyber Essentials and funders"],
  },
];

/* ------------------------------------------------------------------ */
/* Plans (DRAFT: contents to confirm, prices announced at launch)      */
/* ------------------------------------------------------------------ */

export type Tier = {
  key: "bronze" | "silver" | "gold";
  name: string;
  /** Ring colour for the tier medal. */
  metal: string;
  title: string;
  who: string;
  inherits?: string;
  features: string[];
};

export const plans: Record<"family" | "organisation", Tier[]> = {
  family: [
    {
      key: "bronze",
      name: "Bronze",
      metal: "#c58a5a",
      title: "Start",
      who: "For one person getting started.",
      features: [
        "Self-assessment and personal score",
        "Starter library of real scam stories",
        "Check a text, number or link",
        "Certificate when you complete a path",
      ],
    },
    {
      key: "silver",
      name: "Silver",
      metal: "#c9d2d8",
      title: "Household",
      who: "For the people you share a home with.",
      inherits: "Everything in Bronze, plus",
      features: [
        "Up to [5] family members",
        "The full story library, for every age",
        "Disclosed practice drills",
        "A household score, shared by choice",
      ],
    },
    {
      key: "gold",
      name: "Gold",
      metal: "#e8bd6a",
      title: "Protected household",
      who: "For families who want every layer.",
      inherits: "Everything in Silver, plus",
      features: [
        "Alerts as new scams emerge",
        "Family check-in word and call-back rules",
        "Call and text filtering where your phone allows",
        "Priority support",
      ],
    },
  ],
  organisation: [
    {
      key: "bronze",
      name: "Bronze",
      metal: "#c58a5a",
      title: "Awareness",
      who: "For small teams starting out.",
      features: [
        "Organisation self-assessment",
        "Story-based training for every member of staff",
        "Staff certificates on completion",
        "A simple progress dashboard",
      ],
    },
    {
      key: "silver",
      name: "Silver",
      metal: "#c9d2d8",
      title: "Simulate",
      who: "For organisations ready to test, not just teach.",
      inherits: "Everything in Bronze, plus",
      features: [
        "Disclosed phishing simulations in Microsoft 365",
        "Human-risk score by team",
        "Report-phish button in Outlook",
        "Automatic follow-up training",
      ],
    },
    {
      key: "gold",
      name: "Gold",
      metal: "#e8bd6a",
      title: "Govern",
      who: "For organisations that answer to auditors and funders.",
      inherits: "Everything in Silver, plus",
      features: [
        "Clocked for staff: text, chat and call scenarios",
        "Response playbooks when scores drop",
        "Cyber Essentials and funder-ready reports",
        "Microsoft Entra ID sync and single sign-on",
      ],
    },
  ],
};
