import { useNavigate } from "react-router-dom";

function Main() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        textAlign: "center",

        backgroundImage: "url('/mainbkg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",

        overflow: "hidden",
      }}
    >
      <h2>Welcome to Expense Tracker</h2>
      <button onClick={() => navigate("/login")}>Start Tracking!</button>
    </div>
  );
}

export default Main;
