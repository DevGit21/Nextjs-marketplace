"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCompanies } from "./lib/actions";
import { supabase } from "@/supabase/config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { User } from "@supabase/supabase-js";
import Image from "next/image";

// Define the type for the company object
interface Company {
  id: string;
  name: string;
  industry: string;
  description: string;
  price: number;
  seller_email?: string; 
  image_url?: string;
}

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [industry, setIndustry] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      // Proper null check for session
      if (session && session.user) {
        setUser(session.user);
      } else {
        setUser(null); // If no session or user, set to null
      }
    });

    return () => authListener.subscription.unsubscribe();
  }, [router]);

  useEffect(() => {
    async function fetchData() {
      const data = await getCompanies();
      setCompanies(data); 
      setLoading(false);
    }
    fetchData();
  }, []);


  const handleExpressInterest = async (companyId: string) => {
    try {
      // Insert interest record into Supabase
      const { data, error } = await supabase
        .from('company_interests')
        .insert([
          {
            user_id: user?.id,
            company_id: companyId,
          },
        ]);

      if (error) {
        throw error;
      }

      console.log("Interest expressed successfully", data);
      alert("You have expressed interest in this company!");
    } catch (error) {
      console.error("Error expressing interest:", error);
      alert("There was an error expressing your interest. Please try again.");
    }
  };


  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold text-center mb-6">Company Marketplace</h1>

      <div className="flex flex-wrap gap-4 justify-center mb-6">
        {/* Search Bar */}
        <Input
          className="w-full max-w-sm"
          placeholder="Search companies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Industry Dropdown */}
        <select
          className="p-2 border border-gray-400 rounded"
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
        >
          <option value="">All Industries</option>
          {Array.from(new Set(companies.map((c) => c.industry))).map((ind) => (
            <option key={ind} value={ind}>
              {ind}
            </option>
          ))}
        </select>

        {/* Price Range */}
        <Input
          type="number"
          className="w-24"
          placeholder="Min Price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />
        <Input
          type="number"
          className="w-24"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <Loader2 className="animate-spin text-gray-500" size={30} />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-200 border-b border-gray-300">
                <th className="px-6 py-3 border-r border-gray-300 text-left">Company Name</th>
                <th className="px-6 py-3 border-r border-gray-300 text-left">Industry</th>
                <th className="px-6 py-3 border-r border-gray-300 text-left">Description</th>
                <th className="px-6 py-3 border-r border-gray-300 text-left">Price</th>
                <th className="px-6 py-3 border-r border-gray-300 text-left">Seller Email</th>
                <th className="px-6 py-3 border-r border-gray-300 text-left">Image</th>
                <th className="px-6 py-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {companies
                .filter(
                  (c) =>
                    c.name.toLowerCase().includes(search.toLowerCase()) &&
                    (industry ? c.industry === industry : true) &&
                    (minPrice ? c.price >= parseFloat(minPrice) : true) &&
                    (maxPrice ? c.price <= parseFloat(maxPrice) : true)
                )
                .map((company) => (
                  <tr key={company.id} className="border-b border-gray-300 hover:bg-gray-50">
                    <td className="px-6 py-4 border-r border-gray-300">{company.name}</td>
                    <td className="px-6 py-4 border-r border-gray-300">{company.industry}</td>
                    <td className="px-6 py-4 border-r border-gray-300 text-sm text-gray-600">
                      {company.description}
                    </td>
                    <td className="px-6 py-4 border-r border-gray-300 text-green-500 font-bold">
                      ${company.price}
                    </td>
                    <td className="px-6 py-4 border-r border-gray-300 text-blue-500">
                      {company.seller_email || "N/A"}
                    </td>
                    <td className="px-6 py-4 border-r border-gray-300">
                      {company.image_url && (
                        <Image 
                          src={company.image_url} 
                          alt={company.name} 
                          width={96} height={96} // Adjust size as needed
                          className="object-cover"
                        />
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {user ? (
                        <Button
                          className="w-full"
                          onClick={() => handleExpressInterest(company.id)}
                        >
                          Express Interest
                        </Button>
                      ) : (
                        <span className="text-gray-500">Login to express interest</span>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
