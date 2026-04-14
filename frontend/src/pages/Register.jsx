import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleregister = async () => {
    try {
      if (!name || !email || !password) {
        alert("All fields are mandatory");
        return;
      }

      if (password.length < 6) {
        alert("Password must be at least 6 characters");
        return;
      }

      const res = await fetch("https://expense-tracker-3utg.onrender.com/register", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ name, email, password }),
});

const data = await res.json();

if (res.ok) {
  console.log("success", data);
  alert("Registration successful");
  navigate("/login");
} else {
  alert(data.message || "Failed, try again");
}
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  };

  return (
    <div style={{ textAlign: "center", display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        textAlign: "center",

        backgroundImage: "url('/mainbkg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",

        overflow: "hidden", }}>
      <h2>Registration Page</h2>

      <input
        type="text"
        placeholder="name"
        onChange={(e) => setName(e.target.value)}
      />
      <br /><br />

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

      <button onClick={handleregister}>Register</button>
    </div>
  );
}

export default Register;