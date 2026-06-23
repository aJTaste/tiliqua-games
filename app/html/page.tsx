"use client";

import { useState, useRef } from "react";

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

  const handleRun = () => {
    setPreviewHtml(html);
  };

  const handleToggleRealtime = () => {
    if (!isRealtime) setPreviewHtml(html);
    setIsRealtime((prev) => !prev);
  };

  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col h-screen">

      {/* hidden inputはここに1つだけ置く */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".html"
        onChange={handleFileUpload}
        className="hidden"
      />

      <header className="flex-shrink-0 flex items-center px-4 h-10 border-b border-[#e8e8e8] bg-[#F8F9FA]">
        <p className="text-xs tracking-[0.3em] text-[#1a1a1a] font-light uppercase">
          HTML Preview
        </p>

        {/* デスクトップ用ボタン群（sm以上で表示） */}
        <div className="hidden sm:flex items-center gap-3 ml-auto">
          <button
            onClick={handleFileButtonClick}
            className="text-xs tracking-[0.2em] border border-[#1a1a1a] text-[#1a1a1a] px-3 py-1 hover:bg-[#1a1a1a] hover:text-[#F8F9FA] transition-all duration-200 uppercase"
          >
            ファイルを選択
          </button>
          <button
            onClick={handleToggleRealtime}
            className="text-xs tracking-[0.2em] px-3 py-1 border transition-all duration-200 uppercase"
            style={{
              borderColor: "#1a1a1a",
              color: isRealtime ? "#F8F9FA" : "#1a1a1a",
              backgroundColor: isRealtime ? "#1a1a1a" : "transparent",
            }}
          >
            リアルタイムで反映
          </button>
          <button
            onClick={handleRun}
            disabled={isRealtime}
            className="text-xs tracking-[0.2em] border border-[#1a1a1a] text-[#1a1a1a] px-3 py-1 transition-all duration-200 uppercase disabled:opacity-20 disabled:cursor-not-allowed"
          >
            実行
          </button>
          <button
            onClick={handleOpenInNewTab}
            disabled={!html}
            className="text-xs tracking-[0.2em] text-[#1a1a1a] border border-[#1a1a1a] px-3 py-1 hover:bg-[#1a1a1a] hover:text-[#F8F9FA] transition-all duration-200 uppercase disabled:opacity-20"
          >
            新しいタブでプレビューを開く
          </button>
        </div>

        {/* モバイル用ボタン群（sm未満で表示） */}
        <div className="flex sm:hidden items-center gap-2 ml-auto">
          <button
            onClick={handleFileButtonClick}
            className="text-[10px] tracking-[0.1em] border border-[#1a1a1a] text-[#1a1a1a] px-2 py-1 uppercase whitespace-nowrap"
          >
            ファイル
          </button>
          <button
            onClick={handleToggleRealtime}
            className="text-[10px] tracking-[0.1em] px-2 py-1 border uppercase whitespace-nowrap"
            style={{
              borderColor: "#1a1a1a",
              color: isRealtime ? "#F8F9FA" : "#1a1a1a",
              backgroundColor: isRealtime ? "#1a1a1a" : "transparent",
            }}
          >
            自動
          </button>
          <button
            onClick={handleRun}
            disabled={isRealtime}
            className="text-[10px] tracking-[0.1em] border border-[#1a1a1a] text-[#1a1a1a] px-2 py-1 uppercase disabled:opacity-20 disabled:cursor-not-allowed whitespace-nowrap"
          >
            実行
          </button>
          <button
            onClick={handleOpenInNewTab}
            disabled={!html}
            className="text-[10px] tracking-[0.1em] text-[#1a1a1a] border border-[#1a1a1a] px-2 py-1 uppercase disabled:opacity-20 whitespace-nowrap"
          >
            開く
          </button>
        </div>
      </header>

      {/* デスクトップ：左右2カラム（sm以上で表示） */}
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

      {/* モバイル：タブ切り替え（sm未満で表示） */}
      <div className="flex sm:hidden flex-1 flex-col overflow-hidden">

        {/* タブバー */}
        <div className="flex flex-shrink-0 border-b border-[#e8e8e8]">
          <button
            onClick={() => setActiveTab("editor")}
            className="flex-1 py-2 text-[10px] tracking-[0.3em] uppercase transition-colors"
            style={{
              color: activeTab === "editor" ? "#1a1a1a" : "#bbb",
              borderBottom: activeTab === "editor" ? "2px solid #1a1a1a" : "2px solid transparent",
            }}
          >
            エディター
          </button>
          <button
            onClick={() => setActiveTab("preview")}
            className="flex-1 py-2 text-[10px] tracking-[0.3em] uppercase transition-colors"
            style={{
              color: activeTab === "preview" ? "#1a1a1a" : "#bbb",
              borderBottom: activeTab === "preview" ? "2px solid #1a1a1a" : "2px solid transparent",
            }}
          >
            プレビュー
          </button>
        </div>

        {/* タブの中身 */}
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

    </div>
  );
}
