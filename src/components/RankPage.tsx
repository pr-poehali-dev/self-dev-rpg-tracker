import { useGame } from "@/context/GameContext";

const RANKS = [
  { title: "Новобранец",   minPower: 0,      icon: "🪨", color: "#6b7280", desc: "Начало пути. Ты только что вступил в игру реальной жизни." },
  { title: "Боец",         minPower: 500,    icon: "⚔️", color: "#84cc16", desc: "Первые шаги сделаны. Тело и разум начинают пробуждаться." },
  { title: "Воин",         minPower: 2000,   icon: "🛡️", color: "#22c55e", desc: "Ты доказал свою стойкость. Путь становится серьёзнее." },
  { title: "Страж",        minPower: 5000,   icon: "🗡️", color: "#3b82f6", desc: "Твоя воля защищает тебя от слабости. Ты становишься щитом." },
  { title: "Мастер",       minPower: 10000,  icon: "🔱", color: "#8b5cf6", desc: "Редкий уровень. Ты превзошёл большинство людей на земле." },
  { title: "Легенда",      minPower: 25000,  icon: "👑", color: "#f59e0b", desc: "Имя, которое помнят. Стат власти говорит сам за себя." },
  { title: "Повелитель",   minPower: 60000,  icon: "🌟", color: "#ef4444", desc: "Ты вышел за пределы обычного. Ты переписываешь реальность." },
  { title: "Бог Реальности", minPower: 150000, icon: "⚡", color: "#dc2626", desc: "Финальный ранг. Немногие достигают этого. Ты — живая легенда." },
];

function calcLevel(xp: number) {
  return Math.floor(Math.sqrt(xp / 50)) + 1;
}

export default function RankPage() {
  const { powerLevel, stats } = useGame();

  const currentRankIdx = RANKS.reduce((acc, rank, i) => (powerLevel >= rank.minPower ? i : acc), 0);
  const currentRank = RANKS[currentRankIdx];
  const nextRank = RANKS[currentRankIdx + 1];
  const progressToNext = nextRank
    ? Math.min(100, Math.round(((powerLevel - currentRank.minPower) / (nextRank.minPower - currentRank.minPower)) * 100))
    : 100;

  return (
    <div className="p-4 space-y-4">
      {/* Current rank hero */}
      <div className="card-rpg-gold rounded-xl p-6 text-center glow-gold">
        <div className="text-6xl mb-3">{currentRank.icon}</div>
        <div className="font-oswald text-2xl gradient-text-gold mb-1">{currentRank.title}</div>
        <div className="text-sm text-muted-foreground font-montserrat px-4">{currentRank.desc}</div>
        <div className="mt-4 flex justify-center gap-6">
          <div>
            <div className="font-oswald text-2xl text-gold">{powerLevel.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">Власть</div>
          </div>
          <div className="w-px bg-border" />
          <div>
            <div className="font-oswald text-2xl text-gold">{calcLevel(powerLevel)}</div>
            <div className="text-xs text-muted-foreground">Уровень</div>
          </div>
        </div>
      </div>

      {/* Progress to next */}
      {nextRank && (
        <div className="card-rpg rounded-xl p-4 space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-oswald text-sm text-muted-foreground">До "{nextRank.title}" {nextRank.icon}</span>
            <span className="font-oswald text-gold text-sm">{progressToNext}%</span>
          </div>
          <div className="h-2 rounded-full bg-secondary overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-red-700 to-gold transition-all duration-700"
              style={{ width: `${progressToNext}%` }}
            />
          </div>
          <div className="text-xs text-muted-foreground font-montserrat">
            {(nextRank.minPower - powerLevel).toLocaleString()} очков Власти осталось
          </div>
        </div>
      )}

      {/* All ranks */}
      <h3 className="font-oswald text-base text-gold tracking-wide">ВСЕ РАНГИ</h3>
      <div className="space-y-2">
        {RANKS.map((rank, i) => {
          const isReached = powerLevel >= rank.minPower;
          const isCurrent = i === currentRankIdx;
          return (
            <div
              key={rank.title}
              className={`card-rpg rounded-xl p-3 flex items-center gap-3 transition-all ${
                isCurrent ? "border border-gold/50" : ""
              } ${!isReached ? "opacity-40" : ""}`}
            >
              <div className="text-2xl w-10 text-center">{rank.icon}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span
                    className="font-oswald text-sm"
                    style={{ color: isReached ? rank.color : "#6b7280" }}
                  >
                    {rank.title}
                  </span>
                  {isCurrent && (
                    <span className="text-[10px] bg-gold text-black px-1.5 rounded font-oswald">ТЕКУЩИЙ</span>
                  )}
                </div>
                <div className="text-xs text-muted-foreground font-montserrat">{rank.minPower.toLocaleString()}+ Власти</div>
              </div>
              {isReached ? (
                <span className="text-green-500 text-lg">✓</span>
              ) : (
                <span className="text-muted-foreground text-lg">🔒</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Stat summary */}
      <div className="card-rpg rounded-xl p-4 space-y-2">
        <h3 className="font-oswald text-sm text-gold tracking-wide">ДЕТАЛИ СТАТОВ</h3>
        <div className="grid grid-cols-3 gap-2">
          {[
            { key: "strength", icon: "💪", label: "Сила" },
            { key: "intellect", icon: "🧠", label: "Интеллект" },
            { key: "charisma", icon: "✨", label: "Харизма" },
            { key: "social", icon: "🤝", label: "Социум" },
            { key: "finance", icon: "💰", label: "Финансы" },
          ].map(({ key, icon, label }) => (
            <div key={key} className="bg-secondary/50 rounded-lg p-2 text-center">
              <div className="text-lg">{icon}</div>
              <div className="font-oswald text-gold text-sm">{stats[key as keyof typeof stats].toLocaleString()}</div>
              <div className="text-[10px] text-muted-foreground font-montserrat">{label}</div>
            </div>
          ))}
          <div className="bg-orange-950/40 border border-orange-800/40 rounded-lg p-2 text-center">
            <div className="text-lg">🔥</div>
            <div className="font-oswald text-orange-400 text-sm">{stats.willpower.toLocaleString()}</div>
            <div className="text-[10px] text-muted-foreground font-montserrat">Дух</div>
          </div>
        </div>
      </div>
    </div>
  );
}
