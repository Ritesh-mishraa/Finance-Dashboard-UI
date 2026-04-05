# Finance Dashboard UI

An interactive, responsive, and modern frontend application built to track and understand financial activity. 

> **Note:** This project was developed as a frontend assessment task. The objective was to evaluate UI/UX design capabilities, component structuring, state management, and overall frontend logic.

## 🚀 Features

This dashboard includes all core requirements and several advanced optional enhancements:

- **Dashboard Overview**: Summary cards calculating Total Balance, Income, and Expenses. Time-based cash flow visualizations and spending breakdown charts.
- **Transactions Management**: View, filter, and search through a realistic list of financial transactions.
- **Simulated Role-Based Access Control (RBAC)**:
  - **Viewer**: Read-only access to the dashboard.
  - **Admin**: Can actively add or delete transactions.
- **Dynamic Insights**: Automated extraction of key data metrics including your highest spending categories and monthly averages.
- **State Persistence (Local Storage)**: Your transactions and theme preferences are automatically saved in the browser so data isn't lost on refresh.
- **Dark/Light Mode**: Full responsive theming built in.
- **Data Export & Factory Reset**: A dedicated settings page allowing administrators to download local records as a `.json` file, or completely hard-reset the app state to default mock data.

## 🛠️ Tech Stack

- **Framework**: React (Bootstrapped with [Vite](https://vitejs.dev/))
- **Styling**: Tailwind CSS
- **Visualizations**: Recharts
- **Icons**: Lucide React
- **State Management**: React Context API (`FinanceContext`)

## 💻 Getting Started

### Prerequisites
Make sure you have Node.js and npm installed on your machine.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Ritesh-mishraa/Finance-Dashboard-UI.git
   cd Finance-Dashboard-UI
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:5173` to view the dashboard natively!

## 📂 Project Structure

- `src/components/`: Reusable UI segments (Layout, Overview, Transactions, Insights, Settings).
- `src/context/`: Core business logic containing `FinanceContext.jsx` for global state delivery.
- `src/data/`: `mockData.js` simulating database payload loading.
- `src/App.jsx`: Main routing file managing the tabs interface.

## 📝 Evaluation Criteria Met
- Clean, intuitive, and properly aligned dashboard layout.
- Fully responsive styling that gracefully degrades onto mobile devices.
- Complex array manipulations (sorting, filtering, aggregations) computed smoothly within native React Hooks (`useMemo`).
- Graceful handling of empty states.