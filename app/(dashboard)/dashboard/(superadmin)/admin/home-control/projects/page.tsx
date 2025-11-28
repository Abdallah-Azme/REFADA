"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProjectsControlPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">تحكم في قسم المشاريع</h1>

      <Card>
        <CardHeader>
          <CardTitle>تعديل محتوى قسم المشاريع</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">العنوان</Label>
            <Input id="title" placeholder="أدخل العنوان" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">الوصف</Label>
            <Textarea id="description" placeholder="أدخل الوصف" />
          </div>

          <div className="space-y-2">
            <Label>إدارة المشاريع المعروضة</Label>
            <p className="text-sm text-muted-foreground">
              يتم عرض المشاريع تلقائياً من قاعدة البيانات. يمكنك هنا تخصيص
              العنوان والوصف العام للقسم.
            </p>
          </div>

          <Button>حفظ التغييرات</Button>
        </CardContent>
      </Card>
    </div>
  );
}
