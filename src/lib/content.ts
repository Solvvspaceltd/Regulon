/**
 * Site content in one place. Figures marked `example` are illustrative
 * and are labelled as such wherever they render.
 */

export const company = {
  legal: "SolvvSpace Limited",
  place: "Bedford, England",
  number: "16153942",
  year: 2026,
};

export type ScaleKey = "you" | "home" | "org";

export const scales: {
  key: ScaleKey;
  index: string;
  label: string;
  product: string;
  title: string;
  body: string;
  score: number;
  rows: { name: string; value: number }[];
}[] = [
  {
    key: "you",
    index: "01",
    label: "You",
    product: "Clocked · personal",
    title: "It starts with one person.",
    body: "Real stories, short and memorable. Disclosed practice you opted into. A check for anything that looks off. Your score moves every time you get sharper.",
    score: 82,
    rows: [
      { name: "Stories completed", value: 70 },
      { name: "Drills caught", value: 82 },
      { name: "Checks run", value: 60 },
    ],
  },
  {
    key: "home",
    index: "02",
    label: "Your household",
    product: "Clocked · family",
    title: "Then everyone you look out for.",
    body: "Invite the people you care about. Everyone keeps their own score, shared only by choice, so you can see who might need a nudge.",
    score: 74,
    rows: [
      { name: "You", value: 82 },
      { name: "Partner", value: 76 },
      { name: "Teenager", value: 64 },
    ],
  },
  {
    key: "org",
    index: "03",
    label: "Your organisation",
    product: "Regulon · organisation",
    title: "Then everyone you employ.",
    body: "The same maths across every team. A human-risk score leaders can act on, with response playbooks and evidence for auditors and funders.",
    score: 67,
    rows: [
      { name: "Finance", value: 58 },
      { name: "Programmes", value: 71 },
      { name: "Leadership", value: 64 },
    ],
  },
];

export const process = [
  { n: "01", title: "Baseline", body: "A short quiz sets where you start." },
  { n: "02", title: "Stories", body: "Real incidents, told the way they unfolded." },
  { n: "03", title: "Drills", body: "Disclosed practice in the channels people actually use." },
  { n: "04", title: "Score", body: "Every catch moves it. Every miss becomes a lesson." },
];

export const drillTeams = [
  { name: "Finance", before: 58, after: 74 },
  { name: "Programmes", before: 71, after: 83 },
  { name: "Operations", before: 62, after: 77 },
  { name: "Leadership", before: 64, after: 80 },
];

export const principles = [
  {
    title: "Every drill is disclosed.",
    body: "People opt in and know practice is coming. Trust is how the lesson lands.",
  },
  {
    title: "Every story is real.",
    body: "Built from incidents that actually happened, told so they stay with you.",
  },
  {
    title: "Personal stays personal.",
    body: "An employer sees training results. Never your own messages, and never your family.",
  },
];

export const navLinks = [
  { id: "scales", label: "How it works" },
  { id: "products", label: "Products" },
  { id: "drill", label: "For organisations" },
  { id: "principles", label: "Principles" },
];
