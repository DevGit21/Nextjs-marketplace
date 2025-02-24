"use client";

import { supabase } from "@/supabase/config";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  async function logout() {
    await supabase.auth.signOut();
    router.refresh();
  }

  return (
    <button className="p-2 bg-red-500 text-white rounded" onClick={logout}>
      Logout
    </button>
  );
}
