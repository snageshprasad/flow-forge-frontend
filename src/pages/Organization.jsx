/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Building2,
  Users,
  LayoutGrid,
  CheckSquare,
  Save,
  Trash2,
  LogOut,
} from "lucide-react";
import { selectCurrentOrg } from "../redux/modules/organization/organizationSlice";
import {
  useGetOrganizationByIdQuery,
  useUpdateOrganizationMutation,
  useDeleteOrganizationMutation,
  useLeaveOrganizationMutation,
  useGetOrgStatsQuery,
} from "../redux/modules/organization/organizationApi";
import {
  setCurrentOrg,
  clearOrganization,
} from "../redux/modules/organization/organizationSlice";
import { useNavigate } from "react-router-dom";
import ImageUpload from "../components/ui/ImageUpload";
import ConfirmationModal from "../components/ui/ConfirmationModal";
import Spinner from "../components/ui/Spinner";

export default function Organization() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentOrg = useSelector(selectCurrentOrg);
  const orgId = currentOrg?.id;

  const { data: orgData, isLoading: orgLoading } = useGetOrganizationByIdQuery(
    orgId,
    { skip: !orgId },
  );
  const { data: statsData } = useGetOrgStatsQuery(orgId, { skip: !orgId });
  const [updateOrganization, { isLoading: updating }] =
    useUpdateOrganizationMutation();
  const [deleteOrganization, { isLoading: deleting }] =
    useDeleteOrganizationMutation();
  const [leaveOrganization, { isLoading: leaving }] =
    useLeaveOrganizationMutation();

  const org = orgData?.data;
  const stats = statsData?.data;
  const myRole = org?.my_role;

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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (org) {
      const parts = org.address ? org.address.split(", ") : [];
      setForm({
        name: org.name || "",
        logo_url: org.logo_url || "",
        line1: parts[0] || "",
        line2: parts[1] || "",
        city: parts[2] || "",
        state: parts[3] || "",
        pin: parts[4] || "",
      });
    }
  }, [org]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
    setApiError("");
  };

  const buildAddress = () => {
    return [form.line1, form.line2, form.city, form.state, form.pin]
      .map((p) => p.trim())
      .filter(Boolean)
      .join(", ");
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Organization name is required";
    return newErrors;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    try {
      const res = await updateOrganization({
        id: orgId,
        name: form.name.trim(),
        logo_url: form.logo_url || null,
        address: buildAddress() || null,
      }).unwrap();
      dispatch(setCurrentOrg({ ...currentOrg, ...res.data }));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setApiError(err?.data?.message || "Failed to update organization");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteOrganization(orgId).unwrap();
      dispatch(clearOrganization());
      navigate("/dashboard");
    } catch (err) {
      setApiError(err?.data?.message || "Failed to delete organization");
      setShowDeleteModal(false);
    }
  };

  const handleLeave = async () => {
    try {
      await leaveOrganization(orgId).unwrap();
      dispatch(clearOrganization());
      navigate("/dashboard");
    } catch (err) {
      setApiError(err?.data?.message || "Failed to leave organization");
      setShowLeaveModal(false);
    }
  };

  const labelStyle = {
    display: "block",
    color: "var(--text-muted)",
    fontSize: "11px",
    fontWeight: 600,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    marginBottom: "6px",
  };
  const inputStyle = (error) => ({
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
  });

  if (orgLoading)
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
        }}
      >
        <Spinner size="md" />
      </div>
    );

  if (!org)
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
        }}
      >
        <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>
          No organization selected.
        </p>
      </div>
    );

  const canEdit = ["owner", "admin"].includes(myRole);

  return (
    <div>
      {/* ── Header ── */}
      <div style={{ marginBottom: "24px" }}>
        <h1
          style={{
            color: "var(--text-primary)",
            fontSize: "18px",
            fontWeight: 600,
            letterSpacing: "-0.01em",
            marginBottom: "4px",
          }}
        >
          Manage Organization
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>
          {org.name}
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 300px",
          gap: "20px",
          alignItems: "start",
        }}
      >
        {/* ── Left ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {apiError && (
            <div
              style={{
                background: "var(--priority-urgent-bg)",
                border: "0.5px solid var(--priority-urgent-text)",
                borderRadius: "8px",
                padding: "10px 14px",
                color: "var(--priority-urgent-text)",
                fontSize: "13px",
              }}
            >
              {apiError}
            </div>
          )}

          {/* Details card */}
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
                color: "var(--text-secondary)",
                fontSize: "12px",
                fontWeight: 600,
                marginBottom: "16px",
              }}
            >
              Organization Details
            </p>

            <form
              onSubmit={handleSave}
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              <div
                style={{
                  display: "flex",
                  gap: "16px",
                  alignItems: "flex-start",
                }}
              >
                <div style={{ flexShrink: 0 }}>
                  <label style={labelStyle}>Logo</label>
                  <ImageUpload
                    value={form.logo_url}
                    onChange={(url) =>
                      setForm((p) => ({ ...p, logo_url: url }))
                    }
                    shape="circle"
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Organization Name *</label>
                  <input
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    disabled={!canEdit}
                    style={{
                      ...inputStyle(errors.name),
                      opacity: canEdit ? 1 : 0.6,
                    }}
                    onFocus={(e) => {
                      if (canEdit && !errors.name)
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

              {/* Address */}
              <div
                style={{
                  background: "var(--bg-secondary)",
                  border: "0.5px solid var(--border)",
                  borderRadius: "8px",
                  padding: "14px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                <p
                  style={{
                    color: "var(--text-secondary)",
                    fontSize: "11px",
                    fontWeight: 600,
                    margin: 0,
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
                    gap: "12px",
                  }}
                >
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={labelStyle}>Address Line 1</label>
                    <input
                      name="line1"
                      type="text"
                      placeholder="Street address"
                      value={form.line1}
                      onChange={handleChange}
                      disabled={!canEdit}
                      style={{ ...inputStyle(), opacity: canEdit ? 1 : 0.6 }}
                      onFocus={(e) => {
                        if (canEdit)
                          e.target.style.borderColor = "var(--accent)";
                      }}
                      onBlur={(e) =>
                        (e.target.style.borderColor = "var(--border)")
                      }
                    />
                  </div>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={labelStyle}>Address Line 2</label>
                    <input
                      name="line2"
                      type="text"
                      placeholder="Apartment, suite"
                      value={form.line2}
                      onChange={handleChange}
                      disabled={!canEdit}
                      style={{ ...inputStyle(), opacity: canEdit ? 1 : 0.6 }}
                      onFocus={(e) => {
                        if (canEdit)
                          e.target.style.borderColor = "var(--accent)";
                      }}
                      onBlur={(e) =>
                        (e.target.style.borderColor = "var(--border)")
                      }
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>City</label>
                    <input
                      name="city"
                      type="text"
                      placeholder="Mumbai"
                      value={form.city}
                      onChange={handleChange}
                      disabled={!canEdit}
                      style={{ ...inputStyle(), opacity: canEdit ? 1 : 0.6 }}
                      onFocus={(e) => {
                        if (canEdit)
                          e.target.style.borderColor = "var(--accent)";
                      }}
                      onBlur={(e) =>
                        (e.target.style.borderColor = "var(--border)")
                      }
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>State</label>
                    <input
                      name="state"
                      type="text"
                      placeholder="Maharashtra"
                      value={form.state}
                      onChange={handleChange}
                      disabled={!canEdit}
                      style={{ ...inputStyle(), opacity: canEdit ? 1 : 0.6 }}
                      onFocus={(e) => {
                        if (canEdit)
                          e.target.style.borderColor = "var(--accent)";
                      }}
                      onBlur={(e) =>
                        (e.target.style.borderColor = "var(--border)")
                      }
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Pin Code</label>
                    <input
                      name="pin"
                      type="text"
                      placeholder="400001"
                      maxLength={6}
                      value={form.pin}
                      onChange={handleChange}
                      disabled={!canEdit}
                      style={{ ...inputStyle(), opacity: canEdit ? 1 : 0.6 }}
                      onFocus={(e) => {
                        if (canEdit)
                          e.target.style.borderColor = "var(--accent)";
                      }}
                      onBlur={(e) =>
                        (e.target.style.borderColor = "var(--border)")
                      }
                    />
                  </div>
                </div>
              </div>

              {canEdit && (
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <button
                    type="submit"
                    disabled={updating}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "9px 20px",
                      background: saved
                        ? "var(--priority-low-bg)"
                        : "var(--accent)",
                      border: "none",
                      borderRadius: "8px",
                      color: saved
                        ? "var(--priority-low-text)"
                        : "var(--text-inverse)",
                      fontSize: "13px",
                      fontWeight: 600,
                      cursor: updating ? "not-allowed" : "pointer",
                      transition: "background 0.15s",
                      fontFamily: "inherit",
                    }}
                  >
                    <Save size={13} />
                    {updating ? "Saving..." : saved ? "Saved" : "Save Changes"}
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* Danger zone */}
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
                color: "var(--text-secondary)",
                fontSize: "12px",
                fontWeight: 600,
                marginBottom: "16px",
              }}
            >
              Danger Zone
            </p>
            <div style={{ display: "flex", gap: "10px" }}>
              {myRole !== "owner" && (
                <button
                  onClick={() => setShowLeaveModal(true)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "8px 14px",
                    background: "transparent",
                    border: "0.5px solid var(--priority-urgent-text)",
                    borderRadius: "8px",
                    color: "var(--priority-urgent-text)",
                    fontSize: "12px",
                    fontWeight: 500,
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  <LogOut size={13} />
                  Leave Organization
                </button>
              )}
              {myRole === "owner" && (
                <button
                  onClick={() => setShowDeleteModal(true)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "8px 14px",
                    background: "var(--priority-urgent-bg)",
                    border: "0.5px solid var(--priority-urgent-text)",
                    borderRadius: "8px",
                    color: "var(--priority-urgent-text)",
                    fontSize: "12px",
                    fontWeight: 500,
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  <Trash2 size={13} />
                  Delete Organization
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── Right — Stats ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
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
              Overview
            </p>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              {[
                { icon: Users, label: "Members", value: stats?.members ?? "—" },
                {
                  icon: LayoutGrid,
                  label: "Boards",
                  value: stats?.boards ?? "—",
                },
                {
                  icon: CheckSquare,
                  label: "Tasks",
                  value: stats?.tasks ?? "—",
                },
              ].map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 12px",
                    background: "var(--bg-secondary)",
                    borderRadius: "8px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <Icon size={14} color="var(--text-muted)" />
                    <span
                      style={{
                        color: "var(--text-secondary)",
                        fontSize: "12px",
                      }}
                    >
                      {label}
                    </span>
                  </div>
                  <span
                    style={{
                      color: "var(--text-primary)",
                      fontSize: "16px",
                      fontWeight: 600,
                    }}
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* org info */}
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
                marginBottom: "12px",
              }}
            >
              Info
            </p>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-muted)", fontSize: "12px" }}>
                  Your role
                </span>
                <span
                  style={{
                    color: "var(--text-primary)",
                    fontSize: "12px",
                    fontWeight: 500,
                    textTransform: "capitalize",
                  }}
                >
                  {myRole}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-muted)", fontSize: "12px" }}>
                  Owner
                </span>
                <span
                  style={{
                    color: "var(--text-primary)",
                    fontSize: "12px",
                    fontWeight: 500,
                  }}
                >
                  {org.owner?.name || "—"}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-muted)", fontSize: "12px" }}>
                  Created
                </span>
                <span
                  style={{ color: "var(--text-primary)", fontSize: "12px" }}
                >
                  {new Date(org.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Organization"
        message={`Are you sure you want to delete "${org.name}"? This will permanently delete all boards, tasks, and data. This action cannot be undone.`}
        confirmLabel="Delete"
        isLoading={deleting}
      />

      <ConfirmationModal
        isOpen={showLeaveModal}
        onClose={() => setShowLeaveModal(false)}
        onConfirm={handleLeave}
        title="Leave Organization"
        message={`Are you sure you want to leave "${org.name}"? You will lose access to all boards and tasks.`}
        confirmLabel="Leave"
        isLoading={leaving}
      />
    </div>
  );
}
