import { useGame } from "@/context/GameContext";
import { getLevelInfo, getNextRankInfo } from "@/hooks/useGameStore";

const ALL_LEVELS = [
  {
    level: 1, title: "Рекрут",   icon: "🪨", color: "#6b7280",
    minPower: 0, ranks: ["E", "D", "C", "B", "A"],
    desc: "Начало пути. Первые шаги в реальной игре.",
  },
  {
    level: 2, title: "Пешка",    icon: "♟️", color: "#84cc16",
    minPower: 0.5, ranks: ["E", "D", "C", "B", "A", "S"],
    desc: "Ты уже движешься. Привычки начинают формироваться.",
  },
  {
    level: 3, title: "Воин",     icon: "⚔️", color: "#22c55e",
    minPower: 2, ranks: ["E", "D", "C", "B", "A", "S"],
    desc: "Ты доказал свою стойкость. Тело и разум крепнут.",
  },
  {
    level: 4, title: "Странник", icon: "🗺️", color: "#3b82f6",
    minPower: 5, ranks: ["E", "D", "C", "B", "A", "S"],
    desc: "Путь открыт. Ты исследуешь границы своих возможностей.",
  },
  {
    level: 5, title: "Мудрец",   icon: "📿", color: "#8b5cf6",
    minPower: 12, ranks: ["E", "D", "C", "B", "A", "S", "SS"],
    desc: "Редкий уровень. Ты превзошёл большинство вокруг.",
  },
  {
    level: 6, title: "Король",   icon: "👑", color: "#f59e0b",
    minPower: 30, ranks: ["E", "D", "C", "B", "A", "S", "SS"],
    desc: "Имя, которое помнят. Власть говорит за тебя.",
  },
  {
    level: 7, title: "Абсолют",  icon: "⚡", color: "#ef4444",
    minPower: 80, ranks: ["∞"],
    desc: "Финальная форма. Немногие достигают этого. Ты — живая легенда.",
  },
];

export default function RankPage() {
  const { power, stats } = useGame();
  const levelInfo = getLevelInfo(power);
  const nextRank = getNextRankInfo(power);

  return (
    <div className="p-4 space-y-4">
      {/* Current */}
      <div className="card-rpg-gold rounded-xl p-6 text-center glow-gold">
        <div className="text-6xl mb-3">{levelInfo.icon}</div>
        <div className="font-oswald text-2xl gradient-text-gold mb-1">{levelInfo.title}</div>
        <div className="inline-flex items-center gap-2 bg-black/40 rounded-full px-4 py-1 mb-3">
          <span className="font-oswald text-gold text-lg">Ранг {levelInfo.rankLabel}</span>
          <span className="text-muted-foreground">·</span>
          <span className="font-oswald text-sm text-muted-foreground">Ур. {levelInfo.level}</span>
        </div>
        <div className="flex justify-center gap-8 mt-2">
          <div>
            <div className="font-oswald text-2xl text-gold">{power.toFixed(1)}</div>
            <div className="text-xs text-muted-foreground">Власть</div>
          </div>
          <div className="w-px bg-border" />
          <div>
            <div className="font-oswald text-2xl text-orange-400">{stats.willpower.toFixed(1)}</div>
            <div className="text-xs text-muted-foreground">Сила Духа</div>
          </div>
        </div>
      </div>

      {/* Progress to next */}
      {nextRank && (
        <div className="card-rpg rounded-xl p-4 space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-oswald text-sm text-muted-foreground">До "{nextRank.nextRankLabel}"</span>
            <span className="font-oswald text-gold text-sm">{levelInfo.progressInRank}%</span>
          </div>
          <div className="h-2 rounded-full bg-secondary overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-red-700 to-gold transition-all duration-700"
              style={{ width: `${levelInfo.progressInRank}%` }}
            />
          </div>
          <div className="text-xs text-muted-foreground font-montserrat">
            нужно ещё {nextRank.neededPower.toFixed(1)} единиц Власти
          </div>
        </div>
      )}

      {/* All levels */}
      <h3 className="font-oswald text-base text-gold tracking-wide">ВСЕ УРОВНИ</h3>
      <div className="space-y-2">
        {ALL_LEVELS.map((lvl) => {
          const isReached = power >= lvl.minPower;
          const isCurrent = lvl.level === levelInfo.level;
          return (
            <div
              key={lvl.level}
              className={`card-rpg rounded-xl p-3 flex items-start gap-3 transition-all ${
                isCurrent ? "border border-gold/50" : ""
              } ${!isReached ? "opacity-40" : ""}`}
            >
              <div className="text-2xl w-10 text-center mt-0.5">{lvl.icon}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-oswald text-sm" style={{ color: isReached ? lvl.color : "#6b7280" }}>
                    {lvl.title}
                  </span>
                  {isCurrent && (
                    <span className="text-[10px] bg-gold text-black px-1.5 rounded font-oswald">ТЕКУЩИЙ</span>
                  )}
                  <span className="text-[10px] text-muted-foreground font-montserrat ml-auto">
                    {lvl.ranks.join(" · ")}
                  </span>
                </div>
                <div className="text-[10px] text-muted-foreground font-montserrat mt-0.5">{lvl.desc}</div>
              </div>
              <div className="mt-1">
                {isReached
                  ? <span className="text-green-500">✓</span>
                  : <span className="text-muted-foreground">🔒</span>
                }
              </div>
            </div>
          );
        })}
      </div>

      {/* Stat breakdown */}
      <div className="card-rpg rounded-xl p-4 space-y-2">
        <h3 className="font-oswald text-sm text-gold tracking-wide">СЛАГАЕМЫЕ ВЛАСТИ</h3>
        <div className="grid grid-cols-3 gap-2">
          {[
            { key: "strength",  icon: "💪", label: "Сила" },
            { key: "intellect", icon: "🧠", label: "Интеллект" },
            { key: "charisma",  icon: "✨", label: "Харизма" },
            { key: "social",    icon: "🤝", label: "Социум" },
            { key: "finance",   icon: "💰", label: "Финансы" },
          ].map(({ key, icon, label }) => (
            <div key={key} className="bg-secondary/50 rounded-lg p-2 text-center">
              <div className="text-lg">{icon}</div>
              <div className="font-oswald text-gold text-sm">{stats[key as keyof typeof stats].toFixed(1)}</div>
              <div className="text-[10px] text-muted-foreground font-montserrat">{label}</div>
            </div>
          ))}
          <div className="bg-orange-950/40 border border-orange-800/40 rounded-lg p-2 text-center">
            <div className="text-lg">🔥</div>
            <div className="font-oswald text-orange-400 text-sm">{stats.willpower.toFixed(1)}</div>
            <div className="text-[10px] text-muted-foreground font-montserrat">Дух</div>
          </div>
        </div>
      </div>
    </div>
  );
}
