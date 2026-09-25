# ⚡ MicroTask Dispatch

### 10-Minute Micro-Task Dispatch Platform

MicroTask Dispatch is a hyperlocal platform that connects local businesses with nearby workers for short-duration micro-tasks ranging from **15 to 60 minutes**.

The platform is designed for situations where a business needs quick local help for tasks such as stock unloading, shelf restocking, flyer distribution, inventory counting, warehouse assistance, and event setup.

---

## 🌐 Live Demo

**Live Application:**  
https://micro-task-platform-pi.vercel.app/

**GitHub Repository:**  
https://github.com/shaiksaidabi/micro-task-platform

---

## 📌 Problem Statement

Local stores and small businesses often need temporary help for small tasks that may only take a few minutes or an hour.

Examples include:

- Unloading incoming stock
- Restocking shelves
- Emergency flyer distribution
- Counting inventory
- Barcode checking
- Sorting parcels
- Packing assistance
- Event setup
- Booth assistance

Traditional job platforms are generally designed for longer-term employment or larger gig assignments.

**MicroTask Dispatch focuses specifically on short, local, task-based work.**

---

## 💡 Solution

MicroTask Dispatch creates a simple marketplace where:

```text
Business
   ↓
Creates a Micro-Task
   ↓
Nearby Worker Discovers Task
   ↓
Worker Accepts Task
   ↓
Worker Completes Task
   ↓
Task Marked Completed
```

The goal is to make short-duration local work easier to discover and complete.

---

# 🎯 Key Features

## 👷 Worker

Workers can:

- Browse available micro-tasks
- Search tasks
- Filter tasks by category
- View business name
- View distance
- View task duration
- View payment
- View required workers
- View task priority
- Accept tasks
- Mark accepted tasks as completed
- Track basic worker statistics

---

## 🏪 Business

Businesses can:

- Create new micro-tasks
- Specify task category
- Set duration
- Set payment
- Set required workers
- Set task priority
- View created tasks
- Track task status
- View business statistics

---

## 🛡️ Admin

Admins can:

- View platform statistics
- Monitor total tasks
- Monitor active tasks
- Monitor completed tasks
- Monitor accepted tasks
- View live task activity
- Monitor platform activity

---

# 📂 Task Categories

The MVP currently supports **5 categories**:

### 🛒 Retail

- Stock Unloading
- Shelf Restocking

### 📢 Marketing

- Emergency Flyer Distribution
- Store Promotion

### 📦 Inventory

- Inventory Counting
- Barcode Stock Check

### 🏭 Warehouse

- Parcel Sorting
- Packing Assistance

### 🎪 Events

- Event Setup Helper
- Booth Assistance

---

# 📋 Sample Micro-Tasks

| Task | Business | Duration | Payment | Workers | Priority |
|---|---|---:|---:|---:|---|
| Stock Unloading | FreshMart Store | 30 min | ₹300 | 2 | High |
| Shelf Restocking | Daily Basket | 25 min | ₹250 | 2 | Medium |
| Emergency Flyer Distribution | QuickBite | 45 min | ₹400 | 3 | Critical |
| Store Promotion | Urban Cafe | 40 min | ₹350 | 2 | High |
| Inventory Counting | DailyNeeds | 20 min | ₹200 | 2 | Medium |
| Barcode Stock Check | ValueMart | 30 min | ₹280 | 2 | Medium |
| Parcel Sorting | QuickShip Hub | 45 min | ₹350 | 2 | High |
| Packing Assistance | LocalKart Warehouse | 35 min | ₹300 | 2 | Medium |
| Event Setup Helper | City Events | 60 min | ₹450 | 2 | High |
| Booth Assistance | Market Expo | 50 min | ₹400 | 2 | Medium |

---

# 🔎 Product Research & Competitor Analysis

Before building the platform, I explored existing products operating in the gig-work, hyperlocal, and local logistics space.

This research helped identify how existing platforms approach local work and helped define a more focused use case for MicroTask Dispatch.

---

## 1. PickMyWork

PickMyWork provides flexible gig opportunities and connects businesses with individuals for gig-based work.

### Observed Focus

- Gig opportunities
- Flexible work
- Business-driven activities
- Sales and referral-oriented gig work

### MicroTask Dispatch Difference

MicroTask Dispatch focuses specifically on **short physical micro-shifts for local businesses**, such as:

- Stock handling
- Shelf restocking
- Inventory checks
- Flyer distribution
- Event assistance

Official Website:

https://www.pickmywork.com/

---

## 2. Shadowfax

Shadowfax operates in hyperlocal logistics and delivery, including rider assignment and last-mile delivery operations.

### Observed Focus

- Hyperlocal delivery
- Logistics
- Store pickup
- Last-mile delivery
- Rider assignment
- Delivery tracking

### MicroTask Dispatch Difference

MicroTask Dispatch is **not primarily a delivery platform**.

Instead, it focuses on non-delivery tasks that local businesses need help with for a short period.

Examples:

- Unloading stock
- Restocking shelves
- Flyer distribution
- Inventory counting
- Event setup

Official Website:

https://www.shadowfax.in/

---

## 3. Porter

Porter provides on-demand intra-city transportation and logistics services using vehicles and delivery partners.

### Observed Focus

- Goods transportation
- Intra-city logistics
- Business transportation
- Delivery services

### MicroTask Dispatch Difference

MicroTask Dispatch is designed around **human task assistance rather than transportation**.

