import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { FcAddImage } from "react-icons/fc";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import { IoSend } from "react-icons/io5";
// --- 1. Import your theme store and color map ---
import { useThemeStore } from "../store/useThemeStore";
import { ACCENT_COLOR_MAP } from "../constants";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const { sendMessage } = useChatStore();

  // --- 2. Get the current accent color from the store ---
  const { accent } = useThemeStore();
  const accentClasses = ACCENT_COLOR_MAP[accent] || ACCENT_COLOR_MAP["Emerald"]; // Fallback to Emerald

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && !file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    try {
      await sendMessage({
        text: text.trim(),
        image: imagePreview,
      });
      setText("");
      removeImage();
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message");
    }
  };

  return (
    <div className="p-4 bg-gray-800 border-t border-gray-700">
      {imagePreview && (
        <div className="relative w-20 mb-3">
          <img
            src={imagePreview}
            alt="Preview"
            className="w-full h-20 object-cover rounded-lg border border-gray-600"
          />
          <button
            onClick={removeImage}
            className="absolute -top-2 -right-2 p-1 bg-gray-700 rounded-full text-white hover:bg-gray-600 transition-colors"
            type="button"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="relative flex items-center">
        <button
          type="button"
          className="absolute left-3 p-2 rounded-full hover:bg-gray-600 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <FcAddImage size={24} />
        </button>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleImageChange}
        />

        <input
          type="text"
          className={`w-full bg-gray-700 rounded-full py-3 pl-14 pr-24 text-white placeholder-gray-400 focus:outline-none focus:ring-2 ${accentClasses.ring}`}
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        {/* --- 3. Apply the dynamic accent color classes to the send button --- */}
        <button
          type="submit"
          className={`absolute right-2 ${accentClasses.primary} ${accentClasses.hover} transition-colors rounded-full p-3 text-white disabled:bg-gray-500 disabled:cursor-not-allowed`}
          disabled={!text.trim() && !imagePreview}
        >
          <IoSend className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
