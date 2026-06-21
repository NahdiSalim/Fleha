import { getPackBadgeClass } from "../../utils/sellCalculations";

interface PackBadgeProps {
  packName: string;
  size?: "xs" | "sm";
}

export default function PackBadge({ packName, size = "sm" }: PackBadgeProps) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-md px-1.5 py-0.5 font-semibold uppercase tracking-wide ${getPackBadgeClass(packName)} ${
        size === "xs" ? "text-[8px]" : "text-[10px]"
      }`}
    >
      {packName}
    </span>
  );
}
