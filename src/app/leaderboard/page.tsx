"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Trophy, Timer, Heart, Loader2 } from "lucide-react";
import type { GameResult, Profile } from "@/types/database";

type LeaderboardEntry = GameResult & {
  profiles: Profile | null;
};

type TabMode = "time_attack" | "survival";

export default function LeaderboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabMode>("time_attack");
  const [timeAttackResults, setTimeAttackResults] = useState<LeaderboardEntry[]>([]);
  const [survivalResults, setSurvivalResults] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeaderboards() {
      setLoading(true);
      try {
        // Fetch Time Attack results - cast to any to bypass TypeScript strict checking
        const { data: timeAttackData, error: timeAttackError } = await (supabase.from('game_results').select('*, profiles(name, avatar_color)') as any).eq('mode', 'time_attack').order('score', { ascending: false }).order('created_at', { ascending: false }).limit(20);

        if (timeAttackError) throw timeAttackError;

        // Fetch Survival results - cast to any to bypass TypeScript strict checking
        const { data: survivalData, error: survivalError } = await (supabase.from('game_results').select('*, profiles(name, avatar_color)') as any).eq('mode', 'survival').order('score', { ascending: false }).order('created_at', { ascending: false }).limit(20);

        if (survivalError) throw survivalError;

        setTimeAttackResults((timeAttackData as LeaderboardEntry[]) || []);
        setSurvivalResults((survivalData as LeaderboardEntry[]) || []);
      } catch (error) {
        console.error("Failed to fetch leaderboards:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchLeaderboards();
  }, []);

  const currentResults = activeTab === "time_attack" ? timeAttackResults : survivalResults;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pl-PL', { 
      day: 'numeric', 
      month: 'short',
      year: 'numeric'
    });
  };

  const getAvatarInitial = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  return (
    <main className="flex min-h-dvh flex-col p-4 safe-area-inset">
      {/* Header */}
      <header className="flex shrink-0 items-center justify-between py-2 mb-4">
        <button
          onClick={() => router.push("/menu")}
          className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/80 shadow-sm backdrop-blur-sm transition-transform active:scale-95"
        >
          <ArrowLeft className="h-6 w-6 text-foreground" />
        </button>
        <div className="flex items-center gap-2">
          <Trophy className="h-7 w-7 text-amber-500" />
          <h1 className="text-2xl font-extrabold text-foreground">Ranking</h1>
        </div>
        <div className="w-12" /> {/* Spacer for centering */}
      </header>

      {/* Tabs */}
      <div className="flex shrink-0 gap-2 mb-4">
        <button
          onClick={() => setActiveTab("time_attack")}
          className={`flex-1 flex items-center justify-center gap-2 h-12 rounded-xl font-bold transition-all ${
            activeTab === "time_attack"
              ? "bg-gradient-to-r from-orange-400 to-rose-500 text-white shadow-lg"
              : "bg-white text-gray-600 shadow-sm"
          }`}
        >
          <Timer className="h-5 w-5" />
          <span>Wyzwanie</span>
        </button>
        <button
          onClick={() => setActiveTab("survival")}
          className={`flex-1 flex items-center justify-center gap-2 h-12 rounded-xl font-bold transition-all ${
            activeTab === "survival"
              ? "bg-gradient-to-r from-violet-400 to-purple-600 text-white shadow-lg"
              : "bg-white text-gray-600 shadow-sm"
          }`}
        >
          <Heart className="h-5 w-5" />
          <span>Przetrwanie</span>
        </button>
      </div>

      {/* Results List */}
      <div className="flex-1 overflow-hidden">
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : currentResults.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <Trophy className="mx-auto h-16 w-16 text-gray-300 mb-4" />
              <p className="text-lg font-semibold text-gray-500">Brak wyników</p>
              <p className="text-sm text-gray-400 mt-1">Zagraj, aby pojawić się w rankingu!</p>
            </div>
          </div>
        ) : (
          <div className="h-[calc(100dvh-200px)] overflow-y-auto pb-4 space-y-2">
            {currentResults.map((result, index) => {
              const profile = result.profiles;
              const accuracy = result.total_questions > 0 
                ? Math.round((result.score / result.total_questions) * 100) 
                : 0;

              return (
                <Card 
                  key={result.id} 
                  className="flex items-center gap-4 p-4 hover:shadow-md transition-shadow"
                >
                  {/* Rank */}
                  <div className="flex-shrink-0 w-8 text-center">
                    {index < 3 ? (
                      <div className={`text-2xl font-extrabold ${
                        index === 0 ? "text-amber-400" :
                        index === 1 ? "text-gray-400" :
                        "text-amber-600"
                      }`}>
                        {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                      </div>
                    ) : (
                      <div className="text-lg font-bold text-gray-500">
                        {index + 1}
                      </div>
                    )}
                  </div>

                  {/* Avatar & Name */}
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div 
                      className="flex-shrink-0 h-12 w-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md"
                      style={{ backgroundColor: profile?.avatar_color || "#999" }}
                    >
                      {profile ? getAvatarInitial(profile.name) : "?"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-foreground truncate">
                        {profile?.name || "Unknown"}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatDate(result.created_at)}
                      </div>
                    </div>
                  </div>

                  {/* Score & Accuracy */}
                  <div className="flex-shrink-0 text-right">
                    <div className="text-2xl font-extrabold text-primary">
                      {result.score}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {accuracy}% dokł.
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

