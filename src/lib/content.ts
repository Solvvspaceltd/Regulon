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

export const navLinks = [
  { id: "story", label: "How it works" },
  { id: "assess", label: "Check your security" },
  { id: "products", label: "Products" },
  { id: "principles", label: "Principles" },
];

export const hero = {
  eyebrow: "Human risk, measured",
  headline: ["How exposed is", "your digital world?"],
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

export type Option = { label: string; points: number };
export type Question = {
  id: string;
  category: string;
  prompt: string;
  options: Option[];
  /** Shown in results when the answer scored below full marks. */
  fix: string;
};

export const personalQuestions: Question[] = [
  {
    id: "passwords",
    category: "Passwords",
    prompt: "How do you handle passwords?",
    options: [
      { label: "I use the same one, or very similar ones, in most places", points: 0 },
      { label: "A few different ones, reused here and there", points: 0.4 },
      { label: "A different one for every important account", points: 0.75 },
      { label: "A password manager creates and remembers them", points: 1 },
    ],
    fix: "Use a password manager so every account has its own strong password. Start with email and banking.",
  },
  {
    id: "two-step",
    category: "Accounts",
    prompt: "Is two-step verification switched on for your main email and banking?",
    options: [
      { label: "No", points: 0 },
      { label: "I'm not sure", points: 0.1 },
      { label: "On some of them", points: 0.5 },
      { label: "Yes, on all of them", points: 1 },
    ],
    fix: "Turn on two-step verification for your email first. Whoever controls your email can reset almost everything else.",
  },
  {
    id: "updates",
    category: "Devices",
    prompt: "When your phone or computer asks to update, what usually happens?",
    options: [
      { label: "I put it off for as long as I can", points: 0 },
      { label: "I get round to it eventually", points: 0.5 },
      { label: "Updates install automatically", points: 1 },
    ],
    fix: "Switch on automatic updates. Most attacks rely on holes that have already been fixed.",
  },
  {
    id: "messages",
    category: "Messages",
    prompt: "A message you weren't expecting asks you to act quickly through a link. What do you do?",
    options: [
      { label: "Tap it to see what it's about", points: 0 },
      { label: "Check who sent it, then decide", points: 0.4 },
      { label: "Ignore the link and go to the app or website myself", points: 1 },
    ],
    fix: "Never act through a link in a message you didn't expect. Open the app or type the website address yourself.",
  },
  {
    id: "calls",
    category: "Calls",
    prompt: "A caller says they're from your bank and asks you to move money or read out a code. What do you do?",
    options: [
      { label: "Follow their instructions if they sound genuine", points: 0 },
      { label: "Ask them questions to check who they are", points: 0.3 },
      { label: "Hang up and call the number on my card", points: 1 },
    ],
    fix: "Hang up and call back on the number printed on your card. A real bank will never ask you to move money or share a code.",
  },
  {
    id: "social",
    category: "Footprint",
    prompt: "How much of your personal life is visible on social media?",
    options: [
      { label: "Public, including birthday, location or family details", points: 0 },
      { label: "Some posts are public", points: 0.5 },
      { label: "Private, and I review who can see what", points: 1 },
    ],
    fix: "Make profiles private and remove details like birthday and home town. They're the answers to many security questions.",
  },
  {
    id: "wifi",
    category: "Devices",
    prompt: "Has your home Wi-Fi router's admin password been changed from the one it came with?",
    options: [
      { label: "No", points: 0 },
      { label: "I don't know", points: 0.2 },
      { label: "Yes, and it gets updates", points: 1 },
    ],
    fix: "Change the router's admin password from the default and check it updates itself.",
  },
  {
    id: "backups",
    category: "Recovery",
    prompt: "If your phone was lost tomorrow, would your photos and files be safe?",
    options: [
      { label: "No, they're only on the phone", points: 0 },
      { label: "Some, when I remember to back up", points: 0.5 },
      { label: "Yes, they back up automatically", points: 1 },
    ],
    fix: "Turn on automatic backup so losing a device, or being locked out of one, isn't a disaster.",
  },
  {
    id: "family",
    category: "Family",
    prompt: "Have you talked with your family about scams?",
    options: [
      { label: "Not really", points: 0 },
      { label: "Once or twice", points: 0.5 },
      { label: "Regularly, and we have a way to check it's really us", points: 1 },
    ],
    fix: "Agree a family check-in word or call-back rule, so an urgent message 'from' a relative can be verified.",
  },
  {
    id: "breaches",
    category: "Accounts",
    prompt: "Do you know whether your email address has appeared in a data breach?",
    options: [
      { label: "I've never checked", points: 0 },
      { label: "I checked once", points: 0.6 },
      { label: "I have alerts set up", points: 1 },
    ],
    fix: "Check your email address at haveibeenpwned.com and set up alerts. Change any password that appears there.",
  },
];

export const orgQuestions: Question[] = [
  {
    id: "mfa",
    category: "Identity",
    prompt: "Is multi-factor authentication enforced for every staff account?",
    options: [
      { label: "No", points: 0 },
      { label: "For admins or some staff only", points: 0.45 },
      { label: "Yes, enforced for everyone", points: 1 },
    ],
    fix: "Enforce MFA for every account, starting with admins and email. It blocks most account-takeover attacks.",
  },
  {
    id: "training",
    category: "People",
    prompt: "How do staff learn to recognise phishing and scams?",
    options: [
      { label: "They don't, formally", points: 0 },
      { label: "An annual course", points: 0.4 },
      { label: "Regular short training plus disclosed practice drills", points: 1 },
    ],
    fix: "Replace the annual course with short, regular, story-based training and disclosed practice drills.",
  },
  {
    id: "reporting",
    category: "People",
    prompt: "If someone receives a suspicious email, how do they report it?",
    options: [
      { label: "There's no clear way", points: 0 },
      { label: "They tell IT informally", points: 0.5 },
      { label: "A report button, and everyone knows the process", points: 1 },
    ],
    fix: "Give staff a one-click report button and thank people for using it. Fast reports stop attacks spreading.",
  },
  {
    id: "patching",
    category: "Systems",
    prompt: "How are devices and software kept up to date?",
    options: [
      { label: "When someone gets round to it", points: 0 },
      { label: "Manually, roughly monthly", points: 0.5 },
      { label: "Automatically managed and tracked", points: 1 },
    ],
    fix: "Manage updates centrally and track compliance. Cyber Essentials expects critical patches within 14 days.",
  },
  {
    id: "admin",
    category: "Identity",
    prompt: "Do people use admin rights for everyday work?",
    options: [
      { label: "Yes, many do", points: 0 },
      { label: "Some separation, not consistent", points: 0.5 },
      { label: "No, admin accounts are separate and kept to a minimum", points: 1 },
    ],
    fix: "Give admins a separate account for admin work only, and remove admin rights nobody needs.",
  },
  {
    id: "backup",
    category: "Recovery",
    prompt: "Could you restore your key data after ransomware?",
    options: [
      { label: "We don't have reliable backups", points: 0 },
      { label: "We have backups but haven't tested a restore", points: 0.4 },
      { label: "Yes, tested restores and a copy kept separate", points: 1 },
    ],
    fix: "Keep a backup copy that attackers can't reach, and test a restore at least twice a year.",
  },
  {
    id: "payments",
    category: "Process",
    prompt: "When a supplier asks to change their bank details, what happens?",
    options: [
      { label: "We update them from the email", points: 0 },
      { label: "Sometimes we call to check", points: 0.4 },
      { label: "Always verified by phone on a known number, with two approvers", points: 1 },
    ],
    fix: "Always verify bank detail changes by phone on a number you already hold, and require two people to approve.",
  },
  {
    id: "incident",
    category: "Process",
    prompt: "If you had a security incident tomorrow, is there a plan?",
    options: [
      { label: "No", points: 0 },
      { label: "Informally, people know who to call", points: 0.4 },
      { label: "A written plan we've practised", points: 1 },
    ],
    fix: "Write a one-page incident plan: who decides, who to call, how to communicate. Then walk through it once.",
  },
];

export function band(score: number) {
  if (score >= 80) return { label: "Strong habits", note: "You're doing most things right. Keep them up and close the last gaps." };
  if (score >= 60) return { label: "Good, with gaps", note: "A solid base with a few openings worth closing soon." };
  if (score >= 40) return { label: "Exposed in places", note: "Several common attacks would have a way in. The fixes below are quick wins." };
  return { label: "Highly exposed", note: "Start with the first two fixes below. They remove the most risk for the least effort." };
}

/* ------------------------------------------------------------------ */
/* Products and principles                                             */
/* ------------------------------------------------------------------ */

export const principles = [
  {
    title: "Every drill is disclosed.",
    body: "People opt in and know practice is coming. Trust is how the lesson lands.",
  },
  {
    title: "Every score is earned.",
    body: "Scores come from real answers and real results, never from guesswork or a scare tactic.",
  },
  {
    title: "Personal stays personal.",
    body: "An employer sees training results. Never your own messages, and never your family.",
  },
];
