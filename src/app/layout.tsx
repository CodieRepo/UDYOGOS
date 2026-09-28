import type { Metadata } from "next";
import "./globals.css";
import { ComplianceProvider } from "../context/ComplianceContext";

export const metadata: Metadata = {
  title: "UDYOGSETU (उद्योगसेतु) | Industrial Approval Dependency Platform",
  description:
    "SIH 2026 Problem Statement SIH26130 — Industrial Approval Dependency & Critical-Path Execution Platform with real-time state recalculation and parallel execution intelligence.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        <ComplianceProvider>{children}</ComplianceProvider>
      </body>
    </html>
  );
}
