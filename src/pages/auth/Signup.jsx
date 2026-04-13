import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useRegisterMutation } from "../../redux/modules/auth/authApi";
import { setCredentials } from "../../redux/modules/auth/authSlice";

export default function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [register, { isLoading }] = useRegisterMutation();

  const [form, setForm] = useState({
    name: "",
    user_name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    setApiError("");
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name) newErrors.name = "Full name is required";
    if (!form.user_name) newErrors.user_name = "Username is required";
    else if (!/^[a-z0-9_]+$/.test(form.user_name))
      newErrors.user_name = "Only lowercase letters, numbers and underscores";
    else if (form.user_name.length < 3)
      newErrors.user_name = "Username must be at least 3 characters";
    if (!form.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Invalid email address";
    if (!form.password) newErrors.password = "Password is required";
    else if (form.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    try {
      const res = await register(form).unwrap();
      dispatch(setCredentials({ user: res.data.user, token: res.data.token }));
      navigate("/dashboard");
    } catch (err) {
      setApiError(
        err?.data?.message || "Something went wrong. Please try again.",
      );
    }
  };

  return (
    <div
      className="min-h-screen flex"
      style={{ fontFamily: "'DM Sans', sans-serif", background: "#0A0C10" }}
    >
      {/* ── Left Panel ── */}
      <div
        className="hidden lg:flex flex-col justify-between w-[52%] relative overflow-hidden p-14"
        style={{ background: "#0D1117", borderRight: "0.5px solid #1A1F2E" }}
      >
        <div className="absolute inset-0 overflow-hidden opacity-[0.025]">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-full h-[0.5px]"
              style={{ background: "#4B6EFF", top: `${i * 9}%` }}
            />
          ))}
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <img
            src="/flow-forge-logo.png"
            alt="FlowForge"
            className="w-8 h-8 object-contain"
            style={{ filter: "brightness(0.9)" }}
          />
          <span
            style={{
              color: "#C8CCDF",
              fontSize: "16px",
              fontWeight: 600,
              letterSpacing: "-0.01em",
            }}
          >
            Flow<span style={{ color: "#4B6EFF" }}>Forge</span>
          </span>
        </div>

        <div className="relative z-10">
          <p
            style={{
              color: "#2E3860",
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "0.12em",
              marginBottom: "20px",
              textTransform: "uppercase",
            }}
          >
            Task Management
          </p>
          <h1
            style={{
              color: "#C8CCDF",
              fontSize: "42px",
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
              marginBottom: "24px",
            }}
          >
            Where teams
            <br />
            get things
            <br />
            <span style={{ color: "#4B6EFF" }}>done.</span>
          </h1>
          <p
            style={{
              color: "#3A4268",
              fontSize: "14px",
              lineHeight: 1.75,
              maxWidth: "320px",
            }}
          >
            Organize work across boards, track every task, and keep your entire
            team aligned — from day one to done.
          </p>
        </div>

        <div
          className="relative z-10 flex items-center gap-3 p-4 rounded-lg"
          style={{ background: "#0F1320", border: "0.5px solid #1A2035" }}
        >
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: "#161C30", border: "0.5px solid #2A3050" }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#4B6EFF"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <p style={{ color: "#3A4268", fontSize: "12px", lineHeight: 1.5 }}>
            Your data is encrypted and never shared with third parties.
          </p>
        </div>
      </div>

      {/* ── Right Panel ── */}
      <div
        className="flex-1 flex flex-col justify-center items-center px-8 py-12"
        style={{ background: "#0A0C10" }}
      >
        <div className="flex lg:hidden items-center gap-2 mb-10">
          <img
            src="/flow-forge-logo.png"
            alt="FlowForge"
            className="w-7 h-7 object-contain"
          />
          <span style={{ color: "#C8CCDF", fontSize: "15px", fontWeight: 600 }}>
            Flow<span style={{ color: "#4B6EFF" }}>Forge</span>
          </span>
        </div>

        <div className="w-full max-w-[400px]">
          <div className="mb-8">
            <h2
              style={{
                color: "#C8CCDF",
                fontSize: "24px",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                marginBottom: "6px",
              }}
            >
              Create your account
            </h2>
            <p style={{ color: "#3A4268", fontSize: "13px" }}>
              Already have an account?{" "}
              <Link
                to="/login"
                style={{
                  color: "#4B6EFF",
                  textDecoration: "none",
                  fontWeight: 500,
                }}
              >
                Sign in
              </Link>
            </p>
          </div>

          {apiError && (
            <div
              className="mb-4 px-4 py-3 rounded-lg"
              style={{
                background: "#1E0F0F",
                border: "0.5px solid #3D1515",
                color: "#E06060",
                fontSize: "13px",
              }}
            >
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <InputField
              label="Full Name"
              name="name"
              type="text"
              placeholder="John Doe"
              value={form.name}
              onChange={handleChange}
              error={errors.name}
            />
            <InputField
              label="Username"
              name="user_name"
              type="text"
              placeholder="johndoe"
              value={form.user_name}
              onChange={handleChange}
              error={errors.user_name}
              prefix="@"
            />
            <InputField
              label="Email"
              name="email"
              type="email"
              placeholder="john@company.com"
              value={form.email}
              onChange={handleChange}
              error={errors.email}
            />
            <InputField
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Min. 6 characters"
              value={form.password}
              onChange={handleChange}
              error={errors.password}
              suffix={
                <EyeToggle
                  show={showPassword}
                  onToggle={() => setShowPassword(!showPassword)}
                />
              }
            />
            <SubmitButton isLoading={isLoading} label="Create Account" />
          </form>

          <p
            style={{
              color: "#1E2440",
              fontSize: "11px",
              textAlign: "center",
              marginTop: "20px",
              lineHeight: 1.6,
            }}
          >
            By creating an account you agree to our{" "}
            <span style={{ color: "#2E3860", cursor: "pointer" }}>
              Terms of Service
            </span>{" "}
            and{" "}
            <span style={{ color: "#2E3860", cursor: "pointer" }}>
              Privacy Policy
            </span>
          </p>
        </div>
      </div>

      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');`}</style>
    </div>
  );
}

