export type ShortcutAction = "fast_advance" | "chakra_chart" | "game_menu" | "close_windows";

export interface CustomKeybindings {
  fast_advance: string[];
  chakra_chart: string[];
  game_menu: string[];
  close_windows: string[];
}

export const DEFAULT_KEYBINDINGS: CustomKeybindings = {
  fast_advance: ["Space", "Enter"],
  chakra_chart: ["c"],
  game_menu: ["m"],
  close_windows: ["Escape"],
};

export function normalizeKey(key: string): string {
  if (!key) return "";
  if (key === " " || key.toLowerCase() === "space") return "Space";
  if (key.toLowerCase() === "esc") return "Escape";
  if (key.toLowerCase() === "return") return "Enter";
  return key;
}

export function formatKeyForDisplay(key: string, lang: "it" | "en" = "it"): string {
  const normalized = normalizeKey(key);
  switch (normalized) {
    case "Space":
      return lang === "it" ? "Spazio" : "Space";
    case "Enter":
      return lang === "it" ? "Invio" : "Enter";
    case "Escape":
      return "Esc";
    case "ArrowUp":
      return "↑";
    case "ArrowDown":
      return "↓";
    case "ArrowLeft":
      return "←";
    case "ArrowRight":
      return "→";
    default:
      return normalized.length === 1 ? normalized.toUpperCase() : normalized;
  }
}

export function isKeyMatchingAction(
  eventKey: string,
  action: ShortcutAction,
  customKeybindings?: CustomKeybindings
): boolean {
  if (!eventKey) return false;
  const bindings = customKeybindings || DEFAULT_KEYBINDINGS;
  const targetKeys = bindings[action] || DEFAULT_KEYBINDINGS[action] || [];
  
  const normalizedEventKey = normalizeKey(eventKey).toLowerCase();

  return targetKeys.some((k) => {
    const normalizedTarget = normalizeKey(k).toLowerCase();
    return normalizedTarget === normalizedEventKey;
  });
}
