import { Prospect } from "@/types";
import { Rating } from "@smastrom/react-rating";
import { ArrowDown01Icon, ArrowDown10Icon } from "lucide-react";
import { useState } from "react";
import "@smastrom/react-rating/style.css";
interface Props {
  prospects: Prospect[];
}

const keysProspect = [
  "name",
  "email",
  "country",
  "jobTitle",
  "yearsOfExperience",
  "industry",
  "companySize",
  "score",
];

function Table({ prospects }: Props) {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Prospect;
    direction: "asc" | "desc";
  } | null>(null);

  const sortedProspects = [...prospects].sort((a, b) => {
    if (!sortConfig) return 0;
    const { key, direction } = sortConfig;

    if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
    if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
    return 0;
  });

  const handleSort = (key: keyof Prospect) => {
    setSortConfig((prev) => {
      if (prev && prev.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
  };

  const renderSortIndicator = (key: keyof Prospect) => {
    if (sortConfig?.key === key) {
      return sortConfig.direction === "asc" ? (
        <ArrowDown01Icon width={14} />
      ) : (
        <ArrowDown10Icon width={14} />
      );
    }
    return null;
  };

  return (
    <div className="rounded-lg border border-zinc-700 bg-zinc-900 w-full">
      <div className="overflow-x-auto rounded-t-lg">
        <table className="min-w-full divide-y-2 divide-zinc-600 text-sm">
          <thead className="ltr:text-left rtl:text-right">
            <tr>
              {keysProspect.map((key) => (
                <th
                  key={key}
                  className="whitespace-nowrap p-4 font-medium text-gray-100 text-left cursor-pointer "
                  onClick={() => handleSort(key as keyof Prospect)}
                >
                  <p className="flex gap-1 items-center  p-2 rounded-md">
                    {" "}
                    {key}
                    <span className="ml-2">
                      {renderSortIndicator(key as keyof Prospect)}
                    </span>
                  </p>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sortedProspects.map((prospect, index) => (
              <tr key={index} className="even:bg-zinc-900 hover:bg-zinc-800">
                <td className="whitespace-nowrap p-4">{prospect.name}</td>
                <td className="whitespace-nowrap p-4">{prospect.email}</td>
                <td className="whitespace-nowrap p-4">{prospect.country}</td>
                <td className="whitespace-nowrap p-4">
                  {prospect.jobTitle.name}
                </td>
                <td className="whitespace-nowrap p-4 text-center">
                  {prospect.yearsOfExperience}
                </td>
                <td className="whitespace-nowrap p-4 text-xs">
                  {prospect.industry.name}
                </td>
                <td className="whitespace-nowrap p-4 ">
                  {prospect.companySize}
                </td>
                <td title={`score ${prospect.score}`}
                 className="whitespace-nowrap p-4 text-right">
                  <Rating
                    style={{ maxWidth: 80 }}
                    value={prospect.score}
                    readOnly
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Table;
