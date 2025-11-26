export type Operation = '+' | '-' | '*' | '/';

export interface MathProblem {
  num1: number;
  num2: number;
  operation: Operation;
  answer: number;
  display: string;
}

/**
 * Generates a random integer between min and max (inclusive)
 */
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generates a valid 2nd-grade level addition problem
 * Constraints: Result <= 100
 */
function generateAddition(): MathProblem {
  const answer = randomInt(0, 100);
  const num1 = randomInt(0, answer);
  const num2 = answer - num1;
  
  return {
    num1,
    num2,
    operation: '+',
    answer,
    display: `${num1} + ${num2}`,
  };
}

/**
 * Generates a valid 2nd-grade level subtraction problem
 * Constraints: Result >= 0 (no negatives)
 */
function generateSubtraction(): MathProblem {
  const num1 = randomInt(0, 100);
  const num2 = randomInt(0, num1); // Ensure num2 <= num1
  const answer = num1 - num2;
  
  return {
    num1,
    num2,
    operation: '-',
    answer,
    display: `${num1} - ${num2}`,
  };
}

/**
 * Generates a valid 2nd-grade level multiplication problem
 * Constraints: Both factors 0-10, Result <= 100
 */
function generateMultiplication(): MathProblem {
  const num1 = randomInt(0, 10);
  const num2 = randomInt(0, 10);
  const answer = num1 * num2;
  
  return {
    num1,
    num2,
    operation: '*',
    answer,
    display: `${num1} × ${num2}`,
  };
}

/**
 * Generates a valid 2nd-grade level division problem
 * Constraints: Result is an integer (no remainders), Dividend <= 100
 */
function generateDivision(): MathProblem {
  // Generate answer first (the quotient), then work backwards
  const answer = randomInt(0, 10);
  const num2 = randomInt(1, 10); // Divisor (can't be 0)
  const num1 = answer * num2; // Dividend
  
  return {
    num1,
    num2,
    operation: '/',
    answer,
    display: `${num1} ÷ ${num2}`,
  };
}

/**
 * Generates a random math problem with balanced operation selection
 */
export function generateProblem(operations?: Operation[]): MathProblem {
  const availableOps = operations || ['+', '-', '*', '/'];
  const operation = availableOps[randomInt(0, availableOps.length - 1)];
  
  switch (operation) {
    case '+':
      return generateAddition();
    case '-':
      return generateSubtraction();
    case '*':
      return generateMultiplication();
    case '/':
      return generateDivision();
    default:
      return generateAddition();
  }
}

/**
 * Generates a batch of unique problems
 */
export function generateProblemSet(count: number, operations?: Operation[]): MathProblem[] {
  const problems: MathProblem[] = [];
  const seen = new Set<string>();
  
  while (problems.length < count) {
    const problem = generateProblem(operations);
    const key = problem.display;
    
    if (!seen.has(key)) {
      seen.add(key);
      problems.push(problem);
    }
  }
  
  return problems;
}

/**
 * Checks if the user's answer is correct
 */
export function checkAnswer(problem: MathProblem, userAnswer: number): boolean {
  return problem.answer === userAnswer;
}

