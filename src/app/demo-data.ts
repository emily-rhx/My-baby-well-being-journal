export type Screen =
  | "welcome"
  | "activate"
  | "login"
  | "account"
  | "child-profile"
  | "home"
  | "log"
  | "health"
  | "sleep"
  | "mood"
  | "meals"
  | "quick-add"
  | "journal"
  | "weekly"
  | "monthly"
  | "report-builder"
  | "report-preview"
  | "memories"
  | "profile";

export type DailyDraft = {
  date: string;
  health: string[];
  healthNotes: string;
  totalSleep: string;
  nightWakes: string;
  napCount: string;
  napTime: string;
  mood: string[];
  meals: string;
  snacks: string;
  fruitVeg: string;
  junkFood: string;
  isDraft?: boolean;
};

export const initialDraft: DailyDraft = {
  date: "2025-10-18",
  health: ["Well"],
  healthNotes: "",
  totalSleep: "8–10 hours",
  nightWakes: "1–2 wakes",
  napCount: "1 nap",
  napTime: "1–2 hours",
  mood: ["Happy / Content"],
  meals: "Ate most",
  snacks: "2 snacks",
  fruitVeg: "3–4",
  junkFood: "Low",
};

export const healthOptions = [
  "Well",
  "Congested",
  "Raised temperature",
  "Teething",
  "Upset stomach",
  "Bowel changes",
  "Rash",
  "Poor sleep",
  "Other",
];

export const sleepOptions = ["Under 6 hours", "6–8 hours", "8–10 hours", "10+ hours"];
export const wakeOptions = ["0 wakes", "1–2 wakes", "3 wakes"];
export const napCountOptions = ["No nap", "1 nap", "2 naps", "3+ naps"];
export const napTimeOptions = ["Under 1 hour", "1–2 hours", "2+ hours"];

export const moodOptions = [
  "Happy / Content",
  "Calm / Settled",
  "Playful / Energetic",
  "Tired / Low energy",
  "Clingy / Needing comfort",
  "Irritable / Frustrated",
  "Upset / Tearful",
  "Unsettled / Fussy",
  "Other / Unusual",
];

export const mealOptions = [
  "Ate well / All",
  "Ate most",
  "Ate some",
  "Ate very little",
  "Refused / Skipped",
  "Other / Unusual",
];
export const snackOptions = ["No snacks", "1 snack", "2 snacks", "3+ snacks", "Other / Unusual"];
export const fruitOptions = ["5+ fruit & veg", "3–4", "1–2", "No fruit & veg", "Other / Unusual"];
export const junkOptions = ["None", "Low", "Moderate", "High", "Other / Unusual"];

export const quickTypes = [
  { label: "Food Reaction", tone: "reaction", helper: "Food & reaction noticed" },
  { label: "Sickness", tone: "sickness", helper: "Symptoms, dates & outcome" },
  { label: "Medicine", tone: "medicine", helper: "Medicine, amount & time" },
  { label: "Unusual Behaviour", tone: "unusual", helper: "An observational note" },
  { label: "Doctor Visit", tone: "doctor", helper: "Appointment notes" },
  { label: "Hospital Visit", tone: "hospital", helper: "Visit notes" },
  { label: "Dentist Visit", tone: "sleep", helper: "Visit notes" },
  { label: "Milestone", tone: "milestone", helper: "A special new moment" },
  { label: "New Favourite", tone: "favourite", helper: "Food, toy, word or song" },
  { label: "Concern", tone: "concern", helper: "Something to keep an eye on" },
  { label: "Appointment", tone: "appointment", helper: "Date, time & place" },
  { label: "General Note", tone: "neutral", helper: "Anything else" },
] as const;

export const journalDays = [
  {
    date: "Saturday 18 October",
    day: "18",
    entries: [
      { type: "Sleep", tone: "sleep", text: "8–10 hours · 1–2 night wakes", icon: "Moon" },
      { type: "Mood", tone: "mood", text: "Happy / Content", icon: "Smile" },
      { type: "Meals", tone: "meals", text: "Ate most · 3–4 fruit & veg", icon: "Utensils" },
      { type: "Health", tone: "health", text: "Well", icon: "HeartPulse" },
    ],
  },
  {
    date: "Wednesday 15 October",
    day: "15",
    entries: [
      { type: "Health", tone: "health", text: "Congested", icon: "HeartPulse" },
      { type: "Sleep", tone: "sleep", text: "6–8 hours · 3 night wakes", icon: "Moon" },
      { type: "Meals", tone: "meals", text: "Ate some", icon: "Utensils" },
      { type: "Medicine", tone: "medicine", text: "Calpol · 5 ml · 7:30 pm", icon: "Pill" },
    ],
  },
  {
    date: "Tuesday 14 October",
    day: "14",
    entries: [
      { type: "Sleep", tone: "sleep", text: "6–8 hours · 3 night wakes", icon: "Moon" },
      { type: "Mood", tone: "mood", text: "Tired / Low energy", icon: "Smile" },
      { type: "Meals", tone: "meals", text: "Ate very little", icon: "Utensils" },
      { type: "Health", tone: "health", text: "Congested", icon: "HeartPulse" },
    ],
  },
  {
    date: "Monday 13 October",
    day: "13",
    entries: [
      { type: "Food Reaction", tone: "reaction", text: "Strawberries · redness around mouth", icon: "Apple" },
      { type: "Mood", tone: "mood", text: "Calm / Settled", icon: "Smile" },
    ],
  },
];

export const weekBars = [
  { day: "M", value: 82, tone: "#9eac9a" },
  { day: "T", value: 52, tone: "#d6a5a1" },
  { day: "W", value: 48, tone: "#d6a5a1" },
  { day: "T", value: 74, tone: "#aebdca" },
  { day: "F", value: 84, tone: "#9eac9a" },
  { day: "S", value: 88, tone: "#9eac9a" },
  { day: "S", value: 78, tone: "#aebdca" },
];

export const monthWeeks = [
  { label: "Week 1", sleep: 62, meals: 72 },
  { label: "Week 2", sleep: 68, meals: 66 },
  { label: "Week 3", sleep: 52, meals: 48 },
  { label: "Week 4", sleep: 78, meals: 75 },
];

export const memories = [
  {
    date: "18 October 2025",
    type: "Milestone",
    title: "First two-word sentence",
    note: "Oliver looked at the garden and said, ‘bird gone’. We wrote it in the journal straight away.",
    tone: "milestone",
    icon: "Sparkles",
  },
  {
    date: "11 October 2025",
    type: "New Favourite",
    title: "The Very Hungry Caterpillar",
    note: "His new favourite bedtime book. He turns straight to the strawberry page.",
    tone: "favourite",
    icon: "BookHeart",
  },
  {
    date: "28 September 2025",
    type: "Milestone",
    title: "Walked to the garden gate",
    note: "Six very determined little steps, then the biggest smile.",
    tone: "milestone",
    icon: "Footprints",
  },
  {
    date: "20 September 2025",
    type: "New Favourite",
    title: "Dancing to Here Comes the Sun",
    note: "Now requested every morning after breakfast.",
    tone: "favourite",
    icon: "Music2",
  },
];

export const reportIncludeOptions = [
  "Current concerns",
  "Symptoms / wellbeing",
  "Sickness",
  "Food reactions",
  "Sleep",
  "Mood / behaviour",
  "Meal / appetite changes",
  "Medicine",
  "Doctor visits",
  "Hospital visits",
  "Bowel changes",
  "Notes",
];
