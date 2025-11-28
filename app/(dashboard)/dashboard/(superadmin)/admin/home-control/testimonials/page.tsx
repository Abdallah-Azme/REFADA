"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, GripVertical, Upload } from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  text: string;
  image: string;
}

export default function TestimonialsControlPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([
    { id: "1", name: "محمد أحمد", text: "خدمة ممتازة...", image: "" },
    { id: "2", name: "سارة علي", text: "شكراً لكم...", image: "" },
  ]);

  const handleAddTestimonial = () => {
    const newTestimonial: Testimonial = {
      id: Date.now().toString(),
      name: "",
      text: "",
      image: "",
    };
    setTestimonials([...testimonials, newTestimonial]);
  };

  const handleDeleteTestimonial = (id: string) => {
    if (testimonials.length <= 1) {
      alert("يجب أن يكون هناك رأي واحد على الأقل");
      return;
    }
    setTestimonials(testimonials.filter((t) => t.id !== id));
  };

  const handleUpdateTestimonial = (
    id: string,
    field: keyof Testimonial,
    value: string
  ) => {
    setTestimonials(
      testimonials.map((t) => (t.id === id ? { ...t, [field]: value } : t))
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">تحكم في قسم آراء المستفيدين</h1>
        <Button onClick={handleAddTestimonial}>
          <Plus className="w-4 h-4 ml-2" />
          إضافة رأي جديد
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {testimonials.map((testimonial, index) => (
          <Card key={testimonial.id} className="relative group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center gap-2">
                <GripVertical className="h-5 w-5 text-gray-400 cursor-move" />
                <CardTitle className="text-sm font-medium">
                  رأي {index + 1}
                </CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                onClick={() => handleDeleteTestimonial(testimonial.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <div className="w-24 h-24 bg-gray-100 rounded-md flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 hover:border-primary/50 transition-colors cursor-pointer shrink-0">
                  <Upload className="h-6 w-6 mb-1" />
                  <span className="text-[10px]">صورة</span>
                </div>
                <div className="flex-1 space-y-2">
                  <Label htmlFor={`name-${testimonial.id}`}>اسم المستفيد</Label>
                  <Input
                    id={`name-${testimonial.id}`}
                    placeholder="اسم المستفيد"
                    value={testimonial.name}
                    onChange={(e) =>
                      handleUpdateTestimonial(
                        testimonial.id,
                        "name",
                        e.target.value
                      )
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`text-${testimonial.id}`}>نص الرأي</Label>
                <Textarea
                  id={`text-${testimonial.id}`}
                  placeholder="نص الرأي"
                  value={testimonial.text}
                  onChange={(e) =>
                    handleUpdateTestimonial(
                      testimonial.id,
                      "text",
                      e.target.value
                    )
                  }
                  className="min-h-[100px]"
                />
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
