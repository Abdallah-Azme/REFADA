import { useQuery } from "@tanstack/react-query";
import { contributorHistoryApi } from "../api/contributor-history.api";

export const useContributorHistory = () => {
  return useQuery({
    queryKey: ["contributor-history"],
    queryFn: contributorHistoryApi.getHistory,
  });
};
export type {
  ContributorFamily,
  ContributorMember,
} from "../api/contributor-history.api";
