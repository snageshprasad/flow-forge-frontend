import { createSlice, createSelector } from "@reduxjs/toolkit";

const initialState = {
  currentOrg: null,
  myOrgs: [],
};

const organizationSlice = createSlice({
  name: "organization",
  initialState,
  reducers: {
    setCurrentOrg: (state, action) => {
      state.currentOrg = action.payload;
    },
    setMyOrgs: (state, action) => {
      state.myOrgs = action.payload;
    },
    clearOrganization: (state) => {
      state.currentOrg = null;
      state.myOrgs = [];
    },
  },
});

export const { setCurrentOrg, setMyOrgs, clearOrganization } =
  organizationSlice.actions;

const selectOrganizationState = (state) => state.organization;

export const selectCurrentOrg = createSelector(
  selectOrganizationState,
  (org) => org?.currentOrg ?? null,
);

export const selectMyOrgs = createSelector(
  selectOrganizationState,
  (org) => org?.myOrgs ?? [],
);

export default organizationSlice.reducer;
