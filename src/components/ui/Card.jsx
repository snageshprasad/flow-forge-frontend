const Card = ({ children, className = "", style = {}, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={className}
      style={{
        background: "var(--bg-card)",
        border: "0.5px solid var(--border)",
        borderRadius: "10px",
        overflow: "hidden",
        cursor: onClick ? "pointer" : "default",
        transition: onClick ? "border-color 0.15s" : "none",
        ...style,
      }}
      onMouseEnter={(e) => {
        if (onClick) e.currentTarget.style.borderColor = "var(--border-strong)";
      }}
      onMouseLeave={(e) => {
        if (onClick) e.currentTarget.style.borderColor = "var(--border)";
      }}
    >
      {children}
    </div>
  );
};

export default Card;
