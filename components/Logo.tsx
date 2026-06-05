import Link from "next/link";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showWordmark?: boolean;
}

export default function Logo({ size = "md", showWordmark = true }: LogoProps) {
  const iconSize = { sm: 28, md: 36, lg: 56 }[size];
  const textClass = {
    sm: "text-base",
    md: "text-xl",
    lg: "text-3xl",
  }[size];

  return (
    <Link href="/" className="flex items-center gap-2 select-none">
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Shopping bag body */}
        <rect x="6" y="13" width="24" height="18" rx="3" fill="#C00037" />
        {/* Bag handle */}
        <path
          d="M13 13V10C13 7.239 15.239 5 18 5C20.761 5 23 7.239 23 10V13"
          stroke="#C00037"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        {/* AI spark — lightning bolt */}
        <path
          d="M20 17L16.5 22H19.5L16 29L21.5 22.5H18.5L20 17Z"
          fill="white"
          strokeLinejoin="round"
        />
      </svg>

      {showWordmark && (
        <span className={`font-bold tracking-tight leading-none ${textClass}`}>
          <span className="text-[#C00037]">Shop</span>
          <span className="text-[#1A1A1A]"> Now</span>
        </span>
      )}
    </Link>
  );
}
