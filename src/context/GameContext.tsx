import { createContext, useContext, ReactNode } from "react";
import { useGameStore } from "@/hooks/useGameStore";

type GameContextType = ReturnType<typeof useGameStore>;

const GameContext = createContext<GameContextType | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const store = useGameStore();
  return <GameContext.Provider value={store}>{children}</GameContext.Provider>;
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be inside GameProvider");
  return ctx;
}
