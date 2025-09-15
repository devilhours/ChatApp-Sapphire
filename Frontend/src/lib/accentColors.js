// This object maps the accent name from your store to the specific Tailwind CSS classes.
export const ACCENT_COLOR_MAP = {
  Emerald: {
    primary: "bg-emerald-600",
    hover: "hover:bg-emerald-700",
    ring: "ring-emerald-500",
    text: "text-emerald-400",
  },
  Blue: {
    primary: "bg-blue-600",
    hover: "hover:bg-blue-700",
    ring: "ring-blue-500",
    text: "text-blue-400",
  },
  Rose: {
    primary: "bg-rose-600",
    hover: "hover:bg-rose-700",
    ring: "ring-rose-500",
    text: "text-rose-400",
  },
  Indigo: {
    primary: "bg-indigo-600",
    hover: "hover:bg-indigo-700",
    ring: "ring-indigo-500",
    text: "text-indigo-400",
  },
  Amber: {
    primary: "bg-amber-600",
    hover: "hover:bg-amber-700",
    ring: "ring-amber-500",
    text: "text-amber-400",
  },
};

// Also, update the THEMES constant to match this structure if it's in a different file.
export const THEMES = Object.keys(ACCENT_COLOR_MAP);
