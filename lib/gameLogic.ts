import { Color, AnswerResult } from "./types";

/** ランダムな色を生成する */
export function generateRandomColor(): Color {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    const hex = `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
    return { hex, r, g, b };
}

/** 数値を2桁16進数に変換 */
function toHex(n: number): string {
    return n.toString(16).padStart(2, "0");
}

/** ユーザーの回答を評価する */
export function evaluateAnswer(
    userInput: string,
    actual: Color
): AnswerResult {
    const normalized = normalizeHex(userInput);

    if (!normalized) {
        return {
            correct: false,
            userHex: userInput,
            actualHex: actual.hex,
            diff: 100,
            points: 0,
        };
    }

    const userColor = parseHex(normalized);
    const diff = calcDiff(userColor, actual);
    const points = calcPoints(diff);
    const correct = diff <= 10; // 差10%以内で正解とみなす

    return {
        correct,
        userHex: normalized.toUpperCase(),
        actualHex: actual.hex,
        diff,
        points,
    };
}

/** 入力を正規化: "#F8F9FA" or "F8F9FA" → "#F8F9FA" */
export function normalizeHex(input: string): string | null {
    const cleaned = input.trim().replace(/^#/, "");
    if (/^[0-9A-Fa-f]{6}$/.test(cleaned)) {
        return `#${cleaned.toUpperCase()}`;
    }
    // 3桁を6桁に展開
    if (/^[0-9A-Fa-f]{3}$/.test(cleaned)) {
        const expanded = cleaned
            .split("")
            .map((c) => c + c)
            .join("");
        return `#${expanded.toUpperCase()}`;
    }
    return null;
}

/** 16進数文字列をRGBに変換 */
function parseHex(hex: string): Color {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { hex, r, g, b };
}

/** RGB差の大きさを0〜100で返す */
function calcDiff(a: Color, b: Color): number {
    const dr = Math.abs(a.r - b.r);
    const dg = Math.abs(a.g - b.g);
    const db = Math.abs(a.b - b.b);
    // 最大差は255*3=765。0〜100にスケール
    return Math.round(((dr + dg + db) / (255 * 3)) * 100);
}

/** 差に応じたポイントを計算 (最大1000点) */
function calcPoints(diff: number): number {
    if (diff > 50) return 0;
    return Math.round(1000 * Math.pow(1 - diff / 50, 2));
}

/** ランクを返す */
export function getRank(diff: number): {
    label: string;
    color: string;
} {
    if (diff <= 2) return { label: "[S] 非常に素晴らしい結果です。", color: "#22c55e" };
    if (diff <= 5) return { label: "[A+] 素晴らしい結果です。", color: "#84cc16" };
    if (diff <= 10) return { label: "[A] 良い結果です。", color: "#eab308" };
    if (diff <= 20) return { label: "[B] 悪くない結果です。", color: "#f97316" };
    if (diff <= 35) return { label: "[C] 少し離れています。", color: "#ef4444" };
    return { label: "[D] かけ離れています。", color: "#dc2626" };
}