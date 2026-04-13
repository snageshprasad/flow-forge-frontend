import { baseApi } from "../../services/api";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMe: builder.query({
      query: () => "/users/me",
      providesTags: ["User"],
    }),

    updateProfile: builder.mutation({
      query: (data) => ({
        url: "/users/me",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    changePassword: builder.mutation({
      query: (data) => ({
        url: "/users/me/password",
        method: "PUT",
        body: data,
      }),
    }),

    searchUsers: builder.query({
      query: (q) => `/users/search?q=${encodeURIComponent(q)}`,
    }),

    deleteAccount: builder.mutation({
      query: () => ({
        url: "/users/me",
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetMeQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useSearchUsersQuery,
  useDeleteAccountMutation,
} = userApi;
