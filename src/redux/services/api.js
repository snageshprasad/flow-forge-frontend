import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: [
    "Auth",
    "Organization",
    "OrganizationMember",
    "Board",
    "BoardMember",
    "Status",
    "Task",
    "TaskAssignee",
    "Comment",
    "Activity",
    "Invite",
  ],
  endpoints: () => ({}), // endpoints injected per module
});
