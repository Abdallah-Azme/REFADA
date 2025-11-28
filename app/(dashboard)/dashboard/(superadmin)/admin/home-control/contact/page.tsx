"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ContactControlPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">تحكم في قسم تواصل معنا</h1>

      <Card>
        <CardHeader>
          <CardTitle>تعديل معلومات التواصل</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">البريد الإلكتروني</Label>
            <Input id="email" placeholder="example@domain.com" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">رقم الهاتف</Label>
            <Input id="phone" placeholder="+970 59 000 0000" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">العنوان</Label>
            <Textarea id="address" placeholder="العنوان بالتفصيل" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="map">رابط الخريطة (Embed URL)</Label>
            <Input
              id="map"
              placeholder="https://www.google.com/maps/embed?..."
            />
          </div>

          <Button>حفظ التغييرات</Button>
        </CardContent>
      </Card>
    </div>
  );
}
