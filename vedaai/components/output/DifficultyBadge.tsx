import { Difficulty } from "@/types";
import clsx from "clsx";

const config: Record<Difficulty, { label: string; className: string }> = {
  easy: { label: "Easy", className: "bg-emerald-50 text-emerald-600 border-emerald-200" },
  moderate: { label: "Moderate", className: "bg-amber-50 text-amber-600 border-amber-200" },
  challenging: { label: "Challenging", className: "bg-red-50 text-red-600 border-red-200" },
};

export default function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  const { label, className } = config[difficulty];
  return (
    <span
      className={clsx(
        "inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-full border",
        className
      )}
    >
      {label}
    </span>
  );
}
