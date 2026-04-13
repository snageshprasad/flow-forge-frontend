import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ArrowLeft, Building2 } from "lucide-react";
import { useCreateOrganizationMutation } from "../redux/modules/organization/organizationApi";
import {
  setCurrentOrg,
  setMyOrgs,
} from "../redux/modules/organization/organizationSlice";
import ImageUpload from "../components/ui/ImageUpload";

export default function CreateOrganization() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [createOrganization, { isLoading }] = useCreateOrganizationMutation();

  const [form, setForm] = useState({
    name: "",
    logo_url: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    pin: "",
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    setApiError("");
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Organization name is required";
    else if (form.name.trim().length < 2)
      newErrors.name = "Name must be at least 2 characters";
    return newErrors;
  };

  const buildAddress = () => {
    const parts = [form.line1, form.line2, form.city, form.state, form.pin]
      .map((p) => p.trim())
      .filter(Boolean);
    return parts.join(", ");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    try {
      const res = await createOrganization({
        name: form.name.trim(),
        logo_url: form.logo_url || null,
        address: buildAddress() || null,
      }).unwrap();
      dispatch(setCurrentOrg(res.data));
      dispatch(setMyOrgs([res.data]));
      navigate("/dashboard");
    } catch (err) {
      setApiError(
        err?.data?.message || "Something went wrong. Please try again.",
      );
    }
  };

  const label = (text, optional) => (
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
      {text}{" "}
      {optional && (
        <span
          style={{
            color: "var(--text-muted)",
            fontWeight: 400,
            textTransform: "none",
            letterSpacing: 0,
            fontSize: "11px",
          }}
        >
          (optional)
        </span>
      )}
    </label>
  );

  const input = (props, error) => ({
    width: "100%",
    background: "var(--bg-input)",
    border:
      "0.5px solid " +
      (error ? "var(--priority-urgent-text)" : "var(--border)"),
    borderRadius: "8px",
    padding: "9px 12px",
    color: "var(--text-primary)",
    fontSize: "13px",
    outline: "none",
    transition: "border-color 0.15s",
    fontFamily: "inherit",
    boxSizing: "border-box",
    ...props,
  });

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* ── Header ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          marginBottom: "28px",
        }}
      >
        <button
          onClick={() => navigate("/dashboard")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--text-muted)",
            fontSize: "13px",
            padding: 0,
            fontFamily: "inherit",
            flexShrink: 0,
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.color = "var(--text-secondary)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = "var(--text-muted)")
          }
        >
          <ArrowLeft size={14} />
          Back
        </button>
        <div
          style={{
            width: "0.5px",
            height: "16px",
            background: "var(--border)",
          }}
        />
        <div>
          <h1
            style={{
              color: "var(--text-primary)",
              fontSize: "16px",
              fontWeight: 600,
              letterSpacing: "-0.01em",
              margin: 0,
            }}
          >
            Create Organization
          </h1>
        </div>
      </div>

      {/* ── Two column layout ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 340px",
          gap: "24px",
          flex: 1,
          minHeight: 0,
        }}
      >
        {/* ── Left — Form ── */}
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "0" }}
        >
          {apiError && (
            <div
              style={{
                background: "var(--priority-urgent-bg)",
                border: "0.5px solid var(--priority-urgent-text)",
                borderRadius: "8px",
                padding: "10px 14px",
                color: "var(--priority-urgent-text)",
                fontSize: "13px",
                marginBottom: "20px",
              }}
            >
              {apiError}
            </div>
          )}

          {/* Basic info card */}
          <div
            style={{
              background: "var(--bg-card)",
              border: "0.5px solid var(--border)",
              borderRadius: "10px",
              padding: "20px",
              marginBottom: "16px",
            }}
          >
            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: "12px",
                fontWeight: 600,
                marginBottom: "16px",
              }}
            >
              Basic Information
            </p>

            <div
              style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}
            >
              <div style={{ flexShrink: 0 }}>
                {label("Logo", true)}
                <ImageUpload
                  value={form.logo_url}
                  onChange={(url) => setForm((p) => ({ ...p, logo_url: url }))}
                  shape="circle"
                />
              </div>

              <div style={{ flex: 1 }}>
                {label("Organization Name")}
                <input
                  name="name"
                  type="text"
                  placeholder="e.g. Acme Corporation"
                  value={form.name}
                  onChange={handleChange}
                  autoComplete="organization"
                  style={input({}, errors.name)}
                  onFocus={(e) => {
                    if (!errors.name)
                      e.target.style.borderColor = "var(--accent)";
                  }}
                  onBlur={(e) => {
                    if (!errors.name)
                      e.target.style.borderColor = "var(--border)";
                  }}
                />
                {errors.name && (
                  <p
                    style={{
                      color: "var(--priority-urgent-text)",
                      fontSize: "11px",
                      marginTop: "4px",
                    }}
                  >
                    {errors.name}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Address card */}
          <div
            style={{
              background: "var(--bg-card)",
              border: "0.5px solid var(--border)",
              borderRadius: "10px",
              padding: "20px",
              marginBottom: "20px",
            }}
          >
            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: "12px",
                fontWeight: 600,
                marginBottom: "16px",
              }}
            >
              Address{" "}
              <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>
                (optional)
              </span>
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "14px",
              }}
            >
              <div style={{ gridColumn: "1 / -1" }}>
                {label("Address Line 1")}
                <input
                  name="line1"
                  type="text"
                  placeholder="Street address, P.O. box"
                  value={form.line1}
                  onChange={handleChange}
                  autoComplete="address-line1"
                  style={input({})}
                  onFocus={(e) =>
                    (e.target.style.borderColor = "var(--accent)")
                  }
                  onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                />
              </div>

              <div style={{ gridColumn: "1 / -1" }}>
                {label("Address Line 2", true)}
                <input
                  name="line2"
                  type="text"
                  placeholder="Apartment, suite, unit, building"
                  value={form.line2}
                  onChange={handleChange}
                  autoComplete="address-line2"
                  style={input({})}
                  onFocus={(e) =>
                    (e.target.style.borderColor = "var(--accent)")
                  }
                  onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                />
              </div>

              <div>
                {label("City")}
                <input
                  name="city"
                  type="text"
                  placeholder="Mumbai"
                  value={form.city}
                  onChange={handleChange}
                  autoComplete="address-level2"
                  style={input({})}
                  onFocus={(e) =>
                    (e.target.style.borderColor = "var(--accent)")
                  }
                  onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                />
              </div>

              <div>
                {label("State")}
                <input
                  name="state"
                  type="text"
                  placeholder="Maharashtra"
                  value={form.state}
                  onChange={handleChange}
                  autoComplete="address-level1"
                  style={input({})}
                  onFocus={(e) =>
                    (e.target.style.borderColor = "var(--accent)")
                  }
                  onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                />
              </div>

              <div>
                {label("Pin Code")}
                <input
                  name="pin"
                  type="text"
                  placeholder="400001"
                  value={form.pin}
                  onChange={handleChange}
                  autoComplete="postal-code"
                  maxLength={6}
                  style={input({})}
                  onFocus={(e) =>
                    (e.target.style.borderColor = "var(--accent)")
                  }
                  onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              alignSelf: "flex-start",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: isLoading ? "var(--bg-hover)" : "var(--accent)",
              border: "none",
              borderRadius: "8px",
              padding: "10px 24px",
              color: isLoading ? "var(--text-muted)" : "var(--text-inverse)",
              fontSize: "13px",
              fontWeight: 600,
              cursor: isLoading ? "not-allowed" : "pointer",
              letterSpacing: "0.01em",
              transition: "background 0.15s",
              fontFamily: "inherit",
            }}
            onMouseEnter={(e) => {
              if (!isLoading)
                e.currentTarget.style.background = "var(--accent-hover)";
            }}
            onMouseLeave={(e) => {
              if (!isLoading)
                e.currentTarget.style.background = "var(--accent)";
            }}
          >
            {isLoading ? "Creating..." : "Create Organization"}
          </button>
        </form>

        {/* ── Right — Preview ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div
            style={{
              background: "var(--bg-card)",
              border: "0.5px solid var(--border)",
              borderRadius: "10px",
              padding: "20px",
            }}
          >
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                marginBottom: "16px",
              }}
            >
              Preview
            </p>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "16px",
              }}
            >
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "50%",
                  background: "var(--bg-secondary)",
                  border: "0.5px solid var(--border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  flexShrink: 0,
                }}
              >
                {form.logo_url ? (
                  <img
                    src={form.logo_url}
                    alt="logo"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <Building2 size={18} color="var(--text-muted)" />
                )}
              </div>
              <div>
                <p
                  style={{
                    color: "var(--text-primary)",
                    fontSize: "14px",
                    fontWeight: 600,
                    margin: 0,
                  }}
                >
                  {form.name || (
                    <span style={{ color: "var(--text-muted)" }}>
                      Organization name
                    </span>
                  )}
                </p>
                <p
                  style={{
                    color: "var(--text-muted)",
                    fontSize: "11px",
                    margin: "2px 0 0",
                  }}
                >
                  {buildAddress() || <span>No address provided</span>}
                </p>
              </div>
            </div>

            <div
              style={{
                borderTop: "0.5px solid var(--border)",
                paddingTop: "12px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "6px 8px",
                  borderRadius: "6px",
                  background: "var(--bg-secondary)",
                }}
              >
                <div
                  style={{
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    background: "var(--bg-input)",
                    border: "0.5px solid var(--border)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "8px",
                    color: "var(--accent)",
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  O
                </div>
                <div>
                  <p
                    style={{
                      color: "var(--text-primary)",
                      fontSize: "11px",
                      fontWeight: 500,
                      margin: 0,
                    }}
                  >
                    You
                  </p>
                  <p
                    style={{
                      color: "var(--text-muted)",
                      fontSize: "10px",
                      margin: 0,
                    }}
                  >
                    Owner
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              background: "var(--bg-card)",
              border: "0.5px solid var(--border)",
              borderRadius: "10px",
              padding: "16px",
            }}
          >
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                marginBottom: "10px",
              }}
            >
              What happens next
            </p>
            {[
              "You become the owner of this organization",
              "Invite your team members via email",
              "Create boards and start managing tasks",
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "8px",
                  marginBottom: "8px",
                }}
              >
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
                    marginTop: "1px",
                  }}
                >
                  <span
                    style={{
                      color: "var(--accent-text)",
                      fontSize: "9px",
                      fontWeight: 700,
                    }}
                  >
                    {i + 1}
                  </span>
                </div>
                <p
                  style={{
                    color: "var(--text-secondary)",
                    fontSize: "12px",
                    lineHeight: 1.5,
                    margin: 0,
                  }}
                >
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
