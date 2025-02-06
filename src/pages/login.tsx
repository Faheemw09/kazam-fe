import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import { useAuth } from "../context/AuthContext";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [apiErrorMessage, setApiErrorMessage] = useState<string>("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError("");
    setPasswordError("");
    setApiErrorMessage("");
    let isValid = true;

    if (!email) {
      setEmailError("Email is required.");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Email is invalid.");
      isValid = false;
    }

    if (!password) {
      setPasswordError("Password is required.");
      isValid = false;
    }

    if (!isValid) return;

    setLoading(true);
    try {
      await login(email, password);
      message.success("Login successful!");
      navigate("/dashboard");
    } catch (err: any) {
      if (err.response?.data?.message === "Email Not Found") {
        setEmailError("Email does not exist. Please check and try again.");
      } else if (err.response?.data?.message === "Incorrect password") {
        setPasswordError("The password you entered is incorrect.");
      } else {
        setApiErrorMessage(
          err.response?.data?.message || "An unexpected error occurred."
        );
      }
      message.error("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
      <div className="max-w-screen-xl m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1">
        <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
          <div className="mt-12 flex flex-col items-center">
            <h1 className="text-4xl font-medium text-gray-600">Sign In Here</h1>
            <form
              className="mx-auto max-w-xs w-full mt-8"
              onSubmit={handleLogin}
            >
              <input
                className="w-full px-8 py-4 rounded-lg bg-gray-100 border placeholder-gray-500 text-sm focus:outline-none"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              {emailError && (
                <p className="text-red-500 text-xs">{emailError}</p>
              )}

              <input
                className="w-full px-8 py-4 rounded-lg bg-gray-100 border placeholder-gray-500 text-sm focus:outline-none mt-5"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {passwordError && (
                <p className="text-red-500 text-xs">{passwordError}</p>
              )}
              {apiErrorMessage && (
                <p className="text-red-500 text-xs">{apiErrorMessage}</p>
              )}

              <button
                type="submit"
                className="mt-5 w-full py-4 rounded-lg bg-green-400 text-white hover:bg-green-700 transition-all"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>
            <p className="mt-4 text-sm text-gray-600">
              Don’t have an account?{" "}
              <span
                className="text-blue-500 hover:underline cursor-pointer"
                onClick={() => navigate("/signup")}
              >
                Sign Up
              </span>
            </p>
          </div>
        </div>
        <div className="flex-1 bg-green-100 hidden lg:flex">
          <div
            className="w-full bg-contain bg-center bg-no-repeat"
            style={{
              backgroundImage:
                "url('https://img.freepik.com/free-photo/sign-user-password-privacy-concept_53876-120316.jpg')",
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Login;
