import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/layout/Sidebar";
import TopBar from "./components/layout/TopBar";
import Dashboard from "./pages/Dashboard";
import Visualizations from "./pages/Visualizations";
import Logs from "./pages/Logs";
import SystemChecks from './pages/SystemChecks';
import Search from './pages/Search';

export default function App() {
  const [isDark, setIsDark] = useState(() => {
    // Check local storage or system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    // Update document class and localStorage when theme changes
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
        <Sidebar />
        <TopBar toggleTheme={() => setIsDark(!isDark)} isDark={isDark} />
        <main className="ml-64 pt-16 min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/visualizations" element={<Visualizations />} />
            <Route path="/checks" element={<SystemChecks />} />
            <Route path="/logs" element={<Logs />} />
            <Route path="/search" element={<Search />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
