"use client";

import Image from "next/image";
import {
  Activity,
  AlertCircle,
  Apple,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Bell,
  BookHeart,
  Calendar,
  CalendarCheck,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleUserRound,
  Clock3,
  CloudSun,
  Download,
  Edit3,
  FileHeart,
  FileText,
  Footprints,
  Heart,
  HeartPulse,
  HelpCircle,
  Home,
  Hospital,
  LockKeyhole,
  Mail,
  MapPin,
  Menu,
  MessageCircleHeart,
  Moon,
  MoreHorizontal,
  Music2,
  NotebookPen,
  PartyPopper,
  Pill,
  Plus,
  Printer,
  Search,
  Settings,
  Share2,
  ShieldCheck,
  Smile,
  Sparkles,
  Stethoscope,
  Syringe,
  Trash2,
  TrendingDown,
  TrendingUp,
  Utensils,
  X,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  fruitOptions,
  healthOptions,
  initialDraft,
  journalDays,
  junkOptions,
  mealOptions,
  memories,
  monthWeeks,
  moodOptions,
  napCountOptions,
  napTimeOptions,
  quickTypes,
  reportIncludeOptions,
  sleepOptions,
  snackOptions,
  wakeOptions,
  weekBars,
  type DailyDraft,
  type Screen,
} from "./demo-data";

const iconMap: Record<string, LucideIcon> = {
  Activity,
  Apple,
  BookHeart,
  Calendar,
  CalendarCheck,
  Clock3,
  FileHeart,
  FileText,
  Footprints,
  Heart,
  HeartPulse,
  Hospital,
  MessageCircleHeart,
  Moon,
  Music2,
  NotebookPen,
  PartyPopper,
  Pill,
  Smile,
  Sparkles,
  Stethoscope,
  Syringe,
  Utensils,
};

const toneIcon: Record<string, LucideIcon> = {
  reaction: Apple,
  sickness: Activity,
  medicine: Pill,
  unusual: AlertCircle,
  doctor: Stethoscope,
  hospital: Hospital,
  sleep: Moon,
  milestone: Sparkles,
  favourite: Heart,
  concern: MessageCircleHeart,
  appointment: CalendarCheck,
  neutral: NotebookPen,
};

const todayLabel = "Saturday, 18 October";

function postPrototype(payload: Record<string, unknown>) {
  return fetch("/api/prototype", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`brand-mark ${compact ? "brand-mark--compact" : ""}`}>
      <span className="brand-heart">♥</span>
      <div>
        <span className="brand-kicker">MY BABY</span>
        <span className="brand-name">Well-Being <em>Insights</em></span>
      </div>
    </div>
  );
}

function Botanical({ side = "right" }: { side?: "left" | "right" }) {
  return (
    <svg className={`botanical botanical--${side}`} viewBox="0 0 110 170" aria-hidden="true">
      <path d="M52 162C54 120 52 72 72 12" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M59 114C38 110 27 96 28 78C47 80 60 92 59 114Z" fill="currentColor" opacity=".24" />
      <path d="M64 91C82 85 91 71 89 55C73 58 62 72 64 91Z" fill="currentColor" opacity=".32" />
      <path d="M55 138C39 135 29 126 27 112C42 111 54 122 55 138Z" fill="currentColor" opacity=".28" />
      <path d="M69 64C54 57 47 46 50 32C64 37 72 49 69 64Z" fill="currentColor" opacity=".24" />
      <circle cx="74" cy="28" r="4" fill="#dca28b" />
      <circle cx="87" cy="61" r="3" fill="#dca28b" />
    </svg>
  );
}

function TopBar({
  title,
  eyebrow,
  back,
  onBack,
  right,
}: {
  title?: string;
  eyebrow?: string;
  back?: boolean;
  onBack?: () => void;
  right?: React.ReactNode;
}) {
  return (
    <header className="topbar">
      <div className="topbar-side">
        {back ? (
          <button className="icon-button" onClick={onBack} aria-label="Go back">
            <ArrowLeft size={20} />
          </button>
        ) : (
          <BrandMark compact />
        )}
      </div>
      {title ? (
        <div className="topbar-title">
          {eyebrow && <span>{eyebrow}</span>}
          <h1>{title}</h1>
        </div>
      ) : (
        <div />
      )}
      <div className="topbar-actions">{right || <button className="avatar-mini" aria-label="Oliver's profile"><Image src="/images/oliver-profile.jpg" alt="Oliver" fill sizes="40px" /></button>}</div>
    </header>
  );
}

function BottomNav({ screen, go }: { screen: Screen; go: (screen: Screen) => void }) {
  const items: Array<{ label: string; screen: Screen; icon: LucideIcon; center?: boolean }> = [
    { label: "Home", screen: "home", icon: Home },
    { label: "Journal", screen: "journal", icon: NotebookPen },
    { label: "Log", screen: "log", icon: Plus, center: true },
    { label: "Insights", screen: "weekly", icon: Activity },
    { label: "Profile", screen: "profile", icon: CircleUserRound },
  ];
  const selected = screen === "monthly" || screen === "weekly" ? "weekly" : screen;
  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.label}
            className={`${item.center ? "bottom-nav__center" : ""} ${selected === item.screen ? "is-active" : ""}`}
            onClick={() => go(item.screen)}
          >
            <span><Icon size={item.center ? 25 : 21} strokeWidth={1.8} /></span>
            <small>{item.label}</small>
          </button>
        );
      })}
    </nav>
  );
}

function AppPage({
  screen,
  go,
  children,
  className = "",
  noNav = false,
}: {
  screen: Screen;
  go: (screen: Screen) => void;
  children: React.ReactNode;
  className?: string;
  noNav?: boolean;
}) {
  return (
    <div className={`app-page ${className}`}>
      <main className="app-main">{children}</main>
      {!noNav && <BottomNav screen={screen} go={go} />}
    </div>
  );
}

function SectionHeading({ eyebrow, title, action }: { eyebrow?: string; title: string; action?: React.ReactNode }) {
  return (
    <div className="section-heading">
      <div>
        {eyebrow && <span>{eyebrow}</span>}
        <h2>{title}</h2>
      </div>
      {action}
    </div>
  );
}

function ProgressDots({ current, total }: { current: number; total: number }) {
  return (
    <div className="progress-dots" aria-label={`Step ${current} of ${total}`}>
      {Array.from({ length: total }, (_, index) => (
        <span key={index} className={index < current ? "is-complete" : ""} />
      ))}
    </div>
  );
}

function Toast({ message }: { message: string }) {
  return (
    <div className="toast" role="status">
      <CheckCircle2 size={18} /> {message}
    </div>
  );
}

function OptionGrid({
  options,
  value,
  onChange,
  multiple = false,
}: {
  options: string[];
  value: string | string[];
  onChange: (value: string | string[]) => void;
  multiple?: boolean;
}) {
  const selected = Array.isArray(value) ? value : [value];
  const select = (option: string) => {
    if (!multiple) return onChange(option);
    const next = selected.includes(option) ? selected.filter((item) => item !== option) : [...selected, option];
    onChange(next);
  };
  return (
    <div className="option-grid">
      {options.map((option) => {
        const active = selected.includes(option);
        return (
          <button key={option} type="button" className={`option-pill ${active ? "is-selected" : ""}`} onClick={() => select(option)}>
            <span className="option-check">{active ? <Check size={15} /> : null}</span>
            {option}
          </button>
        );
      })}
    </div>
  );
}

function SaveBar({
  onSave,
  label = "Save & continue",
  secondary,
}: {
  onSave: () => void;
  label?: string;
  secondary?: { label: string; onClick: () => void };
}) {
  return (
    <div className="save-bar">
      {secondary && <button className="button button--ghost" onClick={secondary.onClick}>{secondary.label}</button>}
      <button className="button button--primary" onClick={onSave}>{label}<ArrowRight size={17} /></button>
    </div>
  );
}

