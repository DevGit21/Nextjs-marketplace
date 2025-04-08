import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Company } from "../types/company";
import { User } from "@supabase/supabase-js";

interface Props {
  company: Company;
  user: User | null;
  onExpressInterest: (companyId: string) => void;
}

export default function CompanyRow({ company, user, onExpressInterest }: Props) {
  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="px-6 py-4 border-r">{company.name}</td>
      <td className="px-6 py-4 border-r">{company.industry}</td>
      <td className="px-6 py-4 border-r text-sm text-gray-600">{company.description}</td>
      <td className="px-6 py-4 border-r font-bold text-green-500">${company.price}</td>
      <td className="px-6 py-4 border-r text-blue-500">{company.seller_email || "N/A"}</td>
      <td className="px-6 py-4 border-r">
        {company.image_url && (
          <Image
            src={company.image_url}
            alt={company.name}
            width={96}
            height={96}
            className="object-cover"
          />
        )}
      </td>
      <td className="px-6 py-4">
        {user ? (
          <Button className="w-full" onClick={() => onExpressInterest(company.id)}>
            Express Interest
          </Button>
        ) : (
          <span className="text-gray-500">Login to express interest</span>
        )}
      </td>
    </tr>
  );
}
