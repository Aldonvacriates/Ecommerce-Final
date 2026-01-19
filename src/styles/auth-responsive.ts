import type { CSSProperties } from "react";
import styles from "./auth-styles";

export const getAuthLayoutStyles = (isNarrow: boolean) => {
  const page: CSSProperties = isNarrow
    ? { ...styles.page, padding: "32px 14px 48px" }
    : styles.page;

  const card: CSSProperties = isNarrow
    ? { ...styles.card, gridTemplateColumns: "1fr", padding: "20px 16px 26px", gap: "18px" }
    : styles.card;

  const hero: CSSProperties = isNarrow
    ? { ...styles.hero, textAlign: "center", alignItems: "center" }
    : styles.hero;

  const actions: CSSProperties = isNarrow
    ? { ...styles.actions, flexDirection: "column", alignItems: "stretch", gap: "10px" }
    : styles.actions;

  const buttonNarrow: CSSProperties = isNarrow
    ? {
        width: "100%",
        minWidth: "0",
        maxWidth: "100%",
        alignSelf: "stretch",
        padding: "11px 16px",
        borderRadius: "12px",
        fontSize: "14px",
      }
    : {};

  const buttonDesktop: CSSProperties = isNarrow
    ? {}
    : {
        flex: "1 1 220px",
        width: "100%",
        maxWidth: "260px",
      };

  return { page, card, hero, actions, buttonNarrow, buttonDesktop };
};
