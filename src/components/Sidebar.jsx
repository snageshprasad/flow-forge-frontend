/* eslint-disable no-unused-vars */
import { useState, useRef, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  LayoutGrid,
  Users,
  Settings,
  Bell,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Sun,
  Moon,
  Building2,
  PlusCircle,
  Check,
} from "lucide-react";
import { selectCurrentUser } from "../redux/modules/auth/authSlice";
import {
  selectCurrentOrg,
  selectMyOrgs,
  setCurrentOrg,
} from "../redux/modules/organization/organizationSlice";
import useTheme from "../hooks/useTheme";

const NavItem = ({ icon: Icon, label, path, collapsed }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <NavLink
      to={path}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={({ isActive }) => ({
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: collapsed ? "9px 0" : "8px 10px",
        justifyContent: collapsed ? "center" : "flex-start",
        borderRadius: "7px",
        marginBottom: "2px",
        textDecoration: "none",
        background: isActive
          ? "var(--bg-hover)"
          : hovered
            ? "var(--bg-hover)"
            : "transparent",
        color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
        fontSize: "12px",
        fontWeight: isActive ? 500 : 400,
        transition: "background 0.15s, color 0.15s",
      })}
    >
      {({ isActive }) => (
        <>
          <Icon
            size={15}
            color={isActive ? "var(--accent)" : "var(--text-muted)"}
            style={{ flexShrink: 0 }}
          />
          {!collapsed && <span style={{ whiteSpace: "nowrap" }}>{label}</span>}
        </>
      )}
    </NavLink>
  );
};

