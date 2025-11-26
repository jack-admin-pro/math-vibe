"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { Profile } from "@/types/database";

interface ProfileContextType {
  currentProfile: Profile | null;
  setCurrentProfile: (profile: Profile | null) => void;
  isLoading: boolean;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

const STORAGE_KEY = "math-vibe-profile";

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [currentProfile, setCurrentProfileState] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load profile from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setCurrentProfileState(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Error loading profile from storage:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save profile to localStorage when it changes
  const setCurrentProfile = (profile: Profile | null) => {
    setCurrentProfileState(profile);
    if (profile) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  return (
    <ProfileContext.Provider value={{ currentProfile, setCurrentProfile, isLoading }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
}