function WelcomeScreen({ go }: { go: (screen: Screen) => void }) {
  return (
    <AppPage screen="welcome" go={go} noNav className="welcome-page">
      <div className="welcome-shell">
        <section className="welcome-copy">
          <div className="welcome-brand"><BrandMark /></div>
          <p className="script-line">The digital companion to your journal</p>
          <h1>Track the little things.<br /><em>See the bigger picture.</em></h1>
          <p className="welcome-intro">Bring the important moments from your physical journal together to gently notice patterns in Oliver’s sleep, mood, meals and wellbeing.</p>
          <div className="welcome-actions">
            <button className="button button--primary button--large" onClick={() => go("activate")}>Activate My Journal <ArrowRight size={18} /></button>
            <button className="button button--outline button--large" onClick={() => go("login")}>I Already Have an Account</button>
            <button className="text-button" onClick={() => go("home")}><Sparkles size={15} /> Preview full app <small>(temporary)</small></button>
          </div>
          <div className="privacy-note"><ShieldCheck size={17} /><span>Your child’s information stays private to your account.</span></div>
        </section>
        <section className="welcome-art" aria-label="Journal companion illustration">
          <div className="paper-label"><span>From your journal</span><Heart size={14} fill="currentColor" /><span>to meaningful insights</span></div>
          <Image src="/images/journal-companion.png" alt="Watercolour bunny, botanical stem and stacking rings" fill priority sizes="(max-width: 800px) 100vw, 50vw" />
          <div className="journal-ticket ticket-one"><Moon size={17} /><span>Sleep</span><b>8–10 hrs</b></div>
          <div className="journal-ticket ticket-two"><Smile size={17} /><span>Mood</span><b>Happy</b></div>
        </section>
      </div>
      <footer className="welcome-footer">My Baby Well-Being Journal <span>•</span> Digital companion</footer>
    </AppPage>
  );
}

function ActivationScreen({ go, code, setCode }: { go: (screen: Screen) => void; code: string; setCode: (value: string) => void }) {
  const [error, setError] = useState("");
  const continueActivation = () => {
    const normalized = code.toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (!/^MBWJ[A-HJ-NP-Z2-9]{12}$/.test(normalized)) return setError("Enter the complete code printed inside your journal.");
    setError("");
    go("account");
  };
  return (
    <AppPage screen="activate" go={go} noNav className="onboarding-page">
      <TopBar back onBack={() => go("welcome")} right={<span className="secure-label"><LockKeyhole size={14} /> Secure</span>} />
      <div className="onboarding-card">
        <ProgressDots current={1} total={3} />
        <div className="onboarding-icon"><BookHeart size={28} /></div>
        <span className="eyebrow">Step 1 of 3</span>
        <h1>Activate your journal</h1>
        <p>Find your unique activation code beside the QR code in your physical My Baby Well-Being Journal.</p>
        <label className="field-label" htmlFor="activation-code">Journal activation code</label>
        <div className={`code-input ${error ? "has-error" : ""}`}>
          <input id="activation-code" value={code} onChange={(event) => setCode(event.target.value.toUpperCase())} placeholder="MBWJ-XXXX-XXXX-XXXX" autoComplete="off" maxLength={19} spellCheck={false} />
          <BookHeart size={20} />
        </div>
        {error && <p className="field-error"><AlertCircle size={15} />{error}</p>}
        <button className="button button--primary button--large button--full" onClick={continueActivation}>Continue <ArrowRight size={18} /></button>
        <div className="onboarding-help"><HelpCircle size={17} /><span>Can’t find your code? It’s on the “From tracking to insight” page near the back of your journal.</span></div>
      </div>
      <Botanical side="right" />
    </AppPage>
  );
}

function AccountScreen({ go, code, notify }: { go: (screen: Screen) => void; code: string; notify: (message: string) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const submit = async () => {
    setLoading(true);
    try {
      const response = await postPrototype({ action: "activate", code, email, password });
      const body = await response.json() as { error?: string };
      if (!response.ok) throw new Error(body.error || "Activation failed");
      notify("Journal activated securely");
      go("child-profile");
    } catch (error) {
      notify(error instanceof Error ? error.message : "Please try again");
    } finally { setLoading(false); }
  };
  return (
    <AppPage screen="account" go={go} noNav className="onboarding-page">
      <TopBar back onBack={() => go("activate")} right={<span className="secure-label"><LockKeyhole size={14} /> Secure</span>} />
      <div className="onboarding-card">
        <ProgressDots current={2} total={3} />
        <div className="onboarding-icon onboarding-icon--sage"><Mail size={27} /></div>
        <span className="eyebrow">Step 2 of 3</span>
        <h1>Create your account</h1>
        <p>Your journal licence will be safely attached to this account.</p>
        <label className="field-label" htmlFor="email">Email address</label>
        <input className="text-input" id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
        <label className="field-label" htmlFor="password">Create a password</label>
        <input className="text-input" id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
        <p className="password-hint"><Check size={14} /> 8+ characters &nbsp; <Check size={14} /> A number or symbol</p>
        <button className="button button--primary button--large button--full" onClick={submit} disabled={loading}>{loading ? "Activating…" : "Create account & continue"}<ArrowRight size={18} /></button>
        <p className="terms-copy">By continuing, you agree to our Terms and Privacy Policy. Child information is never used for advertising.</p>
      </div>
      <Botanical side="left" />
    </AppPage>
  );
}

function LoginScreen({ go, notify }: { go: (screen: Screen) => void; notify: (message: string) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const submit = async () => {
    setLoading(true);
    try {
      const response = await postPrototype({ action: "login", email, password });
      const body = await response.json() as { error?: string };
      if (!response.ok) throw new Error(body.error || "Sign in failed");
      notify("Welcome back");
      go("home");
    } catch (error) {
      notify(error instanceof Error ? error.message : "Please try again");
    } finally { setLoading(false); }
  };
  return (
    <AppPage screen="login" go={go} noNav className="onboarding-page">
      <TopBar back onBack={() => go("welcome")} right={<span className="secure-label"><LockKeyhole size={14} /> Secure</span>} />
      <div className="onboarding-card">
        <div className="onboarding-icon onboarding-icon--sage"><LockKeyhole size={27} /></div>
        <span className="eyebrow">Existing account</span>
        <h1>Welcome back</h1>
        <p>Sign in with the account linked to your journal.</p>
        <label className="field-label" htmlFor="login-email">Email address</label>
        <input className="text-input" id="login-email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} />
        <label className="field-label" htmlFor="login-password">Password</label>
        <input className="text-input" id="login-password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} />
        <button className="button button--primary button--large button--full" onClick={submit} disabled={loading}>{loading ? "Signing in…" : "Sign in"}<ArrowRight size={18} /></button>
        <button className="text-button" onClick={() => go("activate")}>Have a new journal code? Activate it</button>
      </div>
      <Botanical side="right" />
    </AppPage>
  );
}

function ChildProfileScreen({ go, notify }: { go: (screen: Screen) => void; notify: (message: string) => void }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "Oliver", nickname: "Ollie", dateOfBirth: "2024-03-18", address: "",
    allergies: "None known", medicines: "None currently", conditions: "None known", medicalNotes: "",
    dietaryRequirements: "", sensitivities: "", preferredHospital: "St Mary’s Hospital",
    gpSurgery: "Meadow Lane Surgery", gpPhone: "020 7946 0321",
  });
  const setField = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }));
  const finish = async () => {
    await postPrototype({ action: "profile", profile: form }).catch(() => null);
    notify("Oliver’s profile is ready");
    go("home");
  };
  return (
    <AppPage screen="child-profile" go={go} noNav className="onboarding-page profile-create-page">
      <TopBar back onBack={() => step === 1 ? go("account") : setStep(1)} right={<button className="text-link" onClick={() => go("home")}>Skip</button>} />
      <div className="profile-create-shell">
        <div className="profile-create-intro">
          <ProgressDots current={step + 2} total={4} />
          <span className="eyebrow">A little about your child</span>
          <h1>{step === 1 ? "Create Oliver’s profile" : "Important details, all together"}</h1>
          <p>{step === 1 ? "This helps personalise insights and keeps useful information close to hand." : "Add what is useful now. You can always return to this later."}</p>
        </div>
        <div className="profile-form-card">
          {step === 1 ? (
            <>
              <div className="profile-photo-picker">
                <div className="profile-photo"><Image src="/images/oliver-profile.jpg" alt="Oliver" fill sizes="92px" /></div>
                <button><Edit3 size={15} /> Change photo</button>
              </div>
              <div className="field-grid field-grid--two">
                <label><span>Child’s name *</span><input value={form.name} onChange={(event) => setField("name", event.target.value)} /></label>
                <label><span>Nickname</span><input value={form.nickname} onChange={(event) => setField("nickname", event.target.value)} /></label>
                <label><span>Date of birth *</span><input type="date" value={form.dateOfBirth} onChange={(event) => setField("dateOfBirth", event.target.value)} /></label>
                <label><span>Age</span><input value="19 months" disabled /><small>Calculated automatically</small></label>
              </div>
              <label className="form-field"><span>Address <i>optional</i></span><input value={form.address} onChange={(event) => setField("address", event.target.value)} placeholder="Home address" /></label>
            </>
          ) : (
            <div className="details-sections">
              <div className="mini-section-title"><HeartPulse size={18} /><h3>Medical information</h3><span>Optional</span></div>
              <div className="field-grid field-grid--two">
                <label><span>Allergies</span><input value={form.allergies} onChange={(event) => setField("allergies", event.target.value)} /></label>
                <label><span>Current medicines</span><input value={form.medicines} onChange={(event) => setField("medicines", event.target.value)} /></label>
                <label><span>Known conditions</span><input value={form.conditions} onChange={(event) => setField("conditions", event.target.value)} /></label>
                <label><span>Dietary requirements</span><input value={form.dietaryRequirements} onChange={(event) => setField("dietaryRequirements", event.target.value)} /></label>
              </div>
              <label className="form-field"><span>Things to be aware of</span><textarea value={form.sensitivities} onChange={(event) => setField("sensitivities", event.target.value)} placeholder="Triggers, sensitivities or anything helpful to know" /></label>
              <div className="mini-section-title"><Stethoscope size={18} /><h3>Doctor details</h3></div>
              <div className="field-grid field-grid--two">
                <label><span>GP surgery</span><input value={form.gpSurgery} onChange={(event) => setField("gpSurgery", event.target.value)} /></label>
                <label><span>GP phone</span><input value={form.gpPhone} onChange={(event) => setField("gpPhone", event.target.value)} /></label>
                <label className="field-span-two"><span>Preferred hospital</span><input value={form.preferredHospital} onChange={(event) => setField("preferredHospital", event.target.value)} /></label>
              </div>
            </div>
          )}
          <SaveBar onSave={() => step === 1 ? setStep(2) : finish()} label={step === 1 ? "Continue" : "Save Oliver’s profile"} secondary={step === 2 ? { label: "Save & finish later", onClick: finish } : undefined} />
        </div>
      </div>
    </AppPage>
  );
}

