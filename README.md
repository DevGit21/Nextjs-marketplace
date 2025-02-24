# Marketplace Web App  

A **Next.js** marketplace where users can browse, sell companies, and view interested buyers. **Google OAuth authentication via Supabase** ensures secure access.

## 🚀 Features  
- **Google OAuth** authentication (Supabase)  
- **Protected routes** for selling and buyer interest  
- **Dynamic Navbar** with active link highlighting  
- **Server-side & client-side rendering** for performance  

## 📌 Setup  

### 1️⃣ Prerequisites  
- **Node.js v18+**  
- **Yarn or npm**  
- **Supabase account**  

### 2️⃣ Install & Run  
git clone https://github.com/DevGit21/Nextjs-marketplace.git
cd marketplace-app
yarn install  # or npm install

### 3️⃣ Configure Supabase
Create a .env.local file:
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

### 4️⃣ Start the Server
yarn dev  # or npm run dev
Visit http://localhost:3000.

🔑 Authentication & Access Control
Protected pages: /sell & /seller/interests
Redirects guests to homepage
Sign in/out via Google

📂 Folder Structure
```bash
📦 nextjs-marketplace-app
 ┣ 📂 components   # Reusable UI (Navbar, Buttons)
 ┣ 📂 pages        # Marketplace, Sell, Interests
 ┣ 📂 supabase     # Supabase client config
 ┣ 📜 .env.local   # API keys (ignored in Git)
 ┣ 📜 package.json # Dependencies
 ┣ 📜 README.md    # Documentation

 🚀 Happy Coding! 🎉
