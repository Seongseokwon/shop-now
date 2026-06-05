export function generateCoupangLink(keyword: string): string {
  const partnerId = process.env.NEXT_PUBLIC_COUPANG_PARTNER_ID ?? "";

  if (!partnerId && process.env.NODE_ENV === "development") {
    console.warn(
      "[coupang] NEXT_PUBLIC_COUPANG_PARTNER_ID is not set. " +
        "Coupang links will be generated without a partner ID."
    );
  }

  // keyword가 falsy이면 빈 문자열로 처리해 ?q=undefined 방지
  const safeKeyword = keyword || "";
  const encodedKeyword = encodeURIComponent(safeKeyword);
  return `https://www.coupang.com/np/search?q=${encodedKeyword}&ref=s2s_${partnerId}`;
}
