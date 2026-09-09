'use client'; // Tells Next.js this component runs in the browser

import { UserButton, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const { isSignedIn } = useAuth(); // Hooks into Clerk's live status
  const router = useRouter(); // Next.js page router

  // The Watcher: If the user is not signed in, redirect to the sign-in page
  useEffect(() => {
    if (isSignedIn === false) {
      router.push("/sign-in");
    }
  }, [isSignedIn, router]);

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-8 py-4 flex justify-between items-center shadow-sm transition-colors duration-300">
      <div className="font-bold text-xl tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
        <span className="text-blue-600 dark:text-blue-500">❖</span> ClearSpace
      </div>
      
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-500 dark:text-gray-400 hidden md:block font-medium">
          Workspace Admin
        </span>
        
        {/* Dark Mode Toggle */}
        <ThemeToggle />
        
        <UserButton />
      </div>
    </nav>
  );
}