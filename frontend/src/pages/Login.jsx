import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handlelogin = async () => {
    try {
      if (!email || !password) {
        alert("All fields are mandatory!");
        return;
      }

      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      // ✅ FIX: Check token
      if (data.token) {
        localStorage.setItem("token", data.token); // 🔥 IMPORTANT
        alert("Login successful");
        navigate("/dashboard"); // match your route
      } else {
        alert(data.message || "Invalid credentials");
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong!");
    }
  };

  return (
    <div style={{ textAlign: "center", backgroundColor: "beige" }}>
      <h1>EXPENSE TRACKER</h1>
      <h2>Login Page</h2>

      <input
        type="email"
        placeholder="email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <br /><br />

      <input
        type="password"
        placeholder="password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <br /><br />

      <button onClick={handlelogin}>Login</button>

      <hr />

      <p>
        Don't have an account?{" "}
        <span
          onClick={() => navigate("/register")}
          style={{ color: "blue", cursor: "pointer" }}
        >
          Register
        </span>
      </p>
    </div>
  );
}

export default Login;