import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { FcAddImage } from "react-icons/fc";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import { IoSend } from "react-icons/io5";
import { useSocket } from "../lib/SocketContextProvider";

const MessageInput = ({ receiverId }) => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const { sendMessage } = useChatStore();
  const socket = useSocket();

  const handleChange = (e) => {
    setText(e.target.value);
    if (socket) {
      // Emit typing event
      socket.emit("typing", { receiverId });

      // Clear previous timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Set a new timeout to emit stopTyping
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

      setText("");
      // handle image removal logic
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="p-4 bg-gray-800 border-t border-gray-700">
      {/* Image preview JSX remains the same */}
      <form onSubmit={handleSendMessage} className="relative flex items-center">
        {/* Image upload button remains the same */}
        <input
          type="text"
          className="w-full bg-gray-700 rounded-full py-3 pl-14 pr-24 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          placeholder="Type a message..."
          value={text}
          onChange={handleChange}
        />
        <button
          type="submit"
          className="absolute right-2 bg-emerald-600 hover:bg-emerald-700 transition-colors rounded-full p-3 text-white disabled:bg-gray-500"
          disabled={!text.trim() && !imagePreview}
        >
          <IoSend className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