const AccordionNavItem = ({ icon: Icon, label, children, collapsed }) => {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);

  const isAnyChildActive = children.some((c) => location.pathname === c.path);

  return (
    <div style={{ marginBottom: "2px" }}>
      <button
        onClick={() => setOpen((p) => !p)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: collapsed ? "9px 0" : "8px 10px",
          justifyContent: collapsed ? "center" : "flex-start",
          borderRadius: "7px",
          background: isAnyChildActive
            ? "var(--bg-hover)"
            : hovered
              ? "var(--bg-hover)"
              : "transparent",
          border: "none",
          cursor: "pointer",
          fontFamily: "inherit",
          color: isAnyChildActive
            ? "var(--text-primary)"
            : "var(--text-secondary)",
          fontSize: "12px",
          fontWeight: isAnyChildActive ? 500 : 400,
          transition: "background 0.15s",
        }}
      >
        <Icon
          size={15}
          color={isAnyChildActive ? "var(--accent)" : "var(--text-muted)"}
          style={{ flexShrink: 0 }}
        />
        {!collapsed && (
          <>
            <span style={{ whiteSpace: "nowrap", flex: 1, textAlign: "left" }}>
              {label}
            </span>
            <ChevronDown
              size={12}
              color="var(--text-muted)"
              style={{
                transform: open ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.2s",
                flexShrink: 0,
              }}
            />
          </>
        )}
      </button>

      {/* children */}
      {!collapsed && open && (
        <div
          style={{
            marginLeft: "12px",
            paddingLeft: "10px",
            borderLeft: "0.5px solid var(--border)",
            marginTop: "2px",
          }}
        >
          {children.map(({ icon: CIcon, label: cLabel, path }) => (
            <NavItem
              key={path}
              icon={CIcon}
              label={cLabel}
              path={path}
              collapsed={false}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default function Sidebar({ collapsed, onToggle }) {
  const user = useSelector(selectCurrentUser);
  const { theme, toggleTheme } = useTheme();
  const [userHovered, setUserHovered] = useState(false);
  const [themeHovered, setThemeHovered] = useState(false);

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  return (
    <div
      style={{
        width: collapsed ? "56px" : "220px",
        background: "var(--bg-sidebar)",
        borderRight: "0.5px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        transition: "width 0.2s ease",
        overflow: "hidden",
        height: "100vh",
        position: "sticky",
        top: 0,
      }}
    >
      {/* ── Logo ── */}
      <div
        style={{
          height: "48px",
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
          padding: collapsed ? "0 12px" : "0 14px",
          borderBottom: "0.5px solid var(--border)",
          flexShrink: 0,
        }}
      >
        {!collapsed && (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <img
              src="/flow-forge-logo.png"
              alt="FlowForge"
              style={{ width: "22px", height: "22px", objectFit: "contain" }}
            />
            <span
              style={{
                color: "var(--text-primary)",
                fontSize: "14px",
                fontWeight: 600,
                letterSpacing: "-0.01em",
                whiteSpace: "nowrap",
              }}
            >
              Flow<span style={{ color: "var(--accent)" }}>Forge</span>
            </span>
          </div>
        )}
        <SidebarIconBtn onClick={onToggle}>
          {collapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
        </SidebarIconBtn>
      </div>

      {/* ── Org Switcher ── */}
      {!collapsed && (
        <div style={{ padding: "10px 10px 0" }}>
          <OrgSwitcher />
        </div>
      )}

      {/* ── Nav ── */}
      <nav style={{ flex: 1, padding: "10px 8px", overflowY: "auto" }}>
        <SectionLabel label="Workspace" collapsed={collapsed} />

        <NavItem
          icon={LayoutGrid}
          label="Boards"
          path="/dashboard"
          collapsed={collapsed}
        />

        <AccordionNavItem
          icon={Building2}
          label="Organizations"
          collapsed={collapsed}
          children={[
            {
              icon: Settings,
              label: "Manage Org",
              path: "/organizations/manage",
            },
            {
              icon: PlusCircle,
              label: "Create Org",
              path: "/organizations/new",
            },
          ]}
        />

        <NavItem
          icon={Users}
          label="Members"
          path="/members"
          collapsed={collapsed}
        />
        <NavItem
          icon={Settings}
          label="Settings"
          path="/settings"
          collapsed={collapsed}
        />

        <div style={{ marginTop: "8px" }}>
          <SectionLabel label="Account" collapsed={collapsed} />
          <NavItem
            icon={Bell}
            label="Invites"
            path="/invites"
            collapsed={collapsed}
          />
        </div>
      </nav>

      {/* ── Bottom ── */}
      <div
        style={{
          padding: "10px 8px",
          borderTop: "0.5px solid var(--border)",
          flexShrink: 0,
        }}
      >
        {collapsed ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <div
              style={{
                width: "26px",
                height: "26px",
                borderRadius: "50%",
                background: "var(--bg-input)",
                border: "0.5px solid var(--border-strong)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--accent)",
                fontSize: "10px",
                fontWeight: 600,
              }}
            >
              {initials}
            </div>
            <SidebarIconBtn onClick={toggleTheme}>
              {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
            </SidebarIconBtn>
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            {/* user name — own hover zone */}
            <div
              onMouseEnter={() => setUserHovered(true)}
              onMouseLeave={() => setUserHovered(false)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                flex: 1,
                padding: "6px 8px",
                borderRadius: "7px",
                cursor: "pointer",
                background: userHovered ? "var(--bg-hover)" : "transparent",
                transition: "background 0.15s",
                minWidth: 0,
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
                  color: "var(--accent)",
                  fontSize: "9px",
                  fontWeight: 600,
                  flexShrink: 0,
                }}
              >
                {initials}
              </div>
              <span
                style={{
                  color: "var(--text-secondary)",
                  fontSize: "11px",
                  fontWeight: 500,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {user?.name || "User"}
              </span>
            </div>

            {/* theme toggle — own hover zone */}
            <button
              onClick={toggleTheme}
              onMouseEnter={() => setThemeHovered(true)}
              onMouseLeave={() => setThemeHovered(false)}
              style={{
                background: themeHovered ? "var(--bg-hover)" : "transparent",
                border: "none",
                cursor: "pointer",
                color: "var(--text-muted)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "6px",
                borderRadius: "7px",
                flexShrink: 0,
                transition: "background 0.15s",
              }}
            >
              {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function SectionLabel({ label, collapsed }) {
  if (collapsed) return null;
  return (
    <p
      style={{
        color: "var(--text-muted)",
        fontSize: "9px",
        fontWeight: 600,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        padding: "0 6px",
        marginBottom: "4px",
      }}
    >
      {label}
    </p>
  );
}

function SidebarIconBtn({ onClick, children }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "var(--bg-hover)" : "none",
        border: "none",
        cursor: "pointer",
        color: "var(--text-muted)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "4px",
        borderRadius: "6px",
        transition: "background 0.15s",
      }}
    >
      {children}
    </button>
  );
}

function OrgSwitcher() {
  const dispatch = useDispatch();
  const currentOrg = useSelector(selectCurrentOrg);
  const myOrgs = useSelector(selectMyOrgs);
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handleOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [open]);

  const handleSelect = (org) => {
    dispatch(setCurrentOrg(org));
    setOpen(false);
  };

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <div
        onClick={() => setOpen((p) => !p)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "7px 10px",
          background:
            hovered || open ? "var(--bg-hover)" : "var(--bg-secondary)",
          border: "0.5px solid " + (open ? "var(--accent)" : "var(--border)"),
          borderRadius: "7px",
          cursor: "pointer",
          transition: "background 0.15s, border-color 0.15s",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "7px",
            minWidth: 0,
          }}
        >
          {currentOrg?.logo_url ? (
            <img
              src={currentOrg.logo_url}
              alt=""
              style={{
                width: "16px",
                height: "16px",
                borderRadius: "50%",
                objectFit: "cover",
                flexShrink: 0,
              }}
            />
          ) : (
            <div
              style={{
                width: "16px",
                height: "16px",
                borderRadius: "50%",
                background: "var(--accent-subtle)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  color: "var(--accent-text)",
                  fontSize: "8px",
                  fontWeight: 700,
                }}
              >
                {currentOrg?.name?.[0]?.toUpperCase() || "?"}
              </span>
            </div>
          )}
          <span
            style={{
              color: "var(--text-secondary)",
              fontSize: "11px",
              fontWeight: 500,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {currentOrg?.name || "Select Organization"}
          </span>
        </div>
        <ChevronDown
          size={11}
          color="var(--text-muted)"
          style={{
            flexShrink: 0,
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s",
          }}
        />
      </div>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            right: 0,
            background: "var(--bg-card)",
            border: "0.5px solid var(--border-strong)",
            borderRadius: "8px",
            overflow: "hidden",
            boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
            zIndex: 200,
          }}
        >
          {myOrgs.length === 0 ? (
            <p
              style={{
                padding: "12px",
                color: "var(--text-muted)",
                fontSize: "12px",
                textAlign: "center",
              }}
            >
              No organizations
            </p>
          ) : (
            myOrgs.map((org) => (
              <button
                key={org.id}
                onClick={() => handleSelect(org)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "8px 10px",
                  background:
                    currentOrg?.id === org.id
                      ? "var(--accent-subtle)"
                      : "transparent",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  transition: "background 0.1s",
                }}
                onMouseEnter={(e) => {
                  if (currentOrg?.id !== org.id)
                    e.currentTarget.style.background = "var(--bg-hover)";
                }}
                onMouseLeave={(e) => {
                  if (currentOrg?.id !== org.id)
                    e.currentTarget.style.background = "transparent";
                }}
              >
                {org.logo_url ? (
                  <img
                    src={org.logo_url}
                    alt=""
                    style={{
                      width: "20px",
                      height: "20px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      flexShrink: 0,
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: "20px",
                      height: "20px",
                      borderRadius: "50%",
                      background: "var(--accent-subtle)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <span
                      style={{
                        color: "var(--accent-text)",
                        fontSize: "9px",
                        fontWeight: 700,
                      }}
                    >
                      {org.name?.[0]?.toUpperCase()}
                    </span>
                  </div>
                )}
                <span
                  style={{
                    color:
                      currentOrg?.id === org.id
                        ? "var(--accent-text)"
                        : "var(--text-primary)",
                    fontSize: "12px",
                    fontWeight: currentOrg?.id === org.id ? 500 : 400,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {org.name}
                </span>
                {currentOrg?.id === org.id && (
                  <Check
                    size={11}
                    color="var(--accent)"
                    style={{ marginLeft: "auto", flexShrink: 0 }}
                  />
                )}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
