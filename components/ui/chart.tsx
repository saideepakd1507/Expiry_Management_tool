import type React from "react"
export const ChartContainer = ({ children }: { children: React.ReactNode }) => {
  return <div className="relative">{children}</div>
}

export const ChartTitle = ({ children }: { children: React.ReactNode }) => {
  return <div className="text-lg font-semibold mb-2">{children}</div>
}

export const ChartTooltip = () => {
  return null
}

export const ChartLegend = ({ children }: { children: React.ReactNode }) => {
  return <div className="text-sm text-muted-foreground">{children}</div>
}

