import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users } from "lucide-react";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } =
    useChatStore();
  const { onlineUsers, authUser } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  // Filter out the currently logged-in user from the list
  const otherUsers = users.filter((user) => user._id !== authUser._id);

  const filteredUsers = showOnlineOnly
    ? otherUsers.filter((user) => onlineUsers.includes(user._id))
    : otherUsers;

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    // --- MODIFIED: Main container with dark theme styles ---
    <aside className="h-full w-20 lg:w-72 bg-gray-800 border-r border-gray-700 flex flex-col transition-all duration-300 ease-in-out">
      {/* Sidebar Header */}
      <div className="border-b border-gray-700 w-full p-4">
        <div className="flex items-center gap-2">
          <Users className="size-6 text-gray-300" />
          <span className="font-bold text-white hidden lg:block">Contacts</span>
        </div>

        {/* --- MODIFIED: Custom Switch Toggle for Online Filter --- */}
        <div className="mt-4 hidden lg:flex items-center justify-between">
          <label
            htmlFor="online-toggle"
            className="text-sm text-gray-300 cursor-pointer"
          >
            Online only
          </label>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">
              ({onlineUsers.length - 1})
            </span>
            <label
              htmlFor="online-toggle"
              className="relative inline-flex items-center cursor-pointer"
            >
              <input
                type="checkbox"
                id="online-toggle"
                className="sr-only peer"
                checked={showOnlineOnly}
                onChange={(e) => setShowOnlineOnly(e.target.checked)}
              />
              <div className="w-9 h-5 bg-gray-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* User List */}
      <div className="flex-1 overflow-y-auto py-2">
        {filteredUsers.map((user) => {
          const isSelected = selectedUser?._id === user._id;
          const isOnline = onlineUsers.includes(user._id);

          return (
            <button
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className={`
                w-full p-2 lg:p-3 flex items-center gap-3 transition-colors justify-center lg:justify-start
                ${isSelected ? "bg-emerald-500/10" : "hover:bg-gray-700/50"}
              `}
            >
              <div className="relative">
                <img
                  src={user.profilePic || "/avatar.png"}
                  alt={user.fullName}
                  className="size-12 object-cover rounded-full"
                />
                {isOnline && (
                  <span
                    className={`absolute bottom-0 right-0 size-3 rounded-full ring-2 ${
                      isSelected
                        ? "bg-green-400 ring-emerald-500/10"
                        : "bg-green-500 ring-gray-800"
                    }`}
                  />
                )}
              </div>

              {/* User info - hidden on small screens */}
              <div className="hidden lg:block text-left min-w-0">
                <div
                  className={`font-semibold truncate ${
                    isSelected ? "text-white" : "text-gray-200"
                  }`}
                >
                  {user.fullName}
                </div>
                <div className="text-sm text-gray-400">
                  {isOnline ? "Online" : "Offline"}
                </div>
              </div>
            </button>
          );
        })}

        {filteredUsers.length === 0 && (
          <div className="text-center text-gray-500 py-4 hidden lg:block">
            No users online
          </div>
        )}
      </div>
    </aside>
  );
};
export default Sidebar;
