// This object maps the accent name to all the specific Tailwind CSS classes we need.
export const ACCENT_COLOR_MAP = {
  Emerald: {
    name: "Emerald",
    primary: "bg-emerald-600",
    hover: "hover:bg-emerald-700",
    ring: "ring-emerald-500",
    text: "text-emerald-400",
  },
  Blue: {
    name: "Blue",
    primary: "bg-blue-600",
    hover: "hover:bg-blue-700",
    ring: "ring-blue-500",
    text: "text-blue-400",
  },
  Rose: {
    name: "Rose",
    primary: "bg-rose-600",
    hover: "hover:bg-rose-700",
    ring: "ring-rose-500",
    text: "text-rose-400",
  },
  Indigo: {
    name: "Indigo",
    primary: "bg-indigo-600",
    hover: "hover:bg-indigo-700",
    ring: "ring-indigo-500",
    text: "text-indigo-400",
  },
  Amber: {
    name: "Amber",
    primary: "bg-amber-600",
    hover: "hover:bg-amber-700",
    ring: "ring-amber-500",
    text: "text-amber-400",
  },
};

// We create an array from the map to make it easy to loop over in our component.
export const ACCENT_COLORS_ARRAY = Object.values(ACCENT_COLOR_MAP);

// Keep your preview messages here or import them if they are elsewhere.
export const PREVIEW_MESSAGES = [
  { id: 1, content: "Hey! How's it going?", isSent: false },
  {
    id: 2,
    content: "I'm doing great! Just working on some new features.",
    isSent: true,
  },
];
