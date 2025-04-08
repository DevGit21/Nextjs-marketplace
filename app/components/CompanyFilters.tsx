import { Input } from "@/components/ui/input";

interface Props {
  search: string;
  industry: string;
  minPrice: string;
  maxPrice: string;
  industries: string[];
  onSearchChange: (val: string) => void;
  onIndustryChange: (val: string) => void;
  onMinPriceChange: (val: string) => void;
  onMaxPriceChange: (val: string) => void;
}

export default function CompanyFilters({
  search,
  industry,
  minPrice,
  maxPrice,
  industries,
  onSearchChange,
  onIndustryChange,
  onMinPriceChange,
  onMaxPriceChange,
}: Props) {
  return (
    <div className="flex flex-wrap gap-4 justify-center mb-6">
      <Input
        className="w-full max-w-sm"
        placeholder="Search companies..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
      />

      <select
        className="p-2 border border-gray-400 rounded"
        value={industry}
        onChange={(e) => onIndustryChange(e.target.value)}
      >
        <option value="">All Industries</option>
        {industries.map((ind) => (
          <option key={ind} value={ind}>
            {ind}
          </option>
        ))}
      </select>

      <Input
        type="number"
        className="w-24"
        placeholder="Min Price"
        value={minPrice}
        onChange={(e) => onMinPriceChange(e.target.value)}
      />

      <Input
        type="number"
        className="w-24"
        placeholder="Max Price"
        value={maxPrice}
        onChange={(e) => onMaxPriceChange(e.target.value)}
      />
    </div>
  );
}
