import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { signupSchema } from "../validation/validation";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Signup() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(signupSchema),
  });

  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.message || "Signup failed");
        return;
      }

      // ✅ Signup success → redirect to login
      navigate("/login");
    } catch (err) {
      setError("Server error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Create Account</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            className="w-full p-2 border rounded mb-1"
            placeholder="Name"
            {...register("name")}
          />
          <p className="text-red-500 text-sm mb-2">{errors.name?.message}</p>

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
            className="w-full bg-blue-600 text-white py-2 rounded mt-2 hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? "Creating account..." : "Signup"}
          </button>
        </form>

        <p className="text-center mt-4 text-sm">
          Already have an account?
          <Link to="/login" className="text-green-600 underline ml-1">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
