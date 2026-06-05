"use client";

type PillGroupProps = {
  options: string[];
  value: string;
  onChange: (v: string) => void;
};

export default function PillGroup({ options, value, onChange }: PillGroupProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(value === opt ? "" : opt)}
          className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors active:scale-95 ${
            value === opt
              ? "bg-[#C00037] text-white border-[#C00037]"
              : "bg-white text-[#1A1A1A] border-[#E9ECEF] hover:border-[#C00037] hover:text-[#C00037]"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}
