import { MessageCircle } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

const NoChatSelected = () => {
  const { authUser } = useAuthStore();
  // A nice touch to personalize the welcome message
  const firstName = authUser?.fullName.split(" ")[0] || "";

  return (
    // --- MODIFIED: Main container using the dark theme background ---
    <div className="flex-1 w-full flex flex-col items-center justify-center p-10 bg-gray-900 text-white">
      <div className="max-w-md text-center space-y-4">
        {/* --- MODIFIED: Consistent icon with theme colors --- */}
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center">
            <MessageCircle className="w-10 h-10 text-emerald-400" />
          </div>
        </div>

        {/* --- MODIFIED: Personalized welcome text --- */}
        <h2 className="text-3xl font-bold text-gray-100">
          Welcome, {firstName}!
        </h2>
        <p className="text-gray-400">
          Please select a conversation from the sidebar to start chatting.
        </p>
      </div>
    </div>
  );
};

export default NoChatSelected;
