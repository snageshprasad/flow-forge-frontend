/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Plus, Layers } from "lucide-react";
import { useGetMyOrganizationsQuery } from "../redux/modules/organization/organizationApi";
import {
  setCurrentOrg,
  setMyOrgs,
  selectCurrentOrg,
  selectMyOrgs,
} from "../redux/modules/organization/organizationSlice";
import Spinner from "../components/ui/Spinner";

export default function Dashboard() {
  const dispatch = useDispatch();
  const currentOrg = useSelector(selectCurrentOrg);
  const myOrgs = useSelector(selectMyOrgs);

  const { data, isLoading } = useGetMyOrganizationsQuery();

useEffect(() => {
  if (data?.data) {
    dispatch(setMyOrgs(data.data));
    if (!currentOrg && data.data.length > 0) {
      dispatch(setCurrentOrg(data.data[0]));
    }
  }
}, [data]);

  if (isLoading) {
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
  }

  if (!isLoading && myOrgs.length === 0) {
    return <NoOrgState />;
  }

  return <OrgDashboard org={currentOrg} />;
}

function NoOrgState() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        gap: "16px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: "52px",
          height: "52px",
          borderRadius: "12px",
          background: "var(--bg-secondary)",
          border: "0.5px solid var(--border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "4px",
        }}
      >
        <Layers size={22} color="var(--text-muted)" />
      </div>

      <div>
        <h2
          style={{
            color: "var(--text-primary)",
            fontSize: "18px",
            fontWeight: 600,
            marginBottom: "8px",
            letterSpacing: "-0.01em",
          }}
        >
          You don't belong to any organization
        </h2>
        <p
          style={{
            color: "var(--text-muted)",
            fontSize: "13px",
            lineHeight: 1.6,
            maxWidth: "340px",
          }}
        >
          Create a new organization to start forging, or ask someone to invite
          you to theirs.
        </p>
      </div>

      <button
        onClick={() => navigate("/organizations/new")}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          padding: "9px 16px",
          background: "var(--accent)",
          border: "none",
          borderRadius: "8px",
          color: "var(--text-inverse)",
          fontSize: "13px",
          fontWeight: 600,
          cursor: "pointer",
          transition: "background 0.15s",
          marginTop: "8px",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.background = "var(--accent-hover)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.background = "var(--accent)")
        }
      >
        <Plus size={14} />
        Create Organization
      </button>
    </div>
  );
}

function OrgDashboard({ org }) {
  const navigate = useNavigate();
  if (!org) return null;

  return (
    <div>
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
          Boards
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>
          {org.name}
        </p>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "360px",
          background: "var(--bg-card)",
          border: "0.5px solid var(--border)",
          borderRadius: "12px",
          gap: "14px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "10px",
            background: "var(--bg-secondary)",
            border: "0.5px solid var(--border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Layers size={20} color="var(--accent)" />
        </div>

        <div>
          <p
            style={{
              color: "var(--text-primary)",
              fontSize: "15px",
              fontWeight: 600,
              marginBottom: "6px",
            }}
          >
            Boards coming soon
          </p>
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "12px",
              lineHeight: 1.6,
              maxWidth: "280px",
            }}
          >
            Kanban boards, task management, and everything in between — almost
            ready.
          </p>
        </div>

        <button
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "8px 14px",
            background: "transparent",
            border: "0.5px solid var(--border)",
            borderRadius: "8px",
            color: "var(--text-muted)",
            fontSize: "12px",
            fontWeight: 500,
            cursor: "not-allowed",
            opacity: 0.5,
          }}
        >
          <Plus size={13} />
          New Board
        </button>
      </div>
    </div>
  );
}
