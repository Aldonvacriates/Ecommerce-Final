import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import type { FormEvent, ChangeEvent, FocusEvent } from "react";
import { auth } from "../lib/firebase/firebase";
import styles from "../styles/auth-styles";

type FormState = {
  email: string;
  password: string;
};

type FocusKey = keyof FormState | null;

const Login = () => {
  const navigate = useNavigate();
  // Core form state + UI affordances for focus/hover/loading/error
  const [form, setForm] = useState<FormState>({ email: "", password: "" });
  const [focusKey, setFocusKey] = useState<FocusKey>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isHoveringSubmit, setIsHoveringSubmit] = useState(false);
  const [isHoveringGhost, setIsHoveringGhost] = useState(false);

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

    if (!form.email.trim() || !form.password.trim()) {
      setError("Email and password are required to sign in.");
      return;
    }

    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, form.email, form.password);
      navigate("/");
    } catch (err) {
      const message =
        (err as { message?: string })?.message || "We couldn't sign you in. Please try again.";
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
          <span style={styles.eyebrow}>Welcome back</span>
          <h1 style={styles.title}>Sign in to continue</h1>
          <p style={styles.subtitle}>
            Access your saved cart, orders, and personalized picks. Two fields and you’re in.
          </p>

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
              style={{ ...styles.input, ...(focusKey === "email" ? styles.inputFocus : {}) }}
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
              style={{ ...styles.input, ...(focusKey === "password" ? styles.inputFocus : {}) }}
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
            </div>
          )}

          <div style={styles.actions}>
            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.submit,
                ...(isHoveringSubmit ? styles.submitHover : {}),
                opacity: loading ? 0.8 : 1,
                cursor: loading ? "not-allowed" : "pointer",
              }}
              onMouseEnter={() => setIsHoveringSubmit(true)}
              onMouseLeave={() => setIsHoveringSubmit(false)}
            >
              {loading ? "Signing you in..." : "Sign in"}
            </button>

            <button
              type="button"
              style={{
                ...styles.ghostButton,
                ...(isHoveringGhost ? styles.ghostButtonHover : {}),
              }}
              onMouseEnter={() => setIsHoveringGhost(true)}
              onMouseLeave={() => setIsHoveringGhost(false)}
              onClick={() => navigate("/register")}
            >
              New here? Create account
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
