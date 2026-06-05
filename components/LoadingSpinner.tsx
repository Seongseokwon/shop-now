export default function LoadingSpinner() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="콘텐츠 로딩 중"
      className="flex flex-col items-center gap-3 py-12"
    >
      <div
        aria-hidden="true"
        className="w-10 h-10 border-4 border-[#E9ECEF] border-t-[#C00037] rounded-full animate-spin"
      />
      <p className="text-[#666666] text-sm">AI가 분석 중입니다...</p>
    </div>
  );
}
