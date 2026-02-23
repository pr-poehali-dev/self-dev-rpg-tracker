import { useGame } from "@/context/GameContext";

const MOCK_PLAYERS = [
  { name: "Александр В.", power: 12850, level: 18, avatar: "🦁", title: "Легенда" },
  { name: "Дмитрий К.", power: 9420, level: 14, avatar: "🐺", title: "Мастер" },
  { name: "Иван С.", power: 7180, level: 12, avatar: "🦊", title: "Эксперт" },
  { name: "Кирилл М.", power: 5340, level: 10, avatar: "🐻", title: "Воин" },
  { name: "Михаил Р.", power: 3210, level: 8, avatar: "🦅", title: "Боец" },
  { name: "Никита Д.", power: 1890, level: 5, avatar: "🐯", title: "Новичок" },
];

const RANK_COLORS = ["text-gold", "text-gray-300", "text-orange-600"];
const MEDALS = ["🥇", "🥈", "🥉"];

export default function RatingPage() {
  const { powerLevel } = useGame();

  const allPlayers = [
    { name: "Вы", power: powerLevel, level: Math.floor(Math.sqrt(powerLevel / 50)) + 1, avatar: "⚔️", title: "Искатель", isMe: true },
    ...MOCK_PLAYERS.map(p => ({ ...p, isMe: false })),
  ].sort((a, b) => b.power - a.power);

  const myPos = allPlayers.findIndex((p) => p.isMe);

  return (
    <div className="p-4 space-y-4">
      <div className="card-rpg-gold rounded-xl p-4 text-center">
        <div className="font-oswald text-xs text-muted-foreground tracking-widest mb-1">ВАШ РАНГ В ТАБЛИЦЕ</div>
        <div className="font-oswald text-5xl gradient-text-gold">#{myPos + 1}</div>
        <div className="text-xs text-muted-foreground font-montserrat mt-1">из {allPlayers.length} игроков</div>
      </div>

      <div className="space-y-2">
        {allPlayers.map((player, i) => (
          <div
            key={i}
            className={`card-rpg rounded-xl p-3 flex items-center gap-3 transition-all ${
              player.isMe ? "border border-gold/50 glow-gold" : ""
            }`}
          >
            {/* Position */}
            <div className={`w-7 text-center font-oswald text-sm ${RANK_COLORS[i] || "text-muted-foreground"}`}>
              {i < 3 ? MEDALS[i] : `#${i + 1}`}
            </div>

            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-xl border border-border">
              {player.avatar}
            </div>

            {/* Info */}
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
                {player.title} · Ур. {player.level}
              </div>
            </div>

            {/* Power */}
            <div className="text-right">
              <div className="font-oswald text-gold text-sm">{player.power.toLocaleString()}</div>
              <div className="text-[10px] text-muted-foreground">власть</div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center text-xs text-muted-foreground font-montserrat py-2">
        Рейтинг обновляется в реальном времени
      </div>
    </div>
  );
}
