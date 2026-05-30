export type GamePhase = "playing" | "correct" | "wrong" | "gameover";

export interface Color {
    hex: string; // e.g. "#FF5733"
    r: number;
    g: number;
    b: number;
}

export interface GameState {
    phase: GamePhase;
    currentColor: Color;
    userInput: string;
    score: number;
    round: number;
    maxRounds: number;
    lastResult: AnswerResult | null;
}

export interface AnswerResult {
    correct: boolean;
    userHex: string;
    actualHex: string;
    diff: number; // 0〜100 (差の大きさ。低いほど近い)
    points: number;
}