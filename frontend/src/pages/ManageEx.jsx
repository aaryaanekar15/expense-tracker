import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function ManageEx() {
  const navigate = useNavigate();

  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({
    amount: "",
    category: "",
    date: "",
  });

  const [editId, setEditId] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const settingsRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }
    fetchExpenses();
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (settingsRef.current && !settingsRef.current.contains(e.target)) {
        setSettingsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const fetchExpenses = async () => {
    const res = await fetch(
      "https://expense-tracker-3utg.onrender.com/expenses",
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      },
    );
    const data = await res.json();
    setExpenses(Array.isArray(data) ? data : []);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // HANDLE INPUT
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ADD OR UPDATE
  const handleSubmit = async () => {
    if (!form.amount || !form.category || !form.date) {
      alert("All fields required");
      return;
    }

    const url = editId
      ? `https://expense-tracker-3utg.onrender.com/update/${editId}`
      : "https://expense-tracker-3utg.onrender.com/add-expense";

    const method = editId ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(form),
    });

    setForm({ amount: "", category: "", date: "" });
    setEditId(null);
    fetchExpenses();
  };

  const handleHome = async() => {
    await navigate("/dashboard");
  }

  // DELETE
  const handleDelete = async (id) => {
    await fetch(`https://expense-tracker-3utg.onrender.com/delete/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    fetchExpenses();
  };

  // EDIT
  const handleEdit = (exp) => {
    setForm({
      amount: exp.amount,
      category: exp.category,
      date: exp.date?.split("T")[0],
    });
    setEditId(exp._id);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 text-gray-900">
      {/* NAVBAR */}
      <nav className="bg-black text-white px-4 sm:px-6 h-14 flex items-center justify-between relative">
        <span className="text-lg font-semibold cursor-pointer" onClick={handleHome}>Expense Tracker</span>

        <div ref={settingsRef} className="relative">
          <button
            onClick={() => setSettingsOpen((o) => !o)}
            className="border px-3 py-1.5 rounded-lg text-sm"
          >
            Settings
          </button>

          {settingsOpen && (
            <div className="absolute right-0 top-11 w-40 bg-white text-black shadow rounded-lg p-2">
              <button
                onClick={handleLogout}
                className="text-red-500 w-full text-left px-2 py-1 hover:bg-red-50"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>
    <h2 className="text-center font-bold text-xl border-4 outline-2">Manage Expenses</h2>
      {/* MAIN */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* LEFT → FORM */}
          <div className="bg-white p-5 rounded-xl shadow flex flex-col gap-3">
            <h3 className="font-semibold">
              {editId ? "Update Expense" : "Add Expense"}
            </h3>

            <input
              type="number"
              name="amount"
              placeholder="Amount"
              value={form.amount}
              onChange={handleChange}
              className="border p-2 rounded"
            />

            <input
              type="text"
              name="category"
              placeholder="Category"
              value={form.category}
              onChange={handleChange}
              className="border p-2 rounded"
            />

            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="border p-2 rounded"
            />

            <button
              onClick={handleSubmit}
              className={`p-2 rounded text-white ${
                editId ? "bg-yellow-500" : "bg-blue-500"
              }`}
            >
              {editId ? "Update" : "Add"}
            </button>
          </div>

          {/*  RIGHT → TABLE */}
          <div className="bg-white p-4 rounded-xl shadow">
            <h3 className="font-semibold mb-3">All Expenses</h3>

            <div className="overflow-auto max-h-100">
              <table className="w-full text-sm border">
                <thead className="bg-gray-100 sticky top-0">
                  <tr>
                    <th className="p-2 border">Amount</th>
                    <th className="p-2 border">Category</th>
                    <th className="p-2 border">Date</th>
                    <th className="p-2 border">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {expenses.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center p-3">
                        No data
                      </td>
                    </tr>
                  ) : (
                    expenses.map((exp) => (
                      <tr key={exp._id}>
                        <td className="p-2 border">₹{exp.amount}</td>
                        <td className="p-2 border">{exp.category}</td>
                        <td className="p-2 border">{exp.date?.split("T")[0]}</td>
                        <td className="p-2 border flex gap-2 justify-center">
                          <button
                            onClick={() => handleEdit(exp)}
                            className="text-blue-500"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => handleDelete(exp._id)}
                            className="text-red-500"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
      {/* FOOTER */}
      <footer className="text-center py-4 text-xs text-gray-400 border-t border-gray-200">
        Track expenses fast and securely
      </footer>
    </div>
  );
}

export default ManageEx;
