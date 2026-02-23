import { useState } from "react";
import { useGame } from "@/context/GameContext";
import { Activity } from "@/hooks/useGameStore";

const STAT_CONFIG = {
  strength:  { label: "Сила",       icon: "💪", color: "#dc2626", desc: "Физическая мощь тела" },
  intellect: { label: "Интеллект",  icon: "🧠", color: "#3b82f6", desc: "Развитие разума и знаний" },
  charisma:  { label: "Харизма",    icon: "✨", color: "#a855f7", desc: "Влияние и привлекательность" },
  social:    { label: "Социум",     icon: "🤝", color: "#22c55e", desc: "Связи и окружение" },
  finance:   { label: "Финансы",    icon: "💰", color: "#eab308", desc: "Богатство и доходы" },
  willpower: { label: "Сила Духа",  icon: "🔥", color: "#f97316", desc: "Воля и дисциплина" },
};

function calcLevel(xp: number) {
  return Math.floor(Math.sqrt(xp / 50)) + 1;
}

function xpProgress(xp: number) {
  const level = calcLevel(xp);
  const needed = Math.pow(level, 2) * 50;
  const prev = Math.pow(level - 1, 2) * 50;
  const pct = Math.min(100, Math.round(((xp - prev) / (needed - prev)) * 100));
  return { level, pct, needed: needed - prev, current: xp - prev };
}

export default function StatsPage() {
  const { stats, ACTIVITIES, addXp, powerLevel } = useGame();
  const [activeLog, setActiveLog] = useState<keyof typeof STAT_CONFIG | null>(null);
  const [selectedAct, setSelectedAct] = useState<Activity | null>(null);
  const [amount, setAmount] = useState("");
  const [flash, setFlash] = useState<{ stat: string; xp: number } | null>(null);

  const statActivities = (stat: string) =>
    ACTIVITIES.filter((a) => a.stat === stat);

  const handleLog = () => {
    if (!selectedAct || !amount) return;
    const n = parseFloat(amount);
    if (!n || n <= 0) return;
    const xp = Math.round(n * selectedAct.xpPerUnit);
    addXp(selectedAct.stat, xp, selectedAct, n);
    setFlash({ stat: selectedAct.stat, xp });
    setAmount("");
    setTimeout(() => setFlash(null), 2000);
  };

  return (
    <div className="p-4 space-y-3">
      {/* Total Power */}
      <div className="card-rpg-gold rounded-xl p-4 flex items-center gap-3">
        <span className="text-3xl">👑</span>
        <div>
          <div className="font-oswald text-xs text-muted-foreground tracking-widest">СИЛА ВЛАСТИ</div>
          <div className="font-oswald text-3xl gradient-text-gold">{powerLevel.toLocaleString()}</div>
          <div className="text-xs text-muted-foreground font-montserrat">сумма всех 5 статов</div>
        </div>
      </div>

      {/* Stats list */}
      {Object.entries(STAT_CONFIG).map(([key, cfg]) => {
        const xp = stats[key as keyof typeof stats];
        const { level, pct, current, needed } = xpProgress(xp);
        const isWillpower = key === "willpower";
        const acts = statActivities(key);
        const isOpen = activeLog === key;

        return (
          <div key={key} className={`card-rpg rounded-xl overflow-hidden transition-all ${isOpen ? "glow-red-sm" : ""}`}>
            <button
              className="w-full p-4 flex items-center gap-3 text-left"
              onClick={() => {
                setActiveLog(isOpen ? null : key as keyof typeof STAT_CONFIG);
                setSelectedAct(acts[0] || null);
                setAmount("");
              }}
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                style={{ background: `${cfg.color}22`, border: `1px solid ${cfg.color}66` }}
              >
                {cfg.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between">
                  <span className="font-oswald text-base text-foreground">{cfg.label}</span>
                  <div className="flex items-center gap-1.5">
                    {isWillpower && (
                      <span className="text-[10px] text-orange-400 font-montserrat border border-orange-800 rounded px-1">особый</span>
                    )}
                    <span className="font-oswald text-gold text-sm">Ур. {level}</span>
                  </div>
                </div>
                <div className="mt-1.5 h-1.5 rounded-full bg-secondary overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${cfg.color}99, ${cfg.color})` }}
                  />
                </div>
                <div className="flex justify-between mt-0.5">
                  <span className="text-[10px] text-muted-foreground font-montserrat">{xp.toLocaleString()} XP</span>
                  <span className="text-[10px] text-muted-foreground font-montserrat">{current}/{needed} до ур.{level + 1}</span>
                </div>
              </div>
            </button>

            {/* Inline logger */}
            {isOpen && (
              <div className="px-4 pb-4 space-y-2 border-t border-border pt-3">
                <p className="text-xs text-muted-foreground font-montserrat">{cfg.desc}</p>
                <div className="flex flex-wrap gap-1.5">
                  {acts.map((act) => (
                    <button
                      key={act.id}
                      onClick={() => setSelectedAct(act)}
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-montserrat border transition-all ${
                        selectedAct?.id === act.id
                          ? "border-red-600 text-foreground bg-red-950/40"
                          : "border-border text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {act.icon} {act.name}
                    </button>
                  ))}
                </div>
                {selectedAct && (
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleLog()}
                      placeholder={`${selectedAct.unit}`}
                      className="flex-1 bg-secondary border border-border rounded-lg px-3 py-2 text-sm font-montserrat text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold"
                    />
                    <button
                      onClick={handleLog}
                      className="px-4 py-2 bg-red-700 hover:bg-red-600 text-white rounded-lg font-oswald text-sm transition-all"
                    >
                      +XP
                    </button>
                  </div>
                )}
                {flash && flash.stat === key && (
                  <div className="text-center font-oswald text-gold animate-scale-in">✨ +{flash.xp} XP</div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
