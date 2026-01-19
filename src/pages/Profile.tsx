import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import styles from "../styles/auth-styles";
import { updateProfile } from "firebase/auth";
import { auth } from "../lib/firebase/firebase";

const Profile = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user?.displayName ?? "");
  const [focusKey, setFocusKey] = useState<"name" | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Redirect guests to login and avoid flashing a broken profile view
  useEffect(() => {
    if (!user) navigate("/login", { replace: true });
  }, [user, navigate]);

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

  const inputStyle = {
    ...styles.input,
    ...(focusKey === "name" ? styles.inputFocus : {}),
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <span style={styles.orb} aria-hidden />
        <span style={styles.orbAlt} aria-hidden />

        <div style={styles.hero}>
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
          {statCard("Last login", user?.metadata?.lastSignInTime || "—")}

          <div style={styles.actions}>
            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.submit,
                opacity: loading ? 0.8 : 1,
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Updating..." : "Update "}
            </button>
            <button
              type="button"
              style={styles.ghostButton}
              onClick={() => navigate("/logout")}
            >
              Sign out
            </button>
            <button
              type="button"
              style={styles.submit}
              onClick={() => navigate("/")}
            >
              Back to shopping
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
    </div>
  );
};

export default Profile;
