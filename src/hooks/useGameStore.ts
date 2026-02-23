import { useState } from "react";

export interface Stats {
  strength: number;   // единицы
  intellect: number;
  charisma: number;
  social: number;
  finance: number;
  willpower: number;  // Сила Духа — особый стат
}

export interface LogEntry {
  id: string;
  activity: string;
  stat: keyof Stats;
  units: number;
  rawResult: number;
  date: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  icon: string;
  description: string;
  bonus: string;
  equipped: boolean;
}

// =====================
// СИСТЕМА УРОВНЕЙ И РАНГОВ
// =====================
// Власть = сумма 5 статов (без Силы Духа)
// Уровень определяется по Власти, ранг — внутри уровня

export interface LevelInfo {
  level: number;       // 1–7
  title: string;
  icon: string;
  rankLabel: string;   // E, D, C, B, A (и доп. для высших)
  rankIndex: number;   // 0 = первый ранг уровня
  progressInRank: number; // 0–100%
  power: number;
}

// Границы власти для каждого уровня
// Уровень 1: Рекрут — 5 рангов (E D C B A), 0–499
// Уровень 2: Пешка  — 6 рангов (E D C B A S), 500–1999
// Уровень 3: Воин   — 6 рангов, 2000–4999
// Уровень 4: Странник — 6 рангов, 5000–11999
// Уровень 5: Мудрец — 7 рангов (E D C B A S SS), 12000–29999
// Уровень 6: Король — 7 рангов, 30000–79999
// Уровень 7: Абсолют — 1 ранг (∞), 80000+

const LEVEL_CONFIG = [
  {
    level: 1, title: "Рекрут",   icon: "🪨",
    minPower: 0,     maxPower: 499,
    ranks: ["E", "D", "C", "B", "A"],
  },
  {
    level: 2, title: "Пешка",    icon: "♟️",
    minPower: 500,   maxPower: 1999,
    ranks: ["E", "D", "C", "B", "A", "S"],
  },
  {
    level: 3, title: "Воин",     icon: "⚔️",
    minPower: 2000,  maxPower: 4999,
    ranks: ["E", "D", "C", "B", "A", "S"],
  },
  {
    level: 4, title: "Странник", icon: "🗺️",
    minPower: 5000,  maxPower: 11999,
    ranks: ["E", "D", "C", "B", "A", "S"],
  },
  {
    level: 5, title: "Мудрец",   icon: "📿",
    minPower: 12000, maxPower: 29999,
    ranks: ["E", "D", "C", "B", "A", "S", "SS"],
  },
  {
    level: 6, title: "Король",   icon: "👑",
    minPower: 30000, maxPower: 79999,
    ranks: ["E", "D", "C", "B", "A", "S", "SS"],
  },
  {
    level: 7, title: "Абсолют",  icon: "⚡",
    minPower: 80000, maxPower: Infinity,
    ranks: ["∞"],
  },
];

export function getLevelInfo(power: number): LevelInfo {
  const cfg = LEVEL_CONFIG.slice().reverse().find(l => power >= l.minPower) || LEVEL_CONFIG[0];
  const span = cfg.maxPower === Infinity ? 1 : cfg.maxPower - cfg.minPower + 1;
  const innerProgress = power - cfg.minPower;
  const rankCount = cfg.ranks.length;
  const perRank = span / rankCount;
  const rankIndex = Math.min(rankCount - 1, Math.floor(innerProgress / perRank));
  const rankStart = rankIndex * perRank;
  const progressInRank = cfg.maxPower === Infinity ? 100 : Math.round(((innerProgress - rankStart) / perRank) * 100);

  return {
    level: cfg.level,
    title: cfg.title,
    icon: cfg.icon,
    rankLabel: cfg.ranks[rankIndex],
    rankIndex,
    progressInRank: Math.min(100, progressInRank),
    power,
  };
}

