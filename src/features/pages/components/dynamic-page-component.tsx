"use client";

import { useState } from "react";
import { Card, CardContent } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Loader2, Edit, FileText } from "lucide-react";
import MainHeader from "@/shared/components/main-header";
import { usePage, useUpdatePage } from "../hooks/use-pages";
import { PageUpdateFormValues } from "../types/page.schema";
import { PageEditFormDialog } from "./page-edit-form-dialog";
import Image from "next/image";

interface DynamicPageComponentProps {
  pageType: string;
  title: string;
}

export default function DynamicPageComponent({
  pageType,
  title,
}: DynamicPageComponentProps) {
  const { data, isLoading, error } = usePage(pageType);
  const updateMutation = useUpdatePage();
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const pageData = data?.data;

  const handleUpdate = (values: PageUpdateFormValues) => {
    updateMutation.mutate(
      { pageType, data: values },
      {
        onSuccess: () => {
          setEditDialogOpen(false);
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="mr-3 text-gray-600">جاري تحميل البيانات...</span>
      </div>
    );
  }

  if (error || !pageData) {
    return (
      <div className="w-full p-8">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200">
          حدث خطأ أثناء تحميل الصفحة أو الصفحة غير موجودة.
        </div>
      </div>
    );
  }

  return (
    <div className="w-full gap-6 p-8 flex flex-col bg-gray-50 min-h-screen">
      <MainHeader header={title}>
        <FileText className="text-primary" />
      </MainHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-white border-none shadow-sm">
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-6 border-b pb-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  {pageData.title}
                </h2>
                <Button onClick={() => setEditDialogOpen(true)}>
                  <Edit className="h-4 w-4 ml-2" />
                  تعديل المحتوى
                </Button>
              </div>

              <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
                {pageData.description}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar / Image */}
        <div className="space-y-6">
          <Card className="bg-white border-none shadow-sm overflow-hidden">
            <div className="relative w-full aspect-video bg-gray-100">
              {pageData.image ? (
                <Image
                  src={pageData.image}
                  alt={pageData.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <FileText className="h-12 w-12" />
                </div>
              )}
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-gray-900 mb-2">صورة الصفحة</h3>
              <p className="text-sm text-gray-500">
                هذه الصورة تظهر في الجزء العلوي من الصفحة أو كصورة بارزة.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <PageEditFormDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        pageData={pageData}
        onSubmit={handleUpdate}
        isPending={updateMutation.isPending}
      />
    </div>
  );
}
