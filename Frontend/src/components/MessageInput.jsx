import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { FcAddImage } from "react-icons/fc";
import { IoSend } from "react-icons/io5";
import { X } from "lucide-react";

import { useChatStore } from "../store/useChatStore";
import { useSocket } from "../lib/SocketContextProvider";
import { useThemeStore } from "../store/useThemeStore";
import { ACCENT_COLOR_MAP } from "../constants";

const MessageInput = ({ receiverId }) => {
  // --- Component State ---
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // --- Hooks & Stores ---
  const { sendMessage } = useChatStore();
  const socket = useSocket();
  const { accent } = useThemeStore();
  const accentClasses = ACCENT_COLOR_MAP[accent] || ACCENT_COLOR_MAP["Emerald"];

  // --- Event Handlers ---

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      return toast.error("Please select an image file.");
    }
    if (file.size > 2 * 1024 * 1024) { // 2MB limit
      return toast.error("File is too large (max 2MB).");
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleTextChange = (e) => {
    setText(e.target.value);

    if (socket) {
      // Emit "typing" event to the server
      socket.emit("typing", { receiverId });

      // Clear any existing timeout to avoid sending "stopTyping" prematurely
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Set a new timeout. If the user doesn't type for 2 seconds, emit "stopTyping".
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit("stopTyping", { receiverId });
      }, 2000);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    try {
      await sendMessage({
        text: text.trim(),
        image: imagePreview,
        receiverId: receiverId,
      });

      // Clear the form completely after sending
      setText("");
      removeImage();
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message.");
    }
  };

  return (
    <div className="p-4 bg-gray-800 border-t border-gray-700">
      {/* Image Preview Section */}
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

      {/* Main Form */}
      <form onSubmit={handleSendMessage} className="relative flex items-center">
        {/* Image Upload Button & Hidden Input */}
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

        {/* Text Input */}
        <input
          type="text"
          className={`w-full bg-gray-700 rounded-full py-3 pl-14 pr-24 text-white placeholder-gray-400 focus:outline-none focus:ring-2 ${accentClasses.ring}`}
          placeholder="Type a message..."
          value={text}
          onChange={handleTextChange}
        />

        {/* Send Button */}
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
