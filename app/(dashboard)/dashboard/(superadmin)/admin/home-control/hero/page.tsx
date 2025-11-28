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
import RichTextEditor from "@/components/rich-text-editor";
import { useState } from "react";

const slideSchema = z.object({
  title: z.string().min(1, "العنوان الرئيسي مطلوب"),
  subtitle: z.string().min(10, "العنوان الفرعي يجب أن يكون 10 أحرف على الأقل"),
  image: z.string().optional(),
  isOpen: z.boolean().default(true),
});

const heroSchema = z.object({
  slides: z.array(slideSchema).min(1, "يجب أن يكون هناك شريحة واحدة على الأقل"),
});

type HeroFormValues = z.infer<typeof heroSchema>;

export default function HeroControlPage() {
  const form = useForm<HeroFormValues>({
    resolver: zodResolver(heroSchema),
    defaultValues: {
      slides: [
        {
          title: "",
          subtitle: "",
          image: "",
          isOpen: true,
        },
      ],
    },
  });

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: "slides",
  });

  const addSlide = () => {
    append({
      title: "",
      subtitle: "",
      image: "",
      isOpen: true,
    });
  };

  const deleteSlide = (index: number) => {
    if (fields.length === 1) {
      alert("يجب أن يكون هناك شريحة واحدة على الأقل");
      return;
    }
    remove(index);
  };

  const toggleSlide = (index: number) => {
    const currentValue = form.getValues(`slides.${index}.isOpen`);
    form.setValue(`slides.${index}.isOpen`, !currentValue);
  };

  const moveSlide = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= fields.length) return;
    move(index, newIndex);
  };

  const onSubmit = (data: HeroFormValues) => {
    console.log("Saving hero slides:", data);
    // Here you would typically save to your backend
    alert("تم حفظ التغييرات بنجاح!");
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">تحكم في قسم الرئيسية (Hero)</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {fields.map((field, index) => (
            <Card key={field.id}>
              <Collapsible
                open={form.watch(`slides.${index}.isOpen`)}
                onOpenChange={() => toggleSlide(index)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <GripVertical className="h-5 w-5 text-gray-400 cursor-move" />
                      <CollapsibleTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-0 h-auto"
                          type="button"
                        >
                          <CardTitle className="text-lg flex items-center gap-2">
                            شريحة {index + 1}
                            {form.watch(`slides.${index}.isOpen`) ? (
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
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => moveSlide(index, "up")}
                        >
                          ↑
                        </Button>
                      )}
                      {index < fields.length - 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => moveSlide(index, "down")}
                        >
                          ↓
                        </Button>
                      )}
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteSlide(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CollapsibleContent>
                  <CardContent className="space-y-4 pt-4">
                    <FormField
                      control={form.control}
                      name={`slides.${index}.title`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>العنوان الرئيسي</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="أدخل العنوان الرئيسي"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`slides.${index}.subtitle`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>العنوان الفرعي</FormLabel>
                          <FormControl>
                            <RichTextEditor
                              content={field.value}
                              onChange={field.onChange}
                              placeholder="أدخل العنوان الفرعي"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`slides.${index}.image`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>رابط الصورة</FormLabel>
                          <FormControl>
                            <Input
                              type="file"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  // Here you would typically upload the file and get a URL
                                  field.onChange(file.name);
                                }
                              }}
                            />
                          </FormControl>
                          {field.value && (
                            <p className="text-sm text-gray-500">
                              الصورة الحالية: {field.value}
                            </p>
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          ))}

          <div className="flex justify-between items-center gap-4">
            <Button type="button" onClick={addSlide} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              إضافة شريحة جديدة
            </Button>
            <Button type="submit" size="lg">
              حفظ جميع التغييرات
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
