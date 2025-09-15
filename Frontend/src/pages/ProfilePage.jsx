import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import toast from "react-hot-toast";
// --- MODIFIED: Using consistent icons and adding new ones ---
import { TbLoader2 } from "react-icons/tb";
import { Mail, User, Camera, Calendar, Edit, X } from "lucide-react";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();

  // State for managing edit mode and form input
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(authUser?.fullName || "");
  const [selectedImg, setSelectedImg] = useState(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      // 2MB limit
      return toast.error("File is too large (max 2MB).");
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image); // Show preview instantly
      await updateProfile({ profilePic: base64Image });
    };
    reader.onerror = () => {
      toast.error("Failed to read the image file.");
    };
  };

  const handleProfileUpdate = async () => {
    if (!fullName.trim()) return toast.error("Full name cannot be empty.");
    try {
      await updateProfile({ fullName });
      setIsEditing(false); // Exit edit mode on success
    } catch (error) {
      // The store already shows a toast on error
      console.error("Profile update failed:", error);
    }
  };

  // Safely format the date for "Member Since"
  const memberSince = authUser?.createdAt
    ? new Date(authUser.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Not available";

  // Loading state for when authUser hasn't loaded yet
  if (!authUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <TbLoader2 className="w-8 h-8 animate-spin text-emerald-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4 pt-20">
      <div className="w-full max-w-2xl mx-auto bg-gray-800 rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center text-white mb-8">
          My Profile
        </h1>

        {/* Avatar Upload Section */}
        <div className="flex flex-col items-center gap-4 mb-8">
          <div className="relative">
            <img
              src={selectedImg || authUser.profilePic || "/avatar.png"}
              alt="Profile Avatar"
              className="w-32 h-32 rounded-full object-cover border-4 border-gray-700"
            />
            {isUpdatingProfile && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-full">
                <TbLoader2 className="w-8 h-8 animate-spin text-emerald-400" />
              </div>
            )}
            <label
              htmlFor="avatar-upload"
              className="absolute -bottom-2 -right-2 bg-emerald-600 p-2 rounded-full cursor-pointer hover:bg-emerald-700 transition-transform duration-200 hover:scale-110"
            >
              <Camera className="w-5 h-5 text-white" />
              <input
                type="file"
                id="avatar-upload"
                className="hidden"
                accept="image/png, image/jpeg"
                onChange={handleImageUpload}
                disabled={isUpdatingProfile}
              />
            </label>
          </div>
        </div>

        {/* User Details Section */}
        <div className="space-y-5">
          {/* Full Name (conditionally an input field) */}
          <div>
            <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
              <User size={16} /> Full Name
            </label>
            {isEditing ? (
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="mt-1 w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
              />
            ) : (
              <div className="mt-1 p-3 w-full bg-gray-700 border border-transparent rounded-md">
                {authUser.fullName}
              </div>
            )}
          </div>

          {/* Email and Member Since Fields */}
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
                <Mail size={16} /> Email Address
              </label>
              <div className="mt-1 p-3 w-full bg-gray-700 border border-transparent rounded-md text-gray-300">
                {authUser.email}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
                <Calendar size={16} /> Member Since
              </label>
              <div className="mt-1 p-3 w-full bg-gray-700 border border-transparent rounded-md text-gray-300">
                {memberSince}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-end gap-3">
          {isEditing ? (
            <>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setFullName(authUser.fullName);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500 text-sm font-semibold"
              >
                <X size={16} /> Cancel
              </button>
              <button
                onClick={handleProfileUpdate}
                disabled={isUpdatingProfile}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:opacity-50 text-sm font-semibold"
              >
                {isUpdatingProfile ? (
                  <TbLoader2 className="animate-spin" />
                ) : (
                  "Save Changes"
                )}
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-semibold"
            >
              <Edit size={16} /> Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
