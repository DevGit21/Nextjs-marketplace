"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/supabase/config"; 
import SellCompany from "../components/SellCompany";

export default function SellCompanyPage() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const session = await supabase.auth.getSession(); // Get current session
      if (!session.data.session) {
        router.push("/"); // Redirect to marketplace
      }
      else{
        setLoading(false);
      }
    };
    checkAuth();
  }, [router]);

  if (loading) {
    return <div>Loading...</div>; // Loading state
  }

  return <SellCompany />;
}
