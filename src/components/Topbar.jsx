import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Bell,
  User,
  Settings,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { logout, selectCurrentUser } from "../redux/modules/auth/authSlice";

export default function Topbar({ title, actions }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectCurrentUser);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  useEffect(() => {
    if (!profileOpen) return;
    const handleOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [profileOpen]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const menuItems = [
    {
      label: "Profile",
      icon: User,
      onClick: () => {
        navigate("/profile");
        setProfileOpen(false);
      },
    },
    {
      label: "Settings",
      icon: Settings,
      onClick: () => {
        navigate("/settings");
        setProfileOpen(false);
      },
    },
    { divider: true },
    { label: "Logout", icon: LogOut, onClick: handleLogout, danger: true },
  ];

  return (
    <div
      style={{
        height: "48px",
        background: "var(--bg-sidebar)",
        borderBottom: "0.5px solid var(--border)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
        flexShrink: 0,
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      {/* ── Left — title + actions ── */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {title && (
          <span
            style={{
              color: "var(--text-primary)",
              fontSize: "13px",
              fontWeight: 600,
            }}
          >
            {title}
          </span>
        )}
        {actions}
      </div>

      {/* ── Right — icons + profile ── */}
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        {/* search */}
        <IconBtn>
          <Search size={14} />
        </IconBtn>

        {/* notifications */}
        <IconBtn>
          <Bell size={14} />
        </IconBtn>

        {/* profile */}
        <div ref={profileRef} style={{ position: "relative" }}>
          <button
            onClick={() => setProfileOpen((p) => !p)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "4px 6px",
              background: profileOpen ? "#161C30" : "transparent",
              border:
                "0.5px solid " + (profileOpen ? "#2E3450" : "transparent"),
              borderRadius: "7px",
              cursor: "pointer",
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) => {
              if (!profileOpen) e.currentTarget.style.background = "#131620";
            }}
            onMouseLeave={(e) => {
              if (!profileOpen)
                e.currentTarget.style.background = "transparent";
            }}
          >
            <div
              style={{
                width: "24px",
                height: "24px",
                borderRadius: "50%",
                background: "var(--bg-input)",
                border: "0.5px solid var(--border-strong)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#4B6EFF",
                fontSize: "9px",
                fontWeight: 600,
                flexShrink: 0,
              }}
            >
              {initials}
            </div>
            <ChevronDown
              size={11}
              color="#3A4268"
              style={{
                transform: profileOpen ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.2s",
              }}
            />
          </button>

          {/* dropdown portal */}
          {profileOpen && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 6px)",
                right: 0,
                background: "var(--bg-sidebar)",
                border: "0.5px solid var(--border)",
                borderRadius: "10px",
                overflow: "hidden",
                minWidth: "180px",
                boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
                zIndex: 200,
              }}
            >
              {/* user info */}
              <div
                style={{
                  padding: "12px 14px",
                  borderBottom: "0.5px solid var(--border)",
                }}
              >
                <p
                  style={{
                    color: "var(--text-primary)",
                    fontSize: "12px",
                    fontWeight: 600,
                    marginBottom: "2px",
                  }}
                >
                  {user?.name || "User"}
                </p>
                <p style={{ color: "var(--text-muted)", fontSize: "11px" }}>
                  @{user?.user_name || ""}
                </p>
              </div>

              {/* menu items */}
              <div style={{ padding: "4px" }}>
                {menuItems.map((item, i) =>
                  item.divider ? (
                    <div
                      key={i}
                      style={{
                        height: "0.5px",
                        background: "#1A1F2E",
                        margin: "4px 0",
                      }}
                    />
                  ) : (
                    <button
                      key={i}
                      onClick={item.onClick}
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "8px 10px",
                        background: "transparent",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        color: item.danger ? "#E06060" : "#7B85A8",
                        fontSize: "12px",
                        fontFamily: "inherit",
                        textAlign: "left",
                        transition: "background 0.1s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = item.danger
                          ? "#1E0F0F"
                          : "#131620")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                    >
                      <item.icon size={13} />
                      {item.label}
                    </button>
                  ),
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function IconBtn({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "30px",
        height: "30px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "transparent",
        border: "none",
        borderRadius: "7px",
        cursor: "pointer",
        color: "var(--text-muted)",
        transition: "background 0.15s, color 0.15s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "#131620";
        e.currentTarget.style.color = "#7B85A8";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "transparent";
        e.currentTarget.style.color = "#3A4268";
      }}
    >
      {children}
    </button>
  );
}
