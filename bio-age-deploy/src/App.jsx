import { useState } from "react";

const TEAL = "#1D9E75", TEAL_L = "#E1F5EE", TEAL_D = "#0F6E56";
const CORAL = "#D85A30", CORAL_L = "#FAECE7";

const LANG = {
  en: {
    appTitle: "Bio-Age Test",
    intro: {
      heading: "Self-Check Bio-Age Test",
      sub: "Answer 12 quick questions and discover your estimated biological age.",
      features: ["12 questions", "~2 minutes", "Science-based", "Free"],
      note: "Educational purposes only. Not a medical diagnosis.",
      cta: "Begin the Test"
    },
    nav: { next: "Next →", back: "← Back", submit: "Calculate My Bio-Age" },
    progress: "Question {n} of {total}",
    results: {
      heading: "Your Biological Age",
      chrono: "Chronological age",
      bioLabel: "Biological age",
      diffYounger: "{n} yrs younger than your age",
      diffOlder: "{n} yrs older than your age",
      diffSame: "Matches your chronological age",
      sectionWhy: "What this means",
      sectionRecs: "Tips to improve",
      retake: "Retake the Test",
      disclaimer: "For educational purposes only. Not a medical diagnosis."
    },
    toggle: "日本語",
    q: {
      age:      { q: "How old are you?",                         unit: "years" },
      sex:      { q: "What is your biological sex?",             opts: ["Male", "Female", "Prefer not to say"] },
      height:   { q: "What is your height?",                     unit: "cm" },
      weight:   { q: "What is your weight?",                     unit: "kg" },
      sleep:    { q: "How many hours do you sleep per night?",   unit: "hrs" },
      exercise: { q: "How often do you exercise each week?",     opts: ["Never", "1–2 ×/week", "3–4 ×/week", "5+ ×/week"] },
      smoking:  { q: "Do you smoke?",                            opts: ["Never", "Former smoker", "Occasionally", "Daily"] },
      alcohol:  { q: "How much alcohol do you drink weekly?",    opts: ["None", "1–3 drinks", "4–7 drinks", "8+ drinks"] },
      diet:     { q: "How would you describe your diet?",        opts: ["Poor", "Fair", "Good", "Excellent"] },
      stress:   { q: "What is your typical stress level?",       opts: ["Low", "Moderate", "High", "Very high"] },
      water:    { q: "How many glasses of water per day?",       unit: "glasses" },
      social:   { q: "How active is your social life?",          opts: ["Isolated", "Sometimes social", "Regularly social", "Very active"] }
    }
  },
  jp: {
    appTitle: "体内年齢セルフ検査",
    intro: {
      heading: "体内年齢セルフ検査",
      sub: "12の質問に答えるだけで、あなたの推定体内年齢を計算します。",
      features: ["12の質問", "約2分", "科学的根拠", "無料"],
      note: "こちらはあくまで教育目的においてのみ作られたもので、医療診断ではございません。",
      cta: "テストを始める"
    },
    nav: { next: "次へ →", back: "← 戻る", submit: "体内年齢を計算する" },
    progress: "質問 {n} / {total}",
    results: {
      heading: "あなたの体内年齢",
      chrono: "実年齢",
      bioLabel: "体内年齢",
      diffYounger: "実年齢より{n}歳若い",
      diffOlder: "実年齢より{n}歳老けている",
      diffSame: "実年齢と一致",
      sectionWhy: "これが意味すること",
      sectionRecs: "改善のためのヒント",
      retake: "もう一度テストを受ける",
      disclaimer: "こちらはあくまで教育目的においてのみ作られたもので、医療診断ではございません。"
    },
    toggle: "English",
    q: {
      age:      { q: "年齢を教えてください",               unit: "歳" },
      sex:      { q: "生物学的性別を選んでください",         opts: ["男性", "女性", "答えたくない"] },
      height:   { q: "身長を教えてください",                unit: "cm" },
      weight:   { q: "体重を教えてください",                unit: "kg" },
      sleep:    { q: "1日の睡眠時間は？",                   unit: "時間" },
      exercise: { q: "週に何回運動しますか？",               opts: ["しない", "週1〜2回", "週3〜4回", "週5回以上"] },
      smoking:  { q: "タバコを吸いますか？",                opts: ["吸わない", "以前吸っていた", "時々吸う", "毎日吸う"] },
      alcohol:  { q: "週に飲むお酒の量は？",                opts: ["飲まない", "1〜3杯", "4〜7杯", "8杯以上"] },
      diet:     { q: "食生活はどのように表現できますか？",   opts: ["悪い", "普通", "良い", "優秀"] },
      stress:   { q: "普段のストレスレベルは？",             opts: ["低い", "普通", "高い", "非常に高い"] },
      water:    { q: "1日に飲む水の量は？",                 unit: "杯" },
      social:   { q: "社会生活をどのように表現できますか？", opts: ["孤立している", "たまに社交的", "定期的に社交的", "非常に活発"] }
    }
  }
};

