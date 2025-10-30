"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Define routes where Navbar should be hidden
  const hideNavbarRoutes = ["/dashboard", "/interview"];
  const hideNavbar = hideNavbarRoutes.some((route) => pathname.startsWith(route));

  return (
    <>
      {!hideNavbar && <Navbar />}
      {children}
    </>
  );
}
