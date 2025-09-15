import { useThemeStore } from "../store/useThemeStore";
import { Send, Check } from "lucide-react";
// --- 1. Import the constants from your central file ---
import {
  ACCENT_COLOR_MAP,
  ACCENT_COLORS_ARRAY,
  PREVIEW_MESSAGES,
} from "../lib/constants";

const SettingsPage = () => {
  const { accent, setAccent } = useThemeStore();
  // --- 2. Use the map for quick lookup of the selected accent's classes ---
  const selectedAccentClasses =
    ACCENT_COLOR_MAP[accent] || ACCENT_COLOR_MAP["Emerald"];

  return (
    <div className="min-h-screen flex justify-center bg-gray-900 text-white p-4 pt-24">
      <div className="w-full max-w-4xl mx-auto space-y-10">
        <div>
          <h1 className="text-3xl font-bold text-white">Appearance</h1>
          <p className="text-gray-400 mt-1">
            Customize the interface to your liking.
          </p>
        </div>

        {/* Accent Color Selection */}
        <div className="p-6 bg-gray-800 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold text-white">Accent Color</h3>
          <p className="text-sm text-gray-400 mt-1">
            Choose a color for buttons, highlights, and sent messages.
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-4 mt-4">
            {/* --- 3. Map over the imported array --- */}
            {ACCENT_COLORS_ARRAY.map((colorTheme) => (
              <button
                key={colorTheme.name}
                onClick={() => setAccent(colorTheme.name)}
                className="flex flex-col items-center gap-2 p-2 rounded-lg hover:bg-gray-700/50 transition-colors"
              >
                <div
                  className={`w-10 h-10 rounded-full ${
                    colorTheme.primary
                  } flex items-center justify-center ${
                    accent === colorTheme.name
                      ? `ring-2 ring-offset-2 ring-offset-gray-800 ${colorTheme.ring}`
                      : ""
                  }`}
                >
                  {accent === colorTheme.name && (
                    <Check className="w-6 h-6 text-white" />
                  )}
                </div>
                <span className="text-xs font-medium text-gray-300">
                  {colorTheme.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Live Preview Section */}
        <div className="p-6 bg-gray-800 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold mb-4 text-white">
            Live Preview
          </h3>
          <div className="rounded-xl border border-gray-700 overflow-hidden bg-gray-900 max-w-lg mx-auto">
            {/* Mock Chat Header */}
            <div className="p-3 border-b border-gray-700 flex items-center gap-3">
              {/* --- 4. Use the full class object for styling the preview --- */}
              <div
                className={`w-8 h-8 rounded-full ${selectedAccentClasses.primary} flex items-center justify-center text-white font-bold text-sm`}
              >
                J
              </div>
              <div>
                <h3 className="font-semibold text-sm text-white">John Doe</h3>
                <p className="text-xs text-gray-400">Online</p>
              </div>
            </div>

            {/* Mock Chat Messages */}
            <div className="p-4 space-y-4 h-48 overflow-y-auto">
              {PREVIEW_MESSAGES.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.isSent ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-xl p-3 text-sm ${
                      message.isSent
                        ? `${selectedAccentClasses.primary} text-white`
                        : "bg-gray-700 text-gray-200"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
            </div>

            {/* Mock Chat Input */}
            <div className="p-3 border-t border-gray-700">
              <div className="relative flex items-center">
                <input
                  type="text"
                  className={`w-full bg-gray-700 rounded-full py-2 pl-4 pr-12 text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-1 ${selectedAccentClasses.ring}`}
                  value="This is a preview"
                  readOnly
                />
                <button
                  className={`absolute right-1.5 ${selectedAccentClasses.primary} rounded-full p-2 text-white`}
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SettingsPage;
