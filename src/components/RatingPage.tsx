import { useGame } from "@/context/GameContext";
import { getLevelInfo } from "@/hooks/useGameStore";

const MOCK_PLAYERS = [
  { name: "Александр В.", power: 128.5, avatar: "🦁" },
  { name: "Дмитрий К.",   power: 94.2,  avatar: "🐺" },
  { name: "Иван С.",      power: 71.8,  avatar: "🦊" },
  { name: "Кирилл М.",    power: 53.4,  avatar: "🐻" },
  { name: "Михаил Р.",    power: 32.1,  avatar: "🦅" },
  { name: "Никита Д.",    power: 18.9,  avatar: "🐯" },
];

const MEDALS = ["🥇", "🥈", "🥉"];

export default function RatingPage() {
  const { power } = useGame();
  const myLevelInfo = getLevelInfo(power);

  const allPlayers = [
    { name: "Вы", power, avatar: "⚔️", isMe: true },
    ...MOCK_PLAYERS.map(p => ({ ...p, isMe: false })),
  ].sort((a, b) => b.power - a.power);

  const myPos = allPlayers.findIndex(p => p.isMe);

  return (
    <div className="p-4 space-y-4">
      <div className="card-rpg-gold rounded-xl p-4 text-center">
        <div className="font-oswald text-xs text-muted-foreground tracking-widest mb-1">ВАШ РАНГ В ТАБЛИЦЕ</div>
        <div className="font-oswald text-5xl gradient-text-gold">#{myPos + 1}</div>
        <div className="text-xs text-muted-foreground font-montserrat mt-1">
          {myLevelInfo.title} · {myLevelInfo.rankLabel} · {power.toFixed(1)} ед.
        </div>
      </div>

      <div className="space-y-2">
        {allPlayers.map((player, i) => {
          const lvl = getLevelInfo(player.power);
          return (
            <div
              key={i}
              className={`card-rpg rounded-xl p-3 flex items-center gap-3 transition-all ${
                player.isMe ? "border border-gold/50 glow-gold" : ""
              }`}
            >
              <div className={`w-7 text-center font-oswald text-sm ${i === 0 ? "text-gold" : i === 1 ? "text-gray-300" : i === 2 ? "text-orange-600" : "text-muted-foreground"}`}>
                {i < 3 ? MEDALS[i] : `#${i + 1}`}
              </div>
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-xl border border-border">
                {player.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className={`font-montserrat text-sm font-semibold ${player.isMe ? "text-gold" : "text-foreground"}`}>
                    {player.name}
                  </span>
                  {player.isMe && (
                    <span className="text-[10px] bg-gold text-black px-1.5 rounded font-oswald">ВЫ</span>
                  )}
                </div>
                <div className="text-xs text-muted-foreground font-montserrat">
                  {lvl.title} · Ранг {lvl.rankLabel}
                </div>
              </div>
              <div className="text-right">
                <div className="font-oswald text-gold text-sm">{player.power.toFixed(1)}</div>
                <div className="text-[10px] text-muted-foreground">власть</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-center text-xs text-muted-foreground font-montserrat py-2">
        Рейтинг обновляется в реальном времени
      </div>
    </div>
  );
}
