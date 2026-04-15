
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function Main() {
  const navigate = useNavigate();

  return (
    <div
      className="h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundColor:"black" }}
    >
      <Card className="w-[420px] text-center shadow-xl bg-white/90 backdrop-blur-md">
        
        <CardHeader>
          <CardTitle className="text-3xl font-bold">
            Expense Tracker
          </CardTitle>
          <p className="text-gray-600 text-sm mt-2">
            Track your expenses smartly & stay in control 💰
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          
          <Button
            className="w-full text-lg"
            onClick={() => navigate("/login")}
          >
            Start Tracking
          </Button>

          <p className="text-xs text-gray-500">
            Simple • Fast • Clean Finance Tracker
          </p>

        </CardContent>
      </Card>
    </div>
  );
}

export default Main;
