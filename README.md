# B.C. Traders - Wholesale E-Commerce Platform

A full-stack e-commerce application built with the MERN stack (MongoDB, Express.js, React.js, Node.js) for the B.C. Traders wholesale business.

---

## 🚀 Key Features

* **Complete E-Commerce Workflow:** Users can browse products, add items to a cart, and manage their orders.
* **Modern User Authentication:** Secure user registration and login handled by **Clerk**, including social logins and profile management.
* **Admin Dashboard:** A role-protected administrative panel to (C)reate, (R)ead, (U)pdate, and (D)elete products, manage categories, and view all user orders.
* **RESTful API:** A scalable backend API built with Node.js and Express.js to handle all application logic.
* **Responsive Design:** The UI is built with React and is fully responsive for all device sizes.

---

## 🛠️ Technology Stack

### Frontend
* **React.js:** A JavaScript library for building user interfaces.
* **@clerk/clerk-react:** For seamless frontend authentication.
* **React Router:** For client-side routing.
* **Axios:** For making HTTP requests to the backend API.
* **Tailwind CSS / Material-UI:** (Add your styling library)

### Backend
* **Node.js:** JavaScript runtime environment.
* **Express.js:** Web application framework for Node.js.
* **MongoDB:** NoSQL database for storing application data.
* **Mongoose:** ODM library for MongoDB.
* **@clerk/clerk-sdk-node:** For backend API authentication and user management.

---

## 🏁 Getting Started

To get a local copy up and running, follow these steps.

### Prerequisites

* Node.js (v18.x or later)
* npm (or yarn)
* MongoDB (a local instance or a free MongoDB Atlas connection string)
* A Clerk account (for API keys)

### Installation

1.  **Clone the repository:**
    ```sh
    git clone [https://github.com/Spandey34/BC-Traders.git](https://github.com/Spandey34/BC-Traders.git)
    cd BC-Traders
    ```

2.  **Install Backend Dependencies:**
    (Assuming your server is in a `backend` or `server` folder)
    ```sh
    cd backend
    npm install
    ```

3.  **Install Frontend Dependencies:**
    (Assuming your client is in a `frontend` or `client` folder)
    ```sh
    cd ../frontend
    npm install
    ```

4.  **Set up Backend Environment Variables:**
    In the `/backend` directory, create a `.env` file and add:

    ```env
    MONGO_URI=your_mongodb_connection_string
    PORT=8000
    
    # Get from your Clerk Dashboard (API Keys)
    CLERK_SECRET_KEY=your_clerk_secret_key
    ```

5.  **Set up Frontend Environment Variables:**
    In the `/frontend` directory, create a `.env` file and add:

    ```env
    # Get from your Clerk Dashboard (API Keys)
    REACT_APP_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
    ```

6.  **Run the application:**

    * **Run the backend server:** (from the `/backend` directory)
        ```sh
        npm run dev 
        ```

    * **Run the frontend client:** (from the `/frontend` directory)
        ```sh
        npm start
        ```

    The application should now be running locally at `http://localhost:3000`.

---

## 👤 Author

**Spandey**
* **GitHub:** [@Spandey34](https://github.com/Spandey34)
