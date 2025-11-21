import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Search, Send } from "lucide-react";
import { Project } from "./current-project-table-contribution";

interface ContributeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
}

export default function ContributeDialog({
  isOpen,
  onClose,
  project,
}: ContributeDialogProps) {
  if (!project) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg p-0 overflow-hidden bg-white rounded-3xl">
        <div className="p-6">
          <DialogHeader className="flex flex-row items-center justify-between mb-6">
            <DialogTitle className="text-xl font-bold text-center w-full text-gray-800">
              {project.projectName} {project.camp ? `مخيم ${project.camp}` : ""}
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
                  <Input
                    placeholder="ادخل اسم العائلة"
                    className="bg-white border-gray-200 text-right h-12 rounded-xl pr-10"
                  />
                  <Search className="w-5 h-5 text-gray-400 absolute right-3 top-3.5" />
                </div>
                <Select>
                  <SelectTrigger className="w-[100px] bg-white border-gray-200 h-12 rounded-xl">
                    <SelectValue placeholder="تنفية" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">الكل</SelectItem>
                    <SelectItem value="beneficiary">مستفيد</SelectItem>
                  </SelectContent>
                </Select>
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
