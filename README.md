# SocialVerse

A modern full-stack social networking platform built with **Django + React + Tailwind**, featuring authentication, posting, commenting, messaging, notifications, and a real modern UI experience.


## 🚀 Features

### Phase 0 — Project Setup

✔ Django backend initialized
✔ React frontend initialized
✔ CORS + CSRF configured
✔ Session-based authentication enabled
✔ API connectivity verified (`/ping → pong`)

### Phase 1 — Authentication

✔ User registration
✔ User login
✔ Session cookie auth
✔ `/me` protected endpoint for current logged-in user
✔ Profile model created
✔ Profile auto-created after user registration

### Phase 2 — Posts

✔ Create a post
✔ View posts in feed
✔ Like posts
✔ Add comments
✔ Like comment events trigger notifications

### Phase 3 — Notifications

✔ Notification model
✔ Generates when a post is liked
✔ Shows in `/notifications` API
✔ Mark-as-read
✔ Mark all read
✔ Frontend dropdown badge
✔ Auto polling + unread count indicator

### Phase 4 — Messaging

✔ Conversation model
✔ Messages model
✔ Inbox style API
✔ Send message
✔ Retrieve conversation history
✔ Notification link when new message arrives



## 🏛️ Tech Stack

### Backend

* Python 3
* Django
* Django REST Framework
* SQLite (dev)
* Session-based auth (no JWT)
* CSRF security enabled

### Frontend

* React.js (no Next.js)
* Vite
* Axios
* Tailwind CSS



## 📂 Project Structure

```
socialverse/
│
├── backend/
│   ├── apps/
│   │   ├── accounts/
│   │   ├── posts/
│   │   ├── messaging/
│   │   └── notifications/
│   ├── config/
│   ├── db.sqlite3
│   └── manage.py
│
└── frontend/
    ├── src/
    ├── public/
    ├── index.html
    └── vite.config.js
```



# 🔧 Installation & Setup

## 1️⃣ Backend Setup

```
cd backend
python -m venv .venv
.venv\Scripts\activate  (Windows)
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 8000
```

### Check:

```
http://127.0.0.1:8000/api/accounts/ping/
→ {"ping": "pong"}
```



## 2️⃣ Frontend Setup

```
cd frontend
npm install
npm run dev
```

Visit:
👉 `http://localhost:5173`



# 🔒 Authentication Flow (Session Based)

✔ Browser stores session cookie from Django
✔ CSRF cookie included
✔ Axios requests use `withCredentials: true`



# 🧪 API Examples

### Register

```
POST /api/accounts/register/
{
  "username": "aditya",
  "email": "a@a.com",
  "password": "abc12345",
  "password2": "abc12345"
}
```

### Login

```
POST /api/accounts/login/
{
  "username": "aditya",
  "password": "abc12345"
}
```

### Current user

```
GET /api/accounts/me/
```

---

# 🐞 Common Debug Issues Encountered & Fixes

### ❗ 401 Unauthorized on `/me`

✔ Fixed by adding:

```
credentials: "include"
X-CSRFToken: csrftoken
```

### ❗ `accounts_profile table does not exist`

✔ Solution:

```
python manage.py makemigrations accounts
python manage.py migrate
```

### ❗ ModuleNotFoundError: apps.posts

✔ Fixed `INSTALLED_APPS` to:

```
'posts',
```

instead of

```
'apps.posts'
```

### ❗ Invalid model reference 'apps.posts.Post.likes'

✔ Replaced with:

```
sender="posts.Post.likes.through"
```



# 🎨 UI Enhancements Added

✔ Modern sidebar
✔ Mobile bottom navigation
✔ Avatar circles
✔ Create Post modal popup
✔ Profile page
✔ Notification popup + unread badge 🔴
✔ Smooth transitions & shadows



# 👨‍💻 Developer:

**Aditya Ravindra Vishwakarma**
BSc IT • Python & React Developer
Looking for full-stack / backend / Python roles

GitHub: *(your GitHub link here)*
LinkedIn: *(your LinkedIn link here)*



# 🚧 Next Planned Features

### Phase 5

🔹 Follow / Unfollow system
🔹 Explore suggestions
🔹 Trending posts
🔹 Tags & topics
🔹 User search
🔹 Real-time notifications via WebSockets
🔹 Real-time chat



# 📝 License

MIT — Free to use & modify.


# 💬 Contributions

PRs welcome!
Create a pull request or open an issue.

