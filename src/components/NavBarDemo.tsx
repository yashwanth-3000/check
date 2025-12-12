"use client";
import { Home, User, Palette } from 'lucide-react'
import { NavBar } from "@/components/ui/tubelight-navbar"

export function NavBarDemo() {
  const navItems = [
    { name: 'Home', url: '/', icon: Home },
    { name: 'Create', url: '/create', icon: Palette },
    { name: 'About', url: '#', icon: User }
  ]

  return <NavBar items={navItems} />
}
