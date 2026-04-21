import { useState } from "react";

function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = async () => {
    const res = await fetch("https://expense-tracker-3utg.onrender.com/forgot-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email })
    });

    const data = await res.json();
    alert(data.message);
  };

  return (
    <div className="h-screen flex justify-center items-center bg-black">
      <div className="p-6 bg-white shadow rounded">
        <h2 className="text-xl mb-4">Forgot Password</h2>

        <input
          type="email"
          placeholder="Enter email"
          className="border p-2 mb-4 w-full"
          onChange={(e) => setEmail(e.target.value)}
        />

        <button onClick={handleSubmit} className="bg-blue-500 text-white p-2 w-full cursor-pointer ">
          Send Reset Link
        </button>
      </div>
    </div>
  );
}

export default ForgotPassword;