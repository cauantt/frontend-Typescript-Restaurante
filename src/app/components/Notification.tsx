// Notification.tsx
import React from "react";
import { toast, ToastOptions, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Tipagem para os tipos de notificação que suportamos
type NotificationType = "info" | "success" | "warning" | "error";

// Função para exibir notificações
export const notify = (message: string, type: NotificationType, options?: ToastOptions) => {
  switch (type) {
    case "success":
      toast.success(message, options);
      break;
    case "info":
      toast.info(message, options);
      break;
    case "warning":
      toast.warning(message, options);
      break;
    case "error":
      toast.error(message, options);
      break;
    default:
      toast(message, options);
  }
};

// Componente customizado para um exemplo de aviso
export const CustomToast: React.FC<{ closeToast: () => void }> = ({ closeToast }) => (
  <div style={{ color: "#333", padding: "10px", borderRadius: "5px", backgroundColor: "#fff", boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)" }}>
    <p style={{ margin: "0 0 10px 0" }}>Something Went Wrong!</p>
    <button
      onClick={closeToast}
      style={{
        padding: "5px 10px",
        backgroundColor: "#f44336",
        color: "#fff",
        border: "none",
        borderRadius: "3px",
        cursor: "pointer",
      }}
    >
      Close
    </button>
  </div>
);

// Componente para renderizar ToastContainer
export const NotificationContainer: React.FC = () => (
  <ToastContainer
    position="top-right"
    autoClose={5000}
    hideProgressBar={false}
    newestOnTop={false}
    closeOnClick
    pauseOnFocusLoss
    draggable
    pauseOnHover
  />
);
