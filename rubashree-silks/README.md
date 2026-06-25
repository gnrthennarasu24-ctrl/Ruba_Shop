# RubaShree Silks

A handloom &amp; powerloom saree store: sign up / log in, browse 50 handloom + 50 powerloom sarees with prices, search by "handloom" / "powerloom", view each saree with Back / Next / Previous, and place an order with name, address and mobile number.

Stack: **Node.js + Express** (API) + **MongoDB** (Mongoose) + plain HTML/CSS/JS frontend served from the same server.

```
rubashree-silks/
├── server.js              # Express app entry point
├── models/                 # Mongoose schemas: User, Saree, Order
├── routes/                 # /api/auth, /api/sarees, /api/orders
├── middleware/auth.js       # JWT route protection
├── seed/seedSarees.js      # populates 100 sarees in MongoDB
├── public/index.html       # the whole frontend
├── .env.example
└── package.json
```

## 1. Run it locally

**Prerequisites:** Node.js 18+, and a MongoDB connection string (Atlas is the easiest free option — see below).

```bash
cd rubashree-silks
npm install
cp .env.example .env
```

Open `.env` and fill in:
- `MONGODB_URI` — your MongoDB connection string
- `JWT_SECRET` — any long random string (e.g. generate one with `openssl rand -hex 32`)

Populate the database with the 100 sarees (run once):
```bash
npm run seed
```

Start the server:
```bash
npm start
```

Visit **http://localhost:5000** — sign up, browse, and place a test order.

### Setting up a free MongoDB database (if you haven't already)
1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) and create a free cluster.
2. Under **Database Access**, create a database user with a password.
3. Under **Network Access**, add `0.0.0.0/0` (allow access from anywhere) — simplest option for this project, since Render's servers use changing IP addresses. (For a production app handling real customer data you'd normally restrict this further.)
4. Under **Database > Connect > Drivers**, copy the connection string and put it in `MONGODB_URI`. Replace `<password>` with your actual password and add a database name, e.g. `/rubashree` before the `?`.

## 2. Push the code to GitHub

```bash
cd rubashree-silks
git init
git add .
git commit -m "RubaShree Silks - handloom & powerloom saree store"
```

Create a new empty repository on [github.com/new](https://github.com/new) (don't initialize it with a README), then:

```bash
git remote add origin https://github.com/<your-username>/rubashree-silks.git
git branch -M main
git push -u origin main
```

`.env` is already in `.gitignore`, so your database password and JWT secret will **not** be uploaded — you'll set those directly in Render instead (next step).

## 3. Deploy on Render

1. Go to [render.com](https://render.com), sign in, and click **New +** → **Web Service**.
2. Connect your GitHub account and pick the `rubashree-silks` repo.
3. Fill in:
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** Free (fine for a demo)
4. Under **Environment Variables**, add:
   - `MONGODB_URI` → your Atlas connection string
   - `JWT_SECRET` → your long random string
   (Don't set `PORT` — Render provides this automatically and `server.js` already reads `process.env.PORT`.)
5. Click **Create Web Service**. Render will install dependencies and start the app — first deploy takes a couple of minutes.
6. Once it's live, seed the production database **once**: easiest way is to run it from your own machine, pointed at the same Atlas URI:
   ```bash
   MONGODB_URI="your-atlas-uri" npm run seed
   ```
   (Or open a Shell from your Render service dashboard and run `npm run seed` there.)
7. Open the `.onrender.com` URL Render gives you — that's your live site.

### After deploying
- Every `git push` to `main` triggers an automatic redeploy on Render.
- If you ever change the saree data in `seed/seedSarees.js`, re-run `npm run seed` against your Atlas URI to refresh the database.
- Render's free tier spins the service down after periods of inactivity — the first request after idle time takes a few extra seconds to wake up.

## API reference

| Method | Route | Auth | Purpose |
|---|---|---|---|
| POST | `/api/auth/signup` | – | create account, returns `{ token, user }` |
| POST | `/api/auth/login` | – | log in, returns `{ token, user }` |
| GET | `/api/sarees?type=&search=` | – | list sarees, filtered by type or search term |
| GET | `/api/sarees/:sareeId` | – | get one saree |
| POST | `/api/orders` | Bearer token | place an order `{ sareeId, name, address, mobile }` |
| GET | `/api/orders/mine` | Bearer token | list the logged-in user's orders |
