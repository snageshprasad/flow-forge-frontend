import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Search, Check } from "lucide-react";

const Dropdown = ({
  label,
  value,
  onChange,
  options = [],
  placeholder = "Select an option",
  searchPlaceholder = "Search...",
  disabled = false,
  fullWidth = false,
  error,
  helperText,
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [dropdownStyle, setDropdownStyle] = useState({});
  const containerRef = useRef(null);
  const triggerRef = useRef(null);

  const selected = options.find((o) => String(o.value) === String(value));
  const filtered = options.filter((o) =>
    o.label.toLowerCase().includes(search.toLowerCase()),
  );

  const calculatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom - 8;
    const spaceAbove = rect.top - 8;
    const showAbove = spaceBelow < 200 && spaceAbove > spaceBelow;

    setDropdownStyle({
      position: "fixed",
      left: rect.left,
      width: rect.width,
      zIndex: 9999,
      ...(showAbove
        ? {
            bottom: window.innerHeight - rect.top + 4,
            top: "auto",
            maxHeight: `${Math.min(spaceAbove, 280)}px`,
          }
        : {
            top: rect.bottom + 4,
            bottom: "auto",
            maxHeight: `${Math.min(spaceBelow, 280)}px`,
          }),
    });
  }, []);

  const handleOpen = () => {
    if (disabled) return;
    if (!open) calculatePosition();
    setOpen((prev) => !prev);
    setSearch("");
  };

  useEffect(() => {
    if (!open) return;
    const handleOutside = (e) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target) &&
        !document.getElementById("ff-dropdown-portal")?.contains(e.target)
      ) {
        setOpen(false);
        setSearch("");
      }
    };
    const handleReposition = () => calculatePosition();
    document.addEventListener("mousedown", handleOutside);
    window.addEventListener("scroll", handleReposition, true);
    window.addEventListener("resize", handleReposition);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      window.removeEventListener("scroll", handleReposition, true);
      window.removeEventListener("resize", handleReposition);
    };
  }, [open, calculatePosition]);

  const handleSelect = (option) => {
    onChange(option.value);
    setOpen(false);
    setSearch("");
  };

  const dropdownContent = open && (
    <div
      id="ff-dropdown-portal"
      style={{
        ...dropdownStyle,
        background: "var(--bg-card)",
        border: "0.5px solid var(--border-strong)",
        borderRadius: "10px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
      }}
    >
      {/* search */}
      <div
        style={{
          padding: "8px",
          borderBottom: "0.5px solid var(--border)",
          flexShrink: 0,
        }}
      >
        <div style={{ position: "relative" }}>
          <Search
            size={13}
            style={{
              position: "absolute",
              left: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--text-muted)",
              pointerEvents: "none",
            }}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={searchPlaceholder}
            autoFocus
            style={{
              width: "100%",
              paddingLeft: "30px",
              paddingRight: "10px",
              paddingTop: "7px",
              paddingBottom: "7px",
              background: "var(--bg-input)",
              border: "0.5px solid var(--border)",
              borderRadius: "6px",
              color: "var(--text-primary)",
              fontSize: "12px",
              outline: "none",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#4B6EFF")}
            onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
          />
        </div>
      </div>

      {/* options */}
      <div style={{ overflowY: "auto", flex: 1 }}>
        {filtered.length === 0 ? (
          <div
            style={{
              padding: "20px",
              textAlign: "center",
              color: "var(--text-muted)",
              fontSize: "12px",
            }}
          >
            No results found
          </div>
        ) : (
          filtered.map((option) => {
            const isSelected = String(option.value) === String(value);
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "9px 12px",
                  background: isSelected
                    ? "var(--accent-subtle)"
                    : "transparent",
                  color: isSelected
                    ? "var(--accent-text)"
                    : "var(--text-primary)",
                  fontSize: "13px",
                  fontWeight: isSelected ? 500 : 400,
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "background 0.1s",
                  fontFamily: "inherit",
                }}
                onMouseEnter={(e) => {
                  if (!isSelected)
                    e.currentTarget.style.background = "var(--bg-hover)";
                }}
                onMouseLeave={(e) => {
                  if (!isSelected)
                    e.currentTarget.style.background = "transparent";
                }}
              >
                <span>{option.label}</span>
                {isSelected && <Check size={13} color="var(--accent)" />}
              </button>
            );
          })
        )}
      </div>
    </div>
  );

  return (
    <div
      ref={containerRef}
      style={{ position: "relative", width: fullWidth ? "100%" : "256px" }}
    >
      {label && (
        <label
          style={{
            display: "block",
            color: "var(--text-muted)",
            fontSize: "11px",
            fontWeight: 600,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            marginBottom: "6px",
          }}
        >
          {label}
        </label>
      )}

      <button
        ref={triggerRef}
        type="button"
        onClick={handleOpen}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "9px 12px",
          background: "var(--bg-input)",
          border: `0.5px solid ${error ? "#E06060" : open ? "#4B6EFF" : "var(--border)"}`,
          borderRadius: "8px",
          color: selected ? "var(--text-primary)" : "var(--text-muted)",
          fontSize: "13px",
          cursor: disabled ? "not-allowed" : "pointer",
          opacity: disabled ? 0.5 : 1,
          fontFamily: "inherit",
          transition: "border-color 0.15s",
        }}
      >
        <span
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown
          size={14}
          style={{
            color: "var(--text-muted)",
            flexShrink: 0,
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s",
          }}
        />
      </button>

      {typeof document !== "undefined" &&
        createPortal(dropdownContent, document.body)}

      {(error || helperText) && (
        <p
          style={{
            fontSize: "11px",
            marginTop: "4px",
            color: error ? "#E06060" : "var(--text-muted)",
          }}
        >
          {error || helperText}
        </p>
      )}
    </div>
  );
};

export default Dropdown;
