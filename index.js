import express from "express";
import { nanoid } from "nanoid";
import { kv } from "@vercel/kv"

const app = express();
app.use(express.json());


// API rút gọn link
app.post("/api/shorten", async (req, res) => {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: "Thiếu URL" });

    const code = nanoid(6);

    // 🔹 Lưu vào Vercel KV
    await kv.set(code, url);

    // 🔹 Lấy domain thật từ request
    const host = req.headers.host;
    const protocol = req.headers["x-forwarded-proto"] || "https";

    res.json({ shortUrl: `${protocol}://${host}/${code}` });
});

// Redirect khi truy cập link ngắn
app.get("/:code", async (req, res) => {
    const url = await kv.get(req.params.code)
    if (url) {
        res.redirect(url);
    } else {
        res.status(404).send("Link không tồn tại!");
    }
});

export default app;
