# 🚀 MyOKR – OKR Management Platform

MyOKR is a modern full-stack **Objective & Key Results (OKR)** management system built as part of the **ABEX Full Stack Developer Internship Assessment**. It enables organizations to clearly define goals, assign them to teams and employees, and track progress through a clean and intuitive interface.

---

## 🧩 Features

### ✅ Authentication & Authorization
- Login and Signup with secure JWT-based auth
- Role-based access for **Admins** and **Employees**

### 🏢 Organizational Hierarchy
- Supports structure: **Organization → Departments → Teams → Users**
- Admin can create departments, teams, and assign users

### 🎯 OKRs Management
- Admins can:
  - Add team OKRs
  - Assign OKRs to users
  - Edit and delete OKRs
- Employees can:
  - View their assigned OKRs
  - Track OKR progress

### 📈 Progress Tracking
- OKR cards show current progress visually
- Supports checking completion levels for each key result

### 🖥️ Admin Panel
- Manage departments, teams, users, and OKRs
- Search, filter, and edit/delete users
- Smooth UI interactions with modals and feedback

### 👨‍💼 Employee Dashboard
- View team and department info
- View all assigned OKRs in a dedicated panel

### 🌐 Landing Page
- Beautiful entry screen with tagline, admin panel preview, and login/signup links

---

## ⚙️ Tech Stack

### 🔵 Frontend
- **React.js** + **Tailwind CSS**
- React Router DOM for routing
- Responsive UI for admin and employee panels

### 🟢 Backend
- **Node.js** + **Express.js**
- REST API architecture

### 🗃️ Database
- **MongoDB Atlas**
- Mongoose for schema & model management

### 🔐 Authentication
- **JWT (JSON Web Tokens)** for session management
- **bcrypt** for password hashing

---

## 📸 Screenshots

> (Upload your screenshots to `/src/assets/` and update these paths below.)

### 🌟 Landing Page  
![Landing](./src/assets/landing.png)

### 🔐 Login  
![Login](./src/assets/login.png)

### 🔐 SignUp  
![Login](./src/assets/signup.png)

### 🏢 Admin-Departments  
![Departments](./src/assets/admin_departments.png)

### 🏢 Admin-Teams  
![Departments](./src/assets/admin_teams.png)

### 👥 Admin-Users  
![Users](./src/assets/admin_users.png)

### 📊 Admin-OKRs  
![OKRs](./src/assets/admin_okrs.png)

### 👨‍💼 Employee Dashboard  
![Employee](./src/assets/employee_dashboard.png)

### 👨‍💼 Employee OKRs  
![Employee](./src/assets/employee_okrs.png)

---

## 🛡️ Security & Deployment Notes

- All sensitive info is stored in environment variables and ignored via `.gitignore`
- Deployed using GitHub and MongoDB Atlas (development only)
- Secrets like DB URIs are **revoked** after exposure alerts from GitHub

---

## 🙏 A Note of Thanks

I’d like to sincerely thank **Team ABEX** for providing this opportunity to build a real-world project as part of the internship assessment. This experience helped me implement a full-stack solution from scratch — both backend and frontend — with role-based workflows and modern UI/UX.

---

## 👤 Author

**Manoj MV**  
📧 manojvelmurugan04@gmail.com 
🔗 [GitHub Profile](https://github.com/Manoj-velmurugan)

---


