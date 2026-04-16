You are a senior full-stack architect and engineer. Design and implement a production-ready Package Tracker Application.

## 🧩 General Requirements
Build a full-stack application with clean architecture, scalability, and best practices. You can choose a modern stack (e.g., React + Node.js, or Next.js + FastAPI, etc.), but explain your choices.

## 🔐 Authentication & Roles
- Implement authentication for admin users only
- Use secure login (JWT or session-based)
- Admin capabilities:
  - Create orders
  - Update order status
  - Manage clients 

## 🌐 Public Features
- Public route/page where users can:
  - Enter an order number (tracking ID)
  - View order status and details (no authentication required)

## 📦 Order Management
Each order must include:
- id (unique tracking number)
- items list (name, quantity, optional description)
- client information:
  - id (optional if registered)
  - name
  - email
- delivery type:
  - delivery
  - on-site pickup
- status (e.g., pending, in transit, delivered, canceled)
- created_at timestamp

### Special Rules:
- Orders can be created WITHOUT a registered client
  - In that case, name and email are REQUIRED
- Orders can optionally be linked to a registered client

## 🧾 Ticket Generation
- When an order is created:
  - Generate a printable ticket/label (PDF or HTML)
  - Include:
    - tracking ID
    - client name
    - delivery type
    - item summary
    - QR or barcode (optional but recommended)

## 📊 Reporting Module
- Create an admin-only reporting page
- Filters:
  - date range
  - client name
  - order status
- Features:
  - list of orders
  - summary metrics (total orders, delivered, pending, etc.)
  - export to CSV or PDF

## 🏗️ Architecture Requirements
- Use Clean Architecture or modular architecture
- Separate layers:
  - domain
  - application/use cases
  - infrastructure (DB, external services)
  - presentation (API/UI)

## 🗄️ Database Design
- Design relational schema (PostgreSQL preferred)
- Include:
  - orders
  - clients
  - order_items
- Show ER diagram or schema definition

## 🔌 API Design
- RESTful API with proper endpoints:
  - POST /orders
  - GET /orders/:id (public tracking)
  - PUT /orders/:id/status
  - GET /reports
- Include request/response examples

## 🎨 Frontend
- Public tracking page
- Admin dashboard:
  - create/edit order
  - change status
  - reporting page
- Clean UI/UX

## ⚙️ DevOps (Optional but Preferred)
- Docker setup
- Environment variables
- Deployment suggestion (Vercel, AWS, etc.)

## 🧪 Testing
- Unit tests for core logic
- Integration tests for API

## 📌 Output Format
Provide:
1. Architecture overview
2. Tech stack justification
3. Database schema
4. API design
5. Folder structure
6. Key code snippets (not full project unless requested)
7. Step-by-step implementation plan
