import { useParams } from "react-router-dom";
import { useState } from "react";

function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState("");

  const handleReset = async () => {
    const res = await fetch(`https://expense-tracker-3utg.onrender.com/reset-password/${token}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ password })
    });

    const data = await res.json();
    alert(data.message);
  };

  return (
    <div className="h-screen flex justify-center items-center">
      <div className="p-6 bg-white shadow rounded">
        <h2 className="text-xl mb-4">Reset Password</h2>

        <input
          type="password"
          placeholder="New Password"
          className="border p-2 mb-4 w-full"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleReset} className="bg-green-500 text-white p-2 w-full cursor-pointer">
          Reset Password
        </button>
      </div>
    </div>
  );
}

export default ResetPassword;