import { Loader2 } from "lucide-react";

const Button = ({
  children,
  variant = "primary",
  size = "md",
  icon: Icon,
  iconPosition = "left",
  onClick,
  disabled = false,
  isLoading = false,
  fullWidth = false,
  className = "",
  ...props
}) => {
  const base = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    fontWeight: 500,
    borderRadius: "8px",
    border: "none",
    cursor: disabled || isLoading ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : 1,
    transition: "background 0.15s, opacity 0.15s",
    width: fullWidth ? "100%" : "auto",
    fontFamily: "inherit",
    letterSpacing: "0.01em",
  };

  const variants = {
    primary: { background: "#4B6EFF", color: "#FFFFFF" },
    secondary: {
      background: "var(--bg-secondary)",
      color: "var(--text-primary)",
      border: "0.5px solid var(--border)",
    },
    danger: {
      background: "#2A1414",
      color: "#E06060",
      border: "0.5px solid #3D1515",
    },
    ghost: { background: "transparent", color: "var(--text-secondary)" },
    outline: {
      background: "transparent",
      color: "var(--text-primary)",
      border: "0.5px solid var(--border)",
    },
  };

  const sizes = {
    sm: { padding: "6px 12px", fontSize: "12px" },
    md: { padding: "9px 16px", fontSize: "13px" },
    lg: { padding: "11px 20px", fontSize: "14px" },
  };

  const handleMouseEnter = (e) => {
    if (disabled || isLoading) return;
    if (variant === "primary") e.currentTarget.style.background = "#3A5AE8";
    if (variant === "ghost" || variant === "outline")
      e.currentTarget.style.background = "var(--bg-hover)";
  };

  const handleMouseLeave = (e) => {
    if (disabled || isLoading) return;
    if (variant === "primary") e.currentTarget.style.background = "#4B6EFF";
    if (variant === "ghost" || variant === "outline")
      e.currentTarget.style.background = "transparent";
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ ...base, ...variants[variant], ...sizes[size] }}
      className={className}
      {...props}
    >
      {isLoading ? (
        <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} />
      ) : (
        Icon && iconPosition === "left" && <Icon size={14} />
      )}
      {children}
      {!isLoading && Icon && iconPosition === "right" && <Icon size={14} />}
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </button>
  );
};

export default Button;
