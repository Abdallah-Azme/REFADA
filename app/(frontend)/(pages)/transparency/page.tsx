import { Breadcrumb } from "@/components/shared/breadcrumb";
import { PageSection } from "@/components/shared/page-section";
import { Lock } from "lucide-react";
import React from "react";

export default function Page() {
  return (
    <div className="container mx-auto py-8 space-y-6">
      <Breadcrumb
        items={[
          { name: "الرئيسية", href: "/" },
          { name: "سياسة الخصوصية", href: "/privacy" },
        ]}
      />
      <PageSection
        title="سياسة الخصوصية"
        icon={<Lock className="w-5 h-5" />}
        description={
          <>
            <p>نحن أولاً نحترم خصوصيتكم...</p>
            <p>نلتزم بعدم مشاركة بياناتكم الشخصية إلا...</p>
          </>
        }
      />
    </div>
  );
}
