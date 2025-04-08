"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/supabase/config";
import CompanyFilters from "./CompanyFilters";
import CompanyTable from "./CompanyTable";
import { Company } from "../types/company";
import { User } from "@supabase/supabase-js";

type Props = {
  initialCompanies: Company[];
};

export default function MarketplacePage({ initialCompanies }: Props) {
  const [companies, setCompanies] = useState<Company[]>(initialCompanies);
  const [loading, setLoading] = useState(false); // already loaded from server
  const [search, setSearch] = useState("");
  const [industry, setIndustry] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => authListener.subscription.unsubscribe();
  }, []);

  const handleExpressInterest = async (companyId: string) => {
    const { data, error } = await supabase.from("company_interests").insert([
      {
        user_id: user?.id,
        company_id: companyId,
      },
    ]);

    if (error) {
      console.error(error);
      alert("There was an error. Try again.");
    } else {
      alert("Interest sent!");
    }
  };

  const filteredCompanies = useMemo(() => {
    return companies.filter((company) => {
      const matchesSearch = company.name.toLowerCase().includes(search.toLowerCase());
      const matchesIndustry = industry ? company.industry === industry : true;
      const matchesMin = minPrice ? company.price >= parseFloat(minPrice) : true;
      const matchesMax = maxPrice ? company.price <= parseFloat(maxPrice) : true;
      return matchesSearch && matchesIndustry && matchesMin && matchesMax;
    });
  }, [companies, search, industry, minPrice, maxPrice]);

  const industries = useMemo(
    () => Array.from(new Set(companies.map((c) => c.industry))),
    [companies]
  );

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold text-center mb-6">Company Marketplace</h1>

      <CompanyFilters
        search={search}
        industry={industry}
        minPrice={minPrice}
        maxPrice={maxPrice}
        industries={industries}
        onSearchChange={setSearch}
        onIndustryChange={setIndustry}
        onMinPriceChange={setMinPrice}
        onMaxPriceChange={setMaxPrice}
      />

      <CompanyTable
        companies={filteredCompanies}
        loading={loading}
        user={user}
        onExpressInterest={handleExpressInterest}
      />
    </div>
  );
}
