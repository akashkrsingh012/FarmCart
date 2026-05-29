# 🌾 FarmCart - Direct Market Access for Farmers

> A B2C marketplace connecting farmers directly with consumers, ensuring fair pricing and eliminating middlemen.

---

## 📖 Overview

**FarmFlo** is a **Business-to-Consumer (B2C)** marketplace designed to empower farmers by providing direct access to consumers.

The platform eliminates intermediaries, reduces commission costs, and ensures transparent pricing. Farmers can list products, manage inventory, and handle orders, while consumers can browse products and make secure purchases.

Built with modern web technologies, FarmFlo offers a fast, secure, and user-friendly marketplace experience.

---

## ✨ Features

### 🌱 Farmer Features

* Add, edit, and delete product listings
* Manage inventory efficiently
* Set product prices independently
* Receive and manage customer orders

### 🛒 Consumer Features

* Browse fresh farm products
* Search and filter products by category and price
* Place secure orders
* Track order history and purchases

### 🔒 Platform Features

* Direct Farmer-to-Consumer sales
* Transparent pricing system
* Secure payment gateway integration
* User authentication and authorization
* Real-time notifications
* Fully responsive UI for mobile and desktop

---

## 🛠️ Tech Stack

### Frontend

* **React.js (Vite)** – Fast and optimized UI rendering
* **Tailwind CSS** – Responsive and modern styling
* **Zustand** – Lightweight state management

### Backend

* **Node.js** – Runtime environment
* **Express.js** – REST API and server logic
* **MongoDB** – Database management
* **Firebase** – Real-time notifications

### Other Technologies

* **Stripe** – Secure payment processing
* **Cloudinary** – Image upload and storage
* **Postman** – API testing

---

## 🏗️ Installation & Setup

### Prerequisites

Make sure the following are installed:

* Node.js (>=16.x.x)
* MongoDB (Local or Atlas)
* Git

---

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/sktigpta/Farm-floo.git
cd Farm-floo
```

---

## 2️⃣ Install Dependencies

### Frontend Setup

```bash
cd client
npm install
```

### Backend Setup

```bash
cd server
npm install
```

---

## 3️⃣ Configure Environment Variables

Create a `.env` file inside the **server** directory and add the following:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
STRIPE_SECRET_KEY=your_stripe_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

---

## 4️⃣ Run the Application

### Start Backend Server

```bash
cd server
npm run dev
```

### Start Frontend

```bash
cd client
npm run dev
```

---

## 📌 API Endpoints

### 🔐 Authentication

| Method | Endpoint             | Description         |
| ------ | -------------------- | ------------------- |
| POST   | `/api/auth/register` | Register a new user |
| POST   | `/api/auth/login`    | Authenticate user   |

---

### 🛍️ Products

| Method | Endpoint            | Description                     |
| ------ | ------------------- | ------------------------------- |
| GET    | `/api/products`     | Get all products                |
| POST   | `/api/products`     | Add new product *(Farmer only)* |
| PUT    | `/api/products/:id` | Update product *(Farmer only)*  |
| DELETE | `/api/products/:id` | Delete product *(Farmer only)*  |

---

### 📦 Orders

| Method | Endpoint          | Description       |
| ------ | ----------------- | ----------------- |
| GET    | `/api/orders`     | Get all orders    |
| POST   | `/api/orders`     | Place a new order |
| GET    | `/api/orders/:id` | Get order details |

---

## 🛡️ Security Measures

FarmFlo follows several security practices:

* **JWT Authentication** – Secure user sessions
* **Input Validation** – Prevents malicious data and injection attacks
* **HTTPS Encryption** – Secure data transmission
* **Role-Based Access Control (RBAC)** – Restricts sensitive operations

---

## 🤝 Contributing

Contributions are welcome!

Follow these steps:

1. Fork the repository
2. Create a feature branch

```bash
git checkout -b feature-branch
```

3. Commit your changes

```bash
git commit -m "Add feature"
```

4. Push to GitHub

```bash
git push origin feature-branch
```

5. Open a Pull Request

---

## 🚀 Future Enhancements

Planned improvements include:

* 🤖 AI-based pricing suggestions
* ⭐ Product ratings and reviews
* 💳 Multiple payment gateway support
* 📱 Dedicated mobile application

---

## 📄 License

This project is licensed under the **MIT License**.

---

## 📬 Contact

For queries or suggestions:

📧 **Email:** [mdgalibashraf4@gmail.com](mailto:mdgalibashraf4@gmail.com)
💻 **GitHub Repository:** https://github.com/galib2005/FarmCart

---

## 🌟 Support

If you like this project, consider giving it a **⭐ star** on GitHub.

**Happy Farming! 🌱**
