interface CoupangButtonProps {
  url: string;
}

export default function CoupangButton({ url }: CoupangButtonProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer nofollow"
      className="block w-full text-center bg-[#C00037] hover:bg-[#A0002D] text-white font-medium py-2.5 px-4 rounded-lg transition-colors text-sm"
    >
      쿠팡에서 최저가 확인 →
    </a>
  );
}
