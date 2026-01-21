export type NavAudience = "any" | "authenticated" | "guest";
export type NavSection = "main" | "actions";
export type NavVariant = "link" | "ghost" | "primary";

export type NavLinkItem = {
  label: string;
  path: string;
  section: NavSection;
  audience?: NavAudience;
  variant?: NavVariant;
};

// Central config for navbar links so both desktop and mobile share the same source of truth.
export const navLinks: NavLinkItem[] = [
  { label: "Home", path: "/", section: "main", audience: "any", variant: "link" },
  { label: "Cart", path: "/cart", section: "main", audience: "any", variant: "link" },
  { label: "Profile", path: "/profile", section: "actions", audience: "authenticated", variant: "ghost" },
  { label: "Logout", path: "/logout", section: "actions", audience: "authenticated", variant: "primary" },
  { label: "Register", path: "/register", section: "actions", audience: "guest", variant: "ghost" },
  { label: "Login", path: "/login", section: "actions", audience: "guest", variant: "primary" },
];
