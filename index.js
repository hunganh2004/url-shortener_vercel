import express from "express";
import { nanoid } from "nanoid";
import { createClient } from "@supabase/supabase-js";

const app = express();
app.use(express.json());

// Kết nối Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// POST /api/shorten
app.post("/api/shorten", async (req, res) => {
    const { url, code } = req.body;
    if (!url) return res.status(400).json({ error: "Thiếu URL" });

    if (!code) {
        code = nanoid(6) // nếu client không gửi code, tạo tự động
    }

    const { error } = await supabase
        .from("urls")
        .insert([{ code, original_url: url }]);

    if (error) return res.status(500).json({ error: error.message });

    const host = req.headers.host;
    const protocol = req.headers["x-forwarded-proto"] || "https";
    res.json({ shortUrl: `${protocol}://${host}/${code}` });
});

// GET /:code
app.get("/:code", async (req, res) => {
    const { code } = req.params;

    const { data, error } = await supabase
        .from("urls")
        .select("original_url")
        .eq("code", code)
        .single();

    if (error || !data) return res.status(404).send("Link không tồn tại!");
    res.redirect(data.original_url);
});

export default app;
