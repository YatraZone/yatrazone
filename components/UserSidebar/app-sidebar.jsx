"use client"

import * as React from "react"
import {
  BadgeInfo,
  Home,
  MessagesSquare,
  Rss,
} from "lucide-react"

import { NavMain } from "@/components/UserSidebar/nav-main"
import { NavProjects } from "@/components/UserSidebar/nav-projects"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { NavPolicy } from "./nav-policy"

// This is sample data.
const data = {
  projects: [
    {
      name: "Home",
      url: "/",
      icon: Home,
    },
    {
      name: "Contact",
      url: "/contact",
      icon: MessagesSquare,
    },
  ],
}

export function AppSidebar({ className, menuItems, fixedMenuItems, policy }) {
  const { open } = useSidebar()
  return (
    <Sidebar collapsible="icon" className={className}>
      <SidebarHeader className="bg-blue-600 !p-0 h-32 flex items-center justify-center">
        <Link href="/"><img src="/logo.png" alt="logo" className={` ${open ? "w-[10rem]" : "-rotate-90"}`} /></Link>
      </SidebarHeader>
      <SidebarContent className="lg:mt-12 items-center font-barlow">
        <NavMain items={menuItems} fixedItems={fixedMenuItems} />
        <NavProjects projects={data.projects} />
        <NavPolicy policy={policy} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
