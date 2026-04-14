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

      const res = await fetch("https://expense-tracker-3utg.onrender.com/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      // ✅ check if response is valid
      if (!res.ok) {
        alert("Login failed");
        return;
      }

      const data = await res.json();

      // ✅ SAVE TOKEN (MOST IMPORTANT)
      if (data.token) {
        localStorage.setItem("token", data.token);

        console.log("Saved Token:", data.token); // debug

        alert("Login successful");

        navigate("/dashboard");
      } else {
        alert(data.message || "Invalid credentials");
      }

    } catch (error) {
      console.log(error);
      alert("Something went wrong!");
    }
  };

  return (
    <div style={{ textAlign: "center", backgroundColor: "beige", padding: "20px" }}>
      <h1>EXPENSE TRACKER</h1>
      <h2>Login Page</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br /><br />

      <input
        type="password"
        placeholder="Password"
        value={password}
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