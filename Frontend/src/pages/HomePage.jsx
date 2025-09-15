import { useChatStore } from "../store/useChatStore";

import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";

const HomePage = () => {
  const { selectedUser } = useChatStore();

  return (
    // --- MODIFIED: Main container for a full-screen layout ---
    // pt-16 offsets the content to appear below your h-16 fixed Navbar
    <main className="h-screen bg-gray-900 pt-16">
      <div className="flex h-full">
        <Sidebar />
        {/* Conditionally render the chat window or the placeholder */}
        {selectedUser ? <ChatContainer /> : <NoChatSelected />}
      </div>
    </main>
  );
};
export default HomePage;
