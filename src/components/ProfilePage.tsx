import { useState } from "react";
import { useGame } from "@/context/GameContext";
import { calcStrengthUnits, getLevelInfo, getNextRankInfo } from "@/hooks/useGameStore";

const INTENSITY_OPTIONS = [
  { value: 0.5, label: "Лёгкая", color: "text-green-400" },
  { value: 1,   label: "Средняя", color: "text-yellow-400" },
  { value: 1.5, label: "Сильная", color: "text-orange-400" },
  { value: 2,   label: "Очень высокая", color: "text-red-400" },
];

const RESULT_OPTIONS = [
  { value: 1,   label: "Минимум (цель достигнута)" },
  { value: 1.1, label: "+10% от нормы" },
  { value: 1.2, label: "+20% от нормы" },
  { value: 1.3, label: "+30% от нормы" },
  { value: 1.5, label: "+50% — личный рекорд!" },
];

const BODY_ELEMENTS = [
  { id: "strength_el", name: "Сила", icon: "🏋️", desc: "Отжимания, подтягивания, тяги" },
  { id: "endurance", name: "Выносливость", icon: "🏃", desc: "Бег, ходьба, удержание" },
  { id: "flexibility", name: "Гибкость", icon: "🧘", desc: "Растяжка, йога, формы" },
  { id: "speed", name: "Скорость", icon: "⚡", desc: "Спринты, реакция" },
  { id: "control", name: "Контроль", icon: "🎯", desc: "Дыхание, баланс, медитация" },
];

const STAT_LABELS = {
  strength:  { label: "Сила тела",   icon: "💪", color: "#dc2626" },
  intellect: { label: "Интеллект",   icon: "🧠", color: "#3b82f6" },
  charisma:  { label: "Харизма",     icon: "✨", color: "#a855f7" },
  social:    { label: "Социум",      icon: "🤝", color: "#22c55e" },
  finance:   { label: "Финансы",     icon: "💰", color: "#eab308" },
  willpower: { label: "Сила Духа",   icon: "🔥", color: "#f97316" },
};

// Пока показываем форму Силы тела, остальные — временно упрощённый ввод
type ActiveStat = keyof typeof STAT_LABELS;

