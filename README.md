# Élan - Luxury Perfume E-commerce Platform

Élan is a premium, cinematic e-commerce platform dedicated to the world of fine fragrances. Built with a focus on luxury aesthetics and seamless user experience, it offers a sophisticated interface for browsing, discovering, and purchasing high-end perfumes.


## 🌟 Key Features

### 💎 Premium User Experience
- **Cinematic Design**: A high-end "dark mode" aesthetic with elegant typography and black gradients.
- **Fluid Animations**: Smooth transitions and micro-interactions powered by Framer Motion.

### 🛍️ Shopping & Discovery
- **Dynamic Catalog**: Browse a wide collection of perfumes with real-time filtering and sorting.
- **Detailed Product Pages**: High-quality imagery, detailed notes (top, heart, base), and brand stories.
- **Persistent Shopping Cart**: Seamless cart synchronization between guest sessions and user accounts.
- **Secure Checkout**: Robust form validation and a streamlined path to purchase.

### 👤 User Management
- **Secure Authentication**: JWT-based login and registration with encrypted passwords.
- **User Profiles**: Manage personal information, viewing order history, and tracking shipments.
- **Review System**: Share experiences through a dedicated review interface with star ratings.

### 🛠️ Dedicated Dashboards
- **Seller Dashboard**: Comprehensive tools for sellers to manage their product listings (Create, Update, Delete).
- **Admin Panel**: Global management of users, products, and site-wide metrics.

---

## 🚀 Tech Stack

### Frontend
- **Framework**: [React.js](https://reactjs.org/) (Vite)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: React Context API
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/) & [React Icons](https://react-icons.github.io/react-icons/)
- **Notifications**: [React Hot Toast](https://react-hot-toast.com/)
- **HTTP Client**: [Axios](https://axios-http.com/)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **Authentication**: JWT (JSON Web Tokens)
- **File Uploads**: Multer
- **Security**: BcryptJS (Password hashing)

---

## 📁 Project Structure

```text
perfume-website/
├── Backend/                # Node.js + Express + MongoDB
│   ├── src/
│   │   ├── config/         # Database and environment configurations
│   │   ├── controllers/    # Request handlers
│   │   ├── middlewares/    # Auth and error handling
│   │   ├── models/         # Mongoose schemas (User, Product, Order, Review)
│   │   ├── routes/         # API endpoints
│   │   └── server.js       # Entry point
│   └── package.json
└── Frontend/               # React + Vite + Tailwind
    ├── src/
    │   ├── components/     # Reusable UI components
    │   ├── context/        # Global state management
    │   ├── pages/          # Full page views (Home, Products, Checkout, etc.)
    │   ├── services/       # API integration layers
    │   └── App.jsx         # Main routing and layout
    └── package.json
```

---

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB account (local or Atlas)

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <https://github.com/Avi511/Elanfragrance>
   cd perfume-website
   ```

2. **Backend Setup**
   ```bash
   cd Backend
   npm install
   ```
   - Create a `.env` file in the `Backend` folder.
   - Add: `PORT`, `MONGODB_URI`, `JWT_SECRET`.
   ```bash
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd ../Frontend
   npm install
   ```
   - Create a `.env` file in the `Frontend` folder.
   - Add: `VITE_API_BASE_URL`.
   ```bash
   npm run dev
   ```

---

## 📜 License
This project is licensed under the ISC License.

---

## 📞 Contact
For any inquiries or feedback, please reach out via the [Contact Page](http://localhost:5173/contact).
