const pool = require("./_db");

const str = (v, max) =>
  typeof v === "string" && v.length <= max ? v : null;

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const b = req.body || {};

  const type = str(b.type, 30);
  const form_id = str(b.form_id, 60);
  const full_name = str(b.full_name, 200);
  const index_number = str(b.index_number, 50);
  const all_indexes = str(b.all_indexes || "", 1000);
  const email = str(b.email, 200);
  const phone = str(b.phone, 50);
  const project_title = str(b.project_title, 300);
  const project_desc = str(b.project_desc, 5000);
  const submitted_at = str(b.submitted_at, 100);
  const members_json =
    b.members_json == null ? null : str(String(b.members_json), 10000);
  const member_count = Number.isInteger(+b.member_count) && +b.member_count > 0 && +b.member_count < 100
    ? +b.member_count : null;

  if (![type, form_id, full_name, index_number, email, phone, project_title, project_desc, submitted_at]
        .every((v) => v && v.trim())) {
    return res.status(400).json({ error: "Missing or invalid fields" });
  }

  try {
    await pool.query(
      `INSERT INTO registrations
        (type, form_id, full_name, index_number, all_indexes, email, phone,
         project_title, project_desc, member_count, members_json, submitted_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`,
      [type, form_id, full_name, index_number, all_indexes, email, phone,
       project_title, project_desc, member_count, members_json, submitted_at]
    );
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("register error:", err.message);
    return res.status(500).json({ error: "Server error" });
  }
};
