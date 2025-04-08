import MarketplacePage from "./components/MarketplacePage";
import { getCompanies } from "./lib/actions";
import { Company } from "./types/company";

export default async function Page() {
  const companies: Company[] = await getCompanies(); 

  return <MarketplacePage initialCompanies={companies} />;
}
