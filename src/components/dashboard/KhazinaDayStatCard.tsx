import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface KhazinaDayStatCardProps {
  label: string;
  value: string;
  icon: ReactNode;
  tone?: "in" | "out" | "neutral" | "accent";
  delay?: number;
}

const toneClasses = {
  in: "from-emerald-500/10 to-emerald-600/5 border-emerald-100 text-emerald-700 dark:border-emerald-900/40 dark:text-emerald-400",
  out: "from-red-500/10 to-red-600/5 border-red-100 text-red-600 dark:border-red-900/40 dark:text-red-400",
  neutral: "from-brand-500/10 to-brand-600/5 border-brand-100 text-brand-700 dark:border-brand-900/40 dark:text-brand-300",
  accent: "from-falah-accent/10 to-falah-accent/5 border-falah-accent/20 text-falah-accent dark:border-falah-accent/30",
};

const iconToneClasses = {
  in: "bg-emerald-500 text-white",
  out: "bg-red-500 text-white",
  neutral: "bg-brand-500 text-white",
  accent: "bg-falah-accent text-white",
};

export default function KhazinaDayStatCard({
  label,
  value,
  icon,
  tone = "neutral",
  delay = 0,
}: KhazinaDayStatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={`rounded-2xl border bg-gradient-to-br p-6 shadow-sm dark:bg-gray-900 ${toneClasses[tone]}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
          <p className={`mt-2 truncate text-2xl font-bold md:text-3xl ${tone !== "neutral" && tone !== "accent" ? "" : ""}`}>
            {value}
          </p>
        </div>
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl shadow-md ${iconToneClasses[tone]}`}
        >
          {icon}
        </div>
      </div>
    </motion.div>
  );
}