function HomeScreen({ go }: { go: (screen: Screen) => void }) {
  const summaries = [
    { label: "Sleep", value: "8–10 hours", note: "slightly lower than usual", icon: Moon, tone: "sleep", trend: "down" },
    { label: "Mood", value: "Mostly happy", note: "content on 5 of 7 days", icon: Smile, tone: "mood" },
    { label: "Meals", value: "Ate most", note: "lower intake on 3 days", icon: Utensils, tone: "meals" },
    { label: "Wellbeing", value: "5 well days", note: "2 congested days", icon: HeartPulse, tone: "health" },
  ];
  return (
    <AppPage screen="home" go={go} className="home-page">
      <TopBar right={<div className="header-tools"><button className="icon-button"><Bell size={19} /></button><button className="avatar-mini" onClick={() => go("profile")}><Image src="/images/oliver-profile.jpg" alt="Oliver" fill sizes="40px" /></button></div>} />
      <div className="page-container home-container">
        <section className="home-hero">
          <div className="hero-copy">
            <span className="eyebrow">Saturday, 18 October</span>
            <h1>Good morning, Emily <span>♥</span></h1>
            <p>Here’s <strong>Oliver’s week</strong> so far.</p>
          </div>
          <div className="child-chip"><div><Image src="/images/oliver-profile.jpg" alt="Oliver" fill sizes="54px" /></div><span><strong>Oliver</strong><small>19 months</small></span><ChevronDown size={16} /></div>
        </section>

        <section className="quick-actions" aria-label="Quick actions">
          <button className="primary-action" onClick={() => go("log")}><span><Plus size={23} /></span><div><b>Log Today</b><small>About 30–60 seconds</small></div><ArrowRight size={18} /></button>
          <button onClick={() => go("journal")}><span className="action-icon tone-sage"><NotebookPen size={21} /></span><b>My Journal</b><small>Your timeline</small></button>
          <button onClick={() => go("weekly")}><span className="action-icon tone-blush"><Activity size={21} /></span><b>Insights</b><small>Notice patterns</small></button>
          <button onClick={() => go("report-builder")}><span className="action-icon tone-blue"><FileHeart size={21} /></span><b>Reports</b><small>Share a summary</small></button>
        </section>

        <section className="week-section">
          <SectionHeading eyebrow="At a glance" title="This week" action={<button className="text-link" onClick={() => go("weekly")}>View insight <ChevronRight size={15} /></button>} />
          <div className="summary-grid">
            {summaries.map((item) => {
              const Icon = item.icon;
              return <article className={`summary-card tone-card--${item.tone}`} key={item.label}>
                <div className="summary-card__top"><span><Icon size={18} /></span><small>{item.label}</small>{item.trend && <TrendingDown size={15} />}</div>
                <strong>{item.value}</strong>
                <p>{item.trend && <ArrowDown size={13} />} {item.note}</p>
              </article>;
            })}
          </div>
        </section>

        <button className="insight-teaser" onClick={() => go("weekly")}>
          <span className="insight-teaser__icon"><Sparkles size={21} /></span>
          <span><small>Pattern we noticed</small><b>Congestion and more night waking were recorded together twice this week.</b><em>View weekly insight</em></span>
          <ChevronRight size={19} />
        </button>

        <section className="journal-nudge">
          <BookHeart size={23} />
          <div><strong>Your journal is the heart of this.</strong><p>Keep recording the moments on paper; bring the key details here when you’re ready.</p></div>
        </section>
        <p className="brand-signoff">Track the little things. See the bigger picture.</p>
      </div>
    </AppPage>
  );
}

