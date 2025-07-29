import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export const expensesPremiumApi = createApi({
  reducerPath: "expensesPremiumApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `https://13.203.138.162/api/Premium`,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("authToken");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Expense", "Stats", "Budget"],
  endpoints: (builder) => ({
    // ...your other queries

    getPremiumStats: builder.query<any, void>({
      query: () => ({
        url: "/stats/premium",
        method: "GET",
      }),
      providesTags: ["Stats"],
    }),
    getLeaderboard: builder.query<any[], void>({
      query: () => `/leaderboard`,
    }),
  }),
});

export const { useGetPremiumStatsQuery, useGetLeaderboardQuery } =
  expensesPremiumApi;
export default expensesPremiumApi;
