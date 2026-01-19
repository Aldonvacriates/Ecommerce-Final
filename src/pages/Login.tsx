import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import type { FormEvent, ChangeEvent, FocusEvent } from "react";
import type { CSSProperties } from "react";
import { auth } from "../lib/firebase/firebase";
import { useAuth } from "../context/AuthContext";
import { useMediaQuery } from "../hooks/useMediaQuery";
import styles from "../styles/auth-styles";

type FormState = {
  email: string;
  password: string;
};

type FocusKey = keyof FormState | null;

const Login = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const isNarrow = useMediaQuery("(max-width: 640px)");
  // Core form state + UI affordances for focus/hover/loading/error; seed email if user is already known
  const [form, setForm] = useState<FormState>(() => ({
    email: user?.email ?? "",
    password: "",
  }));
  const [focusKey, setFocusKey] = useState<FocusKey>(null);
  const [error, setError] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isHoveringSubmit, setIsHoveringSubmit] = useState(false);
  const [isHoveringGhost, setIsHoveringGhost] = useState(false);

  const inputStyle = (key: keyof FormState) => ({
    ...styles.input,
    ...(focusKey === key ? styles.inputFocus : {}),
  });

  // If a user is already signed in, redirect them away from the login page and keep form email in sync
  useEffect(() => {
    if (user) {
      navigate("/profile", { replace: true });
      setForm((prev) => ({ ...prev, email: user.email ?? prev.email }));
    }
  }, [user, navigate]);

  // Keep inputs controlled and remember which field has focus for styling
  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const onFocus = (event: FocusEvent<HTMLInputElement>) => {
    setFocusKey(event.target.name as FocusKey);
  };

  const onBlur = () => setFocusKey(null);

  // Client-side guardrails then Firebase sign-in
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setErrorCode(null);

    if (!form.email.trim() || !form.password.trim()) {
      setError("Email and password are required to sign in.");
      return;
    }

    try {
      setLoading(true);
      const credential = await signInWithEmailAndPassword(auth, form.email, form.password);
      setUser(credential.user);
      navigate("/profile");
    } catch (err) {
      const errorData = err as { code?: string; message?: string };
      const code = errorData?.code ?? null;
      setErrorCode(code);

      const friendlyByCode: Record<string, string> = {
        "auth/user-not-found": "This account doesn't exist. Please register first.",
        "auth/invalid-credential": "Email or password is incorrect. Please try again.",
        "auth/invalid-email": "That email looks invalid. Double-check and try again.",
        "auth/wrong-password": "Email or password is incorrect. Please try again.",
        "auth/too-many-requests": "Too many attempts. Please wait a moment and try again.",
      };

      const message =
        (code && friendlyByCode[code]) ||
        "We couldn't sign you in. Please try again.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const submitStyle = {
    ...styles.submit,
    ...(isHoveringSubmit ? styles.submitHover : {}),
    opacity: loading ? 0.8 : 1,
    cursor: loading ? "not-allowed" : "pointer",
    ...(isNarrow ? { width: "100%" } : {}),
  };

  const ghostStyle = {
    ...styles.ghostButton,
    ...(isHoveringGhost ? styles.ghostButtonHover : {}),
    ...(isNarrow ? { width: "100%" } : {}),
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

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <span style={styles.orb} aria-hidden />
        <span style={styles.orbAlt} aria-hidden />

        <div style={heroStyle}>
          <span style={styles.eyebrow}>Welcome back</span>
          <h1 style={styles.title}>Sign in to continue</h1>
          <p style={styles.subtitle}>
            Access your saved cart, orders, and personalized picks. Two fields and you’re in.
          </p>
          {user?.email && (
            <p style={styles.hint}>You’re currently signed in as {user.email}.</p>
          )}

          <div style={styles.featureCard}>
            <div style={styles.badge}>Trusted sign-in</div>
            <h3 style={styles.featureTitle}>Quick and secure</h3>
            <p style={styles.featureText}>
              We use Firebase Auth to keep your account safe. Sign in and pick up where you left off across
              devices.
            </p>
          </div>
        </div>

        <form style={styles.form} onSubmit={handleSubmit} noValidate>
          <div style={styles.field}>
            <label style={styles.label} htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={form.email}
              onChange={onChange}
              onFocus={onFocus}
              onBlur={onBlur}
              style={inputStyle("email")}
              placeholder="you@example.com"
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label} htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={form.password}
              onChange={onChange}
              onFocus={onFocus}
              onBlur={onBlur}
              style={inputStyle("password")}
              placeholder="Your password"
            />
            <span style={styles.hint}>
              <Link to="#" style={styles.link}>
                Forgot your password?
              </Link>
            </span>
          </div>

          {error && (
            <div style={{ ...styles.featureCard, borderColor: "rgba(239, 68, 68, 0.4)" }}>
              <div style={{ ...styles.badge, color: "#fecdd3", background: "rgba(239, 68, 68, 0.12)" }}>
                Something went wrong
              </div>
              <p style={styles.featureText}>{error}</p>
              {errorCode === "auth/user-not-found" && (
                <button
                  type="button"
                  style={{ ...styles.submit, width: "100%" }}
                  onClick={() => navigate("/register")}
                >
                  <span style={styles.buttonLabel}>Go to registration</span>
                </button>
              )}
            </div>
          )}

          <div style={actionsStyle}>
            <button
              type="submit"
              disabled={loading}
              style={submitStyle}
              onMouseEnter={() => setIsHoveringSubmit(true)}
              onMouseLeave={() => setIsHoveringSubmit(false)}
            >
              <span style={styles.buttonLabel}>
                {loading ? "Signing you in..." : "Sign in"}
              </span>
            </button>

            <button
              type="button"
              style={ghostStyle}
              onMouseEnter={() => setIsHoveringGhost(true)}
              onMouseLeave={() => setIsHoveringGhost(false)}
              onClick={() => navigate("/register")}
            >
              <span style={styles.buttonLabel}>New here? Create account</span>
            </button>
          </div>

          <div style={styles.footer}>
            By continuing you agree to our{" "}
            <a style={styles.link} href="#">
              terms
            </a>{" "}
            and{" "}
            <a style={styles.link} href="#">
              privacy policy
            </a>
            . Prefer to browse? <Link to="/" style={styles.link}>Return home</Link>.
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