function LogTodayScreen({ go, draft, saveDraft }: { go: (screen: Screen) => void; draft: DailyDraft; saveDraft: (draft: boolean) => void }) {
  const sections = [
    { label: "Health", sub: draft.health.join(", ") || "Not added", icon: HeartPulse, tone: "health", screen: "health" as Screen, done: draft.health.length > 0 },
    { label: "Sleep & naps", sub: `${draft.totalSleep || "Not added"} · ${draft.nightWakes || "Night wakes"}`, icon: Moon, tone: "sleep", screen: "sleep" as Screen, done: !!draft.totalSleep },
    { label: "Mood", sub: draft.mood.join(", ") || "Not added", icon: Smile, tone: "mood", screen: "mood" as Screen, done: draft.mood.length > 0 },
    { label: "Meals & food", sub: `${draft.meals || "Not added"} · ${draft.fruitVeg || "Fruit & veg"}`, icon: Utensils, tone: "meals", screen: "meals" as Screen, done: !!draft.meals },
  ];
  return (
    <AppPage screen="log" go={go} className="log-page">
      <TopBar title="Log Today" eyebrow="Oliver’s daily record" back onBack={() => go("home")} right={<button className="text-link" onClick={() => saveDraft(true)}>Finish later</button>} />
      <div className="narrow-container">
        <ProgressDots current={4} total={4} />
        <div className="date-card"><span><Calendar size={18} /> Date</span><input type="date" value={draft.date} readOnly /><small>{todayLabel}</small></div>
        <div className="log-intro"><h2>What would you like to record?</h2><p>Tap a section to add or update the little details from your journal.</p></div>
        <div className="log-section-list">
          {sections.map((section) => {
            const Icon = section.icon;
            return <button key={section.label} onClick={() => go(section.screen)} className={`log-row tone-card--${section.tone}`}>
              <span className="log-row__icon"><Icon size={22} /></span>
              <span className="log-row__copy"><b>{section.label}</b><small>{section.sub}</small></span>
              {section.done ? <span className="done-mark"><Check size={16} /></span> : <ChevronRight size={18} />}
            </button>;
          })}
        </div>
        <button className="anything-else" onClick={() => go("quick-add")}><span><Plus size={20} /></span><div><b>Anything else to record?</b><small>Medicine, sickness, milestones & more</small></div><ChevronRight size={18} /></button>
        <div className="autosave-note"><CloudSun size={15} /> Your entries are saved as you go.</div>
        <SaveBar onSave={() => saveDraft(false)} label="Save today’s record" secondary={{ label: "Save & finish later", onClick: () => saveDraft(true) }} />
      </div>
    </AppPage>
  );
}

function EntryPage({
  screen,
  go,
  title,
  subtitle,
  icon: Icon,
  tone,
  children,
  onSave,
}: {
  screen: Screen;
  go: (screen: Screen) => void;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  tone: string;
  children: React.ReactNode;
  onSave: () => void;
}) {
  return (
    <AppPage screen={screen} go={go} className="entry-page">
      <TopBar title={title} eyebrow={subtitle} back onBack={() => go("log")} right={<span className="autosaved"><Check size={13} /> Autosaved</span>} />
      <div className="narrow-container">
        <div className={`entry-banner tone-card--${tone}`}><span><Icon size={25} /></span><div><small>Recording for</small><strong>Oliver · {todayLabel}</strong></div></div>
        {children}
        <SaveBar onSave={onSave} label="Save & return" secondary={{ label: "Skip", onClick: () => go("log") }} />
      </div>
    </AppPage>
  );
}

function HealthScreen({ go, draft, setDraft }: { go: (screen: Screen) => void; draft: DailyDraft; setDraft: React.Dispatch<React.SetStateAction<DailyDraft>> }) {
  return (
    <EntryPage screen="health" go={go} title="Health & Wellbeing" subtitle="Daily check-in" icon={HeartPulse} tone="health" onSave={() => go("log")}>
      <div className="entry-question"><span className="question-number">1</span><div><h2>How has Oliver been today?</h2><p>Select all that apply.</p></div></div>
      <OptionGrid options={healthOptions} value={draft.health} multiple onChange={(value) => setDraft((current) => ({ ...current, health: value as string[] }))} />
      <label className="notes-field"><span>Optional notes</span><textarea value={draft.healthNotes} onChange={(event) => setDraft((current) => ({ ...current, healthNotes: event.target.value }))} placeholder="Anything else you noticed?" /></label>
      {draft.health.some((item) => ["Raised temperature", "Rash", "Upset stomach"].includes(item)) && <div className="safety-note"><AlertCircle size={19} /><p>If you are worried about Oliver or symptoms feel urgent, contact a qualified healthcare professional or local urgent care service. This app cannot assess symptoms.</p></div>}
    </EntryPage>
  );
}

function SleepScreen({ go, draft, setDraft }: { go: (screen: Screen) => void; draft: DailyDraft; setDraft: React.Dispatch<React.SetStateAction<DailyDraft>> }) {
  return (
    <EntryPage screen="sleep" go={go} title="Sleep & Naps" subtitle="Daily check-in" icon={Moon} tone="sleep" onSave={() => go("log")}>
      <div className="entry-question"><span className="question-number">1</span><div><h2>Total sleep</h2><p>Choose the closest range.</p></div></div>
      <OptionGrid options={sleepOptions} value={draft.totalSleep} onChange={(value) => setDraft((current) => ({ ...current, totalSleep: value as string }))} />
      <div className="entry-question"><span className="question-number">2</span><div><h2>Night wakes</h2></div></div>
      <OptionGrid options={wakeOptions} value={draft.nightWakes} onChange={(value) => setDraft((current) => ({ ...current, nightWakes: value as string }))} />
      <div className="divider-label"><span>Naps</span></div>
      <div className="entry-question entry-question--small"><div><h2>Nap count</h2></div></div>
      <OptionGrid options={napCountOptions} value={draft.napCount} onChange={(value) => setDraft((current) => ({ ...current, napCount: value as string }))} />
      <div className="entry-question entry-question--small"><div><h2>Total nap time</h2></div></div>
      <OptionGrid options={napTimeOptions} value={draft.napTime} onChange={(value) => setDraft((current) => ({ ...current, napTime: value as string }))} />
    </EntryPage>
  );
}

function MoodScreen({ go, draft, setDraft }: { go: (screen: Screen) => void; draft: DailyDraft; setDraft: React.Dispatch<React.SetStateAction<DailyDraft>> }) {
  return (
    <EntryPage screen="mood" go={go} title="Mood" subtitle="Daily check-in" icon={Smile} tone="mood" onSave={() => go("log")}>
      <div className="entry-question"><span className="question-number">1</span><div><h2>How would you describe Oliver’s mood?</h2><p>Select all that felt relevant today.</p></div></div>
      <OptionGrid options={moodOptions} value={draft.mood} multiple onChange={(value) => setDraft((current) => ({ ...current, mood: value as string[] }))} />
      <div className="observation-note"><MessageCircleHeart size={18} /><p>Record what you observed. The app will never medically interpret Oliver’s behaviour.</p></div>
    </EntryPage>
  );
}

function MealsScreen({ go, draft, setDraft }: { go: (screen: Screen) => void; draft: DailyDraft; setDraft: React.Dispatch<React.SetStateAction<DailyDraft>> }) {
  return (
    <EntryPage screen="meals" go={go} title="Meals & Food" subtitle="Daily check-in" icon={Utensils} tone="meals" onSave={() => go("log")}>
      <div className="entry-question"><span className="question-number">1</span><div><h2>Meals</h2><p>Overall, how much did Oliver eat?</p></div></div>
      <OptionGrid options={mealOptions} value={draft.meals} onChange={(value) => setDraft((current) => ({ ...current, meals: value as string }))} />
      <div className="entry-question"><span className="question-number">2</span><div><h2>Snacks</h2></div></div>
      <OptionGrid options={snackOptions} value={draft.snacks} onChange={(value) => setDraft((current) => ({ ...current, snacks: value as string }))} />
      <div className="entry-question"><span className="question-number">3</span><div><h2>Fruit & veg</h2></div></div>
      <OptionGrid options={fruitOptions} value={draft.fruitVeg} onChange={(value) => setDraft((current) => ({ ...current, fruitVeg: value as string }))} />
      <div className="entry-question"><span className="question-number">4</span><div><h2>Junk food</h2></div></div>
      <OptionGrid options={junkOptions} value={draft.junkFood} onChange={(value) => setDraft((current) => ({ ...current, junkFood: value as string }))} />
    </EntryPage>
  );
}

