import { useState } from "react";
import ProfilePage from "@/components/ProfilePage";
import StatsPage from "@/components/StatsPage";
import RatingPage from "@/components/RatingPage";
import ShopPage from "@/components/ShopPage";
import RankPage from "@/components/RankPage";
import Icon from "@/components/ui/icon";

type Page = "profile" | "stats" | "rating" | "shop" | "rank";

const navItems = [
  { id: "profile", label: "Профиль", icon: "User" },
  { id: "stats", label: "Статы", icon: "BarChart3" },
  { id: "rating", label: "Рейтинг", icon: "Trophy" },
  { id: "shop", label: "Магазин", icon: "ShoppingBag" },
  { id: "rank", label: "Ранг", icon: "Crown" },
] as const;

export default function Index() {
  const [page, setPage] = useState<Page>("profile");

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto relative">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-border sticky top-0 bg-background z-10">
        <span className="font-oswald text-xl font-bold gradient-text-gold tracking-widest">⚔ LIFE RPG</span>
        <div className="flex items-center gap-2 text-xs font-montserrat">
          <span className="text-muted-foreground">Сезон</span>
          <span className="text-gold font-bold">I</span>
          <div className="w-px h-4 bg-border" />
          <span className="text-muted-foreground">2026</span>
        </div>
      </header>

      {/* Page Content */}
      <main className="flex-1 overflow-y-auto pb-20">
        <div className="animate-fade-in" key={page}>
          {page === "profile" && <ProfilePage />}
          {page === "stats" && <StatsPage />}
          {page === "rating" && <RatingPage />}
          {page === "shop" && <ShopPage />}
          {page === "rank" && <RankPage />}
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-background border-t border-border z-20">
        <div className="flex">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setPage(item.id)}
              className={`flex-1 flex flex-col items-center py-2 gap-0.5 transition-all duration-200 ${
                page === item.id
                  ? "text-gold border-t-2 border-gold -mt-px"
                  : "text-muted-foreground hover:text-foreground border-t-2 border-transparent -mt-px"
              }`}
            >
              <Icon name={item.icon} size={20} />
              <span className="text-[10px] font-montserrat font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
