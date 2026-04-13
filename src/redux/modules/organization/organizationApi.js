import { baseApi } from "../../services/api";

export const organizationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createOrganization: builder.mutation({
      query: (data) => ({
        url: "/organizations",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Organization"],
    }),

    getMyOrganizations: builder.query({
      query: () => "/organizations",
      providesTags: ["Organization"],
    }),

    getOrganizationById: builder.query({
      query: (id) => `/organizations/${id}`,
      providesTags: (result, error, id) => [{ type: "Organization", id }],
    }),

    updateOrganization: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/organizations/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Organization", id },
        "Organization",
      ],
    }),

    deleteOrganization: builder.mutation({
      query: (id) => ({
        url: `/organizations/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Organization"],
    }),

    getMembers: builder.query({
      query: (orgId) => `/organizations/${orgId}/members`,
      providesTags: (result, error, orgId) => [
        { type: "OrganizationMember", id: orgId },
      ],
    }),

    updateMemberRole: builder.mutation({
      query: ({ orgId, userId, role }) => ({
        url: `/organizations/${orgId}/members/${userId}/role`,
        method: "PUT",
        body: { role },
      }),
      invalidatesTags: (result, error, { orgId }) => [
        { type: "OrganizationMember", id: orgId },
      ],
    }),

    removeMember: builder.mutation({
      query: ({ orgId, userId }) => ({
        url: `/organizations/${orgId}/members/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { orgId }) => [
        { type: "OrganizationMember", id: orgId },
      ],
    }),

    getOrgStats: builder.query({
      query: (orgId) => `/organizations/${orgId}/stats`,
      providesTags: (result, error, orgId) => [
        { type: "Organization", id: orgId },
      ],
    }),

    leaveOrganization: builder.mutation({
      query: (orgId) => ({
        url: `/organizations/${orgId}/leave`,
        method: "DELETE",
      }),
      invalidatesTags: ["Organization"],
    }),
  }),
});

export const {
  useCreateOrganizationMutation,
  useGetMyOrganizationsQuery,
  useGetOrganizationByIdQuery,
  useUpdateOrganizationMutation,
  useDeleteOrganizationMutation,
  useGetMembersQuery,
  useUpdateMemberRoleMutation,
  useRemoveMemberMutation,
  useLeaveOrganizationMutation,
  useGetOrgStatsQuery,
} = organizationApi;
