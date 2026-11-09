# Express + MongoDB CRUD

Node.js, Express ve MongoDB (resmi `mongodb` sürücüsü) ile yazılmış basit Ekle / Listele / Güncelle / Sil uygulaması.

## Kurulum

```bash
npm install
cp .env.example .env     # gerekirse MONGO_URI değerini düzenleyin
npm start
```

Tarayıcıda: http://localhost:3000

## API

| Metot  | Adres            | Açıklama        |
|--------|------------------|-----------------|
| POST   | /api/items       | Kayıt ekle      |
| GET    | /api/items       | Tümünü listele  |
| GET    | /api/items/:id   | Tek kayıt getir |
| PUT    | /api/items/:id   | Kayıt güncelle  |
| DELETE | /api/items/:id   | Kayıt sil       |

Örnek:

```bash
curl -X POST localhost:3000/api/items -H "Content-Type: application/json" \
  -d '{"title":"İlk kayıt","description":"Merhaba"}'
```
