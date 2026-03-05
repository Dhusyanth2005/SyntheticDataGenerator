import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";

import Register from "./pages/Register";
import Login from "./pages/Login";
import DashboardLayout from "./layouts/DashboardLayout";

import Main from "./pages/Main";
import Generate from "./pages/Generate";
import History from "./pages/History";
import Settings from "./pages/Settings";

const globalStyles = `
  *, *::before, *::after {
    box-sizing: border-box;
  }

  html, body, #root {
    height: 100%;
    margin: 0;
    padding: 0;
    background: #0a0a0c;
    color: #e5e5ea;
  }
`;

export default function App() {
  return (
    <>
      <style>{globalStyles}</style>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <BrowserRouter>
          <Routes>
            {/* Auth */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* App */}
            <Route
              path="/dashboard"
              element={
                <DashboardLayout
                  title="Dashboard"
                  breadcrumbs={[{ label: "Dashboard", path: "/dashboard" }]}
                >
                  <Main />
                </DashboardLayout>
              }
            />

            <Route
              path="/generate"
              element={
                <DashboardLayout
                  title="Generate"
                  breadcrumbs={[{ label: "Generate", path: "/generate" }]}
                >
                  <Generate />
                </DashboardLayout>
              }
            />

            <Route
              path="/history"
              element={
                <DashboardLayout
                  title="History"
                  breadcrumbs={[{ label: "History", path: "/history" }]}
                >
                  <History />
                </DashboardLayout>
              }
            />

            <Route
              path="/settings"
              element={
                <DashboardLayout
                  title="Settings"
                  breadcrumbs={[{ label: "Settings", path: "/settings" }]}
                >
                  <Settings />
                </DashboardLayout>
              }
            />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </>
  );
}
