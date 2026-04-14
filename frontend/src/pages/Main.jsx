import { useNavigate } from "react-router-dom";

function Main() {
    const navigate = useNavigate();

    return (
        <div style={{ textAlign: "center" }}>
            <h2>welcome to expense tracker</h2>
            <button onClick={() => navigate("/login")}>
                start tracking!
            </button>
        </div>
    );
}

export default Main;