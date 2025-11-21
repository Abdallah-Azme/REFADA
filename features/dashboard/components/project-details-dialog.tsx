import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Check, Heart } from "lucide-react";
import { Project } from "./current-project-table-contribution";

interface ProjectDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
  onContribute: (project: Project) => void;
}

// Dummy data for families
const families = [
  {
    id: 1,
    name: "عائلة سالم أحمد محمد",
    members: 5,
    elderly: 1,
    females: 2,
    males: "لا يوجد",
    sick: 3,
    beneficiary: true,
  },
  {
    id: 2,
    name: "عائلة المحمدي أمين",
    members: 10,
    elderly: "لا يوجد",
    females: 2,
    males: 30,
    sick: 2,
    beneficiary: true,
  },
  {
    id: 3,
    name: "عائلة سالم أحمد محمد",
    members: 10,
    elderly: 2,
    females: 3,
    males: 30,
    sick: 3,
    beneficiary: false,
  },
  {
    id: 4,
    name: "عائلة المحمدي أمين",
    members: 10,
    elderly: 4,
    females: 5,
    males: 20,
    sick: 2,
    beneficiary: false,
  },
  {
    id: 5,
    name: "عائلة سالم أحمد محمد",
    members: 10,
    elderly: "لا يوجد",
    females: 3,
    males: 10,
    sick: 2,
    beneficiary: true,
  },
  {
    id: 6,
    name: "عائلة المحمدي أمين",
    members: 10,
    elderly: 1,
    females: 1,
    males: 6,
    sick: 1200,
    beneficiary: true,
  },
];

export default function ProjectDetailsDialog({
  isOpen,
  onClose,
  project,
  onContribute,
}: ProjectDetailsDialogProps) {
  if (!project) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden bg-white">
        <div className="p-6 pb-0">
          <DialogHeader className="flex flex-row items-center justify-between mb-6">
            <DialogTitle className="text-xl font-bold text-right w-full">
              تفاصيل مشروع
            </DialogTitle>
          </DialogHeader>

          {/* Top Info Bar */}
          <div className="grid grid-cols-5 gap-2 mb-6">
            <div className="bg-white p-3 rounded-md text-center shadow-sm border border-gray-100">
              <span className="text-sm font-semibold text-gray-800 block">
                {project.projectName}
              </span>
            </div>
            <div className="bg-white p-3 rounded-md text-center shadow-sm border border-gray-100">
              <span className="text-sm font-semibold text-gray-800 block">
                {project.camp ? `مخيم ${project.camp}` : "مخيم أصداء"}
              </span>
            </div>
            <div className="bg-white p-3 rounded-md text-center shadow-sm border border-gray-100">
              <span className="text-sm font-semibold text-gray-800 block">
                الاجمالي: {project.total}
              </span>
            </div>
            <div className="bg-white p-3 rounded-md text-center shadow-sm border border-gray-100">
              <span className="text-sm font-semibold text-gray-800 block">
                تم تسليم: {project.received}
              </span>
            </div>
            <div className="bg-white p-3 rounded-md text-center shadow-sm border border-gray-100">
              <span className="text-sm font-semibold text-gray-800 block">
                المتبقي: {project.remaining}
              </span>
            </div>
          </div>

          {/* Families Table Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
            <h3 className="text-right font-bold text-gray-800 mb-4">
              العائلات
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-right">
                <thead className="bg-gray-50 text-gray-500">
                  <tr>
                    <th className="pb-3 font-medium">اسم العائلة</th>
                    <th className="pb-3 font-medium text-center">
                      عدد الافراد
                    </th>
                    <th className="pb-3 font-medium text-center">كبار سن</th>
                    <th className="pb-3 font-medium text-center">اناث</th>
                    <th className="pb-3 font-medium text-center">ذكور</th>
                    <th className="pb-3 font-medium text-center">
                      حالات مرضية
                    </th>
                    <th className="pb-3 font-medium text-center">مستفيدة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {families.map((family) => (
                    <tr key={family.id} className="group hover:bg-gray-50/50">
                      <td className="py-4 font-medium text-gray-900">
                        {family.name}
                      </td>
                      <td className="py-4 text-center text-gray-600">
                        {family.members}
                      </td>
                      <td className="py-4 text-center text-gray-600">
                        {family.elderly}
                      </td>
                      <td className="py-4 text-center text-gray-600">
                        {family.females}
                      </td>
                      <td className="py-4 text-center text-gray-600">
                        {family.males}
                      </td>
                      <td className="py-4 text-center text-gray-600">
                        {family.sick}
                      </td>
                      <td className="py-4 text-center">
                        {family.beneficiary && (
                          <div className="flex justify-center">
                            <div className="bg-green-100 rounded-full p-1">
                              <Check className="w-3 h-3 text-green-600" />
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer Button */}
        <div className="p-6 pt-0 flex justify-center">
          <Button
            onClick={() => onContribute(project)}
            className="bg-[#1B2540] hover:bg-[#2c3b60] text-white rounded-md px-8 py-6 text-base font-medium flex items-center gap-2 min-w-[200px]"
          >
            <Heart className="w-5 h-5" />
            ساهم الان
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
