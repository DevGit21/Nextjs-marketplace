"use server";

import { supabase } from "@/supabase/config";

export async function getCompanies() {
  //Fetch companies without the seller email
  const { data: companies, error } = await supabase.from("companies").select("*");

  if (error) {
    throw new Error(error.message);
  }

  // Fetch seller emails for each company
  const companiesWithEmail = await Promise.all(
    companies.map(async (company) => {
      // Wrap seller_id in an array
      const { data: sellerData, error: sellerError } = await supabase.rpc("get_user_emails", {
        user_ids: [company.seller_id], // Wrap seller_id in an array
      });

      if (sellerError) {
        console.error("Error fetching seller email", sellerError);
      }

      return {
        ...company,
        seller_email: sellerData?.[0]?.email || "Unknown",
      };
    })
  );

  return companiesWithEmail;
}
