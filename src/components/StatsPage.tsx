import { useGame } from "@/context/GameContext";
import { getLevelInfo } from "@/hooks/useGameStore";

const STAT_CONFIG = {
  strength:  { label: "Сила тела",   icon: "💪", color: "#dc2626", desc: "Физическая мощь. Сила, выносливость, гибкость, скорость, контроль." },
  intellect: { label: "Интеллект",   icon: "🧠", color: "#3b82f6", desc: "Развитие разума, обучение, чтение, курсы, практика." },
  charisma:  { label: "Харизма",     icon: "✨", color: "#a855f7", desc: "Влияние, публичность, ораторство, личный бренд." },
  social:    { label: "Социум",      icon: "🤝", color: "#22c55e", desc: "Нетворкинг, связи, окружение, отношения." },
  finance:   { label: "Финансы",     icon: "💰", color: "#eab308", desc: "Доходы, инвестиции, бизнес, финансовые привычки." },
  willpower: { label: "Сила Духа",   icon: "🔥", color: "#f97316", desc: "Воля, дисциплина, медитация. Особый стат — не входит во Власть." },
};

export default function StatsPage() {
  const { stats, power } = useGame();
  const levelInfo = getLevelInfo(power);

  return (
    <div className="p-4 space-y-3">
      {/* Header */}
      <div className="card-rpg-gold rounded-xl p-4 flex items-center gap-3">
        <span className="text-3xl">{levelInfo.icon}</span>
        <div>
          <div className="font-oswald text-xs text-muted-foreground tracking-widest">ВЛАСТЬ</div>
          <div className="font-oswald text-3xl gradient-text-gold">{power.toFixed(1)}</div>
          <div className="text-xs text-muted-foreground font-montserrat">
            {levelInfo.title} · Ур.{levelInfo.level} · Ранг {levelInfo.rankLabel}
          </div>
        </div>
      </div>

      {/* Stats list */}
      {Object.entries(STAT_CONFIG).map(([key, cfg]) => {
        const units = stats[key as keyof typeof stats];
        const isWillpower = key === "willpower";

        // Прогресс-бар: каждые 10 единиц = новый "уровень" стата
        const statLevel = Math.floor(units / 10) + 1;
        const pct = Math.min(100, ((units % 10) / 10) * 100);

        return (
          <div key={key} className="card-rpg rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                style={{ background: `${cfg.color}22`, border: `1px solid ${cfg.color}55` }}
              >
                {cfg.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between">
                  <span className="font-oswald text-base text-foreground">{cfg.label}</span>
                  <div className="flex items-center gap-2">
                    {isWillpower && (
                      <span className="text-[10px] text-orange-400 border border-orange-800 rounded px-1 font-montserrat">особый</span>
                    )}
                    <span className="font-oswald text-sm" style={{ color: cfg.color }}>
                      Ур. {statLevel}
                    </span>
                  </div>
                </div>
                <div className="mt-1.5 h-1.5 rounded-full bg-secondary overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${cfg.color}88, ${cfg.color})` }}
                  />
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-[10px] text-muted-foreground font-montserrat">{units.toFixed(2)} единиц</span>
                  <span className="text-[10px] text-muted-foreground font-montserrat">{(10 - (units % 10)).toFixed(2)} до Ур.{statLevel + 1}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-[11px] text-muted-foreground font-montserrat mt-2 leading-relaxed">
              {cfg.desc}
            </p>
          </div>
        );
      })}

      <div className="text-center text-xs text-muted-foreground font-montserrat py-2">
        Записывай активности в разделе «Профиль»
      </div>
    </div>
  );
}
