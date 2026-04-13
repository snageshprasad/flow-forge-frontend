/* eslint-disable react-hooks/immutability */
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";

const toastConfig = {
  success: {
    bg: "#0F2018",
    border: "#1A4030",
    color: "#4DB880",
    icon: CheckCircle,
  },
  error: {
    bg: "#1E0F0F",
    border: "#3D1515",
    color: "#E06060",
    icon: XCircle,
  },
  warning: {
    bg: "#1E1C0F",
    border: "#3A3010",
    color: "#C8A840",
    icon: AlertTriangle,
  },
  info: {
    bg: "#0F1219",
    border: "#1E2240",
    color: "#7B8FFF",
    icon: Info,
  },
};

const ToastItem = ({ id, type = "success", message, onRemove }) => {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const config = toastConfig[type] || toastConfig.success;
  const Icon = config.icon;

  useEffect(() => {
    const enter = setTimeout(() => setVisible(true), 10);
    const leave = setTimeout(() => handleRemove(), 3500);
    return () => {
      clearTimeout(enter);
      clearTimeout(leave);
    };
  }, []);

  const handleRemove = () => {
    setLeaving(true);
    setTimeout(() => onRemove(id), 300);
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "11px 14px",
        borderRadius: "10px",
        border: `0.5px solid ${config.border}`,
        background: config.bg,
        minWidth: "260px",
        maxWidth: "360px",
        opacity: visible && !leaving ? 1 : 0,
        transform: visible && !leaving ? "translateX(0)" : "translateX(20px)",
        transition: "opacity 0.25s, transform 0.25s",
        boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
      }}
    >
      <Icon size={15} color={config.color} style={{ flexShrink: 0 }} />
      <p
        style={{
          color: config.color,
          fontSize: "13px",
          fontWeight: 500,
          flex: 1,
          lineHeight: 1.4,
        }}
      >
        {message}
      </p>
      <button
        onClick={handleRemove}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: config.color,
          opacity: 0.6,
          display: "flex",
          alignItems: "center",
          padding: 0,
          flexShrink: 0,
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.6")}
      >
        <X size={13} />
      </button>
    </div>
  );
};

export const ToastContainer = ({ toasts, onRemove }) => {
  return createPortal(
    <div
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} {...toast} onRemove={onRemove} />
      ))}
    </div>,
    document.body,
  );
};

export default ToastItem;
