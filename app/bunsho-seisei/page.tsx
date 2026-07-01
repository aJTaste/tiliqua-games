// app/bunsho-seisei/page.tsx
"use client";

import { useState } from "react";
import CategoryTitle from "@/components/ui/CategoryTitle";
import PageFooter from "@/components/ui/PageFooter";
import Button from "@/components/ui/Button";
import {
  ChainOrder,
  MarkovTable,
  QuestionReply,
} from "@/lib/bunsho-seisei/types";
import {
  buildMarkovTable,
  generateText,
  generateReply,
  isTextLongEnough,
} from "@/lib/bunsho-seisei/markovLogic";

const ORDER_OPTIONS: ChainOrder[] = [1, 2, 3];
const LENGTH_OPTIONS = [100, 200, 400] as const;

const RECOMMENDED_MIN_LENGTH: Record<ChainOrder, number> = {
  1: 100,
  2: 300,
  3: 800,
};

export default function Page() {
  const [sourceText, setSourceText] = useState("");
  const [order, setOrder] = useState<ChainOrder>(2);
  const [outputLength, setOutputLength] = useState<number>(200);
  const [outputText, setOutputText] = useState("");
  const [patternCount, setPatternCount] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // 質問セクション用の状態
  const [questionText, setQuestionText] = useState("");
  const [replyResult, setReplyResult] = useState<QuestionReply | null>(null);
  const [askError, setAskError] = useState<string | null>(null);

  const charCount = Array.from(sourceText).length;
  const recommendedMin = RECOMMENDED_MIN_LENGTH[order];
  const belowRecommended = charCount > 0 && charCount < recommendedMin;

  // 元テキスト・連鎖長が同じなら毎回同じ表になるので、必要なタイミングでその場で組み立てる
  const buildCurrentMarkov = (): MarkovTable | null => {
    if (!isTextLongEnough(sourceText, order)) return null;
    return buildMarkovTable(sourceText, order);
  };

  const handleGenerate = () => {
    const markov = buildCurrentMarkov();
    if (!markov) {
      setError("テキストが短すぎます。もっと長い文章を入力してください。");
      setOutputText("");
      setPatternCount(null);
      return;
    }
    setError(null);
    setCopied(false);
    setPatternCount(Object.keys(markov.tables[markov.order]).length);
    setOutputText(generateText(markov, outputLength));
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleAsk = () => {
    const markov = buildCurrentMarkov();
    if (!markov) {
      setAskError("先に元となる文章を入力してください。");
      setReplyResult(null);
      return;
    }
    if (questionText.trim().length === 0) {
      setAskError("質問を入力してください。");
      setReplyResult(null);
      return;
    }
    setAskError(null);
    setReplyResult(generateReply(markov, questionText, outputLength));
  };

  return (
    <main className="flex flex-col items-center min-h-dvh bg-[#F8F9FA]">
      <header className="w-full max-w-xs flex flex-col px-5 pt-8 pb-5">
        <CategoryTitle category="Tools" title="文章生成疑似AI" />
      </header>

      <div className="w-full max-w-xs border-t border-[#e8e8e8]" />

      <div className="flex-1 w-full max-w-xs px-5 py-8 flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <span className="text-[7px] tracking-[0.3em] text-[#bbb] uppercase">
            元となる文章
          </span>
          <textarea
            value={sourceText}
            onChange={(e) => setSourceText(e.target.value)}
            placeholder="ここに長めの文章を貼り付けてください..."
            rows={6}
            className="w-full resize-none outline-none font-normal text-xs leading-relaxed p-3 bg-[#F8F9FA] border border-[#e8e8e8] text-[#1a1a1a] placeholder:text-[#ccc]"
          />
          <div className="flex justify-between">
            <span className="font-mono-game text-[9px] text-[#bbb]">
              {charCount}文字
            </span>
            {belowRecommended && (
              <span className="text-[9px] text-[#f97316]">
                推奨: {recommendedMin}文字以上
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-[7px] tracking-[0.3em] text-[#bbb] uppercase">
            連鎖の長さ（N文字）
          </span>
          <div className="flex gap-2">
            {ORDER_OPTIONS.map((n) => (
              <Button
                key={n}
                active={order === n}
                onClick={() => setOrder(n)}
                className="flex-1 py-2 text-xs tracking-[0.15em]"
              >
                {n}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-[7px] tracking-[0.3em] text-[#bbb] uppercase">
            生成する文字数
          </span>
          <div className="flex gap-2">
            {LENGTH_OPTIONS.map((len) => (
              <Button
                key={len}
                active={outputLength === len}
                onClick={() => setOutputLength(len)}
                className="flex-1 py-2 text-xs tracking-[0.15em]"
              >
                {len}
              </Button>
            ))}
          </div>
        </div>

        <Button
          onClick={handleGenerate}
          disabled={sourceText.length === 0}
          className="w-full py-2.5 text-xs tracking-[0.3em]"
        >
          生成する
        </Button>

        {error && (
          <p className="text-[10px] tracking-[0.1em] text-[#c0392b] text-center">
            {error}
          </p>
        )}

        {outputText && (
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="text-[7px] tracking-[0.3em] text-[#bbb] uppercase">
                生成結果
              </span>
              {patternCount !== null && (
                <span className="font-mono-game text-[8px] text-[#bbb]">
                  学習パターン数: {patternCount}
                </span>
              )}
            </div>
            <p className="w-full p-3 bg-white border border-[#e8e8e8] text-xs leading-relaxed text-[#1a1a1a] whitespace-pre-wrap">
              {outputText}
            </p>
            <Button
              onClick={handleCopy}
              className="w-full py-2 text-[10px] tracking-[0.25em]"
            >
              {copied ? "コピーしました" : "コピーする"}
            </Button>
          </div>
        )}

        <div className="w-full border-t border-[#ebebeb]" />

        <div className="flex flex-col gap-2">
          <span className="text-[7px] tracking-[0.3em] text-[#bbb] uppercase">
            疑似AIに質問してみる
          </span>
          <div className="flex gap-2">
            <input
              type="text"
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder="例：猫について教えて"
              className="flex-1 outline-none text-xs p-3 bg-[#F8F9FA] border border-[#e8e8e8] text-[#1a1a1a] placeholder:text-[#ccc]"
            />
            <Button
              onClick={handleAsk}
              disabled={sourceText.length === 0}
              className="px-4 text-xs tracking-[0.15em] whitespace-nowrap"
            >
              きいてみる
            </Button>
          </div>
        </div>

        {askError && (
          <p className="text-[10px] tracking-[0.1em] text-[#c0392b] text-center">
            {askError}
          </p>
        )}

        {replyResult && (
          <div className="flex flex-col gap-2">
            <span className="text-[8px] tracking-[0.15em] text-[#bbb]">
              {replyResult.matched
                ? `「${replyResult.matched}」について考えてみると…`
                : "その話はまだ知らないみたい。適当に話すね…"}
            </span>
            <p className="w-full p-3 bg-white border border-[#e8e8e8] text-xs leading-relaxed text-[#1a1a1a] whitespace-pre-wrap">
              {replyResult.body}
            </p>
          </div>
        )}
      </div>

      <PageFooter />
    </main>
  );
}
