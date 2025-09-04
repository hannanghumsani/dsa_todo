// import type { Metadata } from "next";
"use client";
import "./globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();

  return (
    <html lang="en">
      <body className="bg-black">
        <ToastContainer />
        {children}
      </body>
    </html>
  );
}
