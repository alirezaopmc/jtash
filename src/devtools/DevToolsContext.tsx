import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  type DevConfig,
  defaultConfig,
  type OptionValue,
  optionGroups,
} from "./options";

const STORAGE_KEY = "portfolio-devtools-v2";

type Ctx = {
  config: DevConfig;
  set: (key: string, value: OptionValue) => void;
  reset: () => void;
  enabled: boolean;
};

const DevToolsContext = createContext<Ctx | null>(null);

function load(): DevConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...defaultConfig, ...JSON.parse(raw) } : defaultConfig;
  } catch {
    return defaultConfig;
  }
}

export function DevToolsProvider({ children }: { children: ReactNode }) {
  // Hidden unless explicitly requested and there is something to tweak.
  const enabled =
    new URLSearchParams(location.search).has("dev") && optionGroups.length > 0;
  const [config, setConfig] = useState<DevConfig>(() =>
    enabled ? load() : defaultConfig,
  );

  useEffect(() => {
    if (!enabled) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch {
      /* storage unavailable */
    }
  }, [config, enabled]);

  const set = useCallback(
    (key: string, value: OptionValue) =>
      setConfig((c) => ({ ...c, [key]: value })),
    [],
  );
  const reset = useCallback(() => setConfig(defaultConfig), []);
  const value = useMemo(
    () => ({ config, set, reset, enabled }),
    [config, set, reset, enabled],
  );
  return (
    <DevToolsContext.Provider value={value}>
      {children}
    </DevToolsContext.Provider>
  );
}

export function useDevTools() {
  const ctx = useContext(DevToolsContext);
  if (!ctx) throw new Error("useDevTools must be used inside DevToolsProvider");
  return ctx;
}

export function useConfig() {
  return useDevTools().config;
}
