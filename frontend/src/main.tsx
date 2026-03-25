// src/main.tsx

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <Toaster
        position="top-right"
        gutter={10}
        toastOptions={{
          duration: 4000,
          style: {
            // Base toast style — cream background matching app theme
            background: "#FDF6E3",
            color: "#1A0E05",
            border: "1.5px solid #E0D0BC",
            borderRadius: "14px",
            padding: "12px 16px",
            fontSize: "14px",
            fontWeight: "600",
            boxShadow: "0 8px 32px rgba(74,46,21,0.12), 0 2px 8px rgba(74,46,21,0.08)",
            maxWidth: "360px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          },
          success: {
            style: {
              background: "#F0FDF4",
              color: "#14532D",
              border: "1.5px solid #BBF7D0",
              borderLeft: "4px solid #16A34A",
            },
            iconTheme: {
              primary: "#16A34A",
              secondary: "#F0FDF4",
            },
          },
          error: {
            style: {
              background: "#FEF2F2",
              color: "#7F1D1D",
              border: "1.5px solid #FECACA",
              borderLeft: "4px solid #DC2626",
            },
            iconTheme: {
              primary: "#DC2626",
              secondary: "#FEF2F2",
            },
          },
          loading: {
            style: {
              background: "#FDF6E3",
              color: "#4A2E15",
              border: "1.5px solid #E0D0BC",
              borderLeft: "4px solid #E6A817",
            },
            iconTheme: {
              primary: "#E6A817",
              secondary: "#FDF6E3",
            },
          },
        }}
      />
      <App />
    </AuthProvider>
  </StrictMode>,
)