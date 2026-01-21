import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import BurgerButton from "./BurgerButton";
import MobileMenu from "./MobileMenu";
import type { NavLinkItem, NavVariant } from "./navLinks";
import { navLinks } from "./navLinks";
import "./Navbar.css";

const Navbar = () => {
  // Responsive nav that swaps between inline links and an animated mobile sheet.
  const { user } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const toggleRef = useRef<HTMLButtonElement | null>(null);

  // Hide or show certain links based on auth state.
  const visibleLinks = useMemo(
    () =>
      navLinks.filter((link) => {
        if (link.audience === "authenticated" && !user) return false;
        if (link.audience === "guest" && user) return false;
        return true;
      }),
    [user]
  );

  const mainLinks = useMemo(
    () => visibleLinks.filter((link) => link.section === "main"),
    [visibleLinks]
  );

  const actionLinks = useMemo(
    () => visibleLinks.filter((link) => link.section === "actions"),
    [visibleLinks]
  );

  // Close the sheet when users click outside or hit Escape.
  useEffect(() => {
    if (!isOpen) return;
    const handlePointer = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      if (menuRef.current?.contains(target)) return;
      if (toggleRef.current?.contains(target)) return;
      setIsOpen(false);
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("mousedown", handlePointer);
    document.addEventListener("touchstart", handlePointer);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handlePointer);
      document.removeEventListener("touchstart", handlePointer);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  // Also close the menu on route change to avoid stale overlays.
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const variantClass = (variant: NavVariant = "link") => {
    if (variant === "primary") return "nav-btn nav-btn--primary";
    if (variant === "ghost") return "nav-btn nav-btn--ghost";
    return "nav-btn nav-btn--link";
  };

  const closeMenu = () => setIsOpen(false);

  return (
    <header className="nav-shell">
      <div className="nav-inner">
        <Link to="/" className="nav-logo">
          Aldo Website
        </Link>

        <nav className="nav-links" aria-label="Main navigation">
          {mainLinks.map((link) => (
            <Link key={link.path} className="nav-link" to={link.path}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="nav-actions">
          {actionLinks.map((link: NavLinkItem) => (
            <Link key={link.path} className={variantClass(link.variant)} to={link.path}>
              {link.label}
            </Link>
          ))}
        </div>

        <div className="nav-mobile-toggle">
          <BurgerButton isOpen={isOpen} ref={toggleRef} onClick={() => setIsOpen((prev) => !prev)} />
        </div>
      </div>

      <MobileMenu
        isOpen={isOpen}
        menuRef={menuRef}
        mainLinks={mainLinks}
        actionLinks={actionLinks}
        onNavigate={closeMenu}
        slideDirection="top"
      />
    </header>
  );
};

export default Navbar;
