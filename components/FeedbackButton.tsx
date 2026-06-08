"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function FeedbackButton() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (open) textareaRef.current?.focus();
  }, [open]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, page: pathname }),
      });
      setStatus(res.ok ? "done" : "error");
      if (res.ok) {
        setMessage("");
        setTimeout(() => { setOpen(false); setStatus("idle"); }, 1500);
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <>
      {/* 플로팅 버튼 */}
      <button
        onClick={() => { setOpen(true); setStatus("idle"); }}
        aria-label="피드백 보내기"
        className="fixed bottom-6 right-4 z-50 w-12 h-12 rounded-full bg-[#C00037] text-white shadow-lg shadow-[#C00037]/30 flex items-center justify-center hover:bg-[#A0002D] active:scale-95 transition-all"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* 모달 오버레이 */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-end p-4 pb-20"
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
        >
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl border border-[#E9ECEF] p-5 flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="flex items-center justify-between">
              <p className="font-bold text-[#1A1A1A] text-sm">💬 피드백 보내기</p>
              <button
                onClick={() => setOpen(false)}
                className="text-[#999] hover:text-[#333] text-lg leading-none"
                aria-label="닫기"
              >
                ×
              </button>
            </div>

            {status === "done" ? (
              <p className="text-center text-sm text-[#22c55e] py-4 font-medium">
                ✓ 피드백이 전달됐습니다. 감사합니다!
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <textarea
                  ref={textareaRef}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="불편한 점, 개선 아이디어, 오류 등 자유롭게 남겨주세요."
                  rows={4}
                  className="w-full border border-[#E9ECEF] rounded-xl px-3 py-2.5 text-sm resize-none focus:outline-none focus:border-[#C00037] focus:ring-2 focus:ring-[#C00037]/20"
                />
                {status === "error" && (
                  <p className="text-xs text-[#DC3545]">전송에 실패했습니다. 다시 시도해주세요.</p>
                )}
                <button
                  type="submit"
                  disabled={!message.trim() || status === "sending"}
                  className="bg-[#C00037] hover:bg-[#A0002D] disabled:bg-[#CCC] disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-xl text-sm transition-colors"
                >
                  {status === "sending" ? "전송 중..." : "전송하기"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
