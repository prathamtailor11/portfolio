// server.js (ES Module syntax)
import express from 'express';
import fs from 'fs';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const app = express();
const PORT = 5000;

// For __dirname equivalent in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DATA_FILE = join(__dirname, 'messages.json');

app.use(cors());
app.use(express.json());

// Load saved messages on server start
let messages = [];
if (fs.existsSync(DATA_FILE)) {
  messages = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  console.log("✅ Messages loaded from file:");
  console.log(messages);
}

app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required." });
  }

  const newMessage = {
    name,
    email,
    message,
    time: new Date().toISOString(),
  };

  messages.push(newMessage);
  fs.writeFileSync(DATA_FILE, JSON.stringify(messages, null, 2));

  console.log("📩 New message received:");
  console.log(newMessage);

  res.status(200).json({ success: true, message: "Message saved." });
});

// ✅ NEW: GET route to fetch all messages
app.get('/api/messages', (req, res) => {
  if (fs.existsSync(DATA_FILE)) {
    const savedMessages = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    res.status(200).json(savedMessages);
  } else {
    res.status(404).json({ error: "No messages found." });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
