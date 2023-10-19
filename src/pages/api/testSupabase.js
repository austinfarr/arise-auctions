// pages/api/testSupabase.js
import supabase from "../../../lib/supabase";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).end();
  }

  const { data, error } = await supabase.from("Items").select("*");

  //   const { data, error } = await supabase.from("Items").select("title");

  console.log("data", data);

  if (error) {
    console.error("Error fetching data:", error);
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json(data);
}
