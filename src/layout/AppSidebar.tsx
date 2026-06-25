import { Link, useLocation } from "react-router";

import { GridIcon, GroupIcon, HorizontaLDots, BoxIcon, BoxCubeIcon, UserCircleIcon, PaperPlaneIcon, FileIcon, DollarLineIcon, FolderIcon, DocsIcon, LockIcon } from "../icons";
import { useSidebar } from "../context/SidebarContext";
import { t } from "../i18n";

const navItems = [
  { nameKey: "nav.dashboard", path: "/", icon: GridIcon },
  { nameKey: "nav.khazina", path: "/khazina", icon: DollarLineIcon },
  { nameKey: "nav.sell", path: "/sell", icon: PaperPlaneIcon },
  {
    nameKey: "nav.pawn",
    path: "/mou3alja-bil-rhan",
    icon: LockIcon,
  },
  {
    nameKey: "nav.sellFollowup",
    path: "/moutaba3t-bay3-el-badha2i3",
    icon: DocsIcon,
  },
  { nameKey: "nav.templates", path: "/templates", icon: FileIcon },
  { nameKey: "nav.clients", path: "/clients", icon: GroupIcon },
  { nameKey: "nav.packs", path: "/packs", icon: BoxIcon },
  { nameKey: "nav.products", path: "/products", icon: BoxCubeIcon },
  { nameKey: "nav.suppliers", path: "/suppliers", icon: UserCircleIcon },
  { nameKey: "nav.tasalom", path: "/tasalom-bidha3a", icon: FolderIcon },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();

  const isActive = (path: string) =>
    path === "/"
      ? location.pathname === "/"
      : location.pathname.startsWith(path);

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 right-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 dark:text-gray-100 h-screen transition-all duration-300 ease-in-out z-50 border-l border-gray-200 
        ${
          isExpanded || isMobileOpen
            ? "w-[290px]"
            : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link to="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <img
                className="dark:hidden"
                src="/images/logo/logo.svg"
                alt={t("app.name")}
                width={120}
                height={32}
              />
              <img
                className="hidden dark:block"
                src="/images/logo/logo-dark.svg"
                alt={t("app.name")}
                width={120}
                height={32}
              />
            </>
          ) : (
            <img
              src="/images/logo/logo-icon.svg"
              alt={t("app.name")}
              width={32}
              height={32}
            />
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div>
            <h2
              className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                !isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "justify-start"
              }`}
            >
              {isExpanded || isHovered || isMobileOpen ? (
                t("nav.menu")
              ) : (
                <HorizontaLDots className="size-6" />
              )}
            </h2>
            <ul className="flex flex-col gap-4">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`menu-item group ${
                      isActive(item.path)
                        ? "menu-item-active"
                        : "menu-item-inactive"
                    }`}
                  >
                    <span
                      className={`menu-item-icon-size ${
                        isActive(item.path)
                          ? "menu-item-icon-active"
                          : "menu-item-icon-inactive"
                      }`}
                    >
                      <item.icon />
                    </span>
                    {(isExpanded || isHovered || isMobileOpen) && (
                      <span className="menu-item-text">{t(item.nameKey)}</span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
