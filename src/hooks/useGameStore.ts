import { useState } from "react";

export interface Stats {
  strength: number;
  intellect: number;
  charisma: number;
  social: number;
  finance: number;
  willpower: number;
}

export interface Activity {
  id: string;
  name: string;
  stat: keyof Stats;
  xpPerUnit: number;
  unit: string;
  icon: string;
}

export interface LogEntry {
  id: string;
  activity: string;
  stat: keyof Stats;
  xpGained: number;
  amount: number;
  unit: string;
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

const ACTIVITIES: Activity[] = [
  { id: "pushups", name: "Отжимания", stat: "strength", xpPerUnit: 1, unit: "повторений", icon: "💪" },
  { id: "pullups", name: "Подтягивания", stat: "strength", xpPerUnit: 3, unit: "повторений", icon: "🏋️" },
  { id: "run", name: "Бег", stat: "strength", xpPerUnit: 5, unit: "км", icon: "🏃" },
  { id: "reading", name: "Чтение", stat: "intellect", xpPerUnit: 10, unit: "страниц", icon: "📚" },
  { id: "course", name: "Обучение", stat: "intellect", xpPerUnit: 15, unit: "уроков", icon: "🎓" },
  { id: "meditation", name: "Медитация", stat: "willpower", xpPerUnit: 8, unit: "минут", icon: "🧘" },
  { id: "networking", name: "Нетворкинг", stat: "social", xpPerUnit: 20, unit: "знакомств", icon: "🤝" },
  { id: "speech", name: "Публичная речь", stat: "charisma", xpPerUnit: 25, unit: "выступлений", icon: "🎤" },
  { id: "income", name: "Доход", stat: "finance", xpPerUnit: 0.01, unit: "₽", icon: "💰" },
  { id: "investment", name: "Инвестиция", stat: "finance", xpPerUnit: 0.05, unit: "₽", icon: "📈" },
];

const INITIAL_STATS: Stats = {
  strength: 0,
  intellect: 0,
  charisma: 0,
  social: 0,
  finance: 0,
  willpower: 0,
};

function calcLevel(xp: number): number {
  return Math.floor(Math.sqrt(xp / 50)) + 1;
}

function xpToNextLevel(xp: number): { current: number; needed: number; level: number } {
  const level = calcLevel(xp);
  const needed = Math.pow(level, 2) * 50;
  const prev = Math.pow(level - 1, 2) * 50;
  return { current: xp - prev, needed: needed - prev, level };
}

export function useGameStore() {
  const [stats, setStats] = useState<Stats>(INITIAL_STATS);
  const [log, setLog] = useState<LogEntry[]>([]);
  const [coins, setCoins] = useState(100);
  const [inventory, setInventory] = useState<InventoryItem[]>([
    { id: "amulet", name: "Амулет Воли", icon: "🔮", description: "+10% к Силе Духа", bonus: "+10% Сила Духа", equipped: false },
    { id: "scroll", name: "Свиток Знаний", icon: "📜", description: "+5% к Интеллекту", bonus: "+5% Интеллект", equipped: false },
  ]);

  const addXp = (stat: keyof Stats, xp: number, activity: Activity, amount: number) => {
    setStats((prev) => ({ ...prev, [stat]: prev[stat] + xp }));
    setCoins((prev) => prev + Math.floor(xp * 0.1));
    const entry: LogEntry = {
      id: Date.now().toString(),
      activity: activity.name,
      stat,
      xpGained: xp,
      amount,
      unit: activity.unit,
      date: new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }),
    };
    setLog((prev) => [entry, ...prev].slice(0, 50));
  };

  const powerLevel = stats.strength + stats.intellect + stats.charisma + stats.social + stats.finance;

  const equipItem = (id: string) => {
    setInventory((prev) =>
      prev.map((item) => (item.id === id ? { ...item, equipped: !item.equipped } : item))
    );
  };

  const buyItem = (item: Omit<InventoryItem, "equipped">, price: number) => {
    if (coins >= price) {
      setCoins((prev) => prev - price);
      setInventory((prev) => [...prev, { ...item, equipped: false }]);
      return true;
    }
    return false;
  };

  return { stats, log, coins, inventory, addXp, equipItem, buyItem, powerLevel, xpToNextLevel, ACTIVITIES };
}
