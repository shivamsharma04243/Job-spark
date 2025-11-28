// src/layouts/Layout.jsx
import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../../components/ui/navbar.jsx";
import Footer from "../../components/ui/footer.jsx";

/**
 * Layout that hides the footer on selected routes (auth pages).
 */
const Layout = () => {
  const { pathname } = useLocation();

  // Routes where we DON'T want to show the footer.
  // Add or remove paths as needed.
  const noFooterRoutes = [
    "/sign-in",
    "/sign-up",
    "/forgot",
    // if you have alternate routes, add them:
    // "/auth/register", "/auth/login"
  ];

  // You can use exact match or pattern match. Example below uses exact match first,
  // then allows startsWith checks if you want to hide footer for entire subpaths.
  const hideFooter =
    noFooterRoutes.includes(pathname) ||
    noFooterRoutes.some((p) => pathname.startsWith(p + "/"));

  return (
    <div className="min-h-screen flex flex-col">
      <header>
        <Navbar />
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      {!hideFooter && (
        <footer>
          <Footer />
        </footer>
      )}
    </div>
  );
};

export default Layout;