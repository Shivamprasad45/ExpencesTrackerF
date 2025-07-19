"use client"

import { StatsCards } from "../components/StatsCards"
import { Charts } from "../components/Charts"

export default function Analytics() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground mt-2">Insights and trends from your spending patterns</p>
      </div>

      <StatsCards />
      <Charts />
    </div>
  )
}
