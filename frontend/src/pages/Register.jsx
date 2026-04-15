
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

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

      setLoading(true);

      const res = await fetch(
        "https://expense-tracker-3utg.onrender.com/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, password }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        alert("Registration successful");
        navigate("/login");
      } else {
        alert(data.message || "Failed, try again");
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundColor:"black" }}
    >
      <Card className="w-95 shadow-xl bg-white/90 backdrop-blur-md">
        
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            Create Account
          </CardTitle>
          <p className="text-sm text-gray-500">
            Register to start tracking expenses
          </p>
        </CardHeader>

        <CardContent className="space-y-4">

          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Password</Label>
            <Input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button
            className="w-full"
            onClick={handleregister}
            disabled={loading}
          >
            {loading ? "Creating account..." : "Register"}
          </Button>

          <p className="text-center text-sm">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-blue-600 cursor-pointer hover:underline"
            >
              Login
            </span>
          </p>

        </CardContent>
      </Card>
    </div>
  );
}

export default Register;