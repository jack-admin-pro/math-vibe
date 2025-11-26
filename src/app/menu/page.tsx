"use client";

import { useRouter } from "next/navigation";
import { useProfile } from "@/contexts/ProfileContext";
import { 
  Dumbbell, 
  Timer, 
  Heart, 
  ArrowLeft,
  Sparkles
} from "lucide-react";
import { useEffect } from "react";

const GAME_MODES = [
  {
    id: "practice",
    name: "Trening",
    description: "Ćwicz bez presji czasu",
    icon: Dumbbell,
    gradient: "from-emerald-400 to-teal-500",
    shadowColor: "shadow-emerald-200",
    bgPattern: "radial-gradient(circle at 80% 20%, rgba(255,255,255,0.3) 0%, transparent 50%)",
  },
  {
    id: "time-attack",
    name: "Wyzwanie",
    description: "60 sekund na zdobycie punktów!",
    icon: Timer,
    gradient: "from-orange-400 to-rose-500",
    shadowColor: "shadow-orange-200",
    bgPattern: "radial-gradient(circle at 20% 80%, rgba(255,255,255,0.3) 0%, transparent 50%)",
  },
  {
    id: "survival",
    name: "Przetrwanie",
    description: "Masz 3 życia – ile wytrzymasz?",
    icon: Heart,
    gradient: "from-violet-400 to-purple-600",
    shadowColor: "shadow-violet-200",
    bgPattern: "radial-gradient(circle at 50% 10%, rgba(255,255,255,0.3) 0%, transparent 50%)",
  },
];

export default function MenuPage() {
  const router = useRouter();
  const { currentProfile, isLoading } = useProfile();

  useEffect(() => {
    if (!isLoading && !currentProfile) {
      router.replace("/");
    }
  }, [currentProfile, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <main className="flex h-full w-full flex-col overflow-hidden p-4 md:p-8 safe-area-inset">
      <div className="mx-auto flex h-full w-full max-w-xl flex-col">
        {/* Header */}
        <header className="flex shrink-0 items-center justify-between py-2">
          <button
            onClick={() => router.push("/")}
            className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/80 shadow-sm backdrop-blur-sm transition-transform active:scale-95"
          >
            <ArrowLeft className="h-6 w-6 text-foreground" />
          </button>
          
          {currentProfile && (
            <div className="flex items-center gap-3 rounded-full bg-white/80 px-4 py-2 shadow-sm backdrop-blur-sm">
              <div
                className="h-8 w-8 rounded-full"
                style={{ backgroundColor: currentProfile.avatar_color }}
              />
              <span className="font-bold text-foreground">
                {currentProfile.name}
              </span>
            </div>
          )}
        </header>

        {/* Title */}
        <div className="mt-2 mb-4 shrink-0 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/60 px-4 py-2 backdrop-blur-sm">
            <Sparkles className="h-4 w-4 md:h-5 md:w-5 text-amber-500" />
            <span className="text-xs md:text-sm font-semibold text-foreground">Wybierz tryb gry</span>
          </div>
          <h1 className="mt-2 text-2xl md:text-3xl font-extrabold text-foreground">
            W co gramy?
          </h1>
        </div>

        {/* Game Mode Cards */}
        <div className="flex flex-1 flex-col gap-3 md:gap-6 min-h-0">
          {GAME_MODES.map((mode, index) => {
            const Icon = mode.icon;
            return (
              <button
                key={mode.id}
                onClick={() => router.push(`/game/${mode.id}`)}
                className={`group relative flex-1 overflow-hidden rounded-3xl bg-gradient-to-br ${mode.gradient} p-4 md:p-8 text-left text-white shadow-xl ${mode.shadowColor} transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] min-h-0`}
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                {/* Background Pattern */}
                <div
                  className="absolute inset-0 opacity-60"
                  style={{ background: mode.bgPattern }}
                />
                
                {/* Floating Icon */}
                <div className="absolute right-4 top-4 opacity-20 transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110">
                  <Icon className="h-16 w-16 md:h-24 md:w-24" strokeWidth={1.5} />
                </div>

                {/* Content */}
                <div className="relative z-10 flex h-full flex-col justify-end">
                  <div className="mb-2 flex h-10 w-10 md:h-14 md:w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                    <Icon className="h-5 w-5 md:h-7 md:w-7" />
                  </div>
                  <h2 className="text-xl md:text-3xl font-extrabold">{mode.name}</h2>
                  <p className="mt-1 text-sm md:text-base font-medium text-white/80 line-clamp-2">
                    {mode.description}
                  </p>
                </div>

                {/* Bottom Shine Effect */}
                <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/10 to-transparent" />
              </button>
            );
          })}
        </div>
      </div>
    </main>
  );
}
