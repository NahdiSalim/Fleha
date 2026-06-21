import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: string;
  icon: ReactNode;
  accent?: "primary" | "accent";
  delay?: number;
}

export default function StatCard({
  label,
  value,
  icon,
  accent = "primary",
  delay = 0,
}: StatCardProps) {
  const gradient =
    accent === "primary"
      ? "from-brand-500 to-brand-700"
      : "from-falah-accent to-falah-accent-dark";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 transition hover:shadow-md"
    >
      <div
        className={`absolute -right-4 -top-4 h-24 w-24 rounded-full bg-gradient-to-br ${gradient} opacity-10 transition group-hover:opacity-20`}
      />
      <div className="relative flex items-center gap-4">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} text-white shadow-lg`}
        >
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
          <p className="truncate text-xl font-bold text-gray-900 dark:text-white">{value}</p>
        </div>
      </div>
    </motion.div>
  );
}
