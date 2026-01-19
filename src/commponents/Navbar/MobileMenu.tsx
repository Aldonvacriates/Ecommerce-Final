import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import type { RefObject } from "react";
import type { NavLinkItem } from "./navLinks";

type SlideDirection = "top" | "right";

type MobileMenuProps = {
  isOpen: boolean;
  menuRef: RefObject<HTMLDivElement | null>;
  mainLinks: NavLinkItem[];
  actionLinks: NavLinkItem[];
  onNavigate: () => void;
  slideDirection?: SlideDirection;
};

const focusableSelector =
  'a[href]:not([tabindex="-1"]), button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

const MobileMenu = ({ isOpen, menuRef, mainLinks, actionLinks, onNavigate, slideDirection = "top" }: MobileMenuProps) => {
  const slideVariants =
    slideDirection === "right"
      ? { initial: { opacity: 0, x: 24 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: 24 } }
      : { initial: { opacity: 0, y: -16 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -16 } };

  useEffect(() => {
    if (!isOpen || !menuRef.current) return;
    const focusables = Array.from(menuRef.current.querySelectorAll<HTMLElement>(focusableSelector));
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    first?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab" || focusables.length === 0) return;
      if (event.shiftKey) {
        if (document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        }
      } else if (document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, menuRef]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={menuRef}
          className="mobile-menu-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          aria-hidden={!isOpen}
        >
          <motion.div
            className="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
            tabIndex={-1}
            initial={slideVariants.initial}
            animate={slideVariants.animate}
            exit={slideVariants.exit}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            <nav className="mobile-links" aria-label="Mobile navigation">
              {mainLinks.map((link) => (
                <Link key={link.path} to={link.path} className="mobile-link" onClick={onNavigate}>
                  <span>{link.label}</span>
                  <span aria-hidden="true" className="mobile-link__chevron">
                    →
                  </span>
                </Link>
              ))}
            </nav>

            {actionLinks.length > 0 && (
              <div className="mobile-actions">
                {actionLinks.map((link) => (
                  <Link key={link.path} to={link.path} className={`mobile-btn mobile-btn--${link.variant ?? "link"}`} onClick={onNavigate}>
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;
