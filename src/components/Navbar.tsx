'use client'; // Tells Next.js this component runs in the browser

import { UserButton, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

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
    <nav className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center shadow-sm">
      <div className="font-bold text-xl tracking-tight text-gray-900 flex items-center gap-2">
        <span className="text-blue-600">❖</span> ClearSpace
      </div>
      
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-500 hidden md:block font-medium">
          Workspace Admin
        </span>
        <UserButton />
      </div>
    </nav>
  );
}