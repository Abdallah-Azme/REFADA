"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Plus } from "lucide-react";
import AdminCampsTable from "@/features/dashboard/components/admin-camps-table";
import {
  Camp,
  dummyCamps,
} from "@/features/dashboard/table-cols/admin-camps-cols";

const campSchema = z
  .object({
    name: z.string().min(1, "اسم المخيم مطلوب"),
    location: z.string().min(1, "الموقع مطلوب"),
    description: z.string().min(10, "الوصف يجب أن يكون 10 أحرف على الأقل"),
    capacity: z.number().min(1, "السعة يجب أن تكون أكبر من 0"),
    currentOccupancy: z.number().min(0, "الإشغال يجب أن يكون 0 أو أكثر"),
    coordinates: z.object({
      lat: z.number().min(-90).max(90, "خط العرض يجب أن يكون بين -90 و 90"),
      lng: z.number().min(-180).max(180, "خط الطول يجب أن يكون بين -180 و 180"),
    }),
  })
  .refine((data) => data.currentOccupancy <= data.capacity, {
    message: "الإشغال الحالي لا يمكن أن يكون أكبر من السعة الكلية",
    path: ["currentOccupancy"],
  });

type CampFormValues = z.infer<typeof campSchema>;

export default function AdminCampsPage() {
  const [camps, setCamps] = useState<Camp[]>(dummyCamps);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCamp, setEditingCamp] = useState<Camp | null>(null);

  const form = useForm<CampFormValues>({
    resolver: zodResolver(campSchema),
    defaultValues: {
      name: "",
      location: "",
      description: "",
      capacity: 0,
      currentOccupancy: 0,
      coordinates: { lat: 0, lng: 0 },
    },
  });

  const handleOpenDialog = (camp?: Camp) => {
    if (camp) {
      setEditingCamp(camp);
      form.reset({
        name: camp.name,
        location: camp.location,
        description: camp.description,
        capacity: camp.capacity,
        currentOccupancy: camp.currentOccupancy,
        coordinates: camp.coordinates,
      });
    } else {
      setEditingCamp(null);
      form.reset({
        name: "",
        location: "",
        description: "",
        capacity: 0,
        currentOccupancy: 0,
        coordinates: { lat: 0, lng: 0 },
      });
    }
    setIsDialogOpen(true);
  };

  const onSubmit = (data: CampFormValues) => {
    if (editingCamp) {
      // Update existing camp
      setCamps(
        camps.map((camp) =>
          camp.id === editingCamp.id ? { ...camp, ...data } : camp
        )
      );
    } else {
      // Create new camp
      const newCamp: Camp = {
        id: Date.now().toString(),
        ...data,
        status: "active",
      };
      setCamps([...camps, newCamp]);
    }
    setIsDialogOpen(false);
    form.reset();
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
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4 py-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>اسم المخيم</FormLabel>
                      <FormControl>
                        <Input placeholder="أدخل اسم المخيم" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>الموقع</FormLabel>
                      <FormControl>
                        <Input placeholder="أدخل موقع المخيم" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>الوصف</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="أدخل وصف المخيم"
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="capacity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>السعة الكلية</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value) || 0)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="currentOccupancy"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>الإشغال الحالي</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value) || 0)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="coordinates.lat"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>خط العرض (Latitude)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.000001"
                            placeholder="31.5"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseFloat(e.target.value) || 0)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="coordinates.lng"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>خط الطول (Longitude)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.000001"
                            placeholder="34.45"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseFloat(e.target.value) || 0)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    إلغاء
                  </Button>
                  <Button type="submit">حفظ</Button>
                </div>
              </form>
            </Form>
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
