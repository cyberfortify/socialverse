# Social Media App

```
socialverse/                    # repo root
├─ .github/
│  └─ workflows/
│     └─ ci.yml                 # CI skeleton to run tests/lint
├─ backend/
│  ├─ manage.py
│  ├─ requirements.txt
│  ├─ pyproject.toml (optional)
│  ├─ .env.example
│  ├─ config/                   # Django project
│  │  ├─ __init__.py
│  │  ├─ asgi.py
│  │  ├─ settings/
│  │  │  ├─ __init__.py
│  │  │  ├─ base.py
│  │  │  ├─ dev.py
│  │  │  └─ prod.py
│  │  ├─ urls.py
│  │  └─ wsgi.py
│  ├─ apps/
│  │  └─ accounts/
│  │     ├─ migrations/
│  │     ├─ models.py
│  │     ├─ serializers.py
│  │     ├─ views.py
│  │     └─ urls.py
│  ├─ tests/
│  └─ static/                   # for collectstatic (dev optional)
├─ frontend/
│  ├─ package.json
│  ├─ .env.example
│  ├─ vite.config.ts
│  ├─ index.html
│  ├─ src/
│  │  ├─ main.jsx
│  │  ├─ App.jsx
│  │  ├─ api/
│  │  │  └─ axiosClient.js
│  │  ├─ components/
│  │  │  └─ Layout.jsx
│  │  ├─ pages/
│  │  │  └─ Home.jsx
│  │  └─ styles/
│  │     └─ index.css
│  └─ tailwind.config.cjs
├─ .gitignore
├─ README.md
└─ LICENSE
````