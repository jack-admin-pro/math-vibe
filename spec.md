# Project Specification: Math Vibe (Kids Ed-Tech App)

## 1. Project Overview
A web-based, mobile-first educational application for 2nd-grade students (approx. 8 years old) to practice basic arithmetic (add, subtract, multiply, divide).
**Core Value:** Gamified learning with immediate feedback, simple "Netflix-style" profile switching, and local persistence via Supabase. Optimized for touch screens (iPhone/iPad).

## 2. Tech Stack & Setup Guidelines
* **Framework:** Next.js 14+ (App Router, TypeScript).
* **Styling:** Tailwind CSS + `shadcn/ui` (Critical: Use `npx shadcn@latest init` to scaffold).
* **Icons:** Lucide React.
* **Backend/DB:** Supabase (PostgreSQL) for Profiles and Leaderboards.
* **State Management:** React Hooks + Supabase Realtime (optional).
* **Mobile-First Config:**
    * Disable pinch-to-zoom in `viewport`.
    * Use large touch targets (min 48px).
    * Prevent pull-to-refresh on mobile.

## 3. Database Schema (Supabase)

### Table: `profiles`
(Stores the 3 local users: Hela, Tata, Mama)
* `id` (uuid, primary key)
* `name` (text, unique) - e.g., "Hela", "Tata", "Mama"
* `avatar_color` (text) - hex code or tailwind class for visual distinction
* `created_at` (timestamp)

### Table: `game_results`
(Stores history of played games for leaderboards)
* `id` (uuid, primary key)
* `profile_id` (uuid, foreign key -> profiles.id)
* `mode` (text) - 'practice', 'time_attack', 'survival'
* `score` (int) - For Practice/Survival: number of correct answers. For Time Attack: number of correct answers.
* `total_questions` (int) - Total questions attempted (to calculate accuracy).
* `duration_seconds` (int) - How long the session lasted.
* `created_at` (timestamp)

## 4. App Structure & Routes
* `/` (Home): Profile Picker. Grid of 3 avatars. Clicking one saves context and redirects to Menu.
* `/menu`: Dashboard. Buttons to select Game Mode.
* `/game/[mode]`: The Active Game Loop.
    * Params: `mode` = `practice` | `time-attack` | `survival`
    * Query Params (optional): `limit` (for practice questions count).
* `/leaderboard`: Tables showing top scores, filtered by Profile and Game Mode.

## 5. Detailed Feature Requirements

### A. Math Logic Engine (CRITICAL)
* **Operations:** +, -, *, /
* **Constraints (2nd Grade Level):**
    * Numbers range: 0-100.
    * **Subtraction:** Result must be >= 0 (No negatives).
    * **Division:** Result must be an integer (No remainders/decimals). Dividend <= 100.
    * **General:** Result <= 100.

### B. Game Modes
1.  **Practice (Trening):**
    * User selects set size: 10, 20, or 30 questions.
    * No timer pressure.
    * **Feedback:** If wrong -> Show "Error" toast + Correct Answer -> Wait for user ack -> Next.
    * **Win Condition:** Complete all questions.
2.  **Time Attack (Wyzwanie):**
    * Fixed time: 60 seconds.
    * Goal: Answer as many as possible.
    * **Feedback:** If wrong -> Flash screen red -> IMMEDIATE skip to next question (don't block).
    * **Win Condition:** Timer hits 0.
3.  **Survival (Przetrwanie):**
    * Infinite questions.
    * Player starts with 3 Hearts (Lives).
    * **Feedback:** If wrong -> Lose 1 Heart -> Shake animation -> Next question.
    * **Win Condition:** Lose all 3 hearts.

### C. Input Interface (Custom NumPad)
* **DO NOT** use the native system keyboard.
* Create a dedicated on-screen `NumPad` component.
* Grid layout:
    * [1] [2] [3]
    * [4] [5] [6]
    * [7] [8] [9]
    * [C] [0] [⌫] (Clear, Zero, Backspace)
* Action Button: "OK/Sprawdź" (Large, separate button).

### D. Leaderboard & Stats
* On `/leaderboard`, show tabs: "Wyzwanie", "Przetrwanie".
* Fetch Top 10 results from Supabase `game_results`.
* "Practice" mode does not need a public leaderboard, just a local summary.

## 6. Design & UI Guidelines
* **Vibe:** Playful, colorful, but clean. Large fonts.
* **Theme:** Light mode default.
* **Components (shadcn/ui):**
    * `Card` for the Question display (e.g., "24 + 5 = ?").
    * `Progress` for Time Attack timer and Practice progress.
    * `Toast` (Sonner) for feedback.
    * `Button` for NumPad (large, h-16 or h-20).
* **Mobile Optimization:** Use `h-screen` and `dvh` (dynamic viewport height) to prevent scrolling issues on iOS Safari.

## 7. Step-by-Step Implementation Plan for AI

**Phase 1: Setup & Data Layer**
1.  Initialize Next.js + Shadcn UI + Lucide Icons.
2.  Setup Supabase Client.
3.  Create SQL migration script for `profiles` and `game_results` tables.
4.  Create a "Seed" script to insert the 3 profiles (Hela, Tata, Mama) if they don't exist.

**Phase 2: Core Components**
1.  Build the `NumPad` component.
2.  Build the `ProfilePicker` (Home Page).
3.  Implement the `MathEngine` (logic for generating valid questions).

**Phase 3: Game Loop Implementation**
1.  Build the generic Game Layout (Score header, Question Card, NumPad).
2.  Implement "Practice Mode" logic (Count limit, detailed feedback).
3.  Implement "Time Attack" logic (Timer, fast skip).
4.  Implement "Survival Mode" logic (Hearts system).

**Phase 4: Persistence & Polish**
1.  Connect Game Over screens to Supabase `insert` (save score).
2.  Build the `/leaderboard` page fetching data from Supabase.
3.  Add "Confetti" effect on high scores or finishing a set.
4.  Final Mobile check (meta tags for PWA).