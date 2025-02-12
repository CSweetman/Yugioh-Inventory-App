import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export interface Product {
    productId: string
    name: string
    price: number
    rating?: number
    stockQuantity: number
}

export interface SalesSummary {
    salesSummaryId: string
    totalValue: number
    changePercentage?: number
    date: string
}

export interface PurchaseSummary {
    purchaseSummaryId: string
    totalPurchased: number
    changePercentage?: number
    date: string
}

export interface ExpenseSummary {
    expenseSummaryId: string
    totalExpenses: number
    date: string
}

export interface ExpenseByCategorySummary {
    expenseByCategorySummaryId: string
    category: string
    amount: string
    date: string
}

export interface DashboardMetrics {
    popularProducts: Product[]
    salesSummary: SalesSummary[]
    purchaseSummary: PurchaseSummary[]
    expenseSummary: ExpenseSummary[]
    expenseByCategorySummary: ExpenseByCategorySummary[]
}

export const api = createApi({
    baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL }),
    reducerPath: "api",
    tagTypes: ["DashboardMetrics"],
    endpoints: (build) => ({
        // 1st param is datatype receiving, 2nd param is datatype that is being sent
        // Tags help us declare when the data is stale/invalidated and needs to be refetched
        // This will all be stored in the redux store
        getDashboardMetrics: build.query<DashboardMetrics, void>({
            query: () => "/dashboard",
            providesTags: ["DashboardMetrics"],
        }),
    }),
})

export const { useGetDashboardMetricsQuery } = api
