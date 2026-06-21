import { motion } from "framer-motion";
import { Link } from "react-router";
import {
  BoxCubeIcon,
  GroupIcon,
  PaperPlaneIcon,
  UserCircleIcon,
} from "../../icons";
import { t } from "../../i18n";

const actions = [
  {
    labelKey: "nav.sell",
    descKey: "dashboard.sellDesc",
    path: "/sell",
    icon: PaperPlaneIcon,
    color: "from-brand-500 to-brand-600",
  },
  {
    labelKey: "nav.clients",
    descKey: "dashboard.clientsDesc",
    path: "/clients",
    icon: GroupIcon,
    color: "from-brand-500 to-brand-700",
  },
  {
    labelKey: "nav.products",
    descKey: "dashboard.productsDesc",
    path: "/products",
    icon: BoxCubeIcon,
    color: "from-falah-accent to-falah-accent-dark",
  },
  {
    labelKey: "nav.suppliers",
    descKey: "dashboard.suppliersDesc",
    path: "/suppliers",
    icon: UserCircleIcon,
    color: "from-emerald-500 to-emerald-700",
  },
];

export default function QuickActions() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
    >
      <h2 className="mb-4 font-semibold text-gray-900 dark:text-white">{t("dashboard.quickActions")}</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {actions.map((action) => (
          <Link
            key={action.path}
            to={action.path}
            className="group flex items-center gap-3 rounded-xl border border-gray-100 p-3 transition hover:border-brand-200 hover:bg-brand-50/30"
          >
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${action.color} text-white shadow-sm`}
            >
              <action.icon className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-brand-600">
                {t(action.labelKey)}
              </p>
              <p className="text-xs text-gray-500">{t(action.descKey)}</p>
            </div>
          </Link>
        ))}
      </div>
    </motion.div>
  );
}
