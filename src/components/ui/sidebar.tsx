import * as React from "react"

const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex w-full min-h-screen">{children}</div>
}

export { SidebarProvider }
