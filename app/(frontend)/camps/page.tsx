import { campsApi } from "@/features/camps/api/camp.api";
import CampsPageClient from "@/components/pages/camps/camps-page-client";

export default async function Page() {
  let camps = [];
  try {
    const response = await campsApi.getAll();
    camps = response.data || [];
  } catch (error) {
    console.error("Failed to fetch camps:", error);
  }

  return <CampsPageClient camps={camps} />;
}
