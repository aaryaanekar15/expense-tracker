import { useEffect, useState } from "react";

function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({
    amount: "",
    category: "",
    date: "",
  });
  const [editId, setEditId] = useState(null);

  // 🔹 Fetch Expenses on Load
  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const res = await fetch("https://expense-tracker-3utg.onrender.com/expenses", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      setExpenses(data);
    } catch (err) {
      console.log(err);
    }
  };

  // 🔹 Handle Input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔹 Add / Update Expense
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
    } catch (err) {
      console.log(err);
    }
  };

  // 🔹 Delete Expense
  const deleteExpense = async (id) => {
    try {
      await fetch(`https://expense-tracker-3utg.onrender.com/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchExpenses();
    } catch (err) {
      console.log(err);
    }
  };

  // 🔹 Edit Expense
  const editExpense = (exp) => {
    setForm({
      amount: exp.amount,
      category: exp.category,
      date: exp.date?.split("T")[0],
    });
    setEditId(exp._id);
  };

const totalExpenses = expenses.reduce(
  (sum, item) => sum + Number(item.amount),
  0
);
 

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>

      {/* 🔹 Title */}
      <h2 style={{ textAlign: "center" }}>Expense Dashboard</h2>


      <div 
      style={{textAlign: "center",
      display: "flex",
      justifyContent: "space-between", 
      background:"#f7f2f2 ",
      borderRadius:"10px",
      padding:"5px"}}>
      <p>Total Amount: {totalExpenses}</p>
      <p>Number of Expences: {expenses.length}</p>
      </div>
      {/* 🔹 Form Section */}
      <div
        style={{
          marginTop:"20px",
          marginBottom: "20px",
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
          textAlign: "center",
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

      {/* 🔹 Expense Table */}
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
          {expenses.length === 0 ? (
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
    </div>
  );
}

export default Dashboard;