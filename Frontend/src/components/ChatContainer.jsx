import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import { formatMessageTime } from "../lib/utils";
import { CheckCheck } from "lucide-react";

const ChatContainer = () => {
  const { messages, setMessages, addMessage, selectedUser } = useChatStore();
  const { authUser, setOnlineUsers } = useAuthStore();
  const [socket, setSocket] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const messageEndRef = useRef(null);

  // ✅ EFFECT 1: MANAGE SOCKET CONNECTION
  useEffect(() => {
    if (authUser) {
      const newSocket = io("https://chatapp-backend-4jwx.onrender.com", {
        query: { userId: authUser._id },
      });
      setSocket(newSocket);

      newSocket.on("getOnlineUsers", (users) => {
        setOnlineUsers(users);
      });

      return () => newSocket.close();
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [authUser, setOnlineUsers]);

  // ✅ EFFECT 2: MANAGE SOCKET EVENT LISTENERS
  useEffect(() => {
    if (socket) {
      socket.on("newMessage", (newMessage) => addMessage(newMessage));
      socket.on("typing", ({ senderId }) => {
        if (senderId === selectedUser?._id) setIsTyping(true);
      });
      socket.on("stopTyping", () => setIsTyping(false));
      socket.on("messagesSeen", ({ conversationId }) => {
        if (authUser._id === conversationId) {
          setMessages(messages.map(msg => ({ ...msg, seen: true })));
        }
      });

      return () => {
        socket.off("newMessage");
        socket.off("typing");
        socket.off("stopTyping");
        socket.off("messagesSeen");
      };
    }
  }, [socket, selectedUser?._id, authUser._id, messages, addMessage, setMessages]);

  // ✅ EFFECT 3: MARK MESSAGES AS SEEN
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
  
  // Auto-scrolling
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col bg-gray-900">
      <ChatHeader />
      <div className="flex-1 overflow-y-auto p-4 lg:p-6">
        {messages.map((message) => {
          const isSender = message.senderId === authUser._id;
          return (
            <div key={message._id} className={`flex items-end gap-3 my-2 ${isSender ? "justify-end" : "justify-start"}`}>
              {!isSender && (<img src={selectedUser.profilePic || "/avatar.png"} alt="profile pic" className="w-8 h-8 rounded-full object-cover self-start"/>)}
              <div className={`flex flex-col ${isSender ? "items-end" : "items-start"}`}>
                <div className={`max-w-md p-3 rounded-2xl ${isSender ? "bg-emerald-600 text-white rounded-br-none" : "bg-gray-700 text-gray-200 rounded-bl-none"}`}>
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
      {selectedUser && <MessageInput receiverId={selectedUser._id} socket={socket} />}
    </div>
  );
};

export default ChatContainer;
