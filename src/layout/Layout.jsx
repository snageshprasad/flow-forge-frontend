import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { ToastProvider } from "../context/ToastContext";

export default function Layout({ title, actions }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <ToastProvider>
      <div
        style={{
          display: "flex",
          height: "100vh",
          background: "var(--bg-primary)",
          overflow: "hidden",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        <Sidebar
          collapsed={collapsed}
          onToggle={() => setCollapsed((p) => !p)}
        />

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
            overflow: "hidden",
          }}
        >
          <Topbar title={title} actions={actions} />

          <main
            style={{
              flex: 1,
              overflowY: "auto",
              background: "var(--bg-primary)",
              padding: "24px",
            }}
          >
            <Outlet />
          </main>
        </div>
      </div>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');`}</style>
    </ToastProvider>
  );
}