function InputField({
  label,
  name,
  type,
  placeholder,
  value,
  onChange,
  error,
  prefix,
  suffix,
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label
        style={{
          color: "#3A4268",
          fontSize: "11px",
          fontWeight: 600,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          display: "block",
          marginBottom: "6px",
        }}
      >
        {label}
      </label>
      <div className="relative">
        {prefix && (
          <span
            style={{
              position: "absolute",
              left: "13px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#3A4268",
              fontSize: "14px",
              pointerEvents: "none",
              userSelect: "none",
            }}
          >
            {prefix}
          </span>
        )}
        <input
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: "100%",
            background: "#0F1219",
            border: `0.5px solid ${error ? "#E06060" : focused ? "#4B6EFF" : "#1A2035"}`,
            borderRadius: "8px",
            padding: `11px ${suffix ? "40px" : "14px"} 11px ${prefix ? "26px" : "14px"}`,
            color: "#C8CCDF",
            fontSize: "14px",
            outline: "none",
            transition: "border-color 0.15s",
          }}
        />
        {suffix && (
          <div
            style={{
              position: "absolute",
              right: "12px",
              top: "50%",
              transform: "translateY(-50%)",
            }}
          >
            {suffix}
          </div>
        )}
      </div>
      {error && (
        <p style={{ color: "#E06060", fontSize: "11px", marginTop: "4px" }}>
          {error}
        </p>
      )}
    </div>
  );
}

function EyeToggle({ show, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: 0,
        color: "#3A4268",
        display: "flex",
        alignItems: "center",
      }}
    >
      {show ? (
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
          <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
          <line x1="1" y1="1" x2="23" y2="23" />
        </svg>
      ) : (
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      )}
    </button>
  );
}

function SubmitButton({ isLoading, label }) {
  return (
    <button
      type="submit"
      disabled={isLoading}
      style={{
        width: "100%",
        background: isLoading ? "#2A3560" : "#4B6EFF",
        border: "none",
        borderRadius: "8px",
        padding: "12px",
        color: isLoading ? "#4A5480" : "#FFFFFF",
        fontSize: "14px",
        fontWeight: 600,
        cursor: isLoading ? "not-allowed" : "pointer",
        marginTop: "4px",
        letterSpacing: "0.01em",
        transition: "background 0.15s",
      }}
    >
      {isLoading ? "Please wait..." : label}
    </button>
  );
}
