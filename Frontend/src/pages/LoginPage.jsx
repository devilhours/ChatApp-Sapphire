import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { MessageCircle, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { TbLoader2 } from "react-icons/tb";

// --- 1. Import your theme store and color map ---
import { useThemeStore } from "../store/useThemeStore";
import { ACCENT_COLOR_MAP } from "../constants";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { login, isLoggingIn } = useAuthStore();
  // --- 2. Get the current accent color from the store ---
  const { accent } = useThemeStore();
  const accentClasses = ACCENT_COLOR_MAP[accent] || ACCENT_COLOR_MAP["Emerald"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return toast.error("Both fields are required");
    }
    login(formData);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
      <div className="flex w-full max-w-4xl mx-auto overflow-hidden bg-gray-800 rounded-lg shadow-lg">
        {/* === Left Side - Branding (hidden on mobile) === */}
        <div className="hidden md:flex flex-col items-center justify-center w-1/2 bg-gray-800 p-8 border-r border-gray-700">
          <div className="bg-emerald-500/10 p-4 rounded-full mb-4">
            {/* --- 3. Apply the dynamic accent color text class --- */}
            <MessageCircle className={`h-16 w-16 ${accentClasses.text}`} />
          </div>
          <h1 className="text-3xl font-bold text-white">Welcome Back!</h1>
          <p className="mt-2 text-gray-400">Sign in to continue to Sapphire.</p>
        </div>

        {/* === Right Side - Form === */}
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-2xl font-bold text-center text-white mb-6">
            Login to Your Account
          </h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <div>
              <label className="text-sm font-medium text-gray-400">
                Email Address
              </label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-gray-500" />
                </div>
                <input
                  type="email"
                  name="email"
                  className={`w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-1 focus:border-transparent ${accentClasses.ring}`}
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="text-sm font-medium text-gray-400">
                Password
              </label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-gray-500" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className={`w-full pl-10 pr-10 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-1 focus:border-transparent ${accentClasses.ring}`}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-300"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* --- 4. Apply the dynamic accent color classes to the button --- */}
            <button
              type="submit"
              className={`w-full flex justify-center items-center gap-2 py-2.5 px-4 text-sm font-semibold rounded-lg text-white ${accentClasses.primary} ${accentClasses.hover} disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <>
                  <TbLoader2 className="w-5 h-5 animate-spin" />
                  <span>Logging In...</span>
                </>
              ) : (
                "Login"
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="text-center mt-6">
            <p className="text-sm text-gray-400">
              Don{"'"}t have an account?{" "}
              {/* --- 5. Apply the dynamic accent color text class to the link --- */}
              <Link
                to="/signup"
                className={`font-medium ${accentClasses.text} hover:underline`}
              >
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;
