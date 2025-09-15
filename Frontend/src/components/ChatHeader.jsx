import { X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const isOnline = onlineUsers.includes(selectedUser._id);

  return (
    // --- MODIFIED: Main container with dark theme styles ---
    <div className="p-4 bg-gray-800 border-b border-gray-700 flex items-center justify-between">
      {/* --- MODIFIED: Increased gap for better spacing --- */}
      <div className="flex items-center gap-4">
        {/* --- MODIFIED: Avatar with a live status indicator --- */}
        <div className="relative">
          <img
            src={selectedUser.profilePic || "/avatar.png"}
            alt={selectedUser.fullName}
            className="w-10 h-10 rounded-full object-cover"
          />
          <span
            className={`
              absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-gray-800
              ${isOnline ? "bg-green-500" : "bg-gray-500"}
            `}
            title={isOnline ? "Online" : "Offline"}
          />
        </div>

        {/* User info */}
        <div>
          <h3 className="font-semibold text-white text-lg">
            {selectedUser.fullName}
          </h3>
          <p className="text-xs text-gray-400">
            {isOnline ? "Online" : "Offline"}
          </p>
        </div>
      </div>

      {/* --- MODIFIED: Styled the close button for better UX --- */}
      <button
        onClick={() => setSelectedUser(null)}
        className="p-2 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
        aria-label="Close chat"
      >
        <X size={20} />
      </button>
    </div>
  );
};
export default ChatHeader;
