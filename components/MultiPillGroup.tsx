"use client";

type MultiPillGroupProps = {
  options: string[];
  values: string[];
  onChange: (v: string) => void;
};

export default function MultiPillGroup({ options, values, onChange }: MultiPillGroupProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const selected = values.includes(opt);
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors active:scale-95 ${
              selected
                ? "bg-[#C00037] text-white border-[#C00037]"
                : "bg-white text-[#1A1A1A] border-[#E9ECEF] hover:border-[#C00037] hover:text-[#C00037]"
            }`}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}
