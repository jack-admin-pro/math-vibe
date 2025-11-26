"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useCallback, useRef } from "react";
import { useProfile } from "@/contexts/ProfileContext";
import { NumPad } from "@/components/NumPad";
import { generateProblem, checkAnswer, type MathProblem } from "@/lib/mathEngine";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { 
  ArrowLeft, 
  Heart, 
  Timer, 
  Trophy,
  Dumbbell,
  Sparkles,
  X,
  Check
} from "lucide-react";
import { toast } from "sonner";

type GameMode = "practice" | "time-attack" | "survival";

interface GameState {
  score: number;
  totalQuestions: number;
  currentProblem: MathProblem | null;
  isGameOver: boolean;
  // Practice specific
  targetQuestions: number;
  // Time Attack specific
  timeLeft: number;
  // Survival specific
  lives: number;
}

const INITIAL_LIVES = 3;
const TIME_ATTACK_DURATION = 60;
const PRACTICE_OPTIONS = [10, 20, 30];

export default function GamePage() {
  const params = useParams();
  const router = useRouter();
  const { currentProfile, isLoading } = useProfile();
  const mode = params.mode as GameMode;

  const [answer, setAnswer] = useState("");
  const [showPracticeSetup, setShowPracticeSetup] = useState(mode === "practice");
  const [isShaking, setIsShaking] = useState(false);
  const [isFlashing, setIsFlashing] = useState(false);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    totalQuestions: 0,
    currentProblem: null,
    isGameOver: false,
    targetQuestions: 10,
    timeLeft: TIME_ATTACK_DURATION,
    lives: INITIAL_LIVES,
  });

  // Redirect if no profile
  useEffect(() => {
    if (!isLoading && !currentProfile) {
      router.replace("/");
    }
  }, [currentProfile, isLoading, router]);

  // Generate first problem when game starts
  const startGame = useCallback((targetQuestions?: number) => {
    setGameState(prev => ({
      ...prev,
      score: 0,
      totalQuestions: 0,
      currentProblem: generateProblem(),
      isGameOver: false,
      targetQuestions: targetQuestions || prev.targetQuestions,
      timeLeft: TIME_ATTACK_DURATION,
      lives: INITIAL_LIVES,
    }));
    setAnswer("");
    setShowPracticeSetup(false);
    setGameStarted(true);
  }, []);

  // Timer for Time Attack mode
  useEffect(() => {
    if (mode === "time-attack" && gameStarted && !gameState.isGameOver) {
      timerRef.current = setInterval(() => {
        setGameState(prev => {
          const newTime = prev.timeLeft - 1;
          if (newTime <= 0) {
            return { ...prev, timeLeft: 0, isGameOver: true };
          }
          return { ...prev, timeLeft: newTime };
        });
      }, 1000);

      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }
  }, [mode, gameStarted, gameState.isGameOver]);

  // Physical keyboard support
  useEffect(() => {
    const isDisabled = showCorrectAnswer || gameState.isGameOver || !gameStarted;
    const maxLength = 3;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't handle if disabled
      if (isDisabled) return;

      // Handle number keys 0-9
      if (/^[0-9]$/.test(e.key)) {
        e.preventDefault();
        setAnswer(prev => {
          if (prev.length >= maxLength) return prev;
          // Prevent leading zeros
          if (prev === "0" && e.key === "0") return prev;
          if (prev === "0" && e.key !== "0") return e.key;
          return prev + e.key;
        });
      }
      
      // Handle Backspace
      if (e.key === "Backspace") {
        e.preventDefault();
        setAnswer(prev => prev.slice(0, -1));
      }
      
      // Handle Enter (submit)
      if (e.key === "Enter") {
        e.preventDefault();
        // Only submit if there's an answer
        setAnswer(currentAnswer => {
          if (currentAnswer !== "") {
            // Use setTimeout to ensure state is updated before submit
            setTimeout(() => {
              document.getElementById("submit-btn")?.click();
            }, 0);
          }
          return currentAnswer;
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showCorrectAnswer, gameState.isGameOver, gameStarted]);

  // Handle answer submission
  const handleSubmit = useCallback(() => {
    if (!gameState.currentProblem || answer === "") return;

    const userAnswer = parseInt(answer, 10);
    const isCorrect = checkAnswer(gameState.currentProblem, userAnswer);

    if (isCorrect) {
      // Correct answer
      const newScore = gameState.score + 1;
      const newTotal = gameState.totalQuestions + 1;

      // Check if practice is complete
      if (mode === "practice" && newTotal >= gameState.targetQuestions) {
        setGameState(prev => ({
          ...prev,
          score: newScore,
          totalQuestions: newTotal,
          isGameOver: true,
        }));
        toast.success("Świetnie! 🎉", { duration: 2000 });
        return;
      }

      toast.success("Dobrze! ✨", { duration: 1000 });
      setGameState(prev => ({
        ...prev,
        score: newScore,
        totalQuestions: newTotal,
        currentProblem: generateProblem(),
      }));
      setAnswer("");

    } else {
      // Wrong answer
      if (mode === "practice") {
        // Practice: Show correct answer and wait
        setShowCorrectAnswer(true);
        toast.error(
          `Błąd! Prawidłowa odpowiedź: ${gameState.currentProblem.answer}`,
          { duration: 2500 }
        );
        setTimeout(() => {
          setShowCorrectAnswer(false);
          setGameState(prev => ({
            ...prev,
            totalQuestions: prev.totalQuestions + 1,
            currentProblem: generateProblem(),
          }));
          setAnswer("");
        }, 2000);

      } else if (mode === "time-attack") {
        // Time Attack: Flash red and skip immediately
        setIsFlashing(true);
        setTimeout(() => setIsFlashing(false), 300);
        setGameState(prev => ({
          ...prev,
          totalQuestions: prev.totalQuestions + 1,
          currentProblem: generateProblem(),
        }));
        setAnswer("");

      } else if (mode === "survival") {
        // Survival: Lose a life
        const newLives = gameState.lives - 1;
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 500);

        if (newLives <= 0) {
          setGameState(prev => ({
            ...prev,
            lives: 0,
            totalQuestions: prev.totalQuestions + 1,
            isGameOver: true,
          }));
          toast.error("Koniec gry! 💔", { duration: 2000 });
        } else {
          toast.error(`Błąd! Zostało żyć: ${newLives}`, { duration: 1500 });
          setGameState(prev => ({
            ...prev,
            lives: newLives,
            totalQuestions: prev.totalQuestions + 1,
            currentProblem: generateProblem(),
          }));
          setAnswer("");
        }
      }
    }
  }, [answer, gameState, mode]);

  // Mode-specific header info
  const renderModeInfo = () => {
    switch (mode) {
      case "practice":
        return (
          <div className="flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2">
            <Dumbbell className="h-5 w-5 text-emerald-600" />
            <span className="font-bold text-emerald-700">
              {gameState.totalQuestions} / {gameState.targetQuestions}
            </span>
          </div>
        );

      case "time-attack":
        const timePercent = (gameState.timeLeft / TIME_ATTACK_DURATION) * 100;
        const timeColor = gameState.timeLeft <= 10 ? "text-rose-600" : "text-orange-600";
        return (
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-2 rounded-full bg-orange-100 px-4 py-2 ${
              gameState.timeLeft <= 10 ? "animate-pulse bg-rose-100" : ""
            }`}>
              <Timer className={`h-5 w-5 ${timeColor}`} />
              <span className={`font-bold tabular-nums ${timeColor}`}>
                {gameState.timeLeft}s
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-amber-100 px-4 py-2">
              <Trophy className="h-5 w-5 text-amber-600" />
              <span className="font-bold text-amber-700">{gameState.score}</span>
            </div>
          </div>
        );

      case "survival":
        return (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              {Array.from({ length: INITIAL_LIVES }).map((_, i) => (
                <Heart
                  key={i}
                  className={`h-7 w-7 transition-all duration-300 ${
                    i < gameState.lives
                      ? "fill-rose-500 text-rose-500"
                      : "fill-gray-200 text-gray-200"
                  } ${i === gameState.lives ? "animate-heart-pulse" : ""}`}
                />
              ))}
            </div>
            <div className="flex items-center gap-2 rounded-full bg-violet-100 px-4 py-2">
              <Trophy className="h-5 w-5 text-violet-600" />
              <span className="font-bold text-violet-700">{gameState.score}</span>
            </div>
          </div>
        );
    }
  };

  // Get mode color theme
  const getModeTheme = () => {
    switch (mode) {
      case "practice":
        return { gradient: "from-emerald-400 to-teal-500", light: "emerald" };
      case "time-attack":
        return { gradient: "from-orange-400 to-rose-500", light: "orange" };
      case "survival":
        return { gradient: "from-violet-400 to-purple-600", light: "violet" };
      default:
        return { gradient: "from-emerald-400 to-teal-500", light: "emerald" };
    }
  };

  const theme = getModeTheme();

  if (isLoading) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  // Practice setup screen
  if (showPracticeSetup) {
    return (
      <main className="flex min-h-dvh flex-col p-4 safe-area-inset">
        <header className="flex items-center py-2">
          <button
            onClick={() => router.push("/menu")}
            className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/80 shadow-sm backdrop-blur-sm transition-transform active:scale-95"
          >
            <ArrowLeft className="h-6 w-6 text-foreground" />
          </button>
        </header>

        <div className="flex flex-1 flex-col items-center justify-center gap-8">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg">
              <Dumbbell className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-3xl font-extrabold text-foreground">Trening</h1>
            <p className="mt-2 text-muted-foreground">Ile pytań chcesz rozwiązać?</p>
          </div>

          <div className="flex gap-4">
            {PRACTICE_OPTIONS.map((count) => (
              <button
                key={count}
                onClick={() => startGame(count)}
                className="flex h-24 w-24 flex-col items-center justify-center rounded-2xl bg-white shadow-lg transition-all hover:scale-105 active:scale-95"
              >
                <span className="text-3xl font-extrabold text-emerald-600">{count}</span>
                <span className="text-sm text-muted-foreground">pytań</span>
              </button>
            ))}
          </div>
        </div>
      </main>
    );
  }

  // Game Over screen
  if (gameState.isGameOver) {
    const accuracy = gameState.totalQuestions > 0 
      ? Math.round((gameState.score / gameState.totalQuestions) * 100) 
      : 0;

    return (
      <main className="flex min-h-dvh flex-col items-center justify-center p-6 safe-area-inset">
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 shadow-xl">
            <Trophy className="h-12 w-12 text-white" />
          </div>
          
          <h1 className="text-4xl font-extrabold text-foreground">
            {mode === "practice" ? "Ukończono!" : "Koniec gry!"}
          </h1>
          
          <div className="mt-8 grid grid-cols-2 gap-4">
            <Card className="p-4 text-center">
              <div className="text-3xl font-extrabold text-primary">{gameState.score}</div>
              <div className="text-sm text-muted-foreground">Punkty</div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-3xl font-extrabold text-primary">{accuracy}%</div>
              <div className="text-sm text-muted-foreground">Dokładność</div>
            </Card>
          </div>

          <div className="mt-8 flex flex-col gap-3">
            <button
              onClick={() => {
                if (mode === "practice") {
                  setShowPracticeSetup(true);
                  setGameStarted(false);
                } else {
                  startGame();
                }
              }}
              className={`h-14 w-full rounded-2xl bg-gradient-to-r ${theme.gradient} font-bold text-white shadow-lg transition-all active:scale-95`}
            >
              Zagraj ponownie
            </button>
            <button
              onClick={() => router.push("/menu")}
              className="h-14 w-full rounded-2xl bg-white font-bold text-foreground shadow-md transition-all active:scale-95"
            >
              Wróć do menu
            </button>
          </div>
        </div>
      </main>
    );
  }

  // Auto-start non-practice modes
  if (!gameStarted && mode !== "practice") {
    startGame();
    return null;
  }

  // Main game UI
  return (
    <main className={`flex h-full flex-col justify-between p-4 pb- safe-area-inset transition-colors duration-300 ${
      isFlashing ? "bg-rose-100" : ""
    }`}>
      {/* Header */}
      <header className="flex shrink-0 items-center justify-between py-2">
        <button
          onClick={() => router.push("/menu")}
          className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/80 shadow-sm backdrop-blur-sm transition-transform active:scale-95"
        >
          <ArrowLeft className="h-6 w-6 text-foreground" />
        </button>
        {renderModeInfo()}
      </header>

      {/* Progress Bar (Practice only) */}
      {mode === "practice" && (
        <div className="mt-4 shrink-0">
          <Progress 
            value={(gameState.totalQuestions / gameState.targetQuestions) * 100} 
            className="h-3"
          />
        </div>
      )}

      {/* Problem Display */}
      <div className="flex flex-1 shrink flex-col items-center justify-center py-2">
        <Card 
          className={`w-full max-w-sm p-4 md:p-8 text-center shadow-xl transition-transform duration-300 ${
            isShaking ? "animate-shake" : ""
          }`}
        >
          {/* Problem */}
          <div className="mb-4 md:mb-6">
            <p className="text-4xl md:text-5xl font-extrabold tracking-wide text-foreground">
              {gameState.currentProblem?.display}
            </p>
            <p className="mt-2 text-2xl md:text-3xl text-muted-foreground">=</p>
          </div>

          {/* Answer Display */}
          <div className="relative mx-auto h-16 md:h-20 w-40 md:w-48 overflow-hidden rounded-2xl bg-gray-100">
            <div className="flex h-full items-center justify-center">
              {showCorrectAnswer ? (
                <div className="flex items-center gap-2 text-rose-500">
                  <X className="h-6 w-6 md:h-8 md:w-8" />
                  <span className="text-3xl md:text-4xl font-bold line-through">{answer}</span>
                </div>
              ) : (
                <span className="text-4xl md:text-5xl font-extrabold text-foreground">
                  {answer || (
                    <span className="text-gray-300">?</span>
                  )}
                </span>
              )}
            </div>
            {/* Cursor blink */}
            {!showCorrectAnswer && answer === "" && (
              <div className="absolute right-4 top-1/2 h-8 md:h-10 w-1 -translate-y-1/2 animate-pulse bg-primary" />
            )}
          </div>

          {/* Correct Answer Reveal */}
          {showCorrectAnswer && (
            <div className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-emerald-100 p-2 md:p-3 text-emerald-700">
              <Check className="h-5 w-5 md:h-6 md:w-6" />
              <span className="text-xl md:text-2xl font-bold">
                {gameState.currentProblem?.answer}
              </span>
            </div>
          )}
        </Card>
      </div>

      {/* NumPad */}
      <div className="shrink-0 pb-safe">
        <NumPad
          value={answer}
          onChange={setAnswer}
          onSubmit={handleSubmit}
          disabled={showCorrectAnswer || gameState.isGameOver}
        />
      </div>
    </main>
  );
}
