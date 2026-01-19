import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import styles from "../styles/auth-styles";
import { deleteUser, updateProfile } from "firebase/auth";
import { auth } from "../lib/firebase/firebase";
import { useMediaQuery } from "../hooks/useMediaQuery";
import type { CSSProperties } from "react";

const Profile = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const isNarrow = useMediaQuery("(max-width: 640px)");
  const [name, setName] = useState(user?.displayName ?? "");
  const [focusKey, setFocusKey] = useState<"name" | null>(null);
  const [loading, setLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [deleteSuccessModalOpen, setDeleteSuccessModalOpen] = useState(false);

  // Redirect guests to login and avoid flashing a broken profile view
  useEffect(() => {
    if (!user && !deleteSuccessModalOpen) navigate("/login", { replace: true });
  }, [user, navigate, deleteSuccessModalOpen]);

  const statCard = (label: string, value: string) => (
    <div style={styles.featureCard}>
      <h3 style={styles.featureTitle}>{label}</h3>
      <p style={styles.featureText}>{value}</p>
    </div>
  );

  const handleNameUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!user) {
      setError("You need to be signed in to update your profile.");
      return;
    }

    const nextName = name.trim();
    if (!nextName) {
      setError("Name cannot be empty.");
      return;
    }

    try {
      setLoading(true);
      await updateProfile(user, { displayName: nextName });
      // Firebase mutates the currentUser in place; re-read to keep context in sync
      setUser(auth.currentUser);
      setSuccess("Name updated successfully.");
    } catch (err) {
      const message = (err as { message?: string })?.message || "Unable to update name right now.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setError(null);
    setSuccess(null);

    const confirmed = window.confirm("Delete your account permanently? This cannot be undone.");
    if (!confirmed) return;

    const currentUser = auth.currentUser;
    if (!currentUser) {
      setError("You need to be signed in to delete your account.");
      return;
    }

    try {
      setIsDeleting(true);
      // Ensure we have a fresh auth state before attempting deletion
      await currentUser.reload();
      await deleteUser(currentUser);
      setUser(null);
      setDeleteSuccessModalOpen(true);
    } catch (err) {
      const errorData = err as { code?: string; message?: string };
      const message =
        errorData?.code === "auth/requires-recent-login"
          ? "Please sign in again to delete your account."
          : errorData?.message || "Unable to delete your account right now.";
      setError(message);
    } finally {
      setIsDeleting(false);
    }
  };

  const inputStyle = {
    ...styles.input,
    ...(focusKey === "name" ? styles.inputFocus : {}),
  };

  const pageStyle: CSSProperties = isNarrow
    ? { ...styles.page, padding: "32px 14px 48px" }
    : styles.page;
  const cardStyle: CSSProperties = isNarrow
    ? { ...styles.card, gridTemplateColumns: "1fr", padding: "20px 16px 26px", gap: "18px" }
    : styles.card;
  const heroStyle: CSSProperties = isNarrow
    ? { ...styles.hero, textAlign: "center", alignItems: "center" }
    : styles.hero;
  const actionsStyle: CSSProperties = isNarrow
    ? { ...styles.actions, flexDirection: "column", alignItems: "stretch", gap: "10px" }
    : styles.actions;

  const primaryButtonStyle: CSSProperties = {
    ...styles.submit,
    opacity: loading || isDeleting ? 0.8 : 1,
    cursor: loading || isDeleting ? "not-allowed" : "pointer",
    ...(isNarrow
      ? {
          width: "100%",
          minWidth: "0",
          maxWidth: "100%",
          alignSelf: "stretch",
          padding: "5px 8px",
          borderRadius: "12px",
          fontSize: "14px",
        }
      : {}),
  };

  const signOutStyle: CSSProperties = {
    ...styles.ghostButton,
    ...(isNarrow
      ? {
          width: "100%",
          minWidth: "0",
          maxWidth: "100%",
          alignSelf: "stretch",
          padding: "5px 8px",
          borderRadius: "12px",
          fontSize: "14px",
        }
      : {}),
  };

  const deleteStyle: CSSProperties = {
    ...styles.ghostButton,
    borderColor: "rgba(239, 68, 68, 0.35)",
    color: "#fecdd3",
    background: "rgba(239, 68, 68, 0.08)",
    opacity: isDeleting || loading ? 0.8 : 1,
    cursor: isDeleting || loading ? "not-allowed" : "pointer",
    ...(isNarrow
      ? {
          width: "100%",
          minWidth: "0",
          maxWidth: "100%",
          alignSelf: "stretch",
          padding: "5px 8px",
          borderRadius: "12px",
          fontSize: "14px",
        }
      : {}),
  };

  const backStyle: CSSProperties = {
    ...styles.submit,
    ...(isNarrow
      ? {
          width: "100%",
          minWidth: "0",
          maxWidth: "100%",
          alignSelf: "stretch",
          padding: "5px 8px",
          borderRadius: "12px",
          fontSize: "14px",
        }
      : {}),
  };

  const handleCloseModal = () => {
    setDeleteSuccessModalOpen(false);
    navigate("/", { replace: true });
  };

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <span style={styles.orb} aria-hidden />
        <span style={styles.orbAlt} aria-hidden />

        <div style={heroStyle}>
          <span style={styles.eyebrow}>Your account</span>
          <h1 style={styles.title}>Profile overview</h1>
          <p style={styles.subtitle}>
            Manage your identity, see session details, and jump back into shopping with your saved profile.
          </p>
          {user?.email && <div style={styles.badge}>Signed in as {user.email}</div>}
        </div>

        <form style={styles.form} onSubmit={handleNameUpdate}>
          <div style={styles.field}>
            <label style={styles.label} htmlFor="displayName">
              Display name
            </label>
            <input
              id="displayName"
              name="displayName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onFocus={() => setFocusKey("name")}
              onBlur={() => setFocusKey(null)}
              style={inputStyle}
              placeholder="Your name"
            />
            <span style={styles.hint}>Update how your name appears across the app.</span>
          </div>

          {success && (
            <div style={styles.featureCard}>
              <div style={styles.badge}>Profile saved</div>
              <p style={styles.featureText}>{success}</p>
            </div>
          )}

          {error && (
            <div style={{ ...styles.featureCard, borderColor: "rgba(239, 68, 68, 0.4)" }}>
              <div style={{ ...styles.badge, color: "#fecdd3", background: "rgba(239, 68, 68, 0.12)" }}>
                Something went wrong
              </div>
              <p style={styles.featureText}>{error}</p>
            </div>
          )}

          {statCard("Name", user?.displayName || "Not set")}
          {statCard("Email", user?.email || "Unknown")}
          {statCard("UID", user?.uid || "N/A")}
          {statCard("Created", user?.metadata?.creationTime || "—")}
          {statCard("Last login", user?.metadata?.lastSignInTime || "-")}

          <div style={actionsStyle}>
            <button
              type="submit"
              disabled={loading || isDeleting}
              style={primaryButtonStyle}
            >
              <span style={styles.buttonLabel}>
                {loading ? "Updating..." : "Update name"}
              </span>
            </button>
            <button
              type="button"
              style={signOutStyle}
              onClick={() => navigate("/logout")}
            >
              <span style={styles.buttonLabel}>Sign out</span>
            </button>
            <button
              type="button"
              disabled={isDeleting || loading}
              style={deleteStyle}
              onClick={handleDeleteAccount}
            >
              <span style={styles.buttonLabel}>
                {isDeleting ? "Deleting..." : "Delete account"}
              </span>
            </button>
            <button
              type="button"
              style={backStyle}
              onClick={() => navigate("/")}
            >
              <span style={styles.buttonLabel}>Back to shopping</span>
            </button>
          </div>

          <div style={styles.footer}>
            Need account changes?{" "}
            <Link to="/login" style={styles.link}>
              Switch user
            </Link>{" "}
            or{" "}
            <Link to="/" style={styles.link}>
              continue browsing
            </Link>
            .
          </div>
        </form>
      </div>
      {deleteSuccessModalOpen && (
        <div style={styles.modalBackdrop} role="dialog" aria-modal="true" aria-labelledby="delete-success-title">
          <div style={styles.modalCard}>
            <span style={styles.modalAccent}>Account removed</span>
            <h2 id="delete-success-title" style={styles.modalTitle}>
              Deletion successful
            </h2>
            <p style={styles.modalText}>
              Your account has been deleted. Thanks for shopping with us. You can return to the home page anytime.
            </p>
            <div style={styles.modalActions}>
              <button type="button" style={styles.ghostButton} onClick={handleCloseModal}>
                <span style={styles.buttonLabel}>Close</span>
              </button>
              <button type="button" style={styles.submit} onClick={handleCloseModal}>
                <span style={styles.buttonLabel}>Go home</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
