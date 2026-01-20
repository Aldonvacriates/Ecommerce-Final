import { motion } from "framer-motion";
import { forwardRef } from "react";
import type { ButtonHTMLAttributes, ForwardedRef } from "react";

type BurgerButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  isOpen: boolean;
};

const BurgerButton = forwardRef(function BurgerButton(
  { isOpen, ...rest }: BurgerButtonProps,
  ref: ForwardedRef<HTMLButtonElement>
) {
  // Animated burger icon so the mobile menu state is obvious (X vs stacked lines).
  return (
    <button
      type="button"
      aria-label="Toggle navigation menu"
      aria-expanded={isOpen}
      className="burger-btn"
      ref={ref}
      {...rest}
    >
      <span className="sr-only">Toggle navigation</span>
      <motion.span
        className="burger-line"
        animate={isOpen ? { y: 8, rotate: 45 } : { y: 0, rotate: 0 }}
        transition={{ duration: 0.2 }}
      />
      <motion.span
        className="burger-line"
        animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
        transition={{ duration: 0.15 }}
      />
      <motion.span
        className="burger-line"
        animate={isOpen ? { y: -8, rotate: -45 } : { y: 0, rotate: 0 }}
        transition={{ duration: 0.2 }}
      />
    </button>
  );
});

export default BurgerButton;
