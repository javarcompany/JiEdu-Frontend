<div align="center">
  <img src="https://img.shields.io/badge/React-18-blue?logo=react&logoColor=white" />&nbsp;
  <img src="https://img.shields.io/badge/Django-4-green?logo=django&logoColor=white" />&nbsp;
  <img src="https://img.shields.io/badge/TailwindCSS-3-06B6D4?logo=tailwindcss&logoColor=white" />&nbsp;
  <img src="https://img.shields.io/badge/TypeScript-blue?logo=typescript" />
</div>

<br />

# 📊 JiEdu Dashboard System

A modern full-stack application built with **React + Django** to manage student allocations, fee tracking, reports, workload assignments, and administrative tasks in an educational setting.

---

## 📚 Table of Contents

- [Screenshots](#️-screenshots)
- [Technologies Used](#-technologies-used)
- [Features Overview](#-features-overview)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Token Expiry Handling](#-token-expiry-handling)
- [Responsive Design](#-responsive-design)
- [API Endpoints](#-api-endpoints)
- [Notes](#-notes)
- [Author](#-author)
- [License](#-license)

---

## 🖼️ Screenshots

| Responsive Dashboard | Dynamic Modals | Chart Reports |
|----------------------|----------------|---------------|
| ![dashboard](https://via.placeholder.com/300x180?text=Dashboard) | ![modal](https://via.placeholder.com/300x180?text=Modal) | ![chart](https://via.placeholder.com/300x180?text=Charts) |

---

## 🔧 Technologies Used

| Frontend               | Backend            | Styling              |
|------------------------|--------------------|-----------------------|
| `React 18`             | `Django 4`         | `TailwindCSS`         |
| `TypeScript`           | `Django REST API`  | `Dark Mode` support   |
| `React Router`         | `JWT Auth`         | `Responsive Layout`   |
| `ApexCharts`           | `SimpleJWT`        | `SweetAlert2`         |

---

## 📂 Features Overview

- ✅ Secure **JWT Authentication**
- 📊 Student Count & Workload Charts
- 🧑‍🏫 Staff & Lecturer Assignments
- 📄 Fee Statement / Structure / Receipt views
- 🧠 Advanced filters (Class, Term, Department)
- ⚙️ Interactive modals for CRUD tasks
- 📈 Fully responsive dashboards and tab views
- 🔐 Auto-logout when JWT token expires
- 🌙 Light/Dark mode switch

---

## 📦 Project Structure

```
.
├── backend/
│   ├── api/                # Django REST API views
│   ├── models/             # Core Models (Student, Staff, Workload...)
│   ├── serializers/        # DRF Serializers
│   └── urls.py             # Backend API routing
├── frontend/
│   ├── components/         # Reusable UI components (modals, charts)
│   ├── pages/              # Student, Staff, Allocation Dashboards
│   ├── utils/axiosInstance.ts # Axios with 401 interceptor
│   └── App.tsx             # Main frontend entry
```

---

## 🚀 Getting Started

### 🐍 Backend (Django)

```bash
cd backend
python -m venv env
source env/bin/activate
pip install -r requirements.txt

python manage.py migrate
python manage.py runserver
```

### ⚛️ Frontend (React)

```bash
cd frontend
npm install
npm run dev
```

---

## 🔐 Token Expiry Handling

* Axios interceptors automatically log out the user and redirect to `/login` when a token expires.
* You can extend it to support auto-refresh using Django SimpleJWT.

---

## 💻 Responsive Design

All components, modals, cards, and tabs adapt to screen sizes:

* ✅ Mobile-first layout
* ✅ Tabs collapse & wrap on smaller screens
* ✅ Charts resize on container width

---

## 📥 API Endpoints

Some sample endpoints:

| Method | Endpoint                      | Description               |
| ------ | ----------------------------- | ------------------------- |
| GET    | `/api/students-allocations/`  | Fetch all student records |
| POST   | `/api/workload/assign-batch/` | Assign multiple units     |
| GET    | `/api/student_count/all/`     | Get student statistics    |
| GET    | `/api/classes/`               | Get available classes     |

---

## 📌 Notes

- Ensure frontend and backend are on the **same local network** when testing on mobile.
- Add CORS settings in Django for mobile access:

```py
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://<your-ip>:5173",
]
```

---

## 👨‍💻 Author

> Built with 💙 by [Javar](https://github.com/javarcompany)  
> For questions, contact: `javarcompany1@gmail.com`

---

## 📃 License

MIT License – use freely in educational and administrative environments.