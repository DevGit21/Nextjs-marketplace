"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/supabase/config"; 
import { Button } from "@/components/ui/button"; 
import Link from "next/link";
import { usePathname } from "next/navigation"; 
import { User } from "@supabase/supabase-js";

const Navbar = () => {
  const [user, setUser] = useState<User | null>(null);
  const pathname = usePathname(); // Get the current path

  useEffect(() => {
    // Get user session when component is mounted
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user || null));

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      // Clean up subscription when the component is unmounted
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Sign in with Google function
  async function signInWithGoogle() {
    await supabase.auth.signInWithOAuth({ provider: "google" });
  }

  // Sign out function
  async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error.message);
      return;
    }
    window.location.href = "/";
  }

  // Function to determine if the link is active
  const getLinkClass = (linkPath: string) =>
    pathname === linkPath ? "text-blue-600 font-semibold" : "text-gray-600 hover:underline";

  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center">
      <div className="flex items-center space-x-6">
        <Link href="/" className={getLinkClass("/")}>
          Marketplace
        </Link>
        {user && (
          <>
            <Link href="/sell" className={getLinkClass("/sell")}>
              Sell a Company
            </Link>
            <Link href="/seller/interests" className={getLinkClass("/seller/interests")}>
              View Interested Buyers
            </Link>
          </>
        )}
      </div>
      {/* Sign in or Sign out button */}
      {user ? (
        <Button onClick={signOut} className="bg-red-500 text-white">
          Sign Out
        </Button>
      ) : (
        <Button onClick={signInWithGoogle} className="bg-blue-500 text-white">
          Sign in with Google
        </Button>
      )}
    </nav>
  );
};

export default Navbar;
