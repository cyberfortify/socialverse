## Phase 0 — Project scaffold (Backend + Frontend)

**Date completed:** YYYY-MM-DD

### What I set up
**Backend (Django + DRF)**
- Django project under `backend/config/`
- Apps folder: `backend/apps/accounts/` with:
  - `models.py` — Profile model (OneToOne with Django User)
  - basic `views.py`, `urls.py`, and `serializers.py` placeholders
- Settings split (minimal dev): `config/settings/base.py`, `config/settings/dev.py`
- SQLite for local development (`db.sqlite3`)
- `requirements.txt` listing Django, DRF, django-environ, django-cors-headers, Pillow (for ImageField)
- `manage.py` and migrations applied (`python manage.py migrate`)
- Admin registered `Profile` model
- A `ping` endpoint at `/api/accounts/ping/` for health checks

**Frontend (Vite + React + Tailwind)**
- Vite React app scaffold at `frontend/`
- TailwindCSS configured (`tailwind.config.cjs` + `src/styles/index.css`)
- Minimal layout & pages: `src/App.jsx`, `src/components/Layout.jsx`
- Axios client at `src/api/axiosClient.js` configured to use `VITE_API_BASE_URL`
- `.env.example` with `VITE_API_BASE_URL=http://127.0.0.1:8000/api/`
- Basic fetch on app load to show `Backend ping: pong` in UI

### Commands (how to run locally)
**Backend**
```bash
cd backend
python -m venv .venv
# activate venv (.venv\Scripts\Activate.ps1 on Windows PowerShell)
pip install -r requirements.txt
cp .env.example .env
python manage.py migrate
python manage.py runserver 8000
