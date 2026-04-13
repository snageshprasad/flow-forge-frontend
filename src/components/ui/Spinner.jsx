const Spinner = ({ size = "md", fullScreen = false }) => {
  const sizes = {
    sm: 16,
    md: 24,
    lg: 36,
  };

  const px = sizes[size] || 24;
  const border = size === "sm" ? "2px" : "2.5px";

  const spinner = (
    <div
      style={{
        width: px,
        height: px,
        borderRadius: "50%",
        border: `${border} solid var(--border-strong)`,
        borderTopColor: "#4B6EFF",
        animation: "ff-spin 0.7s linear infinite",
        flexShrink: 0,
      }}
    />
  );

  if (fullScreen) {
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 999,
          background: "rgba(10,12,16,0.7)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {spinner}
        <style>{`@keyframes ff-spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <>
      {spinner}
      <style>{`@keyframes ff-spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
};

export default Spinner;
