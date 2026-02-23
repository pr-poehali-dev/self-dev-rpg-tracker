import { useState } from "react";
import { useGame } from "@/context/GameContext";
import Icon from "@/components/ui/icon";
import { Activity } from "@/hooks/useGameStore";

const STAT_LABELS = {
  strength: { label: "Сила", color: "bg-red-600", icon: "💪" },
  intellect: { label: "Интеллект", color: "bg-blue-600", icon: "🧠" },
  charisma: { label: "Харизма", color: "bg-purple-600", icon: "✨" },
  social: { label: "Социум", color: "bg-green-600", icon: "🤝" },
  finance: { label: "Финансы", color: "bg-yellow-500", icon: "💰" },
  willpower: { label: "Сила Духа", color: "bg-orange-500", icon: "🔥" },
};

function calcLevel(xp: number) {
  return Math.floor(Math.sqrt(xp / 50)) + 1;
}

export default function ProfilePage() {
  const { stats, log, coins, ACTIVITIES, addXp, powerLevel, xpToNextLevel } = useGame();
  const [selected, setSelected] = useState<Activity>(ACTIVITIES[0]);
  const [amount, setAmount] = useState("");
  const [flash, setFlash] = useState<string | null>(null);

  const totalLevel = calcLevel(powerLevel);
  const { current: curXp, needed: neededXp } = xpToNextLevel(powerLevel);
  const progressPct = Math.min(100, Math.round((curXp / neededXp) * 100));

  const handleLog = () => {
    const n = parseFloat(amount);
    if (!n || n <= 0) return;
    const xp = Math.round(n * selected.xpPerUnit);
    addXp(selected.stat, xp, selected, n);
    setFlash(`+${xp} XP к ${STAT_LABELS[selected.stat].label}!`);
    setAmount("");
    setTimeout(() => setFlash(null), 2000);
  };

  const statLevel = calcLevel(stats[selected.stat]);

  return (
    <div className="p-4 space-y-4">
      {/* Hero Card */}
      <div className="card-rpg-gold rounded-xl p-4 glow-gold">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-900 to-black border-2 border-gold flex items-center justify-center text-2xl glow-red">
            ⚔️
          </div>
          <div className="flex-1">
            <div className="flex items-baseline gap-2">
              <h2 className="font-oswald text-xl text-gold">Искатель</h2>
              <span className="text-xs text-muted-foreground font-montserrat">Уровень {totalLevel}</span>
            </div>
            <div className="mt-1">
              <div className="flex justify-between text-xs text-muted-foreground mb-1 font-montserrat">
                <span>XP {curXp.toLocaleString()} / {neededXp.toLocaleString()}</span>
                <span>{progressPct}%</span>
              </div>
              <div className="h-2 rounded-full bg-secondary overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-red-700 to-gold xp-glow transition-all duration-700"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-gold font-oswald font-bold text-lg">{coins}</div>
            <div className="text-xs text-muted-foreground">монет</div>
          </div>
        </div>

        {/* Mini stats row */}
        <div className="mt-3 grid grid-cols-6 gap-1">
          {Object.entries(STAT_LABELS).map(([key, meta]) => (
            <div key={key} className="flex flex-col items-center">
              <span className="text-base">{meta.icon}</span>
              <span className="text-[10px] font-oswald text-gold">{calcLevel(stats[key as keyof typeof stats])}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Power stat */}
      <div className="card-rpg rounded-xl p-4 flex items-center gap-3">
        <span className="text-2xl">👑</span>
        <div className="flex-1">
          <div className="font-oswald text-sm text-muted-foreground">ВЛАСТЬ</div>
          <div className="font-oswald text-2xl gradient-text-gold">{powerLevel.toLocaleString()} XP</div>
        </div>
        <div className="text-right">
          <div className="text-xs text-muted-foreground">= сумма 5 статов</div>
        </div>
      </div>

      {/* Activity Logger */}
      <div className="card-rpg rounded-xl p-4 space-y-3">
        <h3 className="font-oswald text-base text-gold tracking-wide">ЗАПИСАТЬ АКТИВНОСТЬ</h3>

        {/* Activity select */}
        <div className="grid grid-cols-2 gap-2">
          {ACTIVITIES.map((act) => (
            <button
              key={act.id}
              onClick={() => setSelected(act)}
              className={`flex items-center gap-2 p-2 rounded-lg border transition-all text-left ${
                selected.id === act.id
                  ? "border-red-600 bg-red-950/40 text-foreground glow-red-sm"
                  : "border-border bg-secondary/30 text-muted-foreground hover:border-border hover:text-foreground"
              }`}
            >
              <span>{act.icon}</span>
              <div>
                <div className="text-xs font-montserrat font-medium leading-tight">{act.name}</div>
                <div className="text-[10px] text-muted-foreground">{act.xpPerUnit} XP/{act.unit.split(" ")[0]}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Amount input */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLog()}
              placeholder={`Кол-во (${selected.unit})`}
              className="w-full bg-secondary border border-border rounded-lg px-3 py-2.5 text-sm font-montserrat text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold transition-colors"
            />
          </div>
          <button
            onClick={handleLog}
            className="px-4 py-2.5 bg-red-700 hover:bg-red-600 text-white rounded-lg font-oswald text-sm transition-all glow-red-sm hover:glow-red"
          >
            +XP
          </button>
        </div>

        {/* Preview */}
        {amount && parseFloat(amount) > 0 && (
          <div className="text-xs text-muted-foreground font-montserrat bg-secondary/50 rounded-lg px-3 py-2">
            {selected.icon} {parseFloat(amount)} {selected.unit} →{" "}
            <span className="text-gold font-bold">+{Math.round(parseFloat(amount) * selected.xpPerUnit)} XP</span>{" "}
            к {STAT_LABELS[selected.stat].label} (Ур.{statLevel})
          </div>
        )}

        {/* Flash */}
        {flash && (
          <div className="text-center font-oswald text-lg text-gold animate-scale-in">
            ✨ {flash}
          </div>
        )}
      </div>

      {/* Recent log */}
      {log.length > 0 && (
        <div className="card-rpg rounded-xl p-4 space-y-2">
          <h3 className="font-oswald text-base text-gold tracking-wide">ИСТОРИЯ</h3>
          <div className="space-y-1.5">
            {log.slice(0, 5).map((entry) => (
              <div key={entry.id} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-base">{STAT_LABELS[entry.stat].icon}</span>
                  <div>
                    <div className="font-montserrat text-xs text-foreground">{entry.activity}</div>
                    <div className="text-[10px] text-muted-foreground">{entry.amount} {entry.unit} · {entry.date}</div>
                  </div>
                </div>
                <span className="font-oswald text-gold text-sm">+{entry.xpGained} XP</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
