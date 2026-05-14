"use client";

import React from "react";
import { AuthContextProvider } from "../../context/AuthContext";
import { ComparisonProvider } from "../../context/ComparisonContext";
import { ThemeProvider } from "../../context/ThemeContext";
import { ToastProvider } from "../Common/ToastProvider";

export default function Providers({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthContextProvider>
          <ComparisonProvider>{children}</ComparisonProvider>
        </AuthContextProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
