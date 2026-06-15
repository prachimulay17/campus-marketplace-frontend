# Campus Market — Frontend

Campus Market is a web-based platform built for college students to buy, sell, and exchange items within their campus community.
This repository contains the **frontend** of the Campus Market application.

---

## Features

- **User authentication** (Login / Register with OTP email verification)
- **Browse items** with search, filter, and pagination
- **Item CRUD** (create, edit, delete listings with image upload)
- **Wishlist / Favorites** — save items for later
- **Real-time chat** between buyers and sellers (Socket.IO)
- **Password reset flow** (forgot password, reset with token, change password)
- **Protected routes** for authenticated users
- **Responsive UI** for all devices

---

## Live Demo

- **Frontend:** https://campus-marketplace-frontend.vercel.app
- **Backend API:** https://campus-marketplace-backend.onrender.com/api

---

## Tech Stack

- React 18 + TypeScript + Vite 5 (SWC)
- Tailwind CSS 3 + ShadCN UI (49 Radix primitives)
- React Router DOM 6
- TanStack React Query 5 + Context API
- Axios 1 (with JWT interceptors)
- Socket.IO Client 4.8
- React Hook Form 7 + Zod 3

---

## Project Structure

```
frontend/
├── src/
│   ├── pages/              # 15 page components (Landing, Login, Signup,
│   │                       #   Browse, ItemDetail, PostItem, EditItem,
│   │                       #   Wishlist, Chat, Profile, EditProfile,
│   │                       #   ForgotPassword, ResetPassword,
│   │                       #   ChangePassword, NotFound)
│   ├── components/
│   │   ├── ui/              # ShadCN UI (49 Radix primitives)
│   │   ├── chat/            # ChatWindow, ConversationList, MessageBubble, MessageInput
│   │   ├── Layout.tsx       # Navbar + Footer wrapper
│   │   ├── Navbar.tsx       # Responsive nav with auth dropdown
│   │   ├── ItemCard.tsx     # Memoized item grid card with wishlist button
│   │   ├── Footer.tsx
│   │   └── ProtectedRoute.tsx
│   ├── contexts/
│   │   └── AuthContext.tsx   # Auth state, JWT management, session expiry
│   ├── services/
│   │   └── chat.service.ts   # Socket.IO client + chat REST helpers
│   ├── hooks/                # useImageUpload, use-toast, use-mobile
│   ├── lib/
│   │   ├── api.ts            # Axios instance, interceptors, endpoint map
│   │   └── utils.ts          # cn() helper
│   └── types/index.ts        # TypeScript interfaces
├── .env                      # VITE_API_URL
└── package.json
```

---

## Getting Started

```bash
git clone https://github.com/prachimulay17/campus-marketplace.git
cd campus-marketplace/frontend
cp .env.example .env        # Edit VITE_API_URL if needed
npm install
npm run dev
```

The app starts at **http://localhost:5173**.

---

## Backend Connection

Ensure the backend server is running. Update `VITE_API_URL` in `.env`:
```
VITE_API_URL=http://localhost:5001/api
```

---

## Deployment

The frontend is deployed on Vercel as a static SPA. Build command:
```bash
npm run build   # outputs to dist/
```

---

## Author

Prachi Mulay
