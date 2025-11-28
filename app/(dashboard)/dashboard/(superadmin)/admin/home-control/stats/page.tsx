"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function StatsControlPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">تحكم في قسم الإحصائيات</h1>

      <Card>
        <CardHeader>
          <CardTitle>تعديل الإحصائيات</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stat1-label">عنوان الإحصائية 1</Label>
              <Input id="stat1-label" placeholder="مثال: عدد المستفيدين" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stat1-value">قيمة الإحصائية 1</Label>
              <Input id="stat1-value" placeholder="مثال: 1000+" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stat2-label">عنوان الإحصائية 2</Label>
              <Input id="stat2-label" placeholder="مثال: عدد المشاريع" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stat2-value">قيمة الإحصائية 2</Label>
              <Input id="stat2-value" placeholder="مثال: 50+" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stat3-label">عنوان الإحصائية 3</Label>
              <Input id="stat3-label" placeholder="مثال: عدد المتطوعين" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stat3-value">قيمة الإحصائية 3</Label>
              <Input id="stat3-value" placeholder="مثال: 200+" />
            </div>
          </div>

          <Button>حفظ التغييرات</Button>
        </CardContent>
      </Card>
    </div>
  );
}
