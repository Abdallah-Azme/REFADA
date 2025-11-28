"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import AdminCampsTable from "@/features/dashboard/components/admin-camps-table";
import {
  Camp,
  dummyCamps,
} from "@/features/dashboard/table-cols/admin-camps-cols";

export default function AdminCampsPage() {
  const [camps, setCamps] = useState<Camp[]>(dummyCamps);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCamp, setEditingCamp] = useState<Camp | null>(null);
  const [formData, setFormData] = useState<Partial<Camp>>({
    name: "",
    location: "",
    description: "",
    capacity: 0,
    currentOccupancy: 0,
    coordinates: { lat: 0, lng: 0 },
    status: "active",
  });

  const handleOpenDialog = (camp?: Camp) => {
    if (camp) {
      setEditingCamp(camp);
      setFormData(camp);
    } else {
      setEditingCamp(null);
      setFormData({
        name: "",
        location: "",
        description: "",
        capacity: 0,
        currentOccupancy: 0,
        coordinates: { lat: 0, lng: 0 },
        status: "active",
      });
    }
    setIsDialogOpen(true);
  };

  const handleSaveCamp = () => {
    if (editingCamp) {
      // Update existing camp
      setCamps(
        camps.map((camp) =>
          camp.id === editingCamp.id ? ({ ...camp, ...formData } as Camp) : camp
        )
      );
    } else {
      // Create new camp
      const newCamp: Camp = {
        id: Date.now().toString(),
        ...formData,
      } as Camp;
      setCamps([...camps, newCamp]);
    }
    setIsDialogOpen(false);
  };

  const handleDeleteCamp = (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذا المخيم؟")) {
      setCamps(camps.filter((camp) => camp.id !== id));
    }
  };

  const handleToggleStatus = (id: string) => {
    setCamps(
      camps.map((camp) =>
        camp.id === id
          ? {
              ...camp,
              status: camp.status === "active" ? "inactive" : "active",
            }
          : camp
      )
    );
  };

  return (
    <section className="p-7 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">إدارة المخيمات</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              إضافة مخيم جديد
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingCamp ? "تعديل المخيم" : "إضافة مخيم جديد"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">اسم المخيم</Label>
                <Input
                  id="name"
                  placeholder="أدخل اسم المخيم"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">الموقع</Label>
                <Input
                  id="location"
                  placeholder="أدخل موقع المخيم"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">الوصف</Label>
                <Textarea
                  id="description"
                  placeholder="أدخل وصف المخيم"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="min-h-[100px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="capacity">السعة الكلية</Label>
                  <Input
                    id="capacity"
                    type="number"
                    placeholder="0"
                    value={formData.capacity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        capacity: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="occupancy">الإشغال الحالي</Label>
                  <Input
                    id="occupancy"
                    type="number"
                    placeholder="0"
                    value={formData.currentOccupancy}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        currentOccupancy: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="lat">خط العرض (Latitude)</Label>
                  <Input
                    id="lat"
                    type="number"
                    step="0.000001"
                    placeholder="31.5"
                    value={formData.coordinates?.lat}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        coordinates: {
                          ...formData.coordinates!,
                          lat: parseFloat(e.target.value) || 0,
                        },
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lng">خط الطول (Longitude)</Label>
                  <Input
                    id="lng"
                    type="number"
                    step="0.000001"
                    placeholder="34.45"
                    value={formData.coordinates?.lng}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        coordinates: {
                          ...formData.coordinates!,
                          lng: parseFloat(e.target.value) || 0,
                        },
                      })
                    }
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  إلغاء
                </Button>
                <Button onClick={handleSaveCamp}>حفظ</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>قائمة المخيمات</CardTitle>
        </CardHeader>
        <CardContent>
          <AdminCampsTable
            data={camps}
            onEdit={handleOpenDialog}
            onDelete={handleDeleteCamp}
            onToggleStatus={handleToggleStatus}
          />
        </CardContent>
      </Card>
    </section>
  );
}
