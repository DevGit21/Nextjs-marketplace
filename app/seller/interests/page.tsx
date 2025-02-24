"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/supabase/config"; // Adjust the path based on your setup
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { User } from "@supabase/supabase-js";
interface Interest {
  id: string;
  created_at: string;
  company_id: string;
  user_id: string;
  company_name?: string; // Optional because it's added later
  user?: {
    id: string;
    email: string;
    full_name?: string;
  };
}

export default function SellerInterestsPage() {
  const [interests, setInterests] = useState<Interest[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch authenticated user (assuming the seller must be logged in)
  const [user, setUser] = useState<User | null>(null);
  
  // Get current session user
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user || null));
  }, []);

  useEffect(() => {
    if (!user) return;

    async function fetchInterests() {
        setLoading(true);
      
        // Fetch the company interests where the current user is the seller
        const { data: interestsData, error } = await supabase
        .from('company_interests')
        .select(`
            id,
            created_at,
            company_id,
            user_id,
            companies ( seller_id, name )
        `)
        .eq('companies.seller_id', user?.id);
      
        if (error) {
          console.error("Error fetching interests:", error.message);
          setLoading(false);
          return;
        }
      
        // Extract company IDs
        const companyIds = interestsData.map((interest) => interest.company_id);
      
        // Fetch company names using the company IDs
        const { data: companiesData, error: companyError } = await supabase
          .from('companies')
          .select('id, name')
          .in('id', companyIds);
      
        if (companyError) {
          console.error("Error fetching company names:", companyError.message);
          setLoading(false);
          return;
        }
      
        // Merge company names into the interests data
        const interestsWithCompanyNames = interestsData.map((interest) => {
          const company = companiesData.find((company) => company.id === interest.company_id);
          return {
            ...interest,
            company_name: company ? company.name : 'N/A',
          };
        });
      
        // Process user data if needed (fetch user emails)
        const userIds = interestsWithCompanyNames.map((interest) => interest.user_id);
        const { data: userData, error: userError } = await supabase
          .rpc("get_user_emails", { user_ids: userIds });
      
        if (userError) {
          console.error("Error fetching user emails:", userError.message);
        } else {
          const interestsWithUser = interestsWithCompanyNames.map((interest) => ({
            ...interest,
            user: userData.find((u: { id: string; email: string; full_name: string }) => u.id === interest.user_id),
          }));
      
          setInterests(interestsWithUser);
        }
      
        setLoading(false);
      }
      

    fetchInterests();
  }, [user]);

  useEffect(() => {
    const checkAuth = async () => {
      const session = await supabase.auth.getSession(); // Get current session
      if (!session.data.session) {
        // If no user session is found, redirect to the login page
        router.push("/"); // Redirect to login (or you can redirect to the homepage)
      }
      else{
        setLoading(false);
      }
    };
    checkAuth();
  }, [router]);

  // Show loader while data is fetching
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin text-gray-500" size={30} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold text-center mb-6">Interested Buyers</h1>

      {interests.length === 0 ? (
        <p className="text-center text-gray-500">No buyers have expressed interest yet.</p>
      ) : (
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-200 border-b border-gray-300">
              <th className="px-6 py-3 border-r border-gray-300 text-left">Company</th>
              <th className="px-6 py-3 border-r border-gray-300 text-left">Buyer Email</th>
              <th className="px-6 py-3 border-r border-gray-300 text-left">Interest Date</th>
            </tr>
          </thead>
          <tbody>
  {interests.map((interest) => (
    <tr key={interest.id} className="border-b border-gray-300 hover:bg-gray-50">
      {/* Display Company Name */}
      <td className="px-6 py-4 border-r border-gray-300">
        {interest.company_name || 'N/A'}
      </td>

      {/* Display User Email */}
      <td className="px-6 py-4 border-r border-gray-300">
        {interest.user?.email || 'N/A'}
      </td>

      {/* Display Created At Date */}
      <td className="px-6 py-4 border-r border-gray-300">
        {interest.created_at ? new Date(interest.created_at).toLocaleDateString() : 'N/A'}
      </td>
    </tr>
  ))}
</tbody>

        </table>
      )}
    </div>
  );
}
