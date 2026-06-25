import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import { t } from "../../i18n";

export interface SearchableSelectOption {
  value: string;
  label: string;
  searchText?: string;
}

interface SearchableSelectProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  options: SearchableSelectOption[];
  placeholder?: string;
  emptyOption?: SearchableSelectOption;
  disabled?: boolean;
  className?: string;
  size?: "sm" | "md";
  debounceMs?: number;
}

const DEBOUNCE_MS = 3000;

export default function SearchableSelect({
  id,
  value,
  onChange,
  options,
  placeholder,
  emptyOption,
  disabled = false,
  className = "",
  size = "md",
  debounceMs = DEBOUNCE_MS,
}: SearchableSelectProps) {
  const autoId = useId();
  const selectId = id ?? autoId;
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const selectingRef = useRef(false);

  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState("");
  const [panelStyle, setPanelStyle] = useState<React.CSSProperties>({});
  const debouncedQuery = useDebouncedValue(inputText, debounceMs);
  const isSearching = inputText.trim() !== debouncedQuery.trim();

  const allOptions = useMemo(
    () => (emptyOption ? [emptyOption, ...options] : options),
    [emptyOption, options]
  );

  const selectedLabel = useMemo(() => {
    const match = allOptions.find((opt) => opt.value === value);
    return match?.label ?? "";
  }, [allOptions, value]);

  const filteredOptions = useMemo(() => {
    const query = debouncedQuery.trim().toLowerCase();
    if (!query) return allOptions;

    return allOptions.filter((opt) => {
      const haystack = `${opt.label} ${opt.searchText ?? ""}`.toLowerCase();
      return haystack.includes(query);
    });
  }, [allOptions, debouncedQuery]);

  const updatePanelPosition = useCallback(() => {
    const input = inputRef.current;
    if (!input) return;

    const rect = input.getBoundingClientRect();
    setPanelStyle({
      position: "fixed",
      top: rect.bottom + 4,
      left: rect.left,
      width: Math.max(rect.width, 200),
      zIndex: 99999,
    });
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const syncInputToValue = useCallback(() => {
    setInputText(value ? selectedLabel : "");
  }, [value, selectedLabel]);

  const commitBlur = useCallback(() => {
    close();
    const trimmed = inputText.trim();

    if (!trimmed) {
      if (emptyOption) {
        onChange("");
        setInputText("");
      } else {
        syncInputToValue();
      }
      return;
    }

    const exact = allOptions.find(
      (opt) => opt.label.toLowerCase() === trimmed.toLowerCase()
    );
    if (exact) {
      onChange(exact.value);
      setInputText(exact.label);
      return;
    }

    syncInputToValue();
  }, [inputText, emptyOption, allOptions, onChange, close, syncInputToValue]);

  useEffect(() => {
    if (!isOpen) {
      syncInputToValue();
    }
  }, [value, selectedLabel, isOpen, syncInputToValue]);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        inputRef.current?.contains(target) ||
        panelRef.current?.contains(target)
      ) {
        return;
      }
      commitBlur();
    };

    const handleReposition = () => updatePanelPosition();

    document.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("resize", handleReposition);
    window.addEventListener("scroll", handleReposition, true);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("resize", handleReposition);
      window.removeEventListener("scroll", handleReposition, true);
    };
  }, [isOpen, commitBlur, updatePanelPosition]);

  const handleFocus = () => {
    if (disabled) return;
    setIsOpen(true);
    setInputText(value ? selectedLabel : "");
    updatePanelPosition();
    requestAnimationFrame(() => inputRef.current?.select());
  };

  const handleChange = (next: string) => {
    setInputText(next);
    if (!isOpen) {
      setIsOpen(true);
      updatePanelPosition();
    }
  };

  const handleSelect = (nextValue: string) => {
    selectingRef.current = true;
    const match = allOptions.find((opt) => opt.value === nextValue);
    onChange(nextValue);
    setInputText(match?.label ?? "");
    close();
    requestAnimationFrame(() => {
      selectingRef.current = false;
      inputRef.current?.blur();
    });
  };

  const handleBlur = () => {
    window.setTimeout(() => {
      if (selectingRef.current) return;
      commitBlur();
    }, 120);
  };

  const sizeClass =
    size === "sm" ? "px-2 py-1.5 text-xs" : "px-4 py-3 text-sm";

  const panel = isOpen
    ? createPortal(
        <div
          ref={panelRef}
          style={panelStyle}
          className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900"
        >
          {isSearching && (
            <p className="border-b border-gray-100 px-3 py-1.5 text-[10px] text-gray-400 dark:border-gray-800">
              {t("searchableSelect.searching")}
            </p>
          )}
          <ul className="max-h-52 overflow-y-auto py-1" role="listbox">
            {filteredOptions.length === 0 ? (
              <li className="px-3 py-2 text-sm text-gray-400">
                {t("searchableSelect.noResults")}
              </li>
            ) : (
              filteredOptions.map((opt) => (
                <li key={opt.value || "__empty"}>
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => handleSelect(opt.value)}
                    className={`w-full px-3 py-2 text-start text-sm transition hover:bg-brand-50 dark:hover:bg-gray-800 ${
                      opt.value === value
                        ? "bg-brand-50 font-medium text-brand-700 dark:bg-brand-500/10 dark:text-brand-300"
                        : "text-gray-700 dark:text-gray-200"
                    }`}
                  >
                    {opt.label}
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>,
        document.body
      )
    : null;

  return (
    <div className="relative w-full">
      <input
        ref={inputRef}
        id={selectId}
        type="text"
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        disabled={disabled}
        value={inputText}
        placeholder={placeholder}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={(e) => handleChange(e.target.value)}
        className={`w-full rounded-xl border border-gray-200 bg-white outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-white ${sizeClass} ${className}`}
      />
      {panel}
    </div>
  );
}
