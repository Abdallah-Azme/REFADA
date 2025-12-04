import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Search, Send, ChevronDown, Check } from "lucide-react";
import { Project } from "./current-project-table-contribution";
import { useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

interface ContributeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
}

const filterOptions = [
  { id: "critical", label: "حالات حرجة" },
  { id: "infants", label: "اطفال رضع" },
  { id: "elderly", label: "كبار سن" },
  { id: "orphans", label: "أيتام" },
  { id: "urgent", label: "حالات عاجلة" },
];

const familiesList = [
  { id: "1", name: "عائلة مرسي حسن" },
  { id: "2", name: "عائلة سالم حسن" },
  { id: "3", name: "عائلة المحمدي السيد علي حسن" },
  { id: "4", name: "عائلة أحمد محمد العيوطي محمد" },
  { id: "5", name: "عائلة الأرقم" },
];

export default function ContributeDialog({
  isOpen,
  onClose,
  project,
}: ContributeDialogProps) {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [selectedFamilies, setSelectedFamilies] = useState<string[]>([]);
  const [openFamilySearch, setOpenFamilySearch] = useState(false);

  if (!project) return null;

  const toggleFilter = (id: string) => {
    setSelectedFilters((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleFamily = (id: string) => {
    setSelectedFamilies((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg p-0 overflow-hidden bg-white rounded-3xl max-w-[500px]!">
        <div className="p-6">
          <DialogHeader className="flex flex-row items-center justify-between mb-6">
            <DialogTitle className="text-xl font-bold text-center w-full text-gray-800">
              {project.projectName}{" "}
              {project.camp ? `إيواء ${project.camp}` : ""}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 bg-gray-50/50 p-6 rounded-xl">
            {/* Quantity Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600 block text-right">
                من فضلك ادخل الكمية التي تريد المساهمة بها
              </label>
              <Input
                type="number"
                placeholder="العدد"
                className="bg-white border-gray-200 text-right h-12 rounded-xl"
              />
            </div>

            {/* Beneficiary Families Search */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-800 block text-right">
                العائلات المستفيدة
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Popover
                    open={openFamilySearch}
                    onOpenChange={setOpenFamilySearch}
                  >
                    <PopoverTrigger asChild>
                      <div className="relative w-full">
                        <Input
                          placeholder="ادخل اسم العائلة"
                          className="bg-white border-gray-200 text-right h-12 rounded-xl pr-10 cursor-pointer"
                          readOnly
                          value={
                            selectedFamilies.length > 0
                              ? `تم اختيار ${selectedFamilies.length} عائلات`
                              : ""
                          }
                        />
                        <Search className="w-5 h-5 text-gray-400 absolute right-3 top-3.5" />
                      </div>
                    </PopoverTrigger>
                    <PopoverContent className="p-0 w-[300px]" align="end">
                      <Command>
                        <CommandInput
                          placeholder="بحث عن عائلة..."
                          className="text-right"
                        />
                        <CommandList>
                          <CommandEmpty>لا توجد نتائج.</CommandEmpty>
                          <CommandGroup>
                            {familiesList.map((family) => (
                              <CommandItem
                                key={family.id}
                                value={family.name}
                                onSelect={() => toggleFamily(family.id)}
                                className="flex items-center justify-between cursor-pointer"
                              >
                                <span className="text-right flex-1">
                                  {family.name}
                                </span>
                                <div
                                  className={cn(
                                    "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                    selectedFamilies.includes(family.id)
                                      ? "bg-primary text-primary-foreground"
                                      : "opacity-50 [&_svg]:invisible"
                                  )}
                                >
                                  <Check className={cn("h-4 w-4")} />
                                </div>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-[100px] bg-white border-gray-200 h-12 rounded-xl flex justify-between items-center px-3 text-gray-500 font-normal"
                    >
                      <ChevronDown className="h-4 w-4 opacity-50" />
                      <span>تنفية</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-[160px] p-2 bg-white rounded-xl shadow-lg"
                    align="end"
                  >
                    <div className="flex flex-col gap-2">
                      {filterOptions.map((option) => (
                        <div
                          key={option.id}
                          className="flex items-center justify-between gap-2 p-1 hover:bg-gray-50 rounded-md cursor-pointer"
                          onClick={() => toggleFilter(option.id)}
                        >
                          <label
                            htmlFor={option.id}
                            className="text-sm text-gray-700 cursor-pointer select-none"
                          >
                            {option.label}
                          </label>
                          <Checkbox
                            id={option.id}
                            checked={selectedFilters.includes(option.id)}
                            onCheckedChange={() => toggleFilter(option.id)}
                            className="border-gray-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                          />
                        </div>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Note Textarea */}
            <div>
              <Textarea
                placeholder="اكتب ملاحظة"
                className="bg-white border-gray-200 text-right min-h-[60px] rounded-xl resize-none"
              />
            </div>
          </div>

          {/* Send Button */}
          <div className="mt-6 flex justify-center">
            <Button className="bg-[#1B2540] hover:bg-[#2c3b60] text-white rounded-xl px-12 py-6 text-base font-medium flex items-center gap-2 min-w-[200px]">
              <Send className="w-5 h-5 rotate-180" /> {/* Rotated for RTL */}
              ارسال
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
