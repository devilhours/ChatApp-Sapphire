import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { FcAddImage } from "react-icons/fc";
import { IoSend } from "react-icons/io5";
import { X } from "lucide-react";

import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { useThemeStore } from "../store/useThemeStore";
import { ACCENT_COLOR_MAP } from "../constants";

const MessageInput = ({ receiverId, socket }) => {
  const [text, setText] = useState("");
  const { sendMessage } = useChatStore();
  const typingTimeoutRef = useRef(null);

  const { accent } = useThemeStore();
  const accentClasses = ACCENT_COLOR_MAP[accent] || ACCENT_COLOR_MAP["Emerald"];

  const handleTextChange = (e) => {
    setText(e.target.value);
    if (socket) {
      socket.emit("typing", { receiverId });
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit("stopTyping", { receiverId });
      }, 2000);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    try {
      await sendMessage({
        text: text.trim(),
        receiverId: receiverId,
      });
      setText("");
    } catch (error) {
      toast.error("Failed to send message.");
    }
  };

  return (
    <div className="p-4 bg-gray-800 border-t border-gray-700">
      <form onSubmit={handleSendMessage} className="relative flex items-center">
        {/* We'll keep the image upload UI simple for this example */}
        <input
          type="text"
          className={`w-full bg-gray-700 rounded-full py-3 pl-4 pr-14 text-white placeholder-gray-400 focus:outline-none focus:ring-2 ${accentClasses.ring}`}
          placeholder="Type a message..."
          value={text}
          onChange={handleTextChange}
        />
        <button
          type="submit"
          className={`absolute right-2 ${accentClasses.primary} ${accentClasses.hover} transition-colors rounded-full p-3 text-white disabled:bg-gray-500 disabled:cursor-not-allowed`}
          disabled={!text.trim()}
        >
          <IoSend className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
