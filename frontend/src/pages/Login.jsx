import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handlelogin = async () => {
    try {
      if (!email || !password) {
        alert("All fields are mandatory!");
        return;
      }

      setLoading(true); // START LOADING

      const res = await fetch("https://expense-tracker-3utg.onrender.com/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        alert("Login failed");
        setLoading(false); // STOP LOADING
        return;
      }

      const data = await res.json();

      if (data.token) { 
        localStorage.setItem("token", data.token);
        
        navigate("/dashboard");
      } else {
        alert(data.message || "Invalid credentials");
      }

    } catch (error) {
      console.log(error);
      alert("Something went wrong!");
    } finally {
      setLoading(false); // ALWAYS STOP
    }
  };

  return (
    <div
      className="h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundColor: "black" }}
    >
      <Card className="w-[380px] shadow-xl bg-white/90 backdrop-blur-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            Expense Tracker
          </CardTitle>
          <p className="text-sm text-gray-500">Login to continue</p>
        </CardHeader>

        <CardContent className="space-y-4">

          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading} // disable input
            />
          </div>

          <div className="space-y-2">
            <Label>Password</Label>
            <Input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading} // disable input
            />
          </div>

          {/* BUTTON WITH LOADING */}
          <Button
            className="w-full flex items-center justify-center gap-2"
            onClick={handlelogin}
            disabled={loading}
          >
            {loading && (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            )}
            {loading ? "Logging in..." : "Login"}
          </Button>

          <p className="text-center text-sm">
            Don’t have an account?{" "}
            <span
              onClick={() => !loading && navigate("/register")}
              className="text-blue-600 cursor-pointer hover:underline"
            >
              Register
            </span>
          </p>

        </CardContent>
      </Card>
    </div>
  );
}

export default Login;