"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Calculator, Loader2 } from "lucide-react";
import { useProfile } from "@/contexts/ProfileContext";
import { supabase } from "@/lib/supabase/client";
import type { Profile } from "@/types/database";

const FALLBACK_PROFILES: Profile[] = [
  { id: "1", name: "Hela", avatar_color: "#FF6B9D", created_at: "" },
  { id: "2", name: "Tata", avatar_color: "#4ECDC4", created_at: "" },
  { id: "3", name: "Mama", avatar_color: "#9B59B6", created_at: "" },
];

export default function HomePage() {
  const router = useRouter();
  const { setCurrentProfile, currentProfile } = useProfile();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch profiles from Supabase
  useEffect(() => {
    async function loadProfiles() {
      try {
        const result = await supabase
          .from('profiles')
          .select('*');
        
        if (result.error) throw result.error;
        
        // Sort profiles by name client-side
        const sortedProfiles = (result.data as Profile[] || [])
          .sort((a, b) => a.name.localeCompare(b.name));
        
        setProfiles(sortedProfiles.length > 0 ? sortedProfiles : FALLBACK_PROFILES);
      } catch (error) {
        console.error("Failed to load profiles:", error);
        // Fallback to hardcoded profiles for demo
        setProfiles(FALLBACK_PROFILES);
      } finally {
        setLoading(false);
      }
    }
    loadProfiles();
  }, []);

  const handleProfileSelect = (profile: Profile) => {
    setCurrentProfile(profile);
    router.push("/menu");
  };

  // Use fallback profiles if none loaded
  const displayProfiles = profiles.length > 0 ? profiles : FALLBACK_PROFILES;

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center p-6 safe-area-inset overflow-auto">
      <div className="flex flex-col items-center gap-6 text-center">
        {/* Logo with Animation */}
        <div className="relative">
          <div className="absolute -inset-4 animate-pulse rounded-3xl bg-gradient-to-br from-orange-400/30 to-rose-500/30 blur-xl" />
          <div className="relative rounded-3xl bg-gradient-to-br from-orange-400 to-rose-500 p-5 shadow-2xl shadow-orange-200">
            <Calculator className="h-14 w-14 text-white" />
          </div>
        </div>

        {/* Title */}
        <div>
          <h1 className="bg-gradient-to-r from-orange-500 to-rose-500 bg-clip-text text-5xl font-extrabold tracking-tight text-transparent">
            Math Vibe
          </h1>
          <p className="mt-2 text-lg font-medium text-muted-foreground">
            Nauka matematyki dla dzieci 🎮
          </p>
        </div>

        {/* Profile Selection */}
        <div className="mt-6">
          <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Kto gra?
          </p>

          {loading ? (
            <div className="flex h-32 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-5">
              {displayProfiles.map((profile) => (
                <button
                  key={profile.id}
                  onClick={() => handleProfileSelect(profile)}
                  className={`group relative flex h-28 w-28 flex-col items-center justify-center rounded-3xl bg-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95 ${
                    currentProfile?.id === profile.id
                      ? "ring-4 ring-offset-2"
                      : ""
                  }`}
                  style={{
                    ringColor: profile.avatar_color,
                  }}
                >
                  {/* Glow effect on hover */}
                  <div
                    className="absolute inset-0 rounded-3xl opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-40"
                    style={{ backgroundColor: profile.avatar_color }}
                  />
                  
                  {/* Avatar */}
                  <div
                    className="relative h-14 w-14 rounded-full shadow-inner transition-transform duration-300 group-hover:scale-110"
                    style={{ backgroundColor: profile.avatar_color }}
                  >
                    {/* Face features */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex gap-2">
                        <div className="h-2 w-2 rounded-full bg-white/80" />
                        <div className="h-2 w-2 rounded-full bg-white/80" />
                      </div>
                    </div>
                    <div className="absolute bottom-3 left-1/2 h-1.5 w-4 -translate-x-1/2 rounded-full bg-white/60" />
                  </div>
                  
                  {/* Name */}
                  <span className="relative mt-2 text-sm font-bold text-foreground">
                    {profile.name}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Tagline */}
        <p className="mt-8 max-w-xs text-center text-sm text-muted-foreground">
          Wybierz swój profil i zacznij przygodę z matematyką! ✨
        </p>
      </div>
    </main>
  );
}
