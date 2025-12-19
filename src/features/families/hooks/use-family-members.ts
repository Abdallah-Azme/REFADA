import { useQuery } from "@tanstack/react-query";
import { getFamilyMembersApi } from "../api/families.api";

export const useFamilyMembers = (familyId: number | null) => {
  return useQuery({
    queryKey: ["family-members", familyId],
    queryFn: () => getFamilyMembersApi(familyId!),
    enabled: !!familyId,
  });
};
