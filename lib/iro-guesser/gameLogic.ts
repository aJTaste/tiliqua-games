import { Color, AnswerResult, RankInfo } from "@/lib/iro-guesser/types";

export function generateRandomColor(): Color {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    const hex = `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
    return { hex, r, g, b };
}

function toHex(n: number): string {
    return n.toString(16).padStart(2, "0");
}

/** sRGB [0,255] → 線形光量 [0,1]（ガンマ補正の逆） */
function srgbToLinear(c: number): number {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
}

/** RGB [0,255] → OKLAB [L, a, b] */
function rgbToOklab(r: number, g: number, b: number): [number, number, number] {
    const rl = srgbToLinear(r);
    const gl = srgbToLinear(g);
    const bl = srgbToLinear(b);

    // 線形sRGB → LMS（cube root前）
    const l_ = Math.cbrt(0.4122214708 * rl + 0.5363325363 * gl + 0.0514459929 * bl);
    const m_ = Math.cbrt(0.2119034982 * rl + 0.6806995451 * gl + 0.1073969566 * bl);
    const s_ = Math.cbrt(0.0883024619 * rl + 0.2817188376 * gl + 0.6299787005 * bl);

    return [
        0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_,
        1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_,
        0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_,
    ];
}

/** OKLAB ΔE を 0–100 スケールで返す（100 = 最大知覚差） */
function calcDeltaE(a: Color, b: Color): number {
    const [L1, a1, b1] = rgbToOklab(a.r, a.g, a.b);
    const [L2, a2, b2] = rgbToOklab(b.r, b.g, b.b);
    const dE = Math.sqrt((L1 - L2) ** 2 + (a1 - a2) ** 2 + (b1 - b2) ** 2);
    // OKLAB の最大ΔEは概ね1.0（黒↔白）なので100倍でスケール
    return Math.min(Math.round(dE * 100), 100);
}

/** 入力を正規化 */
export function normalizeHex(input: string): string | null {
    const cleaned = input.trim().replace(/^#/, "");
    if (/^[0-9A-Fa-f]{6}$/.test(cleaned)) {
        return `#${cleaned.toUpperCase()}`;
    }
    if (/^[0-9A-Fa-f]{3}$/.test(cleaned)) {
        const expanded = cleaned.split("").map((c) => c + c).join("");
        return `#${expanded.toUpperCase()}`;
    }
    return null;
}

function hexToColor(hex: string): Color {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { hex: hex.toUpperCase(), r, g, b };
}

export function getRank(deltaE: number): RankInfo {
    if (deltaE <= 3) return { grade: "S", label: "完璧な色感覚です。", color: "#22c55e" };
    if (deltaE <= 7) return { grade: "A+", label: "非常に近い！", color: "#84cc16" };
    if (deltaE <= 12) return { grade: "A", label: "良い精度です。", color: "#eab308" };
    if (deltaE <= 20) return { grade: "B", label: "まずまずです。", color: "#f97316" };
    if (deltaE <= 35) return { grade: "C", label: "少し離れています。", color: "#ef4444" };
    return { grade: "D", label: "かけ離れています。", color: "#dc2626" };
}

export function evaluateAnswer(
    userInput: string,
    actual: Color
): AnswerResult | null {
    const normalized = normalizeHex(userInput);
    if (!normalized) return null;

    const userColor = hexToColor(normalized);
    const deltaE = calcDeltaE(userColor, actual);
    const rank = getRank(deltaE);

    return { userHex: normalized, actualHex: actual.hex, userColor, actualColor: actual, deltaE, rank };
}