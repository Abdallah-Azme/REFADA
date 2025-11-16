import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function SearchForm() {
  return (
    <div className="relative w-10 lg:w-72">
      <Input
        type="text"
        placeholder="...بحث"
        className="h-11 rounded-full bg-[#F5F5F5] pr-10 text-right placeholder:text-gray-400 border-none focus-visible:ring-0"
      />
      <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
    </div>
  );
}
