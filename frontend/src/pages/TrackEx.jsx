import { useEffect, useRef, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

function TrackEx() {
  const navigate = useNavigate();

  const [expenses, setExpenses] = useState([]);
  const [total, setTotal] = useState(0);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const settingsRef = useRef(null);

  //  FILTER STATES
  const [categoryFilter, setCategoryFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }
    fetchExpenses();
    fetchTotal();
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
    const res = await fetch("https://expense-tracker-3utg.onrender.com/expenses", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    const data = await res.json();
    setExpenses(Array.isArray(data) ? data : []);
  };

  const fetchTotal = async () => {
    const res = await fetch("https://expense-tracker-3utg.onrender.com/total-expense", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    const data = await res.json();
    setTotal(data.total || 0);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // FILTERED DATA
  const filteredExpenses = useMemo(() => {
    return expenses.filter((e) => {
      const matchCategory = categoryFilter
        ? e.category.toLowerCase().includes(categoryFilter.toLowerCase())
        : true;

      const matchDate = dateFilter ? e.date === dateFilter : true;

      return matchCategory && matchDate;
    });
  }, [expenses, categoryFilter, dateFilter]);

   const handleHome = async() => {
    await navigate("/dashboard");
  }

  //  PIE DATA BASED ON FILTER
  const pieData = useMemo(() => {
    const map = {};
    filteredExpenses.forEach((e) => {
      map[e.category] = (map[e.category] || 0) + Number(e.amount);
    });
    return Object.keys(map).map((k) => ({ name: k, value: map[k] }));
  }, [filteredExpenses]);

  const COLORS = ["#7C6FDE", "#1D9E75", "#EF9F27", "#E24B4A", "#378ADD"];

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 text-gray-900">

      {/* NAVBAR */}
      <nav className="bg-black text-white px-4 sm:px-6 h-14 flex items-center justify-between relative z-50">
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

        <h2 className="text-center font-bold text-xl border-4 outline-2">Track Expenses</h2>


      {/* MAIN */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-6">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* ✅ LEFT SIDE → TABLE */}
          <div className="bg-white p-4 rounded-xl shadow">

            <h3 className="font-semibold mb-3">Expenses</h3>

            {/* FILTERS */}
            <div className="flex flex-col sm:flex-row gap-2 mb-4">
              <input
                type="text"
                placeholder="Filter by category"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="border px-2 py-1 rounded w-full"
              />

              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="border px-2 py-1 rounded"
              />
            </div>

            {/* TABLE */}
            <div className="overflow-auto max-h-100">
              <table className="w-full text-sm border">
                <thead className="bg-gray-100 sticky top-0">
                  <tr>
                    <th className="p-2 border">Amount</th>
                    <th className="p-2 border">Category</th>
                    <th className="p-2 border">Date</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredExpenses.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="text-center p-3">
                        No data
                      </td>
                    </tr>
                  ) : (
                    filteredExpenses.map((exp) => (
                      <tr key={exp._id}>
                        <td className="p-2 border">₹{exp.amount}</td>
                        <td className="p-2 border">{exp.category}</td>
                        <td className="p-2 border">{exp.date?.split("T")[0]}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/*  RIGHT SIDE → CHART */}
          <div className="bg-white p-4 rounded-xl shadow">
            <h3 className="font-semibold mb-3">Expense Breakdown</h3>

            {pieData.length === 0 ? (
              <p className="text-gray-400 text-center mt-10">No data</p>
            ) : (
              <div className="h-64">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={pieData} dataKey="value">
                      {pieData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
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

export default TrackEx;