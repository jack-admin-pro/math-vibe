"use client";

import { ProfileProvider } from "@/contexts/ProfileContext";
import { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return <ProfileProvider>{children}</ProfileProvider>;
}

