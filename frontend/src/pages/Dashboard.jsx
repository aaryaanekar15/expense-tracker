import { useEffect, useRef, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

function Dashboard() {
  const navigate = useNavigate();

  const [expenses, setExpenses] = useState([]);
  const [total, setTotal] = useState(0);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const settingsRef = useRef(null);

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

  const pieData = useMemo(() => {
    const map = {};
    expenses.forEach((e) => {
      map[e.category] = (map[e.category] || 0) + Number(e.amount);
    });
    return Object.keys(map).map((k) => ({ name: k, value: map[k] }));
  }, [expenses]);

  const COLORS = ["#7C6FDE", "#1D9E75", "#EF9F27", "#E24B4A", "#378ADD"];

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 text-gray-900">

      {/* NAVBAR */}
      <nav className="bg-black text-white px-4 sm:px-6 h-14 flex items-center justify-between relative z-50">
        <span className="text-lg font-semibold tracking-tight">Dashboard</span>

        <div ref={settingsRef} className="relative">
          <button
            onClick={() => setSettingsOpen((o) => !o)}
            className="flex items-center gap-2 text-sm border border-white/25 px-3 py-1.5 rounded-lg hover:bg-white/10 transition"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="7" r="2" stroke="white" strokeWidth="1.2" />
              <path
                d="M7 1v1.5M7 11.5V13M1 7h1.5M11.5 7H13M2.929 2.929l1.06 1.06M9.011 9.011l1.06 1.06M2.929 11.071l1.06-1.06M9.011 4.989l1.06-1.06"
                stroke="white"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </svg>
            <span className="hidden sm:inline">Settings</span>
          </button>

          {settingsOpen && (
            <div className="absolute right-0 top-11 w-44 rounded-xl border border-gray-200 bg-white shadow-lg py-2 px-2">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 transition"
              >
                <span>Logout</span>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M5 2H2.5A1.5 1.5 0 001 3.5v7A1.5 1.5 0 002.5 12H5M9 10l3-3-3-3M12 7H5"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col gap-6">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* LEFT: Greeting + Total + Nav Buttons */}
          <div className="flex flex-col gap-4">

            <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
              <h2 className="text-xl font-semibold mb-1">Hello! 👋</h2>
              <p className="text-sm text-gray-500 mb-4">
                Here's a snapshot of your spendings.
              </p>
              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-xs text-gray-400 mb-1">Total expenses</p>
                <p className="text-3xl font-semibold">₹{total.toLocaleString()}</p>
              </div>
            </div>

            {/* Track Expenses */}
            <button
              onClick={() => navigate("/trackex")}
              className="flex items-center gap-4 p-4 sm:p-5 rounded-2xl border border-gray-200 bg-white text-left w-full hover:bg-gray-50 transition group"
            >
              <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center text-lg flex-shrink-0">
                📈
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm cursor-pointer">Track expenses</div>
                <div className="text-xs mt-0.5 text-gray-500">Track and record new entries</div>
              </div>
              <span className="text-lg text-gray-400 transition group-hover:translate-x-1">›</span>
            </button>

            {/* Manage Expenses */}
            <button
              onClick={() => navigate("/manageex")}
              className="flex items-center gap-4 p-4 sm:p-5 rounded-2xl border border-gray-200 bg-white text-left w-full hover:bg-gray-50 transition group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-lg flex-shrink-0">
                📋
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm cursor-pointer">Manage expenses</div>
                <div className="text-xs mt-0.5 text-gray-500">Edit, delete, and review</div>
              </div>
              <span className="text-lg text-gray-400 transition group-hover:translate-x-1">›</span>
            </button>
          </div>

          {/* RIGHT: Pie Chart */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
            <h3 className="text-base font-semibold mb-5">Expense breakdown</h3>

            {pieData.length === 0 ? (
              <div className="text-center py-16 text-sm text-gray-400">
                No expenses yet
              </div>
            ) : (
              <>
                <div className="h-52 sm:h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        dataKey="value"
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={85}
                        paddingAngle={2}
                      >
                        {pieData.map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => [`₹${value.toLocaleString()}`, ""]}
                        contentStyle={{
                          borderRadius: "10px",
                          border: "1px solid #e5e7eb",
                          background: "#fff",
                          color: "#111",
                          fontSize: "13px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Legend */}
                <div className="mt-4 flex flex-col gap-2">
                  {pieData.map((entry, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                          style={{ background: COLORS[i % COLORS.length] }}
                        />
                        <span className="text-gray-600">{entry.name}</span>
                      </div>
                      <span className="font-medium">₹{entry.value.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </>
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

export default Dashboard;