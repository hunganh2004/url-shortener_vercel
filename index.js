import express from "express";
import { nanoid } from "nanoid";

const app = express();
app.use(express.json());

// Dùng object tạm thay DB (sau này có thể thay MySQL/MongoDB)
const db = {};

// API rút gọn link
app.post("/api/shorten", (req, res) => {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: "Thiếu URL" });

    const code = nanoid(6);
    db[code] = url;
    res.json({ shortUrl: `https://your-vercel-project.vercel.app/${code}` });
});

// Redirect khi truy cập link ngắn
app.get("/:code", (req, res) => {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: "Thiếu URL" });

    const code = nanoid(6);
    db[code] = url;

    const host = req.headers.host;
    const protocol = req.headers["x-forwarded-proto"] || "http";

    res.json({ shortUrl: `${protocol}://${host}/${code}` });
});

export default app