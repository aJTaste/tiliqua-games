export type GamePhase = "playing" | "answered";

export interface Color {
    hex: string;
    r: number;
    g: number;
    b: number;
}

export interface RankInfo {
    grade: string;
    label: string;
    color: string;
}

export interface AnswerResult {
    userHex: string;
    actualHex: string;
    userColor: Color;
    actualColor: Color;
    deltaE: number; // OKLAB ΔE × 100, 0–100
    rank: RankInfo;
}

export interface GameState {
    phase: GamePhase;
    currentColor: Color;
    streak: number;
    lastResult: AnswerResult | null;
}