function QuickAddScreen({ go, notify }: { go: (screen: Screen) => void; notify: (message: string) => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [extra, setExtra] = useState("");
  const [status, setStatus] = useState("Watching");
  const item = quickTypes.find((type) => type.label === selected);
  const save = async () => {
    if (!selected) return;
    await postPrototype({ action: "entry", entry: { kind: selected, date: "2025-10-18", title: title || selected, notes, details: { extra, status } } }).catch(() => null);
    notify(`${selected} added to Oliver’s journal`);
    setSelected(null); setTitle(""); setNotes(""); setExtra("");
  };
  return (
    <AppPage screen="quick-add" go={go} className="quick-add-page">
      <TopBar title="Quick Add" eyebrow="Anything else to record?" back onBack={() => go("log")} />
      <div className="page-container quick-container">
        <div className="quick-intro"><h2>Choose an entry</h2><p>Add only what feels relevant. Most take less than a minute.</p></div>
        <div className="quick-grid">
          {quickTypes.map((type) => {
            const Icon = toneIcon[type.tone] || NotebookPen;
            return <button className={`quick-card tone-card--${type.tone}`} key={type.label} onClick={() => setSelected(type.label)}><span><Icon size={21} /></span><div><b>{type.label}</b><small>{type.helper}</small></div><Plus size={17} /></button>;
          })}
        </div>
      </div>
      {selected && item && <div className="sheet-backdrop" onMouseDown={() => setSelected(null)}>
        <section className="quick-sheet" onMouseDown={(event) => event.stopPropagation()}>
          <div className="sheet-handle" />
          <button className="sheet-close" onClick={() => setSelected(null)}><X size={19} /></button>
          <div className={`sheet-title tone-card--${item.tone}`}><span>{(() => { const Icon = toneIcon[item.tone]; return <Icon size={22} />; })()}</span><div><small>Quick add</small><h2>{selected}</h2></div></div>
          <label className="form-field"><span>Date</span><input type="date" defaultValue="2025-10-18" /></label>
          <label className="form-field"><span>{selected === "Food Reaction" ? "Food" : selected === "Medicine" ? "Medicine" : selected === "Milestone" ? "Milestone" : selected === "New Favourite" ? "Favourite" : selected === "Concern" ? "Concern" : "Title"}</span><input value={title} onChange={(event) => setTitle(event.target.value)} placeholder={selected === "Food Reaction" ? "e.g. Strawberries" : `Add ${selected.toLowerCase()}`} /></label>
          {selected === "Medicine" && <div className="field-grid field-grid--two"><label><span>Time</span><input type="time" defaultValue="19:30" /></label><label><span>Amount</span><input value={extra} onChange={(event) => setExtra(event.target.value)} placeholder="e.g. 5 ml" /></label></div>}
          {selected === "Food Reaction" && <label className="form-field"><span>Reaction noticed</span><input value={extra} onChange={(event) => setExtra(event.target.value)} placeholder="Describe only what you observed" /></label>}
          {selected === "Appointment" && <div className="field-grid field-grid--two"><label><span>Time</span><input type="time" /></label><label><span>Address</span><input value={extra} onChange={(event) => setExtra(event.target.value)} placeholder="Location" /></label></div>}
          {selected === "Concern" && <div className="status-options">{["Watching", "Discussed with professional", "Resolved"].map((option) => <button key={option} className={status === option ? "is-selected" : ""} onClick={() => setStatus(option)}>{status === option && <Check size={14} />}{option}</button>)}</div>}
          <label className="notes-field"><span>Notes <i>optional</i></span><textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Add any details from your journal…" /></label>
          {selected === "Food Reaction" && <div className="food-history"><Apple size={17} /><p>You have recorded a reaction after strawberries on <strong>3 occasions</strong>. This does not label an allergy or intolerance.</p></div>}
          <button className="button button--primary button--large button--full" onClick={save}>Save {selected}<Check size={17} /></button>
        </section>
      </div>}
    </AppPage>
  );
}

function JournalScreen({ go }: { go: (screen: Screen) => void }) {
  const [range, setRange] = useState("Week");
  const [filter, setFilter] = useState("All entries");
  const filters = ["All entries", "Health", "Sleep", "Mood", "Meals", "Medicine", "Milestones", "Concerns"];
  return (
    <AppPage screen="journal" go={go} className="journal-page">
      <TopBar title="My Journal" eyebrow="Oliver’s digital timeline" right={<button className="icon-button"><Search size={19} /></button>} />
      <div className="page-container journal-container">
        <div className="journal-quote"><BookHeart size={20} /><p>Everything you choose to bring across from the journal, beautifully organised.</p><Botanical /></div>
        <div className="segmented-control">{["Day", "Week", "Month", "All"].map((item) => <button key={item} className={range === item ? "is-active" : ""} onClick={() => setRange(item)}>{item}</button>)}</div>
        <div className="filter-row">{filters.map((item) => <button key={item} className={filter === item ? "is-active" : ""} onClick={() => setFilter(item)}>{item}</button>)}</div>
        <div className="journal-toolbar"><span><Calendar size={17} /> 12–18 October 2025</span><button><ChevronDown size={16} /> Filter</button></div>
        <div className="timeline">
          {journalDays.map((day) => {
            const visible = day.entries.filter((entry) => filter === "All entries" || entry.type === filter || (filter === "Meals" && entry.type === "Food Reaction"));
            if (!visible.length) return null;
            return <section className="timeline-day" key={day.date}>
              <div className="timeline-date"><span>{day.day}</span><div><small>October</small><b>{day.date.replace(/\s\d+\sOctober/, "")}</b></div><button aria-label={`More options for ${day.date}`}><MoreHorizontal size={19} /></button></div>
              <div className="timeline-entries">
                {visible.map((entry) => {
                  const Icon = iconMap[entry.icon] || Heart;
                  return <article className={`timeline-entry tone-card--${entry.tone}`} key={`${day.date}-${entry.type}`}><span><Icon size={18} /></span><div><b>{entry.type}</b><p>{entry.text}</p></div><button onClick={() => entry.type === "Sleep" ? go("sleep") : entry.type === "Mood" ? go("mood") : entry.type === "Meals" ? go("meals") : entry.type === "Health" ? go("health") : go("quick-add")}><Edit3 size={15} /></button></article>;
                })}
              </div>
            </section>;
          })}
        </div>
        <button className="load-more">Show earlier entries <ChevronDown size={16} /></button>
      </div>
    </AppPage>
  );
}

function InsightTabs({ active, go }: { active: "weekly" | "monthly"; go: (screen: Screen) => void }) {
  return <div className="insight-tabs"><button className={active === "weekly" ? "is-active" : ""} onClick={() => go("weekly")}>Weekly</button><button className={active === "monthly" ? "is-active" : ""} onClick={() => go("monthly")}>Monthly</button></div>;
}

function ConfidenceNote() {
  return <div className="confidence-note"><span><Sparkles size={17} /></span><div><b>Based on 7 days of records</b><p>There’s enough information to begin noticing gentle patterns. Insights become more useful over time.</p></div></div>;
}

function WeeklyInsights({ go }: { go: (screen: Screen) => void }) {
  return (
    <AppPage screen="weekly" go={go} className="insights-page">
      <TopBar title="Insights" eyebrow="See the bigger picture" right={<button className="icon-button"><Share2 size={18} /></button>} />
      <div className="page-container insights-container">
        <InsightTabs active="weekly" go={go} />
        <section className="report-hero report-hero--weekly"><div><span className="eyebrow">12–18 October</span><h1>Oliver’s <em>Week</em></h1><p>A gentle look at what you recorded.</p></div><div className="report-ring"><strong>7</strong><small>days logged</small></div><Botanical /></section>
        <ConfidenceNote />
        <SectionHeading eyebrow="At a glance" title="This week’s overview" />
        <div className="glance-grid">
          <article><span className="tone-blue"><Moon size={19} /></span><small>Sleep</small><strong>8–10 hours</strong><p>Average category</p></article>
          <article><span className="tone-lavender"><Activity size={19} /></span><small>Night waking</small><strong>Higher</strong><p><TrendingUp size={14} /> than last week</p></article>
          <article><span className="tone-peach"><Smile size={19} /></span><small>Mood</small><strong>Mostly happy</strong><p>5 of 7 days</p></article>
          <article><span className="tone-coral"><Utensils size={19} /></span><small>Meals</small><strong>Lower on 3 days</strong><p>than Oliver’s usual</p></article>
        </div>
        <section className="wellbeing-week">
          <div className="wellbeing-copy"><span className="tone-sage"><HeartPulse size={20} /></span><div><small>Wellbeing</small><strong>5 well days · 2 congested days</strong></div></div>
          <div className="mini-bars">{weekBars.map((bar, index) => <div key={`${bar.day}-${index}`}><span style={{ height: `${bar.value}%`, background: bar.tone }} /><small>{bar.day}</small></div>)}</div>
        </section>
        <SectionHeading eyebrow="Together, over time" title="Patterns we noticed" />
        <div className="pattern-list">
          <article className="pattern-card pattern-card--primary"><span className="pattern-count">01</span><Sparkles size={20} /><p>On the <strong>two days</strong> you recorded Oliver as congested, you also recorded <strong>more night waking</strong> and lower meal intake.</p><small>These were recorded alongside one another; this does not show that one caused the other.</small></article>
          <article className="pattern-card"><span className="pattern-count">02</span><Moon size={20} /><p>Lower appetite was recorded on <strong>three days</strong> this week. Two of these occurred alongside poor sleep.</p></article>
          <article className="pattern-card"><span className="pattern-count">03</span><Smile size={20} /><p>Oliver was recorded as <strong>happy/content on 5 of 7 days</strong>.</p></article>
        </div>
        <section className="keep-eye"><div><AlertCircle size={19} /></div><span><small>Something to keep an eye on</small><p>Night waking was different from Oliver’s usual pattern on two days. You may find this useful to mention if it continues or if you have concerns.</p></span></section>
        <div className="safety-disclaimer"><ShieldCheck size={18} /><p>Insights describe only what you recorded. They do not diagnose, interpret symptoms medically, or establish cause.</p></div>
      </div>
    </AppPage>
  );
}

function MonthlyInsights({ go }: { go: (screen: Screen) => void }) {
  const trendCards = [
    { label: "Sleep", value: "More settled", note: "Night waking decreased", trend: "up", icon: Moon, tone: "blue" },
    { label: "Naps", value: "Consistent", note: "Mostly 1 nap", trend: "same", icon: CloudSun, tone: "lavender" },
    { label: "Mood", value: "Happy / Content", note: "Most frequently recorded", trend: "same", icon: Smile, tone: "peach" },
    { label: "Appetite", value: "Generally steady", note: "Ate less on 6 days", trend: "down", icon: Utensils, tone: "coral" },
  ];
  return (
    <AppPage screen="monthly" go={go} className="insights-page">
      <TopBar title="Insights" eyebrow="See the bigger picture" right={<button className="icon-button"><Share2 size={18} /></button>} />
      <div className="page-container insights-container">
        <InsightTabs active="monthly" go={go} />
        <section className="report-hero report-hero--monthly"><div><span className="eyebrow">October 2025</span><h1>Oliver’s <em>Month</em></h1><p>Compared with September.</p></div><div className="report-ring"><strong>25</strong><small>days logged</small></div><Botanical /></section>
        <div className="month-selector"><button><ArrowLeft size={17} /></button><span><Calendar size={17} /> October 2025</span><button disabled><ArrowRight size={17} /></button></div>
        <SectionHeading eyebrow="Compared with last month" title="Everyday rhythms" />
        <div className="monthly-trends">
          {trendCards.map((card) => { const Icon = card.icon; return <article key={card.label}><div className={`trend-icon tone-${card.tone}`}><Icon size={20} /></div><div><small>{card.label}</small><strong>{card.value}</strong><p>{card.trend === "up" ? <TrendingUp size={14} /> : card.trend === "down" ? <TrendingDown size={14} /> : <ArrowRight size={14} />}{card.note}</p></div></article>; })}
        </div>
        <section className="trend-chart-card">
          <div className="chart-title"><div><small>Four-week view</small><h3>Sleep & appetite</h3></div><div className="chart-key"><span className="key-sleep" /> Sleep <span className="key-meals" /> Meals</div></div>
          <div className="line-chart" aria-label="A simple chart showing sleep and appetite across four weeks">
            <div className="chart-grid-lines"><i /><i /><i /></div>
            {monthWeeks.map((week) => <div className="chart-column" key={week.label}><div className="chart-bars"><span className="bar-sleep" style={{ height: `${week.sleep}%` }} /><span className="bar-meals" style={{ height: `${week.meals}%` }} /></div><small>{week.label}</small></div>)}
          </div>
          <p className="chart-caption">Both were lower during week 3 and returned closer to Oliver’s usual pattern in week 4.</p>
        </section>
        <SectionHeading eyebrow="Wellbeing records" title="This month" />
        <div className="month-counts"><article><HeartPulse size={20} /><strong>6</strong><span>Congested days</span></article><article><Activity size={20} /><strong>1</strong><span>Sickness episode</span></article><article><Apple size={20} /><strong>3</strong><span>Food reactions</span></article><article><Pill size={20} /><strong>4</strong><span>Medicine entries</span></article></div>
        <SectionHeading eyebrow="Across your records" title="Patterns" />
        <article className="month-pattern"><div className="pattern-venn"><span><HeartPulse size={18} /></span><span><Moon size={18} /></span></div><div><h3>Congestion + night waking</h3><p>Congestion and increased night waking were recorded together on <strong>4 occasions</strong>.</p><small>This is a recorded correlation only and does not imply causation.</small></div></article>
        <div className="keepsake-link"><span><Sparkles size={21} /></span><div><small>A month to remember</small><strong>2 milestones & 3 new favourites</strong></div><button onClick={() => go("memories")}>View memories <ChevronRight size={15} /></button></div>
        <div className="safety-disclaimer"><ShieldCheck size={18} /><p>Insights describe only what you recorded. They do not diagnose, interpret symptoms medically, or establish cause.</p></div>
      </div>
    </AppPage>
  );
}

function ReportBuilder({ go, notify }: { go: (screen: Screen) => void; notify: (message: string) => void }) {
  const [step, setStep] = useState(1);
  const [range, setRange] = useState("Last 7 days");
  const [included, setIncluded] = useState(reportIncludeOptions.slice(0, 9));
  const [reason, setReason] = useState("To share a summary of Oliver’s recent congestion, sleep and appetite records before our appointment.");
  const toggle = (item: string) => setIncluded((current) => current.includes(item) ? current.filter((value) => value !== item) : [...current, item]);
  const generate = async () => {
    await postPrototype({ action: "report", report: { type: "doctor", start: "2025-10-12", end: "2025-10-18", range, included, reason } }).catch(() => null);
    notify("Doctor’s Report created");
    go("report-preview");
  };
  return (
    <AppPage screen="report-builder" go={go} className="report-builder-page">
      <TopBar title="Doctor’s Report" eyebrow="Prepare a clear summary" back onBack={() => step === 1 ? go("profile") : setStep(step - 1)} right={<span className="secure-label"><LockKeyhole size={14} /> Private</span>} />
      <div className="narrow-container report-builder-container">
        <div className="builder-steps">{["Date range", "Information", "Review"].map((label, index) => <div key={label} className={step >= index + 1 ? "is-active" : ""}><span>{step > index + 1 ? <Check size={14} /> : index + 1}</span><small>{label}</small></div>)}</div>
        {step === 1 && <section className="builder-card"><div className="builder-icon tone-blue"><Calendar size={23} /></div><span className="eyebrow">Step 1</span><h1>Choose a date range</h1><p>Include the period most useful for your upcoming appointment.</p><div className="range-options">{["Last 7 days", "Last 30 days", "Custom"].map((item) => <button key={item} className={range === item ? "is-selected" : ""} onClick={() => setRange(item)}><span>{range === item && <Check size={14} />}</span><div><b>{item}</b><small>{item === "Last 7 days" ? "12–18 October 2025" : item === "Last 30 days" ? "19 September–18 October" : "Choose start and end dates"}</small></div></button>)}</div>{range === "Custom" && <div className="field-grid field-grid--two"><label><span>From</span><input type="date" defaultValue="2025-10-01" /></label><label><span>To</span><input type="date" defaultValue="2025-10-18" /></label></div>}<SaveBar onSave={() => setStep(2)} label="Continue" /></section>}
        {step === 2 && <section className="builder-card"><div className="builder-icon tone-sage"><FileText size={23} /></div><span className="eyebrow">Step 2</span><h1>What should we include?</h1><p>Select the details that feel relevant. You can preview everything before downloading.</p><div className="check-list">{reportIncludeOptions.map((item) => <button key={item} className={included.includes(item) ? "is-selected" : ""} onClick={() => toggle(item)}><span>{included.includes(item) && <Check size={14} />}</span>{item}</button>)}</div><SaveBar onSave={() => setStep(3)} label="Review report" secondary={{ label: "Select all", onClick: () => setIncluded([...reportIncludeOptions]) }} /></section>}
        {step === 3 && <section className="builder-card"><div className="builder-icon tone-blush"><Stethoscope size={23} /></div><span className="eyebrow">Step 3</span><h1>Ready to create</h1><p>We’ll organise the information into a simple, professional summary.</p><div className="report-review"><div><small>Child</small><b>Oliver Hart · 19 months</b></div><div><small>Report period</small><b>12–18 October 2025</b></div><div><small>Includes</small><b>{included.length} information sections</b></div></div><label className="notes-field"><span>Reason for report <i>optional</i></span><textarea value={reason} onChange={(event) => setReason(event.target.value)} /></label><div className="privacy-panel"><LockKeyhole size={18} /><p>This report is created privately from the information you selected. It is an organisational aid, not a medical record.</p></div><SaveBar onSave={generate} label="Create Doctor’s Report" /></section>}
      </div>
    </AppPage>
  );
}

function ReportPreview({ go, notify }: { go: (screen: Screen) => void; notify: (message: string) => void }) {
  const [downloading, setDownloading] = useState(false);
  const download = async () => {
    setDownloading(true);
    try {
      const response = await fetch("/api/reports/doctor/pdf", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ start: "12 October 2025", end: "18 October 2025" }) });
      if (!response.ok) throw new Error("Unable to create PDF");
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a"); anchor.href = url; anchor.download = "oliver-doctors-report.pdf"; anchor.click(); URL.revokeObjectURL(url);
      notify("PDF downloaded securely");
    } catch { notify("Could not download the report"); } finally { setDownloading(false); }
  };
  const share = async () => {
    if (navigator.share) await navigator.share({ title: "Oliver’s Doctor’s Report", text: "My Baby Well-Being Insights report for Oliver." });
    else notify("Sharing is available from your browser’s share menu");
  };
  return (
    <AppPage screen="report-preview" go={go} className="report-preview-page">
      <TopBar title="Report Preview" eyebrow="Oliver · 12–18 October" back onBack={() => go("report-builder")} right={<span className="ready-label"><CheckCircle2 size={15} /> Ready</span>} />
      <div className="report-actions"><button className="button button--primary" onClick={download} disabled={downloading}><Download size={17} />{downloading ? "Creating…" : "Download PDF"}</button><button className="button button--outline" onClick={() => window.print()}><Printer size={17} /> Print</button><button className="button button--outline" onClick={share}><Share2 size={17} /> Share</button></div>
      <div className="document-wrap">
        <article className="doctor-document">
          <header><div><span>MY BABY</span><h1>Well-Being Insights</h1></div><div><small>DOCTOR’S REPORT</small><b>Created 18 October 2025</b></div></header>
          <div className="document-child"><div className="document-avatar"><Image src="/images/oliver-profile.jpg" alt="Oliver" fill sizes="56px" /></div><div><small>CHILD</small><h2>Oliver Hart</h2><p>DOB 18 March 2024 · 19 months</p></div><div><small>REPORT PERIOD</small><b>12–18 October 2025</b></div></div>
          <DocumentSection title="Current information"><div className="document-columns"><p><small>Known conditions</small>None known</p><p><small>Allergies</small>None known</p><p><small>Current medicines</small>None routinely</p></div></DocumentSection>
          <DocumentSection title="Reason for report"><p>To share a concise summary of recent congestion, sleep and appetite records before Oliver’s appointment.</p></DocumentSection>
          <DocumentSection title="Summary"><p>During this period, <strong>congestion was recorded on 2 days</strong>, lower meal intake on 3 days and increased night waking on 2 days. Oliver was recorded as well on 5 days and happy/content on 5 of 7 days.</p></DocumentSection>
          <DocumentSection title="Timeline"><div className="document-timeline"><p><b>14 Oct</b><span>Congested · 3 night wakes · Ate very little</span></p><p><b>15 Oct</b><span>Congested · 3 night wakes · Ate some</span></p><p><b>15 Oct</b><span>Calpol · 5 ml · 7:30 pm · Teething discomfort</span></p><p><b>16 Oct</b><span>Well · 1–2 wakes · Ate most</span></p></div></DocumentSection>
          <DocumentSection title="Patterns observed"><div className="document-callout">Increased night waking was recorded on both days where congestion was also recorded. Lower meal intake occurred alongside these records. <strong>This is an observed combination and does not establish a cause.</strong></div></DocumentSection>
          <div className="document-half"><DocumentSection title="Medicine"><p><b>15 Oct · Calpol</b><br />5 ml · Teething discomfort</p></DocumentSection><DocumentSection title="Food reactions"><p><b>13 Oct · Strawberries</b><br />Redness around mouth</p></DocumentSection></div>
          <DocumentSection title="Parent notes / concerns"><p>Please discuss the recent congestion and whether there is anything in particular we should continue to observe.</p></DocumentSection>
          <footer>This report contains information recorded by the parent/carer through My Baby Well-Being Insights. It is intended as an organisational aid and is not a medical record, diagnosis or medical advice.</footer>
        </article>
      </div>
      <div className="report-history-link"><CheckCircle2 size={18} /><span><b>Saved to Report History</b><small>You can revisit this report from your profile.</small></span><ChevronRight size={17} /></div>
    </AppPage>
  );
}

