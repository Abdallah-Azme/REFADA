"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Plus, Trash2, GripVertical, Upload } from "lucide-react";

const partnerSchema = z.object({
  name: z.string().min(1, "اسم الشريك مطلوب"),
  logo: z.string().optional(),
});

const partnersSchema = z.object({
  partners: z
    .array(partnerSchema)
    .min(1, "يجب أن يكون هناك شريك واحد على الأقل"),
});

type PartnersFormValues = z.infer<typeof partnersSchema>;

export default function PartnersControlPage() {
  const form = useForm<PartnersFormValues>({
    resolver: zodResolver(partnersSchema),
    defaultValues: {
      partners: [
        { name: "شريك 1", logo: "" },
        { name: "شريك 2", logo: "" },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "partners",
  });

  const handleAddPartner = () => {
    append({
      name: `شريك جديد ${fields.length + 1}`,
      logo: "",
    });
  };

  const handleDeletePartner = (index: number) => {
    if (fields.length <= 1) {
      alert("يجب أن يكون هناك شريك واحد على الأقل");
      return;
    }
    remove(index);
  };

  const onSubmit = (data: PartnersFormValues) => {
    console.log("Saving partners:", data);
    // Here you would typically save to your backend
    alert("تم حفظ التغييرات بنجاح!");
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">تحكم في قسم الشركاء</h1>
        <Button type="button" onClick={handleAddPartner}>
          <Plus className="w-4 h-4 ml-2" />
          إضافة شريك جديد
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fields.map((field, index) => (
              <Card key={field.id} className="relative group">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="flex items-center gap-2">
                    <GripVertical className="h-5 w-5 text-gray-400 cursor-move" />
                    <CardTitle className="text-sm font-medium">
                      شريك {index + 1}
                    </CardTitle>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleDeletePartner(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name={`partners.${index}.logo`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="aspect-video bg-gray-100 rounded-md flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 hover:border-primary/50 transition-colors cursor-pointer">
                              <Upload className="h-8 w-8 mb-2" />
                              <span className="text-xs">رفع الشعار</span>
                              <Input
                                type="file"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    field.onChange(file.name);
                                  }
                                }}
                              />
                            </div>
                          </FormControl>
                          {field.value && (
                            <p className="text-xs text-gray-500">
                              الشعار: {field.value}
                            </p>
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`partners.${index}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>اسم الشريك</FormLabel>
                          <FormControl>
                            <Input placeholder="اسم الشريك" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-end pt-6 border-t">
            <Button type="submit" size="lg">
              حفظ التغييرات
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
