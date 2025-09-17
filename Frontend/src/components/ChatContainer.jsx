import { useEffect, useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { useSocket } from "../lib/SocketContextProvider"; // Corrected import path
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import { formatMessageTime } from "../lib/utils";
import { CheckCheck } from "lucide-react";

const ChatContainer = () => {
  // --- THIS IS THE FIX: Added 'addMessage' to the destructuring ---
  const { messages, setMessages, addMessage, selectedUser } = useChatStore();
  
  const { authUser } = useAuthStore();
  const socket = useSocket();
  const messageEndRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);

  // Effect for auto-scrolling
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Effect for handling all socket events
  useEffect(() => {
    if (socket) {
      socket.on("newMessage", (newMessage) => {
        // Now 'addMessage' is a function and this will work correctly
        addMessage(newMessage);
      });

      socket.on("typing", ({ senderId }) => {
        if (senderId === selectedUser?._id) setIsTyping(true);
      });
      socket.on("stopTyping", () => setIsTyping(false));

      socket.on("messagesSeen", ({ conversationId }) => {
        if (selectedUser?._id === conversationId) {
          setMessages(prevMessages =>
            prevMessages.map(msg => ({ ...msg, seen: true }))
          );
        }
      });

      // Cleanup listeners on component unmount
      return () => {
        socket.off("newMessage");
        socket.off("typing");
        socket.off("stopTyping");
        socket.off("messagesSeen");
      };
    }
  }, [socket, selectedUser?._id, addMessage, setMessages]);

  // Effect to mark messages as seen
  useEffect(() => {
    if (socket && messages.length > 0) {
      const unread = messages.some(msg => !msg.seen && msg.senderId === selectedUser._id);
      if (unread) {
        socket.emit("markAsSeen", {
          conversationId: selectedUser._id,
          userId: authUser._id,
        });
      }
    }
  }, [socket, selectedUser?._id, authUser._id, messages]);

  return (
    <div className="flex-1 flex flex-col bg-gray-900">
      <ChatHeader />
      <div className="flex-1 overflow-y-auto p-4 lg:p-6">
        {messages.map((message) => {
          const isSender = message.senderId === authUser._id;
          const profilePic = isSender ? authUser.profilePic : selectedUser.profilePic;

          return (
            <div key={message._id} className={`flex items-end gap-3 my-2 ${isSender ? "justify-end" : "justify-start"}`}>
              {!isSender && (<img src={profilePic || "/avatar.png"} alt="profile pic" className="w-8 h-8 rounded-full object-cover self-start"/>)}
              <div className={`flex flex-col ${isSender ? "items-end" : "items-start"}`}>
                <div className={`max-w-md lg:max-w-xl p-3 rounded-2xl ${isSender ? "bg-emerald-600 text-white rounded-br-none" : "bg-gray-700 text-gray-200 rounded-bl-none"}`}>
                  <p>{message.text}</p>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <time className="text-xs text-gray-500">{formatMessageTime(message.createdAt)}</time>
                  {isSender && message.seen && (
                    <CheckCheck size={16} className="text-blue-400" />
                  )}
                </div>
              </div>
            </div>
          );
        })}
        {isTyping && <div className="text-gray-400 text-sm py-2">Typing...</div>}
        <div ref={messageEndRef} />
      </div>
      {selectedUser && <MessageInput receiverId={selectedUser._id} />}
    </div>
  );
};

export default ChatContainer;
