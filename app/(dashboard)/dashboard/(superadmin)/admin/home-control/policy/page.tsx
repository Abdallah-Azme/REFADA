"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RichTextEditor from "@/components/rich-text-editor";

export default function PolicyControlPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSave = () => {
    console.log("Title:", title);
    console.log("Content:", content);
    // Here you would typically save to your backend
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">تحكم في قسم السياسات</h1>

      <Card>
        <CardHeader>
          <CardTitle>تعديل السياسات</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">العنوان</Label>
            <Input
              id="title"
              placeholder="أدخل العنوان"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">المحتوى</Label>
            <RichTextEditor
              content={content}
              onChange={setContent}
              placeholder="أدخل محتوى السياسات"
            />
          </div>

          <Button onClick={handleSave}>حفظ التغييرات</Button>
        </CardContent>
      </Card>
    </div>
  );
}
