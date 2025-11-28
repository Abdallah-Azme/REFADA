"use client";

import { useForm } from "react-hook-form";
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
import { Textarea } from "@/components/ui/textarea";

const contactSchema = z.object({
  email: z.string().email("البريد الإلكتروني غير صحيح"),
  phone: z.string().min(1, "رقم الهاتف مطلوب"),
  address: z.string().min(1, "العنوان مطلوب"),
  mapUrl: z.string().url("رابط الخريطة غير صحيح").optional().or(z.literal("")),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function ContactControlPage() {
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      email: "",
      phone: "",
      address: "",
      mapUrl: "",
    },
  });

  const onSubmit = (data: ContactFormValues) => {
    console.log("Saving contact info:", data);
    // Here you would typically save to your backend
    alert("تم حفظ التغييرات بنجاح!");
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">تحكم في قسم تواصل معنا</h1>

      <Card>
        <CardHeader>
          <CardTitle>تعديل معلومات التواصل</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>البريد الإلكتروني</FormLabel>
                    <FormControl>
                      <Input placeholder="example@domain.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>رقم الهاتف</FormLabel>
                    <FormControl>
                      <Input placeholder="+970 59 000 0000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>العنوان</FormLabel>
                    <FormControl>
                      <Textarea placeholder="العنوان بالتفصيل" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="mapUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>رابط الخريطة (Embed URL)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://www.google.com/maps/embed?..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit">حفظ التغييرات</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
