import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { MessageCircle, LogOut, LogIn, Settings } from "lucide-react";
import { useThemeStore } from "../store/useThemeStore";
import { ACCENT_COLOR_MAP } from "../constants";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();
  const { accent } = useThemeStore();
  const accentClasses = ACCENT_COLOR_MAP[accent];

  return (
    <header className="fixed w-full top-0 z-40 backdrop-blur-lg bg-gray-800/70 border-b border-gray-700">
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          <Link
            to="/"
            className="flex items-center gap-2.5 hover:opacity-80 transition-all"
          >
            <div
              className={`size-9 rounded-full bg-emerald-500/10 flex items-center justify-center`}
            >
              <MessageCircle className={`w-5 h-5 ${accentClasses.text}`} />
            </div>
            <h1 className="text-xl font-bold text-white">Sapphire</h1>
          </Link>

          <div className="flex items-center gap-2">
            {authUser ? (
              <>
                <Link
                  to={"/settings"}
                  className="p-2 rounded-full text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                  aria-label="Settings"
                >
                  <Settings size={20} />
                </Link>
                <Link
                  to={"/profile"}
                  className="flex items-center gap-2 p-1 pr-3 rounded-full text-sm text-gray-200 hover:bg-gray-700 transition-colors"
                >
                  <img
                    src={authUser.profilePic || "/avatar.png"}
                    alt="Your Profile"
                    className="w-8 h-8 rounded-full object-cover border-2 border-gray-600"
                  />
                  <span className="hidden sm:inline font-medium">
                    {authUser.fullName.split(" ")[0]}
                  </span>
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 p-2 rounded-lg text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                  aria-label="Logout"
                >
                  <LogOut size={18} />
                </button>
              </>
            ) : (
              <>
                <Link
                  to={"/login"}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                >
                  <LogIn size={16} /> Login
                </Link>
                {/* Apply dynamic accent color to the Sign Up button */}
                <Link
                  to={"/signup"}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white ${accentClasses.primary} ${accentClasses.hover} transition-colors`}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
export default Navbar;
