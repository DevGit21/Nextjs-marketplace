import { Loader2 } from "lucide-react";
import CompanyRow from "./CompanyRow";
import { Company } from "../types/company";
import { User } from "@supabase/supabase-js";

interface Props {
  companies: Company[];
  loading: boolean;
  user: User | null;
  onExpressInterest: (companyId: string) => void;
}

export default function CompanyTable({ companies, loading, user, onExpressInterest }: Props) {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <Loader2 className="animate-spin text-gray-500" size={30} />
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-200 border-b border-gray-300">
            <th className="px-6 py-3 border-r text-left">Company Name</th>
            <th className="px-6 py-3 border-r text-left">Industry</th>
            <th className="px-6 py-3 border-r text-left">Description</th>
            <th className="px-6 py-3 border-r text-left">Price</th>
            <th className="px-6 py-3 border-r text-left">Seller Email</th>
            <th className="px-6 py-3 border-r text-left">Image</th>
            <th className="px-6 py-3 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {companies.map((company) => (
            <CompanyRow
              key={company.id}
              company={company}
              user={user}
              onExpressInterest={onExpressInterest}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
