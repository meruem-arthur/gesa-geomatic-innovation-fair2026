const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 1,
});

exports.handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, headers, body: JSON.stringify({ error: "Invalid JSON" }) };
  }

  const { query, params = [] } = body;

  if (!query || typeof query !== "string") {
    return { statusCode: 400, headers, body: JSON.stringify({ error: "Missing query" }) };
  }

  // Only allow SELECT and INSERT for safety
  const normalized = query.trim().toUpperCase();
  if (!normalized.startsWith("SELECT") && !normalized.startsWith("INSERT")) {
    return { statusCode: 403, headers, body: JSON.stringify({ error: "Only SELECT and INSERT are allowed" }) };
  }

  try {
    const result = await pool.query(query, params);
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ rows: result.rows, rowCount: result.rowCount }),
    };
  } catch (err) {
    console.error("DB error:", err.message);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
