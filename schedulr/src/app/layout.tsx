"use client";
import type { Metadata } from "next";
import "./globals.scss";
import { GoogleOAuthProvider } from '@react-oauth/google';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/footer/Footer';

// export const metadata: Metadata = {
//   title: "Create Next App",
//   description: "Generated by create next app",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
          <Navbar />
          {children}
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
