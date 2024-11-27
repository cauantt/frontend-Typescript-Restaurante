// NotificationTrigger.tsx
import React from "react";
import { notify, NotificationContainer } from "./Notification"; // Ajuste o caminho conforme necessário
import { ToastOptions } from "react-toastify";

// Define os props que o componente irá aceitar
type NotificationTriggerProps = {
  message: string;
  type: "info" | "success" | "warning" | "error";
  options?: ToastOptions; // Opções opcionais para personalizar a notificação
};

const NotificationTrigger: React.FC<NotificationTriggerProps> = ({ message, type, options }) => {
  // Função para disparar a notificação
  const handleShowNotification = () => {
    notify(message, type, options);
  };

  return (
    <div>
      
     
      <NotificationContainer />
    </div>
  );
};

export default NotificationTrigger;
