import { useState } from "react";
import { useGame } from "@/context/GameContext";

const SHOP_ITEMS = [
  { id: "ring_power", name: "Кольцо Силы", icon: "💍", desc: "+15% к стату Сила", bonus: "+15% Сила", price: 50, category: "Аксессуары" },
  { id: "tome", name: "Гримуар", icon: "📖", desc: "+20% к Интеллекту на 1 день", bonus: "+20% Интеллект", price: 80, category: "Расходники" },
  { id: "cape", name: "Плащ Харизмы", icon: "🧥", desc: "Удваивает XP от публичных выступлений", bonus: "x2 XP Харизма", price: 120, category: "Одежда" },
  { id: "phone", name: "Деловой Телефон", icon: "📱", desc: "+10% к Социум XP", bonus: "+10% Социум", price: 90, category: "Предметы" },
  { id: "wallet", name: "Золотой Кошелёк", icon: "👛", desc: "+25% к финансовому XP", bonus: "+25% Финансы", price: 150, category: "Аксессуары" },
  { id: "skull", name: "Амулет Воли", icon: "💀", desc: "+30% к Силе Духа", bonus: "+30% Сила Духа", price: 200, category: "Аксессуары" },
  { id: "boost_xp", name: "XP Буст x2", icon: "⚡", desc: "Удваивает весь XP на 24 часа", bonus: "x2 Весь XP", price: 300, category: "Расходники" },
  { id: "title_war", name: "Титул: Воитель", icon: "🗡️", desc: "Показывается в рейтинге", bonus: "Титул", price: 500, category: "Титулы" },
];

const CATEGORIES = ["Все", "Аксессуары", "Одежда", "Предметы", "Расходники", "Титулы"];

export default function ShopPage() {
  const { coins, inventory, buyItem } = useGame();
  const [cat, setCat] = useState("Все");
  const [bought, setBought] = useState<string[]>([]);
  const [flash, setFlash] = useState<string | null>(null);

  const filtered = cat === "Все" ? SHOP_ITEMS : SHOP_ITEMS.filter(i => i.category === cat);
  const ownedIds = inventory.map(i => i.id);

  const handleBuy = (item: typeof SHOP_ITEMS[0]) => {
    if (bought.includes(item.id) || ownedIds.includes(item.id)) return;
    const ok = buyItem({ id: item.id, name: item.name, icon: item.icon, description: item.desc, bonus: item.bonus }, item.price);
    if (ok) {
      setBought(prev => [...prev, item.id]);
      setFlash(item.name);
      setTimeout(() => setFlash(null), 2000);
    }
  };

  const isOwned = (id: string) => bought.includes(id) || ownedIds.includes(id);

  return (
    <div className="p-4 space-y-4">
      {/* Balance */}
      <div className="card-rpg-gold rounded-xl p-4 flex items-center gap-3">
        <span className="text-3xl">💰</span>
        <div>
          <div className="font-oswald text-xs text-muted-foreground tracking-widest">БАЛАНС</div>
          <div className="font-oswald text-3xl gradient-text-gold">{coins}</div>
          <div className="text-xs text-muted-foreground font-montserrat">монет · зарабатывай единицы!</div>
        </div>
      </div>

      {/* Flash */}
      {flash && (
        <div className="text-center font-oswald text-gold animate-scale-in">
          ✨ Куплено: {flash}!
        </div>
      )}

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map(c => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-montserrat font-medium border transition-all ${
              cat === c
                ? "bg-red-700 border-red-700 text-white"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Items grid */}
      <div className="grid grid-cols-2 gap-3">
        {filtered.map(item => {
          const owned = isOwned(item.id);
          const canAfford = coins >= item.price;
          return (
            <div key={item.id} className={`card-rpg rounded-xl p-3 flex flex-col gap-2 ${owned ? "opacity-60" : ""}`}>
              <div className="text-3xl text-center">{item.icon}</div>
              <div>
                <div className="font-oswald text-sm text-foreground text-center">{item.name}</div>
                <div className="text-[10px] text-muted-foreground font-montserrat text-center mt-0.5">{item.desc}</div>
              </div>
              <div className="text-center">
                <span className="text-[10px] bg-secondary rounded px-2 py-0.5 text-gold font-oswald">{item.bonus}</span>
              </div>
              <button
                onClick={() => handleBuy(item)}
                disabled={owned || !canAfford}
                className={`w-full py-2 rounded-lg font-oswald text-sm transition-all ${
                  owned
                    ? "bg-secondary text-muted-foreground cursor-default"
                    : canAfford
                    ? "bg-red-700 hover:bg-red-600 text-white glow-red-sm"
                    : "bg-secondary text-muted-foreground cursor-not-allowed opacity-50"
                }`}
              >
                {owned ? "Куплено" : `${item.price} 💰`}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}