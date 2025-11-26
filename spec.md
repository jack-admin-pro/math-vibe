# Project Specification: Math Vibe (v1.0 - Gold Master)

## 1. Project Overview
A web-based, mobile-first educational PWA for 2nd-grade students.
**Core Value:** Gamified arithmetic practice (Add, Subtract, Multiply, Divide) with immediate feedback, zero-friction profile switching, and persistent leaderboards.
**Target Device:** Optimized strictly for Mobile (iPhone SE/Pro) & Desktop.

## 2. Tech Stack & Architecture
* **Framework:** Next.js 14+ (App Router, TypeScript).
* **Styling:** Tailwind CSS + `shadcn/ui`.
* **Icons:** Lucide React.
* **Backend:** Supabase (PostgreSQL) via `@/lib/supabase/client`.
* **Animations:** `canvas-confetti` (for rewards), CSS transitions for UI states.
* **Deployment:** Vercel.

## 3. Database Schema (Supabase)

### Table: `profiles`
* `id` (uuid, PK)
* `name` (text) - e.g., "Hela", "Tata", "Mama"
* `avatar_color` (text) - Hex code used for UI styling
* `created_at` (timestamp)

### Table: `game_results`
* `id` (uuid, PK)
* `profile_id` (uuid, FK -> profiles.id)
* `mode` (text) - 'practice', 'time_attack', 'survival'
* `score` (int)
* `total_questions` (int)
* `duration_seconds` (int)
* `created_at` (timestamp)

## 4. App Structure & Routes
* **`/` (Home):** Profile Picker.
    * **Logic:** Fetches profiles from DB. Handles selection with "Glowing Orb" active state.
    * **UX:** Requires user to pick a profile before entering.
* **`/menu`:** Game Mode Selection.
    * **Layout:** Strictly single-screen on mobile (no scrolling).
    * **Components:** 3 huge cards (Practice, Time Attack, Survival).
* **`/game/[mode]`:** The Core Game Loop.
    * **Layout:** Fixed height `100dvh` (no scrolling).
    * **Components:** Score Header, Question Card (adaptive size), NumPad (bottom fixed).
* **`/leaderboard`:** High Scores.
    * **Layout:** Tabbed interface (Wyzwanie / Przetrwanie).
    * **UX:** Scrollable list inside a fixed container.

## 5. Key Features & Implementation Details

### A. Math Logic Engine
* **Constraints:** 2nd Grade level (Results 0-100, No negatives, No remainders).
* **Generator:** `mathEngine.ts` ensures strictly valid operands.

### B. Input System (Hybrid)
1.  **On-Screen NumPad:**
    * Layout: Grid 0-9, C, Backspace.
    * **Styling:** Uses "Shadow 3D" technique (no border-width changes) to prevent layout shifts on press.
2.  **Physical Keyboard:**
    * Global `keydown` listener attached in Game Page.
    * Maps Keys `0-9`, `Backspace`, `Enter` to game functions.

### C. Game Modes
1.  **Practice:** 10/20/30 Qs. No timer. Confetti on finish.
2.  **Time Attack:** 60s limit. Red flash on error. Auto-save score on timeout.
3.  **Survival:** 3 Hearts. Shake animation on error. Game over on 0 hearts.

### D. Mobile Optimization (CRITICAL)
* **Global Layout:** `h-[100dvh] overflow-hidden` on `body` to prevent address bar scrolling issues on iOS.
* **Adaptive Components:**
    * Question Card shrinks font/padding on small screens (`flex-1`).
    * Menu Cards reduce gaps/icons to fit "Above the Fold".

## 6. UI/Design Guidelines
* **Theme:** Playful, rounded corners (`rounded-3xl`), vibrant gradients.
* **Feedback:**
    * **Success:** Confetti explosion + Green toast.
    * **Error:** Screen shake + Red toast.
* **Profile UX:** Selected profile maintains background color + adds `ring-4` and `scale-110`.

## 7. Future Roadmap (Post v1.0)
* Add "Division with Remainders" mode (Level 3).
* Add "Weekly Challenge" logic.
* Add Sound Effects (Web Audio API).