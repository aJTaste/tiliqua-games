// app/html-preview/page.tsx
"use client";

import { useState, useRef } from "react";
import CategoryTitle from "@/components/ui/CategoryTitle";
import Button from "@/components/ui/Button";

export default function Page() {
  const [html, setHtml] = useState("");
  const [isRealtime, setIsRealtime] = useState(true);
  const [previewHtml, setPreviewHtml] = useState("");
  const [activeTab, setActiveTab] = useState<"editor" | "preview">("editor");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setHtml(content);
      if (isRealtime) setPreviewHtml(content);
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleOpenInNewTab = () => {
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  const handleRun = () => setPreviewHtml(html);

  const handleToggleRealtime = () => {
    if (!isRealtime) setPreviewHtml(html);
    setIsRealtime((prev) => !prev);
  };

  return (
    // <div> → <main> に変更
    <main className="flex flex-col h-[100dvh]">
      <input
        ref={fileInputRef}
        type="file"
        accept=".html"
        onChange={handleFileUpload}
        className="hidden"
      />

      <header className="flex-shrink-0 flex items-center px-4 h-14 border-b border-[#e8e8e8] bg-[#F8F9FA]">
        <CategoryTitle category="Tools" title="HTML Preview" />

        {/* デスクトップ用ボタン群（sm以上で表示） */}
        <div className="hidden sm:flex items-center gap-3 ml-auto">
          <Button
            onClick={() => fileInputRef.current?.click()}
            className="text-xs tracking-[0.2em] px-3 py-1"
          >
            ファイル
          </Button>
          {/* active={isRealtime} で塗りつぶし↔アウトラインを切り替え */}
          <Button
            onClick={handleToggleRealtime}
            active={isRealtime}
            className="text-xs tracking-[0.2em] px-3 py-1"
          >
            リアルタイム
          </Button>
          <Button
            onClick={handleRun}
            disabled={isRealtime}
            className="text-xs tracking-[0.2em] px-3 py-1"
          >
            実行
          </Button>
          <Button
            onClick={handleOpenInNewTab}
            disabled={!html}
            className="text-xs tracking-[0.2em] px-3 py-1"
          >
            新しいタブで開く
          </Button>
        </div>

        {/* モバイル用ボタン群（sm未満で表示） */}
        <div className="flex sm:hidden items-center gap-2 ml-auto">
          <Button
            onClick={() => fileInputRef.current?.click()}
            className="text-[10px] tracking-[0.1em] px-2 py-1 whitespace-nowrap"
          >
            ファイル
          </Button>
          <Button
            onClick={handleToggleRealtime}
            active={isRealtime}
            className="text-[10px] tracking-[0.1em] px-2 py-1 whitespace-nowrap"
          >
            自動
          </Button>
          <Button
            onClick={handleRun}
            disabled={isRealtime}
            className="text-[10px] tracking-[0.1em] px-2 py-1 whitespace-nowrap"
          >
            実行
          </Button>
          <Button
            onClick={handleOpenInNewTab}
            disabled={!html}
            className="text-[10px] tracking-[0.1em] px-2 py-1 whitespace-nowrap"
          >
            開く
          </Button>
        </div>
      </header>

      {/* デスクトップレイアウト */}
      <div className="hidden sm:flex flex-1 overflow-hidden">
        <div className="w-1/2 border-r border-[#e8e8e8]">
          <textarea
            value={html}
            onChange={(e) => {
              setHtml(e.target.value);
              if (isRealtime) setPreviewHtml(e.target.value);
            }}
            className="w-full h-full resize-none outline-none font-mono text-sm leading-relaxed p-3 bg-[#F8F9FA] text-[#1a1a1a]"
            placeholder="HTMLをここに書いてください..."
            spellCheck={false}
          />
        </div>
        <div className="w-1/2">
          <iframe
            srcDoc={previewHtml}
            className="w-full h-full"
            sandbox="allow-scripts allow-modals"
          />
        </div>
      </div>

      {/* モバイルレイアウト */}
      <div className="flex sm:hidden flex-1 flex-col overflow-hidden">
        <div className="flex flex-shrink-0 border-b border-[#e8e8e8]">
          {/* タブボタン：style={{ borderBottom }} → Tailwindの条件クラスに変更 */}
          <button
            onClick={() => setActiveTab("editor")}
            className={`flex-1 py-2 text-[10px] tracking-[0.3em] uppercase transition-colors border-b-2 ${
              activeTab === "editor"
                ? "text-[#1a1a1a] border-[#1a1a1a]"
                : "text-[#bbb] border-transparent"
            }`}
          >
            エディター
          </button>
          <button
            onClick={() => setActiveTab("preview")}
            className={`flex-1 py-2 text-[10px] tracking-[0.3em] uppercase transition-colors border-b-2 ${
              activeTab === "preview"
                ? "text-[#1a1a1a] border-[#1a1a1a]"
                : "text-[#bbb] border-transparent"
            }`}
          >
            プレビュー
          </button>
        </div>

        <div className="flex-1 overflow-hidden">
          {activeTab === "editor" ? (
            <textarea
              value={html}
              onChange={(e) => {
                setHtml(e.target.value);
                if (isRealtime) setPreviewHtml(e.target.value);
              }}
              className="w-full h-full resize-none outline-none font-mono text-sm leading-relaxed p-3 bg-[#F8F9FA] text-[#1a1a1a]"
              placeholder="HTMLをここに書いてください..."
              spellCheck={false}
            />
          ) : (
            <iframe
              srcDoc={previewHtml}
              className="w-full h-full"
              sandbox="allow-scripts allow-modals"
            />
          )}
        </div>
      </div>
    </main>
  );
}
