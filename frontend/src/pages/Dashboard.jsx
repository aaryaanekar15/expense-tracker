import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [total, setTotal] = useState(0); 
  const [form, setForm] = useState({
    amount: "",
    category: "",
    date: "",
  });
  const [editId, setEditId] = useState(null);
  const navigate = useNavigate();

  // ✅ CHECK LOGIN + FETCH
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      navigate("/"); 
      return;
    }

    fetchExpenses();
    fetchTotal(); 
  }, []);

  //  FETCH EXPENSES
  const fetchExpenses = async () => {
    try {
      const res = await fetch("https://expense-tracker-3utg.onrender.com/expenses", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) {
        console.log("Error:", res.status);
        setExpenses([]);
        return;
      }

      const data = await res.json();

      if (Array.isArray(data)) {
        setExpenses(data);
      } else {
        setExpenses([]);
      }
    } catch (err) {
      console.log(err);
      setExpenses([]);
    }
  };

  //  FETCH TOTAL
  const fetchTotal = async () => {
    try {
      const res = await fetch("https://expense-tracker-3utg.onrender.com/total-expense", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();
      setTotal(data.total || 0);
    } catch (err) {
      console.log("Error fetching total:", err);
    }
  };

  //  HANDLE INPUT
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // LOGOUT
  const handleLogout = () => {
    try {
      localStorage.clear();
      navigate("/login");
    } catch (err) {
      console.log("Logout error:", err);
    }
  };

  //  ADD / UPDATE
  const handleSubmit = async () => {
    try {
      if (editId) {
        await fetch(`https://expense-tracker-3utg.onrender.com/update/${editId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(form),
        });
        setEditId(null);
      } else {
        await fetch("https://expense-tracker-3utg.onrender.com/add-expense", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(form),
        });
      }

      setForm({ amount: "", category: "", date: "" });
      fetchExpenses();
      fetchTotal(); 
    } catch (err) {
      console.log(err);
    }
  };

  // DELETE
  const deleteExpense = async (id) => {
    try {
      await fetch(`https://expense-tracker-3utg.onrender.com/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      fetchExpenses();
      fetchTotal(); //  UPDATE TOTAL
    } catch (err) {
      console.log(err);
    }
  };

  // EDIT
  const editExpense = (exp) => {
    setForm({
      amount: exp.amount,
      category: exp.category,
      date: exp.date?.split("T")[0],
    });
    setEditId(exp._id);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>

      <h2 style={{ textAlign: "center" }}>Expense Dashboard</h2>

      {/*  TOTAL DISPLAY */}
      <h3 style={{ textAlign: "center", marginTop: "10px" }}>
        Total Expenses: ₹{total}
      </h3>

      {/* FORM */}
      <div
        style={{
          marginTop: "20px",
          marginBottom: "20px",
          display: "flex",
          justifyContent: "space-between",
          gap: "10px",
          flexWrap: "wrap",
        }}
      >
        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={form.amount}
          onChange={handleChange}
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
        />
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
        />
        <button onClick={handleSubmit}>
          {editId ? "Update" : "Add"}
        </button>
      </div>

      {/* TABLE */}
      <table width="100%" border="1" cellPadding="10">
        <thead style={{ background: "#ddd" }}>
          <tr>
            <th>Amount</th>
            <th>Category</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {!Array.isArray(expenses) || expenses.length === 0 ? (
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>
                No expenses found
              </td>
            </tr>
          ) : (
            expenses.map((exp) => (
              <tr key={exp._id}>
                <td>₹{exp.amount}</td>
                <td>{exp.category}</td>
                <td>{exp.date?.split("T")[0]}</td>
                <td>
                  <button onClick={() => editExpense(exp)}>Edit</button>
                  <button onClick={() => deleteExpense(exp._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <button
        style={{
          marginTop: "10px",
          cursor: "pointer",
          borderRadius: "5px",
          backgroundColor: "#9a9898",
        }}
        onClick={handleLogout}
      >
        LOGOUT
      </button>
    </div>
  );
}

export default Dashboard;