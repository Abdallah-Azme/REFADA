"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function FooterControlPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">تحكم في تذييل الصفحة (Footer)</h1>

      <Card>
        <CardHeader>
          <CardTitle>تعديل محتوى التذييل</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="about">نبذة مختصرة</Label>
            <Textarea id="about" placeholder="نبذة مختصرة عن الجمعية" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="copyright">حقوق النشر</Label>
            <Input id="copyright" placeholder="جميع الحقوق محفوظة..." />
          </div>

          <div className="space-y-2">
            <Label>روابط التواصل الاجتماعي</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input placeholder="Facebook URL" />
              <Input placeholder="Twitter URL" />
              <Input placeholder="Instagram URL" />
              <Input placeholder="LinkedIn URL" />
            </div>
          </div>

          <Button>حفظ التغييرات</Button>
        </CardContent>
      </Card>
    </div>
  );
}