A worker can accept a 20–60 minute task at a nearby store without the task being related to vehicle-based delivery.

Official Website:

https://porter.in/

---

# 🆚 Product Differentiation

The main product idea is:

> **Short-duration, hyperlocal, non-delivery micro-shifts for local businesses.**

| Platform | Main Focus | MicroTask Dispatch Difference |
|---|---|---|
| PickMyWork | Gig opportunities | Focuses on short physical local tasks |
| Shadowfax | Hyperlocal delivery | Focuses on non-delivery tasks |
| Porter | Transportation & logistics | Focuses on human task assistance |
| MicroTask Dispatch | 15–60 minute local micro-shifts | Task-specific local workforce marketplace |

The MVP is intentionally focused on a smaller use case instead of trying to cover every type of gig work.

---

# 🧠 Why This Product Direction?

Many local business requirements are too small to justify hiring someone for a full shift.

For example:

```text
Business receives stock
        ↓
Needs 2 people
        ↓
Task takes only 30 minutes
        ↓
Traditional hiring is inefficient
        ↓
Business posts a micro-task
        ↓
Nearby workers discover the task
        ↓
Worker accepts the task
        ↓
Task gets completed
```

This creates a simple model for **short-duration workforce demand**.

---

# 🛠️ Technology Stack

### Frontend

- React
- Vite
- JavaScript
- HTML
- CSS

### Development

- VS Code
- Git
- GitHub

### Deployment

- Vercel

---

# 🏗️ Current MVP Architecture

The current version is a frontend-focused MVP.

```text
React Application
       │
       ├── Worker Interface
       │
       ├── Business Interface
       │
       ├── Admin Interface
       │
       ├── Task Search
       │
       ├── Category Filtering
       │
       ├── Task Acceptance
       │
       └── Task Completion
```

Task data is currently handled through React state for demonstration purposes.

---

# 🚀 Running the Project Locally

## 1. Clone the Repository

```bash
git clone https://github.com/shaiksaidabi/micro-task-platform.git
```

## 2. Navigate to the Frontend

```bash
cd micro-task-platform/frontend
```

## 3. Install Dependencies

```bash
npm install
```

## 4. Start the Development Server

```bash
npm run dev
```

The application will then be available through the local Vite development URL.

---

# 📱 MVP User Flow

## Worker Flow

```text
Open Platform
      ↓
Switch to Worker
      ↓
Browse Tasks
      ↓
Search / Filter
      ↓
View Task
      ↓
Accept Task
      ↓
Complete Task
```

## Business Flow

```text
Open Platform
      ↓
Switch to Business
      ↓
Create Task
      ↓
Set Duration / Payment / Workers
      ↓
Publish Task
      ↓
Monitor Task
```

## Admin Flow

```text
Open Platform
      ↓
Switch to Admin
      ↓
View Platform Statistics
      ↓
Monitor Tasks
      ↓
View Activity
```

---

# 📊 Current MVP Scope

The current version demonstrates the core product concept through a frontend MVP.

### Included

- Worker interface
- Business interface
- Admin interface
- Task creation
- Task discovery
- Search
- Category filtering
- Task acceptance
- Task completion
- Task statistics
- Responsive UI
- 10 sample micro-tasks
- Vercel deployment

### Not Yet Included

The following features can be added in a production version:

- Backend API
- Persistent database
- Real authentication
- User profiles
- GPS-based worker matching
- Real-time task updates
- Payment processing
- KYC verification
- Push notifications
- Business verification
- Worker ratings
- Task history
- Production-level security

---

# 🔮 Future Improvements

## Phase 1 — Backend

- Spring Boot or Node.js backend
- REST APIs
- PostgreSQL database
- User authentication
- Role-based access control

## Phase 2 — Hyperlocal Matching

- GPS-based worker discovery
- Distance-based task matching
- Worker availability
- Location radius filtering

## Phase 3 — Trust & Safety

- Worker verification
- Business verification
- Ratings and reviews
- Task completion verification

## Phase 4 — Payments

- Digital payments
- Wallet
- Payment history
- Automated payouts

## Phase 5 — Real-Time Platform

- Real-time task updates
- Notifications
- Task acceptance alerts
- Worker availability status

---

# 🎯 Project Goal

The goal of MicroTask Dispatch is to explore how a **hyperlocal micro-work marketplace** can connect businesses with nearby workers for tasks that are too small or short-term for traditional hiring.

The MVP focuses on validating the core workflow:

```text
Business Need
      ↓
Micro-Task
      ↓
Nearby Worker
      ↓
Task Acceptance
      ↓
Task Completion
```

---

# 👨‍💻 Project Highlights

This project demonstrates practical experience with:

- React application development
- Vite project setup
- Component-based UI development
- State management
- Marketplace-style product design
- Role-based interfaces
- Task search and filtering
- Product research
- Competitor analysis
- Responsive UI design
- Git and GitHub
- Vercel deployment

---

# 📚 Research Sources

- PickMyWork — https://www.pickmywork.com/
- Shadowfax — https://www.shadowfax.in/
- Porter — https://porter.in/

---

# ⭐ Project Status

**MVP Completed**

### Live Demo

https://micro-task-platform-pi.vercel.app/

### GitHub Repository

https://github.com/shaiksaidabi/micro-task-platform

---

## 👤 Author

**Shaik Saidabi**

Built as a practical MVP to explore a hyperlocal marketplace for short-duration workforce requirements.