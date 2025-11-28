"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Plus,
  Trash2,
  GripVertical,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  isOpen: boolean;
}

export default function HeroControlPage() {
  const [slides, setSlides] = useState<HeroSlide[]>([
    {
      id: "1",
      title: "",
      subtitle: "",
      image: "",
      isOpen: true,
    },
  ]);

  const addSlide = () => {
    const newSlide: HeroSlide = {
      id: Date.now().toString(),
      title: "",
      subtitle: "",
      image: "",
      isOpen: true,
    };
    setSlides([...slides, newSlide]);
  };

  const deleteSlide = (id: string) => {
    if (slides.length === 1) {
      alert("يجب أن يكون هناك شريحة واحدة على الأقل");
      return;
    }
    setSlides(slides.filter((slide) => slide.id !== id));
  };

  const updateSlide = (id: string, field: keyof HeroSlide, value: string) => {
    setSlides(
      slides.map((slide) =>
        slide.id === id ? { ...slide, [field]: value } : slide
      )
    );
  };

  const toggleSlide = (id: string) => {
    setSlides(
      slides.map((slide) =>
        slide.id === id ? { ...slide, isOpen: !slide.isOpen } : slide
      )
    );
  };

  const moveSlide = (index: number, direction: "up" | "down") => {
    const newSlides = [...slides];
    const newIndex = direction === "up" ? index - 1 : index + 1;

    if (newIndex < 0 || newIndex >= slides.length) return;

    [newSlides[index], newSlides[newIndex]] = [
      newSlides[newIndex],
      newSlides[index],
    ];
    setSlides(newSlides);
  };

  const handleSave = () => {
    console.log("Saving slides:", slides);
    // Here you would typically save to your backend
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">تحكم في قسم الرئيسية (Hero)</h1>

      <div className="space-y-4">
        {slides.map((slide, index) => (
          <Card key={slide.id}>
            <Collapsible
              open={slide.isOpen}
              onOpenChange={() => toggleSlide(slide.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <GripVertical className="h-5 w-5 text-gray-400 cursor-move" />
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm" className="p-0 h-auto">
                        <CardTitle className="text-lg flex items-center gap-2">
                          شريحة {index + 1}
                          {slide.isOpen ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </CardTitle>
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                  <div className="flex items-center gap-2">
                    {index > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => moveSlide(index, "up")}
                      >
                        ↑
                      </Button>
                    )}
                    {index < slides.length - 1 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => moveSlide(index, "down")}
                      >
                        ↓
                      </Button>
                    )}
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteSlide(slide.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CollapsibleContent>
                <CardContent className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor={`title-${slide.id}`}>العنوان الرئيسي</Label>
                    <Input
                      id={`title-${slide.id}`}
                      placeholder="أدخل العنوان الرئيسي"
                      value={slide.title}
                      onChange={(e) =>
                        updateSlide(slide.id, "title", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`subtitle-${slide.id}`}>
                      العنوان الفرعي
                    </Label>
                    <Textarea
                      id={`subtitle-${slide.id}`}
                      placeholder="أدخل العنوان الفرعي"
                      value={slide.subtitle}
                      onChange={(e) =>
                        updateSlide(slide.id, "subtitle", e.target.value)
                      }
                      className="min-h-[100px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`image-${slide.id}`}>رابط الصورة</Label>
                    <Input
                      id={`image-${slide.id}`}
                      type="file"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          // Here you would typically upload the file and get a URL
                          updateSlide(slide.id, "image", file.name);
                        }
                      }}
                    />
                    {slide.image && (
                      <p className="text-sm text-gray-500">
                        الصورة الحالية: {slide.image}
                      </p>
                    )}
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        ))}
      </div>

      <div className="flex justify-between items-center gap-4">
        <Button onClick={addSlide} variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          إضافة شريحة جديدة
        </Button>
        <Button onClick={handleSave} size="lg">
          حفظ جميع التغييرات
        </Button>
      </div>
    </div>
  );
}
