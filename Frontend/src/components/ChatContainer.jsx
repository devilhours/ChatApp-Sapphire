import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef } from "react";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";
import { useThemeStore } from "../store/useThemeStore";
import { ACCENT_COLOR_MAP } from "../constants";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);
  const { accent } = useThemeStore();
  const accentClasses = ACCENT_COLOR_MAP[accent];

  useEffect(() => {
    getMessages(selectedUser._id);
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [
    selectedUser._id,
    getMessages,
    subscribeToMessages,
    unsubscribeFromMessages,
  ]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col bg-gray-900">
      <ChatHeader />
      <div className="flex-1 overflow-y-auto p-4 lg:p-6">
        {messages.map((message) => {
          const isSender = message.senderId === authUser._id;
          const profilePic = isSender
            ? authUser.profilePic
            : selectedUser.profilePic;
          return (
            <div
              key={message._id}
              className={`flex items-end gap-3 my-2 ${
                isSender ? "justify-end" : "justify-start"
              }`}
            >
              {!isSender && (
                <img
                  src={profilePic || "/avatar.png"}
                  alt="profile pic"
                  className="w-8 h-8 rounded-full object-cover self-start"
                />
              )}
              <div
                className={`flex flex-col ${
                  isSender ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`max-w-md lg:max-w-xl p-3 rounded-2xl ${
                    isSender
                      ? `${accentClasses.primary} text-white rounded-br-none`
                      : "bg-gray-700 text-gray-200 rounded-bl-none"
                  }`}
                >
                  {message.image && (
                    <img
                      src={message.image}
                      alt="Attachment"
                      className="max-w-[250px] rounded-md mb-2"
                    />
                  )}
                  {message.text && <p>{message.text}</p>}
                </div>
                <time className="text-xs text-gray-500 mt-1">
                  {formatMessageTime(message.createdAt)}
                </time>
              </div>
            </div>
          );
        })}
        <div ref={messageEndRef} />
      </div>
      <MessageInput />
    </div>
  );
};
export default ChatContainer;
