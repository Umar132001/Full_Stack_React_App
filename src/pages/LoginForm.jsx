import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "../validation/validation";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.message || "Login failed");
        return;
      }

      // ✅ SUCCESS
      localStorage.setItem("token", result.token);
      navigate("/dashboard");
    } catch (err) {
      setError("Server error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            className="w-full p-2 border rounded mb-1"
            placeholder="Email"
            {...register("email")}
          />
          <p className="text-red-500 text-sm mb-2">{errors.email?.message}</p>

          <input
            className="w-full p-2 border rounded mb-1"
            type="password"
            placeholder="Password"
            {...register("password")}
          />
          <p className="text-red-500 text-sm mb-2">
            {errors.password?.message}
          </p>

          {error && (
            <p className="text-red-600 text-sm mb-2 text-center">{error}</p>
          )}

          <button
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 rounded mt-2 cursor-pointer hover:bg-green-700 disabled:bg-gray-400"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center mt-4 text-sm">
          Don’t have an account?
          <Link to="/signup" className="text-blue-600 underline ml-1">
            Signup
          </Link>
        </p>
      </div>
    </div>
  );
}
