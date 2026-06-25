import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface KhazinaHeroCardProps {
  label: string;
  value: string;
  icon: ReactNode;
  delay?: number;
}

export default function KhazinaHeroCard({
  label,
  value,
  icon,
  delay = 0,
}: KhazinaHeroCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-3xl border border-brand-200/60 bg-gradient-to-br from-brand-500 via-brand-600 to-brand-700 p-8 shadow-xl shadow-brand-500/25 dark:border-brand-500/30"
    >
      <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
      <div className="absolute -bottom-16 -right-8 h-48 w-48 rounded-full bg-falah-accent/20" />
      <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-wider text-white/80">
            {label}
          </p>
          <p className="mt-2 text-4xl font-bold text-white md:text-5xl">{value}</p>
        </div>
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-white backdrop-blur-sm">
          {icon}
        </div>
      </div>
    </motion.div>
  );
}
