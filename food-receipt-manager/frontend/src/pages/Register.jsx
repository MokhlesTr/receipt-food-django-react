import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../features/authSlice";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading } = useSelector(state => state.auth);

  const handleSubmit = async e => {
    e.preventDefault();
    const resultAction = await dispatch(registerUser(formData));
    if (registerUser.fulfilled.match(resultAction)) {
      toast.success("Registration successful! Please login.");
      navigate("/login");
    } else {
      toast.error("Registration failed.");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative py-12 px-4 sm:px-6 lg:px-8 bg-cover bg-center transition-colors duration-200"
      style={{
        backgroundImage:
          'url("https://www.decoraid.com/wp-content/uploads/2021/04/small-kitchen-design-scaled-958x575.jpeg")',
      }}
    >
      <div className="absolute inset-0 bg-white/20 backdrop-blur-sm z-0"></div>

      <div className="max-w-md w-full space-y-8 bg-white/90 p-10 rounded-3xl shadow-2xl border border-white/50 relative z-10 backdrop-blur-md">
        <div className="text-center flex flex-col items-center">
          <img
            src="https://al-makhzan.com/Logo%20Al-makhzen.png"
            alt="Al-makhzen Logo"
            className="h-28 w-auto mb-4"
          />
          <p className="mt-2 text-sm text-gray-600">
            Create an account to track your inventory
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Username
              </label>
              <input
                type="text"
                required
                className="mt-1 block w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:text-white transition-all"
                value={formData.username}
                onChange={e =>
                  setFormData({ ...formData, username: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <input
                type="password"
                required
                className="mt-1 block w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:text-white transition-all"
                value={formData.password}
                onChange={e =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-primary hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all disabled:opacity-50"
          >
            {isLoading ? "Registering..." : "Register"}
          </button>
        </form>
        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-primary hover:text-blue-500 dark:text-blue-400 transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
