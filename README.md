# ✦ Vonix Code Camp
### An Offline Coding Curriculum — Updated May 2026

A fully-featured, offline-capable coding education platform based on the FreeCodeCamp engine, rebranded and expanded with a **2026 curriculum** covering Python, TypeScript, React, AI/ML, SQL, and Information Security.

---

## 🎓 Curriculum Tracks

| # | Track | Status | Hours |
|---|-------|--------|-------|
| 01 | Responsive Web Design (HTML5 + CSS3) | ✅ Available | ~300 hrs |
| 02 | JavaScript Algorithms & Data Structures | ✅ Available | ~300 hrs |
| 03 | Back End Development & APIs (Node/Express) | ✅ Available | ~300 hrs |
| 04 | Data Visualization (D3.js + React) | ✅ Available | ~200 hrs |
| 05 | **Python & Data Science** *(New 2026)* | 🆕 New | ~200 hrs |
| 06 | **AI & Modern Web (TypeScript + React Hooks + LLMs)** *(New 2026)* | 🆕 New | ~250 hrs |
| 07 | **Relational Databases (SQL + PostgreSQL)** *(New 2026)* | 🆕 New | ~150 hrs |
| 08 | **Information Security (Hashing + JWT + XSS)** *(New 2026)* | 🆕 New | ~150 hrs |

---

## 🛠 Installation

### Prerequisites
- **Node.js** v4.x.x
- **MongoDB** v3.x.x
- **7-Zip** (for extracting archive files)

### Steps

**1.** Download and install Node.js 4.x.x, MongoDB 3.x.x, and 7-Zip.

**2.** After cloning this repository, extract the three `.7z` archive files (`data.7z`, `public.7z`, `node_modules.7z`) directly into the project root. The resulting folder structure should be:

```
vonix-code-camp/
├── .github/
├── client/
├── common/
├── config/
├── data/          ← extracted from data.7z
├── node_modules/  ← extracted from node_modules.7z
├── public/        ← extracted from public.7z
├── seed/
├── server/
└── ...
```

**3.** Verify your PATH variables:
- MongoDB: run `mongod --version` → should show `v3.x.x`. If not found, add `C:\Program Files\MongoDB\Server\3.0\bin` to PATH.
- Node.js: run `node --version` → should show `v4.x.x`.

---

## 🚀 Running Vonix Code Camp

**Step 1** — Open a command prompt in the project folder and start MongoDB:
```
database
```

**Step 2** — Open a second command prompt in the same folder and start the app:
```
gulp
```

Wait until you see:
```
[BS] Watching files...
FreeCodeCamp server listening on port 3000 in development
```

**Step 3** — Open your browser and navigate to:
```
http://localhost:3000
```

---

## 🔑 Default Login

```
email:    username@email.com
password: password
```

> **Note:** Creating a new account may show an error during sign-up, but you can still use the email/password you entered to log in.

> **Tip:** If you get a "LoopBack error", press `CTRL+C` twice to stop the server, then run `gulp` again.

---

## 🔧 Seeding the Database (first run or reset)

To load all challenge data into MongoDB:
```
npm run only-once
```

---

## 🎨 Design

Vonix Code Camp features a modern **Codecademy-inspired dark UI** with:
- Inter font throughout
- Dark navy background (`#0f1117`) with purple (`#7b66ff`) and teal (`#00d4aa`) accents
- Card-based course catalog on the home page
- Redesigned curriculum map with search
- Responsive layout for all screen sizes

---

## 📄 License

Original FreeCodeCamp code: BSD-3-Clause AND CC-BY-SA-4.0  
Vonix Code Camp additions: MIT






