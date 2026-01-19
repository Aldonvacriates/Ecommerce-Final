import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase/firebase";
import styles from "../styles/auth-styles";

const Logout = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isHoveringSubmit, setIsHoveringSubmit] = useState(false);
  const [isHoveringGhost, setIsHoveringGhost] = useState(false);

  const handleLogout = async () => {
    setError(null);
    try {
      setLoading(true);
      await signOut(auth);
      navigate("/");
    } catch (err) {
      const message = (err as { message?: string })?.message || "Sign out failed. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <span style={styles.orb} aria-hidden />
        <span style={styles.orbAlt} aria-hidden />

        <div style={styles.hero}>
          <span style={styles.eyebrow}>Wrap it up</span>
          <h1 style={styles.title}>Ready to sign out?</h1>
          <p style={styles.subtitle}>
            We’ll keep your cart and preferences saved to your account. You can jump back in anytime.
          </p>

          <div style={styles.featureCard}>
            <div style={styles.badge}>Secure session</div>
            <h3 style={styles.featureTitle}>What happens next?</h3>
            <p style={styles.featureText}>
              We’ll end your session across this device. You can sign back in with the same email and
              password to pick up where you left off.
            </p>
          </div>
        </div>

        <div style={styles.form}>
          {error && (
            <div style={{ ...styles.featureCard, borderColor: "rgba(239, 68, 68, 0.4)" }}>
              <div style={{ ...styles.badge, color: "#fecdd3", background: "rgba(239, 68, 68, 0.12)" }}>
                Something went wrong
              </div>
              <p style={styles.featureText}>{error}</p>
            </div>
          )}

          <div style={styles.actions}>
            <button
              type="button"
              disabled={loading}
              style={{
                ...styles.submit,
                ...(isHoveringSubmit ? styles.submitHover : {}),
                opacity: loading ? 0.8 : 1,
                cursor: loading ? "not-allowed" : "pointer",
              }}
              onMouseEnter={() => setIsHoveringSubmit(true)}
              onMouseLeave={() => setIsHoveringSubmit(false)}
              onClick={handleLogout}
            >
              {loading ? "Signing you out..." : "Sign out securely"}
            </button>

            <button
              type="button"
              style={{ ...styles.ghostButton, ...(isHoveringGhost ? styles.ghostButtonHover : {}) }}
              onMouseEnter={() => setIsHoveringGhost(true)}
              onMouseLeave={() => setIsHoveringGhost(false)}
              onClick={() => navigate(-1)}
            >
              Stay logged in
            </button>
          </div>

          <div style={styles.footer}>
            Need help? <Link to="/profile" style={styles.link}>Visit support</Link> or{" "}
            <Link to="/" style={styles.link}>go back home</Link>.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Logout;
