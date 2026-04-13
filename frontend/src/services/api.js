const BASE_URL = "http://localhost:5000";

export const getExpenses = async () => {
  const res = await fetch(`${BASE_URL}/expenses`, {
    headers: {
      Authorization: localStorage.getItem("token"),
    },
  });
  return res.json();
};