const QS = [
  { id: "age",      type: "number", min: 18,  max: 100, step: 1,   dflt: 35 },
  { id: "sex",      type: "select" },
  { id: "height",   type: "number", min: 130, max: 220, step: 1,   dflt: 165 },
  { id: "weight",   type: "number", min: 30,  max: 200, step: 1,   dflt: 60 },
  { id: "sleep",    type: "range",  min: 4,   max: 12,  step: 0.5, dflt: 7 },
  { id: "exercise", type: "select" },
  { id: "smoking",  type: "select" },
  { id: "alcohol",  type: "select" },
  { id: "diet",     type: "select" },
  { id: "stress",   type: "select" },
  { id: "water",    type: "range",  min: 1,   max: 15,  step: 1,   dflt: 8 },
  { id: "social",   type: "select" }
];

function calculateBioAge(answers, lang) {
  const age  = parseFloat(answers.age)    || 35;
  const h    = parseFloat(answers.height) || 165;
  const w    = parseFloat(answers.weight) || 60;
  const slp  = parseFloat(answers.sleep)  || 7;
  const wtr  = parseFloat(answers.water)  || 8;
  const bmi  = w / Math.pow(h / 100, 2);
  const jp   = lang === "jp";

  const FACTORS = [
    {
      id: "bmi",
      delta: bmi < 18.5 ? 2 : bmi < 22 ? -1 : bmi < 25 ? 0 : bmi < 28 ? 1 : bmi < 32 ? 3 : 5,
      label:  jp ? "BMI・体型" : "BMI / body weight",
      good:   jp ? "健康的な体型が体内年齢を若く保っています。" : "Your healthy body weight is helping keep your biological age low.",
      bad:    jp ? "BMIが理想範囲を外れており、体内年齢に影響しています。" : "Your BMI is outside the ideal range, which is contributing to a higher biological age.",
      rec:    jp ? "バランスの取れた食事と適度な運動でBMIを18.5〜24.9に近づけましょう。" : "Aim for a BMI of 18.5–24.9 through a balanced diet and regular physical activity."
    },
    {
      id: "sleep",
      delta: slp < 5 ? 4 : slp < 6 ? 2 : slp < 7 ? 1 : slp <= 9 ? -1 : slp <= 10 ? 0 : 1,
      label:  jp ? "睡眠" : "sleep",
      good:   jp ? "質の良い睡眠が体の回復と若さを支えています。" : "Your sleep duration is supporting your body's overnight recovery.",
      bad:    jp ? "睡眠時間が不十分で、体内年齢に悪影響を与えています。" : "Your sleep habits are negatively affecting your biological age.",
      rec:    jp ? "毎晩7〜9時間の睡眠を確保し、就寝・起床時間を一定に保ちましょう。" : "Aim for 7–9 hours of quality sleep per night with a consistent schedule."
    },
    {
      id: "exercise",
      delta: ({ "Never":4,"1–2 ×/week":0,"3–4 ×/week":-2,"5+ ×/week":-1,"しない":4,"週1〜2回":0,"週3〜4回":-2,"週5回以上":-1 })[answers.exercise] ?? 1,
      label:  jp ? "運動" : "exercise",
      good:   jp ? "定期的な運動が体内年齢を下げる大きな要因になっています。" : "Regular exercise is a major factor keeping your biological age young.",
      bad:    jp ? "運動不足が体内の老化を加速させています。" : "Physical inactivity is accelerating your biological aging.",
      rec:    jp ? "週3〜4回、30分以上の有酸素運動（ウォーキング、水泳など）を習慣にしましょう。" : "Add 30+ minutes of moderate aerobic exercise (walking, cycling, swimming) 3–4 times per week."
    },
    {
      id: "smoking",
      delta: ({ "Never":-1,"Former smoker":1,"Occasionally":3,"Daily":7,"吸わない":-1,"以前吸っていた":1,"時々吸う":3,"毎日吸う":7 })[answers.smoking] ?? 0,
      label:  jp ? "喫煙" : "smoking",
      good:   jp ? "タバコを吸わないことは、体内年齢を若く保つ最重要習慣の一つです。" : "Not smoking is one of the most powerful habits for keeping your biological age low.",
      bad:    jp ? "喫煙は体内年齢を大幅に引き上げる最大のリスク要因の一つです。" : "Smoking is one of the single biggest factors accelerating biological aging.",
      rec:    jp ? "禁煙は体内年齢改善に最も大きな効果があります。医師や禁煙プログラムへの相談をお勧めします。" : "Quitting smoking has the single largest impact on reducing biological age. Talk to a doctor about cessation support."
    },
    {
      id: "alcohol",
      delta: ({ "None":0,"1–3 drinks":-0.5,"4–7 drinks":2,"8+ drinks":5,"飲まない":0,"1〜3杯":-0.5,"4〜7杯":2,"8杯以上":5 })[answers.alcohol] ?? 0,
      label:  jp ? "飲酒" : "alcohol",
      good:   jp ? "飲酒量が体内年齢に悪影響を与えていません。" : "Your alcohol intake is not negatively affecting your biological age.",
      bad:    jp ? "過度な飲酒が体の老化を加速させています。" : "Excessive alcohol consumption is accelerating aging in your body.",
      rec:    jp ? "週3杯以下を目標に、休肝日を週2〜3日設けましょう。" : "Aim for no more than 1–3 drinks per week and include at least 2–3 alcohol-free days."
    },
    {
      id: "diet",
      delta: ({ "Poor":3,"Fair":1,"Good":-1,"Excellent":-3,"悪い":3,"普通":1,"良い":-1,"優秀":-3 })[answers.diet] ?? 0,
      label:  jp ? "食生活" : "diet",
      good:   jp ? "優れた食生活が細胞レベルの若さを支えています。" : "Your excellent diet is supporting cellular health and longevity.",
      bad:    jp ? "食生活の改善が体内年齢を大きく下げる可能性があります。" : "Improving your diet could significantly lower your biological age.",
      rec:    jp ? "野菜・果物・全粒穀物・良質なタンパク質を中心に、加工食品・糖分を減らしましょう。" : "Focus on vegetables, fruits, whole grains, and lean protein, while cutting processed foods and added sugars."
    },
    {
      id: "stress",
      delta: ({ "Low":-1,"Moderate":0,"High":2,"Very high":4,"低い":-1,"普通":0,"高い":2,"非常に高い":4 })[answers.stress] ?? 0,
      label:  jp ? "ストレス" : "stress",
      good:   jp ? "低いストレスレベルが体と心の若さを保っています。" : "Your low stress levels are positively influencing both body and mind.",
      bad:    jp ? "慢性的なストレスが細胞の老化を加速させています。" : "Chronic stress is one of the key drivers of accelerated cellular aging.",
      rec:    jp ? "瞑想・深呼吸・自然散歩など、毎日のストレス解消習慣を取り入れましょう。" : "Build daily stress-relief habits: meditation, deep breathing, nature walks, or regular digital detoxes."
    },
    {
      id: "water",
      delta: wtr <= 3 ? 2 : wtr <= 5 ? 1 : wtr <= 9 ? 0 : -1,
      label:  jp ? "水分摂取" : "hydration",
      good:   jp ? "十分な水分摂取が体の機能を最適に維持しています。" : "Your hydration is keeping your body's cellular functions in good shape.",
      bad:    jp ? "水分不足が体の機能に影響している可能性があります。" : "Insufficient hydration may be impairing your body's cellular functions.",
      rec:    jp ? "1日8杯（約2リットル）の水を目標に、習慣的に水分補給をしましょう。" : "Aim for at least 8 glasses (2 litres) of water per day, and keep a bottle with you as a reminder."
    },
    {
      id: "social",
      delta: ({ "Isolated":3,"Sometimes social":1,"Regularly social":-1,"Very active":-2,"孤立している":3,"たまに社交的":1,"定期的に社交的":-1,"非常に活発":-2 })[answers.social] ?? 0,
      label:  jp ? "社会的つながり" : "social connection",
      good:   jp ? "活発な社会生活が精神的・身体的健康に良い影響を与えています。" : "Your active social life is contributing positively to both mental and physical health.",
      bad:    jp ? "社会的孤立は心身の老化を加速させることが研究で明らかになっています。" : "Research shows social isolation is a significant accelerator of physical and mental aging.",
      rec:    jp ? "友人・家族との定期的な交流や地域活動への参加を増やしましょう。" : "Make regular time for friends, family, or community groups to strengthen your social bonds."
    }
  ];

  const totalDelta = FACTORS.reduce((s, f) => s + f.delta, 0);
  const bioAge = Math.max(10, Math.round(age + totalDelta));
  const rating = totalDelta <= -2 ? "Younger" : totalDelta >= 2 ? "Older" : "Same";

  const worst = [...FACTORS].sort((a, b) => b.delta - a.delta);
  const best  = FACTORS.filter(f => f.delta < 0).sort((a, b) => a.delta - b.delta);

  // Build explanation
  const open = jp
    ? (rating === "Younger" ? "あなたの体内年齢は実年齢より若いと推定されます。" : rating === "Older" ? "いくつかの生活習慣が体内年齢を押し上げています。" : "あなたの体内年齢は実年齢とほぼ一致しています。")
    : (rating === "Younger" ? "Your biological age is estimated to be younger than your chronological age." : rating === "Older" ? "Several lifestyle habits are pushing your biological age above your chronological age." : "Your biological age closely matches your chronological age.");

  const bestNote = best[0]
    ? (jp ? `特に「${best[0].label}」${best[0].good}` : `Your ${best[0].label} habits stand out as a key strength — ${best[0].good}`)
    : "";
  const worstNote = worst[0]?.delta > 0
    ? (jp ? `「${worst[0].label}」の改善が体内年齢をさらに若くする最大の鍵です。` : `The biggest opportunity to lower your biological age lies in improving your ${worst[0].label} habits.`)
    : (jp ? "現在の健康習慣を継続することが最大の長寿法です。" : "Keep maintaining your current healthy lifestyle — consistency is the key to longevity.");

  const explanation = [open, bestNote, worstNote].filter(Boolean).join(" ");

  // Top 3 recs from worst factors, pad if needed
  const recs = worst.filter(f => f.delta > 0).slice(0, 3).map(f => f.rec);
  const fallback = jp
    ? ["毎年定期健診を受け、主要な健康指標を把握しましょう。", "現在の良い習慣を継続することが最大の予防医学です。", "筋力トレーニングを取り入れ、加齢による筋肉量低下を防ぎましょう。"]
    : ["Schedule annual health check-ups to track key biomarkers over time.", "Maintain your current healthy habits — consistency is the foundation of longevity.", "Consider adding strength training to preserve muscle mass as you get older."];
  while (recs.length < 3) recs.push(fallback[recs.length]);

  return { bioAge, rating, explanation, recommendations: recs };
}