export default function ProfilePage() {
  const { stats, log, coins, addUnits, power } = useGame();

  const [activeStat, setActiveStat] = useState<ActiveStat>("strength");
  const [element, setElement] = useState(BODY_ELEMENTS[0]);
  const [time, setTime] = useState("");
  const [intensity, setIntensity] = useState(1);
  const [result, setResult] = useState(1);
  // Для остальных статов
  const [simpleUnits, setSimpleUnits] = useState("");
  const [flash, setFlash] = useState<{ units: number; stat: string } | null>(null);

  const levelInfo = getLevelInfo(power);
  const nextRank = getNextRankInfo(power);

  const preview = activeStat === "strength" && time && parseFloat(time) > 0
    ? calcStrengthUnits(parseFloat(time), intensity, result)
    : null;

  const handleLog = () => {
    if (activeStat === "strength") {
      const t = parseFloat(time);
      if (!t || t <= 0) return;
      const { sb, units } = calcStrengthUnits(t, intensity, result);
      addUnits("strength", units, `${element.name} (${t} мин)`, sb);
      setFlash({ units, stat: "Сила тела" });
      setTime("");
    } else {
      const u = parseFloat(simpleUnits);
      if (!u || u <= 0) return;
      addUnits(activeStat, u, STAT_LABELS[activeStat].label, u);
      setFlash({ units: u, stat: STAT_LABELS[activeStat].label });
      setSimpleUnits("");
    }
    setTimeout(() => setFlash(null), 2500);
  };

  return (
    <div className="p-4 space-y-4">
      {/* HERO CARD */}
      <div className="card-rpg-gold rounded-xl p-4 glow-gold">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-900 to-black border-2 border-gold flex items-center justify-center text-2xl glow-red">
              {levelInfo.icon}
            </div>
            <div className="absolute -bottom-1 -right-1 bg-black border border-gold rounded-full px-1.5 py-0.5 font-oswald text-[10px] text-gold leading-none">
              {levelInfo.rankLabel}
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-baseline gap-2">
              <h2 className="font-oswald text-xl text-gold">{levelInfo.title}</h2>
              <span className="text-xs text-muted-foreground font-montserrat">Ур. {levelInfo.level}</span>
              <span
                className="text-xs font-oswald px-1.5 py-0.5 rounded border"
                style={{ color: "#f5c842", borderColor: "#f5c84266" }}
              >
                {levelInfo.rankLabel}
              </span>
            </div>
            {/* Progress in rank */}
            <div className="mt-1.5">
              <div className="flex justify-between text-[10px] text-muted-foreground mb-1 font-montserrat">
                <span>Ранг {levelInfo.rankLabel}</span>
                <span>{levelInfo.progressInRank}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-red-700 to-gold xp-glow transition-all duration-700"
                  style={{ width: `${levelInfo.progressInRank}%` }}
                />
              </div>
              {nextRank && (
                <div className="text-[10px] text-muted-foreground mt-0.5 font-montserrat">
                  до {nextRank.nextRankLabel}: {nextRank.neededPower.toFixed(1)} ед.
                </div>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="text-gold font-oswald font-bold text-lg">{coins}</div>
            <div className="text-[10px] text-muted-foreground">монет</div>
          </div>
        </div>

        {/* Mini stats */}
        <div className="mt-3 grid grid-cols-6 gap-1">
          {Object.entries(STAT_LABELS).map(([key, meta]) => (
            <div key={key} className="flex flex-col items-center">
              <span className="text-base">{meta.icon}</span>
              <span className="text-[10px] font-oswald" style={{ color: meta.color }}>
                {stats[key as keyof typeof stats].toFixed(1)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* POWER + WILLPOWER */}
      <div className="grid grid-cols-2 gap-3">
        <div className="card-rpg-gold rounded-xl p-3 flex items-center gap-2">
          <span className="text-2xl">👑</span>
          <div>
            <div className="font-oswald text-[10px] text-muted-foreground tracking-widest">ВЛАСТЬ</div>
            <div className="font-oswald text-xl gradient-text-gold">{power.toFixed(1)}</div>
            <div className="text-[10px] text-muted-foreground font-montserrat">единиц</div>
          </div>
        </div>
        <div className="card-rpg rounded-xl p-3 flex items-center gap-2 border border-orange-900/40">
          <span className="text-2xl">🔥</span>
          <div>
            <div className="font-oswald text-[10px] text-muted-foreground tracking-widest">СИЛА ДУХА</div>
            <div className="font-oswald text-xl text-orange-400">{stats.willpower.toFixed(1)}</div>
            <div className="text-[10px] text-muted-foreground font-montserrat">единиц</div>
          </div>
        </div>
      </div>

      {/* LOGGER */}
      <div className="card-rpg rounded-xl p-4 space-y-3">
        <h3 className="font-oswald text-base text-gold tracking-wide">ЗАПИСАТЬ АКТИВНОСТЬ</h3>

        {/* Stat tabs */}
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {Object.entries(STAT_LABELS).map(([key, meta]) => (
            <button
              key={key}
              onClick={() => setActiveStat(key as ActiveStat)}
              className={`flex-shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-montserrat border transition-all ${
                activeStat === key
                  ? "text-black border-transparent"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
              style={activeStat === key ? { background: meta.color } : {}}
            >
              {meta.icon} {meta.label}
            </button>
          ))}
        </div>

        {/* СИЛА ТЕЛА — полная формула */}
        {activeStat === "strength" && (
          <div className="space-y-3">
            {/* Элемент */}
            <div>
              <div className="text-[10px] text-muted-foreground font-montserrat mb-1.5 uppercase tracking-wide">Элемент</div>
              <div className="grid grid-cols-3 gap-1.5">
                {BODY_ELEMENTS.map(el => (
                  <button
                    key={el.id}
                    onClick={() => setElement(el)}
                    className={`p-2 rounded-lg border text-left transition-all ${
                      element.id === el.id
                        ? "border-red-600 bg-red-950/40 text-foreground"
                        : "border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <div className="text-lg">{el.icon}</div>
                    <div className="text-[10px] font-montserrat mt-0.5 leading-tight">{el.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Время */}
            <div>
              <div className="text-[10px] text-muted-foreground font-montserrat mb-1 uppercase tracking-wide">Время (мин)</div>
              <input
                type="number"
                value={time}
                onChange={e => setTime(e.target.value)}
                placeholder="Например: 30"
                className="w-full bg-secondary border border-border rounded-lg px-3 py-2.5 text-sm font-montserrat text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold"
              />
            </div>

            {/* Интенсивность */}
            <div>
              <div className="text-[10px] text-muted-foreground font-montserrat mb-1.5 uppercase tracking-wide">Интенсивность</div>
              <div className="grid grid-cols-2 gap-1.5">
                {INTENSITY_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setIntensity(opt.value)}
                    className={`py-2 px-3 rounded-lg border text-xs font-montserrat transition-all ${
                      intensity === opt.value
                        ? "border-red-600 bg-red-950/40 text-foreground"
                        : "border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <span className={intensity === opt.value ? opt.color : ""}>{opt.value}×</span>
                    {" "}{opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Результат */}
            <div>
              <div className="text-[10px] text-muted-foreground font-montserrat mb-1.5 uppercase tracking-wide">Результат</div>
              <div className="space-y-1">
                {RESULT_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setResult(opt.value)}
                    className={`w-full py-2 px-3 rounded-lg border text-xs font-montserrat transition-all text-left ${
                      result === opt.value
                        ? "border-red-600 bg-red-950/40 text-foreground"
                        : "border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {opt.value}× — {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Preview */}
            {preview && (
              <div className="bg-secondary/50 rounded-lg px-3 py-2.5 space-y-1 text-xs font-montserrat">
                <div className="flex justify-between text-muted-foreground">
                  <span>Сырой результат (SB)</span>
                  <span className="text-foreground">{preview.sb}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span className="text-muted-foreground">Единицы роста</span>
                  <span className="text-gold text-base font-oswald">+{preview.units} ед.</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ДРУГИЕ СТАТЫ — упрощённый ввод */}
        {activeStat !== "strength" && (
          <div className="space-y-2">
            <div className="text-[10px] text-muted-foreground font-montserrat uppercase tracking-wide">
              Введи количество единиц ({STAT_LABELS[activeStat].label})
            </div>
            <input
              type="number"
              value={simpleUnits}
              onChange={e => setSimpleUnits(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleLog()}
              placeholder="Например: 1.5"
              step="0.1"
              className="w-full bg-secondary border border-border rounded-lg px-3 py-2.5 text-sm font-montserrat text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold"
            />
            <div className="text-[10px] text-muted-foreground font-montserrat">
              Формулы для остальных статов будут добавлены в следующем обновлении
            </div>
          </div>
        )}

        <button
          onClick={handleLog}
          className="w-full py-3 bg-red-700 hover:bg-red-600 text-white rounded-lg font-oswald text-base tracking-wide transition-all glow-red-sm hover:glow-red"
        >
          + ЗАПИСАТЬ
        </button>

        {flash && (
          <div className="text-center font-oswald text-lg text-gold animate-scale-in">
            ✨ +{flash.units} ед. к {flash.stat}
          </div>
        )}
      </div>

      {/* ИСТОРИЯ */}
      {log.length > 0 && (
        <div className="card-rpg rounded-xl p-4 space-y-2">
          <h3 className="font-oswald text-base text-gold tracking-wide">ИСТОРИЯ</h3>
          <div className="space-y-2">
            {log.slice(0, 6).map(entry => (
              <div key={entry.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-base">{STAT_LABELS[entry.stat].icon}</span>
                  <div>
                    <div className="font-montserrat text-xs text-foreground">{entry.activity}</div>
                    <div className="text-[10px] text-muted-foreground">SB: {entry.rawResult} · {entry.date}</div>
                  </div>
                </div>
                <span className="font-oswald text-gold text-sm">+{entry.units} ед.</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
