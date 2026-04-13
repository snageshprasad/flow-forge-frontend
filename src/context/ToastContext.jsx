/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext } from "react";
import { useToast } from "../hooks/useToast";
import { ToastContainer } from "../components/ui/Toast";

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const { toasts, toast, removeToast } = useToast();
  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
};

export const useToastContext = () => useContext(ToastContext);