function DocumentSection({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="document-section"><h3>{title}</h3>{children}</section>;
}

function MemoriesScreen({ go }: { go: (screen: Screen) => void }) {
  return (
    <AppPage screen="memories" go={go} className="memories-page">
      <TopBar title="Memories & Milestones" eyebrow="Oliver’s keepsake timeline" back onBack={() => go("profile")} right={<button className="icon-button" onClick={() => go("quick-add")}><Plus size={19} /></button>} />
      <div className="page-container memories-container">
        <section className="memories-hero"><div><span className="script-line">A keepsake for your child</span><h1>Little moments,<br /><em>lovingly remembered.</em></h1><p>The journal holds the feeling. This timeline helps you find those moments again.</p></div><div className="memory-photo"><Image src="/images/oliver-profile.jpg" alt="Oliver smiling" fill sizes="240px" /></div><Botanical /></section>
        <div className="memory-stats"><span><strong>12</strong><small>Milestones</small></span><Heart size={17} fill="currentColor" /><span><strong>8</strong><small>New favourites</small></span><Heart size={17} fill="currentColor" /><span><strong>24</strong><small>Memories</small></span></div>
        <SectionHeading eyebrow="2025" title="Oliver’s story" action={<button className="text-link" onClick={() => go("quick-add")}>Add a memory <Plus size={15} /></button>} />
        <div className="memory-timeline">
          {memories.map((memory, index) => { const Icon = iconMap[memory.icon] || Heart; return <article className={`memory-entry tone-card--${memory.tone}`} key={memory.title}><div className="memory-line"><span><Icon size={19} /></span>{index < memories.length - 1 && <i />}</div><div className="memory-card"><small>{memory.date} · {memory.type}</small><h2>{memory.title}</h2><p>{memory.note}</p><button><Edit3 size={14} /> Edit memory</button></div></article>; })}
        </div>
        <div className="paper-keepsake"><BookHeart size={23} /><div><h3>Keep writing in your physical journal</h3><p>It’s the tactile, emotional keepsake of Oliver’s story. This digital timeline is here to help you organise and revisit it.</p></div></div>
      </div>
    </AppPage>
  );
}

function ProfileScreen({ go, notify }: { go: (screen: Screen) => void; notify: (message: string) => void }) {
  const [notifications, setNotifications] = useState(true);
  const groups = [
    { title: "Oliver", items: [
      { label: "Child profile & medical details", sub: "DOB, allergies, GP and emergency contacts", icon: CircleUserRound, action: () => go("child-profile") },
      { label: "Memories & Milestones", sub: "Oliver’s keepsake timeline", icon: Sparkles, action: () => go("memories") },
    ] },
    { title: "Reports", items: [
      { label: "Create Doctor’s Report", sub: "Prepare an appointment summary", icon: Stethoscope, action: () => go("report-builder") },
      { label: "Report history", sub: "Weekly, monthly and doctor’s reports", icon: FileText, badge: "3 saved", action: () => go("report-preview") },
    ] },
    { title: "Privacy & your data", items: [
      { label: "Export my data", sub: "Download a private copy", icon: Download, action: () => notify("Your data export is being prepared") },
      { label: "Privacy & security", sub: "How we protect Oliver’s information", icon: ShieldCheck, action: () => notify("Privacy information opened") },
      { label: "Delete my data", sub: "Permanently remove child records", icon: Trash2, danger: true, action: () => notify("For safety, deletion requires account verification") },
    ] },
  ];
  return (
    <AppPage screen="profile" go={go} className="profile-page">
      <TopBar title="Profile & Settings" eyebrow="Your journal companion" right={<button className="icon-button"><Settings size={19} /></button>} />
      <div className="page-container profile-container">
        <section className="profile-hero"><div className="profile-large"><Image src="/images/oliver-profile.jpg" alt="Oliver" fill sizes="92px" /></div><div><span className="eyebrow">Child profile</span><h1>Oliver Hart</h1><p>19 months · Born 18 March 2024</p><button onClick={() => go("child-profile")}><Edit3 size={14} /> Edit profile</button></div><Heart className="profile-heart" size={30} /></section>
        <div className="licence-card"><BookHeart size={21} /><div><small>MY BABY WELL-BEING JOURNAL</small><strong>Journal companion active</strong><p>Activated for emily@example.com</p></div><CheckCircle2 size={21} /></div>
        {groups.map((group) => <section className="settings-group" key={group.title}><h2>{group.title}</h2><div>{group.items.map((item) => { const Icon = item.icon; const isDanger = "danger" in item && item.danger; const badge = "badge" in item ? item.badge : undefined; return <button key={item.label} onClick={item.action} className={isDanger ? "danger" : ""}><span><Icon size={19} /></span><div><b>{item.label}</b><small>{item.sub}</small></div>{badge && <em>{badge}</em>}<ChevronRight size={17} /></button>; })}</div></section>)}
        <section className="settings-group"><h2>Preferences</h2><div><div className="setting-toggle"><span><Bell size={19} /></span><div><b>Gentle reminders</b><small>Daily log and report-ready notifications</small></div><button className={`toggle ${notifications ? "is-on" : ""}`} onClick={() => setNotifications(!notifications)} aria-label="Toggle notifications"><i /></button></div><button onClick={() => notify("Help centre opened")}><span><HelpCircle size={19} /></span><div><b>Help & support</b><small>Using your journal companion</small></div><ChevronRight size={17} /></button></div></section>
        <div className="medical-statement"><HeartPulse size={18} /><p>My Baby Well-Being Insights helps parents organise and understand information they record about their child. It does not provide medical diagnoses and should not replace advice from a qualified healthcare professional.</p></div>
        <button className="sign-out" onClick={async () => { await postPrototype({ action: "logout" }).catch(() => null); go("welcome"); }}>Sign out</button>
        <p className="version">My Baby Well-Being Insights · Prototype 1.0</p>
      </div>
    </AppPage>
  );
}

export default function InsightsApp() {
  const [screen, setScreen] = useState<Screen>("welcome");
  const [activationCode, setActivationCode] = useState("");
  const [draft, setDraft] = useState<DailyDraft>(() => {
    if (typeof window === "undefined") return initialDraft;
    const saved = window.localStorage.getItem("mbwi-daily-draft");
    if (!saved) return initialDraft;
    try { return JSON.parse(saved) as DailyDraft; } catch { return initialDraft; }
  });
  const [toast, setToast] = useState("");

  useEffect(() => {
    window.localStorage.setItem("mbwi-daily-draft", JSON.stringify(draft));
  }, [draft]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 2800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const go = (next: Screen) => {
    setScreen(next);
    window.setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 10);
  };

  const notify = (message: string) => setToast(message);

  const saveDraft = async (isDraft: boolean) => {
    await postPrototype({ action: "log", log: { ...draft, isDraft } }).catch(() => null);
    notify(isDraft ? "Saved to finish later" : "Today’s details saved to Oliver’s journal");
    go(isDraft ? "home" : "journal");
  };

  const view = (() => {
    switch (screen) {
      case "welcome": return <WelcomeScreen go={go} />;
      case "activate": return <ActivationScreen go={go} code={activationCode} setCode={setActivationCode} />;
      case "login": return <LoginScreen go={go} notify={notify} />;
      case "account": return <AccountScreen go={go} code={activationCode} notify={notify} />;
      case "child-profile": return <ChildProfileScreen go={go} notify={notify} />;
      case "home": return <HomeScreen go={go} />;
      case "log": return <LogTodayScreen go={go} draft={draft} saveDraft={saveDraft} />;
      case "health": return <HealthScreen go={go} draft={draft} setDraft={setDraft} />;
      case "sleep": return <SleepScreen go={go} draft={draft} setDraft={setDraft} />;
      case "mood": return <MoodScreen go={go} draft={draft} setDraft={setDraft} />;
      case "meals": return <MealsScreen go={go} draft={draft} setDraft={setDraft} />;
      case "quick-add": return <QuickAddScreen go={go} notify={notify} />;
      case "journal": return <JournalScreen go={go} />;
      case "weekly": return <WeeklyInsights go={go} />;
      case "monthly": return <MonthlyInsights go={go} />;
      case "report-builder": return <ReportBuilder go={go} notify={notify} />;
      case "report-preview": return <ReportPreview go={go} notify={notify} />;
      case "memories": return <MemoriesScreen go={go} />;
      case "profile": return <ProfileScreen go={go} notify={notify} />;
      default: return <HomeScreen go={go} />;
    }
  })();

  return <>{view}{toast && <Toast message={toast} />}</>;
}
