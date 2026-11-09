require("dotenv").config();
const express = require("express");
const path = require("path");
const { MongoClient, ObjectId } = require("mongodb");

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017";
const DB_NAME = process.env.DB_NAME || "crud_demo";
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

let items; // MongoDB collection

// Geçersiz id'leri yakalar
const validId = (req, res, next) => {
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: "Geçersiz id" });
  }
  next();
};

// CREATE - Ekle
app.post("/api/items", async (req, res) => {
  const { title, description = "" } = req.body;
  if (!title || !title.trim()) {
    return res.status(400).json({ error: "title zorunludur" });
  }
  const doc = { title: title.trim(), description, createdAt: new Date() };
  const result = await items.insertOne(doc);
  res.status(201).json({ _id: result.insertedId, ...doc });
});

// READ - Listele
app.get("/api/items", async (req, res) => {
  const list = await items.find().sort({ createdAt: -1 }).toArray();
  res.json(list);
});

// READ - Tek kayıt
app.get("/api/items/:id", validId, async (req, res) => {
  const item = await items.findOne({ _id: new ObjectId(req.params.id) });
  if (!item) return res.status(404).json({ error: "Kayıt bulunamadı" });
  res.json(item);
});

// UPDATE - Güncelle
app.put("/api/items/:id", validId, async (req, res) => {
  const { title, description } = req.body;
  const changes = {};
  if (title !== undefined) changes.title = String(title).trim();
  if (description !== undefined) changes.description = description;
  if (!Object.keys(changes).length) {
    return res.status(400).json({ error: "Güncellenecek alan yok" });
  }
  changes.updatedAt = new Date();

  const result = await items.findOneAndUpdate(
    { _id: new ObjectId(req.params.id) },
    { $set: changes },
    { returnDocument: "after" }
  );
  if (!result) return res.status(404).json({ error: "Kayıt bulunamadı" });
  res.json(result);
});

// DELETE - Sil
app.delete("/api/items/:id", validId, async (req, res) => {
  const result = await items.deleteOne({ _id: new ObjectId(req.params.id) });
  if (!result.deletedCount) {
    return res.status(404).json({ error: "Kayıt bulunamadı" });
  }
  res.json({ message: "Silindi" });
});

// Beklenmeyen hatalar
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Sunucu hatası" });
});

async function start() {
  const client = new MongoClient(MONGO_URI);
  await client.connect();
  items = client.db(DB_NAME).collection("items");
  console.log("MongoDB'ye bağlandı");
  app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
}

start().catch((err) => {
  console.error("Başlatılamadı:", err.message);
  process.exit(1);
});
