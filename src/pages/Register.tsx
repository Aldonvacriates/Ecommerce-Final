import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import type { FormEvent, FocusEvent, ChangeEvent } from "react";
import { auth } from "../lib/firebase/firebase";
import styles from "../styles/auth-styles";

type FormState = {
  name: string;
  email: string;
  password: string;
  confirm: string;
};

type FocusKey = keyof FormState | null;

const Register = () => {
  const navigate = useNavigate();
  // Core form state + UI affordances for focus/hover/loading/error
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
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

  // Client-side guardrails then Firebase sign-up + profile display name update
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!form.name.trim()) {
      setError("Please add your name so we can personalize your account.");
      return;
    }

    if (form.password !== form.confirm) {
      setError("Passwords must match before we can sign you up.");
      return;
    }

    try {
      setLoading(true);
      const credential = await createUserWithEmailAndPassword(auth, form.email, form.password);
      await updateProfile(credential.user, { displayName: form.name.trim() });
      navigate("/profile");
    } catch (err) {
      const message =
        (err as { message?: string })?.message || "Something went wrong while creating your account.";
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
          <span style={styles.eyebrow}>Register now!</span>
          <h1 style={styles.title}>Create your account</h1>
          <p style={styles.subtitle}>
            Save your cart, track orders, and get early access to drops. It takes less than a minute.
          </p>

          <div style={styles.featureCard}>
            <div style={styles.badge}>Secure by Firebase Auth</div>
            <h3 style={styles.featureTitle}>Why create an account?</h3>
            <p style={styles.featureText}>
              Faster checkout, synced preferences across devices, and personalized picks powered by your
              profile.
            </p>
          </div>
        </div>

        <form style={styles.form} onSubmit={handleSubmit} noValidate>
          <div style={styles.field}>
            <label style={styles.label} htmlFor="name">
              Full name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              value={form.name}
              onChange={onChange}
              onFocus={onFocus}
              onBlur={onBlur}
              style={{ ...styles.input, ...(focusKey === "name" ? styles.inputFocus : {}) }}
              placeholder="Aldo Doe"
            />
          </div>

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
              autoComplete="new-password"
              required
              value={form.password}
              onChange={onChange}
              onFocus={onFocus}
              onBlur={onBlur}
              style={{ ...styles.input, ...(focusKey === "password" ? styles.inputFocus : {}) }}
              placeholder="Create a strong password"
              minLength={6}
            />
            <span style={styles.hint}>At least 6 characters for Firebase auth.</span>
          </div>

          <div style={styles.field}>
            <label style={styles.label} htmlFor="confirm">
              Confirm password
            </label>
            <input
              id="confirm"
              name="confirm"
              type="password"
              autoComplete="new-password"
              required
              value={form.confirm}
              onChange={onChange}
              onFocus={onFocus}
              onBlur={onBlur}
              style={{ ...styles.input, ...(focusKey === "confirm" ? styles.inputFocus : {}) }}
              placeholder="Repeat your password"
              minLength={6}
            />
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
              {loading ? "Creating your account..." : "Create account"}
            </button>

            <button
              type="button"
              style={{
                ...styles.ghostButton,
                ...(isHoveringGhost ? styles.ghostButtonHover : {}),
              }}
              onMouseEnter={() => setIsHoveringGhost(true)}
              onMouseLeave={() => setIsHoveringGhost(false)}
              onClick={() => navigate("/login")}
            >
              Already registered? Sign in
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
            . Need help? <Link to="/profile" style={styles.link}>Visit support</Link>.
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
