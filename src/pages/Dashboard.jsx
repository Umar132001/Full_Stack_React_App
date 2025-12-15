import { useEffect, useState } from "react";

export default function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/user/profile", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setUser(data));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6">
        {/* Header */}
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Dashboard
        </h2>

        {!user ? (
          <p className="text-center text-gray-500">Loading profile...</p>
        ) : (
          <>
            {/* Avatar */}
            <div className="flex justify-center mb-4">
              <div className="h-20 w-20 rounded-full bg-indigo-500 flex items-center justify-center text-white text-2xl font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
            </div>

            {/* User Info */}
            <div className="text-center space-y-2">
              <p className="text-lg font-semibold text-gray-700">{user.name}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>

            {/* Divider */}
            <hr className="my-6" />

            {/* Actions */}
            <button
              className="w-full bg-red-500 cursor-pointer text-white py-2 rounded-lg font-medium hover:bg-red-600 transition"
              onClick={() => {
                localStorage.removeItem("token");
                window.location.href = "/login";
              }}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </div>
  );
}
