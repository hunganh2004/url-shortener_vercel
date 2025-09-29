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
    const url = db[req.params.code];
    if (url) {
        res.redirect(url);
    } else {
        res.status(404).send("Link không tồn tại!");
    }
});

export default app