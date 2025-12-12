"use client";
import { NavBarDemo } from "@/components/NavBarDemo";
import { HeroDemo } from "@/components/ui/animated-hero";
import { Component as AnimatedBackground } from "@/components/ui/raycast-animated-background";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <AnimatedBackground />
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        <NavBarDemo />
        <HeroDemo />
      </div>
    </div>
  );
}
