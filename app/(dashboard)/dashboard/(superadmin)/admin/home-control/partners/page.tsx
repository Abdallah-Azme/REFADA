"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, GripVertical, Upload } from "lucide-react";

interface Partner {
  id: string;
  name: string;
  logo: string;
}

export default function PartnersControlPage() {
  const [partners, setPartners] = useState<Partner[]>([
    { id: "1", name: "شريك 1", logo: "" },
    { id: "2", name: "شريك 2", logo: "" },
  ]);

  const handleAddPartner = () => {
    const newPartner: Partner = {
      id: Date.now().toString(),
      name: `شريك جديد ${partners.length + 1}`,
      logo: "",
    };
    setPartners([...partners, newPartner]);
  };

  const handleDeletePartner = (id: string) => {
    if (partners.length <= 1) {
      alert("يجب أن يكون هناك شريك واحد على الأقل");
      return;
    }
    setPartners(partners.filter((p) => p.id !== id));
  };

  const handleUpdatePartner = (
    id: string,
    field: keyof Partner,
    value: string
  ) => {
    setPartners(
      partners.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">تحكم في قسم الشركاء</h1>
        <Button onClick={handleAddPartner}>
          <Plus className="w-4 h-4 ml-2" />
          إضافة شريك جديد
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {partners.map((partner, index) => (
          <Card key={partner.id} className="relative group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center gap-2">
                <GripVertical className="h-5 w-5 text-gray-400 cursor-move" />
                <CardTitle className="text-sm font-medium">
                  شريك {index + 1}
                </CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                onClick={() => handleDeletePartner(partner.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="aspect-video bg-gray-100 rounded-md flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 hover:border-primary/50 transition-colors cursor-pointer">
                  <Upload className="h-8 w-8 mb-2" />
                  <span className="text-xs">رفع الشعار</span>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`name-${partner.id}`}>اسم الشريك</Label>
                  <Input
                    id={`name-${partner.id}`}
                    placeholder="اسم الشريك"
                    value={partner.name}
                    onChange={(e) =>
                      handleUpdatePartner(partner.id, "name", e.target.value)
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-end pt-6 border-t">
        <Button size="lg">حفظ التغييرات</Button>
      </div>
    </div>
  );
}
