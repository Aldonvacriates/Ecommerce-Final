import { useEffect, useState } from "react";

const getInitialMatch = (query: string) => {
  if (typeof window === "undefined" || typeof window.matchMedia === "undefined") return false;
  return window.matchMedia(query).matches;
};

export const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState<boolean>(() => getInitialMatch(query));

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia === "undefined") return undefined;

    const mediaQueryList = window.matchMedia(query);
    const handleChange = (event: MediaQueryListEvent) => setMatches(event.matches);

    // Sync once on mount in case of hydration differences
    setMatches(mediaQueryList.matches);
    mediaQueryList.addEventListener("change", handleChange);

    return () => mediaQueryList.removeEventListener("change", handleChange);
  }, [query]);

  return matches;
};
