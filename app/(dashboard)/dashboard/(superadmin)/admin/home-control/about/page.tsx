"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AboutControlPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">تحكم في قسم من نحن (About)</h1>

      <Card>
        <CardHeader>
          <CardTitle>تعديل محتوى من نحن</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">العنوان</Label>
            <Input id="title" placeholder="أدخل العنوان" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">الوصف</Label>
            <Textarea
              id="description"
              placeholder="أدخل الوصف التفصيلي"
              className="min-h-[150px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">رابط الصورة</Label>
            <Input id="image" type="file" />
          </div>

          <Button>حفظ التغييرات</Button>
        </CardContent>
      </Card>
    </div>
  );
}
