import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { InvoiceTemplate, TemplateLine } from "../types/templates";

const STORAGE_KEY = "falah-templates-v2";
const LEGACY_STORAGE_KEY = "falah-templates-v1";

interface TemplatesContextValue {
  templates: InvoiceTemplate[];
  getTemplate: (id: string) => InvoiceTemplate | undefined;
  saveTemplate: (name: string, lines: TemplateLine[]) => InvoiceTemplate;
  updateTemplate: (id: string, name: string, lines: TemplateLine[]) => void;
  deleteTemplate: (id: string) => void;
}

const TemplatesContext = createContext<TemplatesContextValue | null>(null);

function migrateTemplateLines(
  lines: Array<TemplateLine & { packCount?: number }>
): TemplateLine[] {
  return lines.map((line) => ({
    productId: line.productId,
    packId: line.packId ?? "",
    quantity: line.quantity ?? line.packCount ?? 1,
    unitNetWeight: line.unitNetWeight,
    unitGrossWeight: line.unitGrossWeight,
    pricePerKg: line.pricePerKg,
    supplier: line.supplier,
  }));
}

function loadTemplates(): InvoiceTemplate[] {
  try {
    const raw =
      localStorage.getItem(STORAGE_KEY) ??
      localStorage.getItem(LEGACY_STORAGE_KEY);
    if (raw) {
      const templates = (JSON.parse(raw) as InvoiceTemplate[]).map(
        (template) => ({
          ...template,
          lines: migrateTemplateLines(template.lines),
        })
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
      if (localStorage.getItem(LEGACY_STORAGE_KEY)) {
        localStorage.removeItem(LEGACY_STORAGE_KEY);
      }
      return templates;
    }
  } catch {
    // fall through
  }
  return [];
}

export function TemplatesProvider({ children }: { children: ReactNode }) {
  const [templates, setTemplates] = useState<InvoiceTemplate[]>(loadTemplates);

  const persist = useCallback((next: InvoiceTemplate[]) => {
    setTemplates(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const getTemplate = useCallback(
    (id: string) => templates.find((t) => t.id === id),
    [templates]
  );

  const saveTemplate = useCallback(
    (name: string, lines: TemplateLine[]) => {
      const template: InvoiceTemplate = {
        id: crypto.randomUUID(),
        name: name.trim(),
        lines,
        createdAt: new Date().toISOString(),
      };
      persist([template, ...templates]);
      return template;
    },
    [templates, persist]
  );

  const updateTemplate = useCallback(
    (id: string, name: string, lines: TemplateLine[]) => {
      persist(
        templates.map((t) =>
          t.id === id ? { ...t, name: name.trim(), lines } : t
        )
      );
    },
    [templates, persist]
  );

  const deleteTemplate = useCallback(
    (id: string) => {
      persist(templates.filter((t) => t.id !== id));
    },
    [templates, persist]
  );

  const value = useMemo(
    () => ({
      templates,
      getTemplate,
      saveTemplate,
      updateTemplate,
      deleteTemplate,
    }),
    [templates, getTemplate, saveTemplate, updateTemplate, deleteTemplate]
  );

  return (
    <TemplatesContext.Provider value={value}>
      {children}
    </TemplatesContext.Provider>
  );
}

export function useTemplates() {
  const ctx = useContext(TemplatesContext);
  if (!ctx) {
    throw new Error("useTemplates must be used within TemplatesProvider");
  }
  return ctx;
}
