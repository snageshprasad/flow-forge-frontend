import { baseApi } from "../../services/api";

export const inviteApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    sendInvite: builder.mutation({
      query: ({ orgId, ...data }) => ({
        url: `/invites/org/${orgId}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, { orgId }) => [
        { type: "Invite", id: orgId },
      ],
    }),

    acceptInvite: builder.mutation({
      query: (token) => ({
        url: `/invites/accept/${token}`,
        method: "POST",
      }),
      invalidatesTags: ["Invite", "Organization"],
    }),

    declineInvite: builder.mutation({
      query: (token) => ({
        url: `/invites/decline/${token}`,
        method: "POST",
      }),
      invalidatesTags: ["Invite"],
    }),

    getInviteByToken: builder.query({
      query: (token) => `/invites/token/${token}`,
    }),

    getMyInvites: builder.query({
      query: () => "/invites/me",
      providesTags: ["Invite"],
    }),

    cancelInvite: builder.mutation({
      query: (inviteId) => ({
        url: `/invites/${inviteId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Invite"],
    }),

    getOrgInvites: builder.query({
      query: (orgId) => `/invites/org/${orgId}`,
      providesTags: (result, error, orgId) => [{ type: "Invite", id: orgId }],
    }),
  }),
});

export const {
  useSendInviteMutation,
  useAcceptInviteMutation,
  useDeclineInviteMutation,
  useGetInviteByTokenQuery,
  useGetMyInvitesQuery,
  useCancelInviteMutation,
  useGetOrgInvitesQuery,
} = inviteApi;
