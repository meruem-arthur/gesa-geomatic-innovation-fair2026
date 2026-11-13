const pool = require("./_db");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const { index_number } = req.body || {};
  if (typeof index_number !== "string" || !index_number.trim() || index_number.length > 50) {
    return res.status(400).json({ error: "Invalid index number" });
  }
  try {
    const r = await pool.query(
      "SELECT 1 FROM registrations WHERE index_number = $1 LIMIT 1",
      [index_number.trim()]
    );
    // Only reveal whether it exists, never row data
    return res.status(200).json({ taken: r.rowCount > 0 });
  } catch (err) {
    console.error("check-index error:", err.message);
    return res.status(500).json({ error: "Server error" });
  }
};
