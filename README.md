GroZaar - Full Stack Project (Frontend)

GroZaar is a modern, responsive, and feature-rich grocery delivery application built with React.js, Vite, Tailwind CSS, and Redux Toolkit. This repository contains the frontend client, which communicates with a separate backend API to manage users, orders, and products.

Table of Contents

Features

Project Structure

Tech Stack

Setup and Installation

Environment Variables

Available Scripts

Deployment

Contributing

License

Features

User authentication and profile management

Browse products by category and subcategory

Add to cart and checkout with Stripe integration

Real-time order tracking

Notifications using toast messages

Responsive UI optimized for mobile and desktop

Project Structure
src/
├── assets/        # Images, icons, logos, and static files
├── common/        # Reusable utilities, constants, and helper functions
├── components/    # Shared UI components (buttons, cards, modals, etc.)
├── hooks/         # Custom React hooks
├── layouts/       # Layout components (headers, footers, sidebars)
├── pages/         # Page components for routes (Home, Login, Dashboard, etc.)
├── popUps/        # Modal and popup components
├── provider/      # Context Providers (e.g., AuthContext, ThemeContext)
├── route/         # Route definitions and protected route components
├── store/         # Redux store setup and slices
├── utils/         # Helper functions and utilities
├── App.css        # Global styles for the App component
├── App.jsx        # Root React component
├── index.css      # Global CSS (Tailwind imports, fonts)
└── main.jsx       # App entry point (ReactDOM.render / createRoot)

# Root folder files
├── .env             # Environment variables
├── .gitignore       # Git ignore rules
├── README.md        # Project documentation
├── eslint.config.js # ESLint configuration
├── index.html       # Main HTML template
├── package.json     # Project dependencies and scripts
├── package-lock.json
├── postcss.config.js
├── tailwind.config.js
├── vercel.json      # Vercel deployment configuration
└── vite.config.js   # Vite build and development configuration

Tech Stack

Frontend: React.js, Vite, Redux Toolkit

Styling: Tailwind CSS, CSS Modules

Forms: React Hook Form

Notifications: React Hot Toast

Routing: React Router DOM

QR & Barcode: react-qr-code, jsbarcode

Payment: Stripe.js

Icons: React Icons, HugeIcons

Setup and Installation

Clone the repository

git clone https://github.com/<your-username>/GroZaar-Full-Stack-Client.git
cd GroZaar-Full-Stack-Client/client


Install dependencies

npm install


Create .env file in the root directory and add environment variables (example below).

Run development server

npm run dev


Open http://localhost:5173
 to view in your browser.

Environment Variables

Example .env:

VITE_API_URL=https://your-backend-url.onrender.com
VITE_STRIPE_KEY=your-stripe-publishable-key
VITE_OTHER_KEYS=...


Note: Replace VITE_API_URL with your live backend URL. Do not use localhost for production.

Available Scripts
Command	Description
npm run dev	Starts the Vite development server
npm run build	Builds the project for production
npm run preview	Preview the production build
npm run lint	Lint the codebase using ESLint
Deployment

This project is configured to deploy with Vercel.

Make sure to connect your GitHub repository to Vercel.

Set environment variables in Vercel Project Settings.

Build command: npm run build

Output directory: dist/

After deployment, your frontend will automatically communicate with your backend URL.

Contributing

Fork the repository.

Create your feature branch: git checkout -b feature-name

Commit your changes: git commit -m 'Add some feature'

Push to the branch: git push origin feature-name

Create a Pull Request

License

This project is MIT Licensed.