export function getNextRankInfo(power: number): { nextRankLabel: string; neededPower: number } | null {
  const cfg = LEVEL_CONFIG.slice().reverse().find(l => power >= l.minPower) || LEVEL_CONFIG[0];
  const span = cfg.maxPower === Infinity ? 1 : cfg.maxPower - cfg.minPower + 1;
  const innerProgress = power - cfg.minPower;
  const rankCount = cfg.ranks.length;
  const perRank = span / rankCount;
  const rankIndex = Math.min(rankCount - 1, Math.floor(innerProgress / perRank));

  if (rankIndex < rankCount - 1) {
    const nextStart = cfg.minPower + (rankIndex + 1) * perRank;
    return { nextRankLabel: cfg.ranks[rankIndex + 1], neededPower: Math.ceil(nextStart) - power };
  }
  const nextLvlIdx = LEVEL_CONFIG.findIndex(l => l.level === cfg.level + 1);
  if (nextLvlIdx === -1) return null;
  return {
    nextRankLabel: `${LEVEL_CONFIG[nextLvlIdx].title} ${LEVEL_CONFIG[nextLvlIdx].ranks[0]}`,
    neededPower: LEVEL_CONFIG[nextLvlIdx].minPower - power,
  };
}

// =====================
// ФОРМУЛА СИЛЫ ТЕЛА
// SB = Время × Интенсивность × Результат
// Units = L × SB / (SB + k),  L=3, k=60
// =====================
export function calcStrengthUnits(time: number, intensity: number, result: number): { sb: number; units: number } {
  const sb = time * intensity * result;
  const L = 3;
  const k = 60;
  const units = parseFloat((L * sb / (sb + k)).toFixed(2));
  return { sb: parseFloat(sb.toFixed(1)), units };
}

// Нормализация для простых активностей (старая таблица — оставим как fallback)
export function normalizeUnits(raw: number): number {
  if (raw <= 20) return 0.5;
  if (raw <= 40) return 1;
  if (raw <= 60) return 1.5;
  if (raw <= 80) return 2;
  return 2.5;
}

// =====================
// STORE
// =====================
const INITIAL_STATS: Stats = {
  strength: 0,
  intellect: 0,
  charisma: 0,
  social: 0,
  finance: 0,
  willpower: 0,
};

export function useGameStore() {
  const [stats, setStats] = useState<Stats>(INITIAL_STATS);
  const [log, setLog] = useState<LogEntry[]>([]);
  const [coins, setCoins] = useState(100);
  const [inventory, setInventory] = useState<InventoryItem[]>([
    { id: "amulet", name: "Амулет Воли", icon: "🔮", description: "+10% к Силе Духа", bonus: "+10% Сила Духа", equipped: false },
    { id: "scroll", name: "Свиток Знаний", icon: "📜", description: "+5% к Интеллекту", bonus: "+5% Интеллект", equipped: false },
  ]);

  const addUnits = (stat: keyof Stats, units: number, activityName: string, rawResult: number) => {
    setStats((prev) => ({ ...prev, [stat]: parseFloat((prev[stat] + units).toFixed(2)) }));
    setCoins((prev) => prev + Math.floor(units * 2));
    const entry: LogEntry = {
      id: Date.now().toString(),
      activity: activityName,
      stat,
      units,
      rawResult,
      date: new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }),
    };
    setLog((prev) => [entry, ...prev].slice(0, 50));
  };

  // Власть = сумма 5 основных статов (без Силы Духа)
  const power = parseFloat((stats.strength + stats.intellect + stats.charisma + stats.social + stats.finance).toFixed(2));

  const equipItem = (id: string) => {
    setInventory((prev) => prev.map((item) => (item.id === id ? { ...item, equipped: !item.equipped } : item)));
  };

  const buyItem = (item: Omit<InventoryItem, "equipped">, price: number) => {
    if (coins >= price) {
      setCoins((prev) => prev - price);
      setInventory((prev) => [...prev, { ...item, equipped: false }]);
      return true;
    }
    return false;
  };

  return { stats, log, coins, inventory, addUnits, equipItem, buyItem, power };
}