function AgeBar({ label, value, max, color, textColor }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 5 }}>
        <span style={{ color: "var(--color-text-secondary)" }}>{label}</span>
        <span style={{ fontWeight: 500, color: textColor || "var(--color-text-primary)" }}>{value}</span>
      </div>
      <div style={{ height: 8, background: "var(--color-background-tertiary)", borderRadius: 4 }}>
        <div style={{ height: "100%", width: `${Math.min((value / max) * 100, 100)}%`, background: color, borderRadius: 4, transition: "width 0.8s ease" }} />
      </div>
    </div>
  );
}

function ResultScreen({ result, answers, tx, lang, retake, card, ghostBtn }) {
  const bio  = Math.round(result.bioAge);
  const diff = bio - answers.age;
  const abs  = Math.abs(diff);
  let diffText = tx.results.diffSame, diffColor = "var(--color-text-secondary)";
  if (diff <= -2) { diffText = tx.results.diffYounger.replace("{n}", abs); diffColor = TEAL; }
  else if (diff >= 2) { diffText = tx.results.diffOlder.replace("{n}", abs);   diffColor = CORAL; }

  const rMap = {
    Younger: { bg: TEAL_L,   fg: TEAL_D,    lbl: lang === "jp" ? "実年齢より若い"       : "Biologically Younger" },
    Same:    { bg: "#F1EFE8", fg: "#5F5E5A", lbl: lang === "jp" ? "実年齢と同じ"         : "Same as Age" },
    Older:   { bg: CORAL_L,  fg: "#993C1D",  lbl: lang === "jp" ? "実年齢より老けている" : "Biologically Older" }
  };
  const rc = rMap[result.rating] || rMap.Same;

  return (
    <div>
      <div style={{ ...card, textAlign: "center", padding: "2rem" }}>
        <p style={{ fontSize: 11, color: "var(--color-text-tertiary)", margin: "0 0 0.5rem", letterSpacing: "0.06em", textTransform: "uppercase" }}>{tx.results.heading}</p>
        <div style={{ fontSize: 80, fontWeight: 500, lineHeight: 1, color: "var(--color-text-primary)", margin: "0.25rem 0" }}>{bio}</div>
        <p style={{ fontSize: 14, fontWeight: 500, color: diffColor, margin: "0.5rem 0 1.25rem" }}>{diffText}</p>
        <div style={{ background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-md)", padding: "1rem 1rem 0.5rem" }}>
          <AgeBar label={tx.results.chrono}   value={answers.age} max={100} color="var(--color-border-secondary)" />
          <AgeBar label={tx.results.bioLabel} value={bio}         max={100} color={TEAL} textColor={TEAL_D} />
        </div>
        <div style={{ marginTop: "1rem" }}>
          <span style={{ display: "inline-block", background: rc.bg, color: rc.fg, fontSize: 13, padding: "4px 14px", borderRadius: 20, fontWeight: 500 }}>{rc.lbl}</span>
        </div>
      </div>

      <div style={{ ...card, marginTop: "0.75rem" }}>
        <p style={{ fontSize: 11, fontWeight: 500, color: "var(--color-text-tertiary)", margin: "0 0 0.75rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>{tx.results.sectionWhy}</p>
        <p style={{ fontSize: 14, color: "var(--color-text-primary)", lineHeight: 1.75, margin: 0 }}>{result.explanation}</p>
      </div>

      <div style={{ ...card, marginTop: "0.75rem" }}>
        <p style={{ fontSize: 11, fontWeight: 500, color: "var(--color-text-tertiary)", margin: "0 0 1rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>{tx.results.sectionRecs}</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {result.recommendations.map((rec, i) => (
            <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div style={{ minWidth: 24, height: 24, borderRadius: "50%", background: TEAL_L, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                <span style={{ fontSize: 12, fontWeight: 500, color: TEAL }}>{i + 1}</span>
              </div>
              <p style={{ margin: 0, fontSize: 14, color: "var(--color-text-primary)", lineHeight: 1.65 }}>{rec}</p>
            </div>
          ))}
        </div>
      </div>

      <p style={{ fontSize: 11, color: "var(--color-text-tertiary)", textAlign: "center", margin: "1rem 0" }}>{tx.results.disclaimer}</p>
      <button style={{ ...ghostBtn, display: "block", width: "100%", textAlign: "center" }} onClick={retake}>{tx.results.retake}</button>
    </div>
  );
}

export default function App() {
  const [lang, setLang]       = useState("en");
  const [screen, setScreen]   = useState("intro");
  const [step, setStep]       = useState(0);
  const [answers, setAnswers] = useState(() => {
    const d = {}; QS.forEach(q => { if (q.dflt !== undefined) d[q.id] = q.dflt; }); return d;
  });
  const [result, setResult] = useState(null);

  const tx    = LANG[lang];
  const total = QS.length;
  const q     = QS[step];
  const qtx   = q ? tx.q[q.id] : null;
  const isLast = step === total - 1;

  const canNext = () => {
    if (!q) return false;
    const v = answers[q.id];
    if (q.type === "select") return v !== undefined && v !== "";
    if (q.type === "number") { const n = parseFloat(v); return !isNaN(n) && n >= q.min && n <= q.max; }
    return true;
  };

  const handleSubmit = (useLang) => {
    const res = calculateBioAge(answers, useLang || lang);
    setResult(res);
    setScreen("result");
  };

  const handleNext = () => { if (!isLast) setStep(s => s + 1); else handleSubmit(); };

  const handleLangToggle = () => {
    const newLang = lang === "en" ? "jp" : "en";
    setLang(newLang);
    if (screen === "result") handleSubmit(newLang);
  };

  const retake = () => {
    const d = {}; QS.forEach(q => { if (q.dflt !== undefined) d[q.id] = q.dflt; });
    setAnswers(d); setStep(0); setResult(null); setScreen("intro");
  };

  const card     = { background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-lg)", padding: "1.5rem" };
  const ghostBtn = { padding: "11px 20px", background: "transparent", border: "0.5px solid var(--color-border-secondary)", borderRadius: "var(--border-radius-md)", fontSize: 14, cursor: "pointer", color: "var(--color-text-secondary)" };
  const priBtn   = (dis) => ({ display: "block", width: "100%", padding: "13px", background: dis ? "var(--color-border-tertiary)" : TEAL, color: dis ? "var(--color-text-tertiary)" : "#fff", border: "none", borderRadius: "var(--border-radius-md)", fontSize: 15, fontWeight: 500, cursor: dis ? "not-allowed" : "pointer" });

  return (
    <div style={{ maxWidth: 560, margin: "0 auto", padding: "1.5rem 1rem", fontFamily: "var(--font-sans)" }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 30, height: 30, borderRadius: "50%", background: TEAL_L, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <i className="ti ti-activity" aria-hidden="true" style={{ color: TEAL, fontSize: 16 }} />
          </div>
          <span style={{ fontSize: 14, fontWeight: 500, color: "var(--color-text-primary)" }}>{tx.appTitle}</span>
        </div>
        <button style={{ fontSize: 12, padding: "5px 12px", borderRadius: "var(--border-radius-md)", border: "0.5px solid var(--color-border-secondary)", background: "transparent", cursor: "pointer", color: "var(--color-text-secondary)" }} onClick={handleLangToggle}>
          {tx.toggle}
        </button>
      </div>

      {/* INTRO */}
      {screen === "intro" && (
        <div style={{ ...card, textAlign: "center", padding: "2.5rem 1.5rem" }}>
          <div style={{ width: 60, height: 60, borderRadius: "50%", background: TEAL_L, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem" }}>
            <i className="ti ti-heart" aria-hidden="true" style={{ color: TEAL, fontSize: 26 }} />
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 500, margin: "0 0 0.75rem", color: "var(--color-text-primary)" }}>{tx.intro.heading}</h1>
          <p style={{ color: "var(--color-text-secondary)", fontSize: 14, margin: "0 0 1.5rem", lineHeight: 1.7 }}>{tx.intro.sub}</p>
          <div style={{ display: "flex", gap: 6, justifyContent: "center", flexWrap: "wrap", marginBottom: "1.5rem" }}>
            {tx.intro.features.map((f, i) => <span key={i} style={{ background: TEAL_L, color: TEAL_D, fontSize: 12, padding: "4px 10px", borderRadius: 20 }}>{f}</span>)}
          </div>
          <button style={{ ...priBtn(false), maxWidth: 300, margin: "0 auto" }} onClick={() => setScreen("quiz")}>{tx.intro.cta}</button>
          <p style={{ fontSize: 11, color: "var(--color-text-tertiary)", marginTop: "1rem" }}>{tx.intro.note}</p>
        </div>
      )}

      {/* QUIZ */}
      {screen === "quiz" && q && qtx && (
        <div>
          <div style={{ marginBottom: "1.25rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--color-text-tertiary)", marginBottom: 6 }}>
              <span>{tx.progress.replace("{n}", step + 1).replace("{total}", total)}</span>
              <span>{Math.round(((step + 1) / total) * 100)}%</span>
            </div>
            <div style={{ height: 3, background: "var(--color-border-tertiary)", borderRadius: 2 }}>
              <div style={{ height: "100%", width: `${((step + 1) / total) * 100}%`, background: TEAL, borderRadius: 2, transition: "width 0.3s ease" }} />
            </div>
          </div>

          <div key={step} style={card}>
            <p style={{ fontSize: 17, fontWeight: 500, margin: "0 0 1.25rem", color: "var(--color-text-primary)", lineHeight: 1.4 }}>{qtx.q}</p>

            {q.type === "select" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {qtx.opts.map((opt, i) => {
                  const sel = answers[q.id] === opt;
                  return <button key={i} onClick={() => setAnswers(a => ({ ...a, [q.id]: opt }))}
                    style={{ padding: "11px 14px", textAlign: "left", borderRadius: "var(--border-radius-md)", border: sel ? `2px solid ${TEAL}` : "0.5px solid var(--color-border-tertiary)", background: sel ? TEAL_L : "var(--color-background-secondary)", color: sel ? TEAL_D : "var(--color-text-primary)", cursor: "pointer", fontSize: 14, fontWeight: sel ? 500 : 400 }}>{opt}</button>;
                })}
              </div>
            )}

            {q.type === "number" && (
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <input type="number" min={q.min} max={q.max} step={q.step} value={answers[q.id] ?? ""}
                    onChange={e => setAnswers(a => ({ ...a, [q.id]: e.target.value === "" ? "" : parseFloat(e.target.value) }))}
                    style={{ fontSize: 28, fontWeight: 500, width: 110, padding: "8px 10px", borderRadius: "var(--border-radius-md)", border: "0.5px solid var(--color-border-secondary)", background: "var(--color-background-secondary)", color: "var(--color-text-primary)", textAlign: "center" }} />
                  <span style={{ fontSize: 16, color: "var(--color-text-secondary)" }}>{qtx.unit}</span>
                </div>
                <p style={{ fontSize: 12, color: "var(--color-text-tertiary)", margin: "8px 0 0" }}>{q.min} – {q.max}</p>
              </div>
            )}

            {q.type === "range" && (
              <div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: "0.75rem" }}>
                  <span style={{ fontSize: 42, fontWeight: 500, color: "var(--color-text-primary)", lineHeight: 1 }}>{answers[q.id] ?? q.dflt}</span>
                  <span style={{ fontSize: 15, color: "var(--color-text-secondary)" }}>{qtx.unit}</span>
                </div>
                <input type="range" min={q.min} max={q.max} step={q.step} value={answers[q.id] ?? q.dflt}
                  onChange={e => setAnswers(a => ({ ...a, [q.id]: parseFloat(e.target.value) }))}
                  style={{ width: "100%", accentColor: TEAL }} />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--color-text-tertiary)", marginTop: 4 }}>
                  <span>{q.min}</span><span>{q.max}</span>
                </div>
              </div>
            )}
          </div>

          <div style={{ display: "flex", gap: 8, marginTop: "1rem" }}>
            {step > 0 && <button style={ghostBtn} onClick={() => setStep(s => s - 1)}>{tx.nav.back}</button>}
            <button style={{ ...priBtn(!canNext()), flex: 1 }} disabled={!canNext()} onClick={handleNext}>
              {isLast ? tx.nav.submit : tx.nav.next}
            </button>
          </div>
        </div>
      )}

      {/* RESULT */}
      {screen === "result" && result && (
        <ResultScreen result={result} answers={answers} tx={tx} lang={lang} retake={retake} card={card} ghostBtn={ghostBtn} />
      )}
    </div>
  );
}
