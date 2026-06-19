"use client";

import { useState } from "react";

export default function Page() {
  const [html, setHtml] = useState("");
  const [isRealtime, setIsRealtime] = useState(false);
  const [previewHtml, setPreviewHtml] = useState("");

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setHtml(event.target?.result as string);
    };
    reader.readAsText(file);
  };

  const handleOpenInNewTab = () => {
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  const handleRun = () => {
    setPreviewHtml(html);
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="flex-shrink-0 flex items-center px-4 h-10 border-b border-[#e8e8e8] bg-[#F8F9FA]">
        <p className="text-xs tracking-[0.3em] text-[#1a1a1a] font-light uppercase">
          HTML Preview
        </p>
        <input
          type="file"
          accept=".html"
          onChange={handleFileUpload}
        />
        {!isRealtime && (
          <button
            onClick={handleRun}
            className="text-xs tracking-[0.2em] text-[#1a1a1a] border border-[#1a1a1a] px-3 py-1 hover:bg-[#1a1a1a] hover:text-[#F8F9FA] transition-all duration-200 uppercase"
          >
            Run
          </button>
        )}
        <button
          onClick={handleOpenInNewTab}
          className="text-xs tracking-[0.2em] text-[#1a1a1a] border border-[#1a1a1a] px-3 py-1 hover:bg-[#1a1a1a] hover:text-[#F8F9FA] transition-all duration-200 uppercase disabled:opacity-20"
          disabled={!html}
        >
          New Tab
        </button>
      </header>
      <div className="flex flex-1 overflow-hidden">
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
          <iframe srcDoc={previewHtml} className="w-full h-full" />
        </div>
      </div>
    </div>
  );
}
